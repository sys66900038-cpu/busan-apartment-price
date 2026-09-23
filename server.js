import express from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.DATA_GO_KR_SERVICE_KEY || "";
const API = "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev";

const GU = {
  "26110":"중구","26140":"서구","26170":"동구","26200":"영도구","26230":"부산진구",
  "26260":"동래구","26290":"남구","26320":"북구","26350":"해운대구","26380":"사하구",
  "26410":"금정구","26440":"강서구","26470":"연제구","26500":"수영구","26530":"사상구","26710":"기장군"
};

app.use(express.json());
app.use(express.static(__dirname));

const db = new Database(path.join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS offers (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 gu_code TEXT NOT NULL,
 gu_name TEXT NOT NULL,
 apt_name TEXT NOT NULL,
 area REAL,
 price_manwon INTEGER NOT NULL,
 floor TEXT,
 memo TEXT,
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cache (
 gu_code TEXT NOT NULL,
 deal_ym TEXT NOT NULL,
 payload TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 PRIMARY KEY(gu_code, deal_ym)
);
`);

function currentYM() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}`;
}

function text(item, tag) {
  const x = item.getElementsByTagName(tag)[0];
  return x?.textContent?.trim() || "";
}

function parseXml(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
  return items.map(item => {
    const price = Number(textFrom(item,"거래금액").replace(/,/g,"").replace(/\s/g,""));
    return {
      apt_name: textFrom(item,"아파트"),
      area: Number(textFrom(item,"전용면적")) || 0,
      price_manwon: price || 0,
      year: textFrom(item,"년"),
      month: textFrom(item,"월"),
      day: textFrom(item,"일"),
      floor: textFrom(item,"층"),
      dong: textFrom(item,"법정동"),
      jibun: textFrom(item,"지번"),
      build_year: textFrom(item,"건축년도")
    };
  }).filter(x => x.apt_name && x.price_manwon > 0);
}
function textFrom(s, tag) {
  const re = new RegExp(`<${tag}>([\\\\s\\\\S]*?)<\\\\/${tag}>`);
  const m = s.match(re);
  return m ? m[1].replace(/<!\\[CDATA\\[|\\]\\]>/g,"").trim() : "";
}

async function getTrades(guCode, ym, force=false) {
  if (!GU[guCode]) throw new Error("잘못된 부산 구·군 코드입니다.");
  if (!KEY) throw new Error("서버에 DATA_GO_KR_SERVICE_KEY가 설정되지 않았습니다.");

  if (!force) {
    const row = db.prepare("SELECT payload FROM cache WHERE gu_code=? AND deal_ym=?").get(guCode, ym);
    if (row) return JSON.parse(row.payload);
  }

  const url = new URL(API);
  url.searchParams.set("serviceKey", KEY);
  url.searchParams.set("LAWD_CD", guCode);
  url.searchParams.set("DEAL_YMD", ym);
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", "1000");

  const r = await fetch(url);
  const xml = await r.text();
  if (!r.ok) throw new Error(`국토부 API HTTP ${r.status}`);
  const code = (xml.match(/<resultCode>(.*?)<\/resultCode>/) || [,""])[1];
  if (code && !["00","000"].includes(code)) {
    const msg = (xml.match(/<resultMsg>(.*?)<\/resultMsg>/) || [,"API 오류"])[1];
    throw new Error(`${code}: ${msg}`);
  }
  const rows = parseXml(xml);
  db.prepare("INSERT OR REPLACE INTO cache VALUES(?,?,?,?)")
    .run(guCode, ym, JSON.stringify(rows), new Date().toISOString());
  return rows;
}

app.get("/api/health", (req,res)=>res.json({ok:true, service:"busan-apartment-price-v1.1"}));
app.get("/api/gu", (req,res)=>res.json(Object.entries(GU).map(([code,name])=>({code,name}))));

app.get("/api/trades", async (req,res)=>{
  try {
    const {gu_code, deal_ym=currentYM(), apt_name, area} = req.query;
    let rows = await getTrades(gu_code, deal_ym);
    if (apt_name) rows = rows.filter(x => x.apt_name === apt_name);
    if (area) rows = rows.filter(x => Math.abs(x.area - Number(area)) < 0.6);
    rows.sort((a,b)=>Number(b.day)-Number(a.day));
    res.json({gu_name:GU[gu_code], deal_ym, count:rows.length, items:rows});
  } catch(e) { res.status(502).json({error:e.message}); }
});

app.get("/api/complexes", async (req,res)=>{
  try {
    const {gu_code, deal_ym=currentYM(), q=""} = req.query;
    const rows = await getTrades(gu_code, deal_ym);
    const map = new Map();
    for (const x of rows) {
      if (q && !x.apt_name.toLowerCase().includes(q.toLowerCase())) continue;
      map.set(x.apt_name, (map.get(x.apt_name)||0)+1);
    }
    res.json([...map.entries()].map(([apt_name,trade_count])=>({apt_name,trade_count}))
      .sort((a,b)=>b.trade_count-a.trade_count));
  } catch(e) { res.status(502).json({error:e.message}); }
});

app.post("/api/update", async (req,res)=>{
  try {
    const {gu_code} = req.body;
    const ym = currentYM();
    const rows = await getTrades(gu_code, ym, true);
    res.json({ok:true, deal_ym:ym, count:rows.length, updated_at:new Date().toISOString()});
  } catch(e) { res.status(502).json({error:e.message}); }
});

app.get("/api/offers", (req,res)=>{
  const {gu_code, apt_name} = req.query;
  let sql="SELECT * FROM offers WHERE 1=1", args=[];
  if(gu_code){sql+=" AND gu_code=?";args.push(gu_code)}
  if(apt_name){sql+=" AND apt_name=?";args.push(apt_name)}
  sql+=" ORDER BY created_at DESC";
  res.json(db.prepare(sql).all(...args));
});

app.post("/api/offers", (req,res)=>{
  const {gu_code,apt_name,area,price_manwon,floor="",memo=""}=req.body;
  if(!GU[gu_code] || !apt_name || !Number(price_manwon)) return res.status(400).json({error:"필수값이 없습니다."});
  const info=db.prepare(`INSERT INTO offers
    (gu_code,gu_name,apt_name,area,price_manwon,floor,memo,created_at)
    VALUES(?,?,?,?,?,?,?,?)`).run(
      gu_code,GU[gu_code],apt_name,area||null,Number(price_manwon),floor,memo,new Date().toISOString()
  );
  res.json({ok:true,id:info.lastInsertRowid});
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"index.html")));
app.listen(PORT,()=>console.log(`Busan Apartment V1.1 listening on ${PORT}`));
