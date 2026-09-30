
const BASE = {
"2026-01":{label:"2026년 1월",pension:{invest:8811652,value:10273054},isa:{invest:23881257,value:27395962},toss:{invest:27648098.2,value:27239522.94},savings:{invest:7000000,value:7000000}},
"2026-02":{label:"2026년 2월",pension:{invest:9318998,value:10570639},isa:{invest:24381257,value:27354081},toss:{invest:28148098.2,value:28285886},savings:{invest:7700000,value:7700000}},
"2026-03":{label:"2026년 3월",pension:{invest:9821105,value:10828598},isa:{invest:24881257,value:27936267},toss:{invest:28648098.2,value:29204010},savings:{invest:8400000,value:8400000}},
"2026-04":{label:"2026년 4월",pension:{invest:11132438,value:13289132},isa:{invest:26381257,value:28952746},toss:{invest:29148098.2,value:30606458},savings:{invest:9100000,value:9100000}},
"2026-05":{label:"2026년 5월",pension:{invest:11632438,value:14900933},isa:{invest:26881257,value:33665543},toss:{invest:29648098.2,value:34547490},savings:{invest:9800000,value:9800000}},
"2026-06":{label:"2026년 6월",pension:{invest:12132438,value:15408571},isa:{invest:27381257,value:30116870},toss:{invest:30148098.2,value:31613827},savings:{invest:10500000,value:10500000}},
"2026-07":{label:"2026년 7월",pension:{invest:12632438,value:14553961},isa:{invest:27881257,value:23317000},toss:{invest:30648098.2,value:28967248},savings:{invest:11200000,value:11200000}},
"2026-08":{label:"2026년 8월",pension:{invest:13132438,value:15098891},isa:{invest:28381257,value:24413816},toss:{invest:31148098.2,value:30710604},savings:{invest:11900000,value:11900000}}
};

const MARKET_BASE={
 sp500:6878.11,
 nasdaq100:25524.267,
 kospi:4224.53
};

let MARKET_DATA={
 "2026-01":{sp500:6939.03,nasdaq100:25552.387,kospi:5224.36},
 "2026-02":{sp500:6878.88,nasdaq100:24960.035,kospi:6244.13},
 "2026-03":{sp500:6368.85,nasdaq100:23132.771,kospi:5277.30},
 "2026-04":{sp500:7135.95,nasdaq100:27186.985,kospi:6598.87},
 "2026-05":{sp500:7580.06,nasdaq100:30333.18,kospi:8476.15},
 "2026-06":{sp500:7440.43,nasdaq100:29774.751,kospi:8476.47},
 "2026-07":{sp500:7489.72,nasdaq100:28274.195,kospi:6595.45},
 "2026-08":{sp500:7711.76,nasdaq100:29433.428,kospi:6788.88}
};

const MARKET_STORE_KEY="my_asset_v11_market";
const MARKET_META_KEY="my_asset_v11_market_meta";

try{
  const saved=JSON.parse(localStorage.getItem(MARKET_STORE_KEY)||"null");
  if(saved && typeof saved==="object"){
    MARKET_DATA={...MARKET_DATA,...saved};
  }
}catch(e){}



const ACCOUNTS = {
 pension:{name:"연금저축",color:"#1769e0"},
 isa:{name:"ISA",color:"#12a594"},
 toss:{name:"토스증권",color:"#8b5cf6"},
 savings:{name:"청년도약계좌",color:"#f59e0b"}
};

const DEFAULT_HOLDINGS = {
 pension:[
  {name:"TIGER 미국나스닥100",qty:30,avg:144918,current:179490,value:5384700},
  {name:"RISE 미국S&P500",qty:205,avg:18414,current:22980,value:4710900},
  {name:"ACE KRX금현물",qty:35,avg:29984,current:28390,value:993650},
  {name:"ACE 미국빅테크TOP7",qty:90,avg:22176,current:24165,value:2174850},
  {name:"TIGER 미국필라델피아반도체",qty:28,avg:48408,current:41925,value:1173900},
  {name:"현금",qty:null,avg:null,current:null,value:660891}
 ],
 isa:[
  {name:"KoAct 글로벌AI메모리반도체",qty:120,avg:18733,current:13935,value:1672200},
  {name:"KODEX 미국AI전력핵심인프라",qty:60,avg:28223,current:19380,value:1162800},
  {name:"SOL AI반도체TOP2플러스",qty:80,avg:24925,current:17250,value:1380000},
  {name:"TIGER 코리아AI전력기기TOP3",qty:60,avg:20565,current:19910,value:1194600},
  {name:"TIME 글로벌휴머노이드로봇산업",qty:100,avg:9200,current:7420,value:742000},
  {name:"KODEX 미국나스닥100",qty:88,avg:27745,current:26835,value:2361480},
  {name:"삼성전자",qty:33,avg:293121,current:256500,value:8464500},
  {name:"하이닉스",qty:3,avg:2560000,current:1658000,value:4974000},
  {name:"삼성전기",qty:1,avg:1790000,current:1405000,value:1405000},
  {name:"예수금",qty:null,avg:null,current:null,value:1057236}
 ],
toss:[
  {name:"QQQM",ticker:"QQQM",qty:20,avg:397118,current:407188,value:8143760},
  {name:"SPYM",ticker:"SPYM",qty:16,avg:123969,current:125013,value:2000208},
  {name:"알파벳",ticker:"GOOGL",qty:10,avg:503492,current:478398,value:4783980},
  {name:"엔비디아",ticker:"NVDA",qty:12,avg:290687,current:300284,value:3603408},
  {name:"ASML",ticker:"ASML",qty:1,avg:2873556,current:2341209,value:2341209},
  {name:"메타",ticker:"META",qty:2,avg:820700,current:797841,value:1595682},
  {name:"스페이스X",ticker:"",qty:1,avg:160770,current:195312,value:195312},
  {name:"QLD",ticker:"QLD",qty:32,avg:128010,current:124461,value:3982752},
  {name:"CONL",ticker:"CONL",qty:157,avg:13290,current:7798,value:1224286},
  {name:"ETHU",ticker:"ETHU",qty:48,avg:39269,current:35501,value:1704048},
  {name:"달러",ticker:"",qty:null,avg:null,current:null,value:1135959}
]
};

const MONTH_KEY="my_asset_v4_monthly";
const HOLD_KEY="my_asset_v4_holdings";
let data=JSON.parse(localStorage.getItem(MONTH_KEY)||"null") || structuredClone(BASE);
let holdings=JSON.parse(localStorage.getItem(HOLD_KEY)||"null") || structuredClone(DEFAULT_HOLDINGS);
  const AUTO_TICKERS = {

  /* 연금저축 */
  "TIGER 미국나스닥100":"133690.KS",
  "RISE 미국S&P500":"379780.KS",
  "ACE KRX금현물":"411060.KS",
  "ACE 미국빅테크TOP7":"465580.KS",
  "ACE 미국빅테크TOP7 Plus":"465580.KS",
  "TIGER 미국필라델피아반도체":"381180.KS",
  "TIGER 미국필라델피아반도체나스닥":"381180.KS",
  "TIME 글로벌휴머노이드로봇산업":"0185L0.KS",
  "TIME 글로벌휴머노이드로봇산업액티브":"0185L0.KS",

  /*
  아래 ETF들은 Yahoo 지원 여부를
  확인하면서 차차 추가
  */
  

  /* ISA */
  "KODEX 미국AI전력핵심인프라":"487230.KS",
  "KoAct 글로벌AI메모리반도체":"0174B0.KS",
  "SOL AI반도체TOP2플러스":"0167A0.KS",
  "TIGER 코리아AI전력기기TOP3":"0117V0.KS",
  "KODEX 미국나스닥100":"379810.KS",
  "삼성전자":"005930.KS",
  "하이닉스":"000660.KS",
  "SK하이닉스":"000660.KS",
  "삼성전기":"009150.KS"
};


/*
기존 localStorage 종목에도
자동으로 ticker 붙이기
*/

for(
  const account
  of ["pension","isa","toss"]
){

  for(
    const h
    of holdings[account] || []
  ){

    if(
      h.autoPrice!==false && !h.ticker &&
      AUTO_TICKERS[h.name]
    ){

      h.ticker=
        AUTO_TICKERS[h.name];

    }

  }

}


localStorage.setItem(
  HOLD_KEY,
  JSON.stringify(holdings)
);
  const TICKER_MAP = {
  "QQQM":"QQQM",
  "SPYM":"SPYM",
  "알파벳":"GOOGL",
  "엔비디아":"NVDA",
  "ASML":"ASML",
  "메타":"META",
  "QLD":"QLD",
  "CONL":"CONL",
  "ETHU":"ETHU"
};

for(const h of holdings.toss || []){
  if(h.autoPrice!==false && !h.ticker && TICKER_MAP[h.name]){
    h.ticker=TICKER_MAP[h.name];
  }
}

localStorage.setItem(
  HOLD_KEY,
  JSON.stringify(holdings)
);

function money(n){return Math.round(Number(n||0)).toLocaleString("ko-KR")+"원"}
function pctFromHolding(h){
 if(isUsdHolding(h))return h.qty && h.usd.avg>0 && h.usd.current!=null ? (h.usd.current-h.usd.avg)/h.usd.avg : null;
 if(h.qty && h.avg && h.current) return (h.current-h.avg)/h.avg;
 return null;
}
function pct(n){return n==null?"-":(Number(n)*100).toFixed(2)+"%"}
function keys(){return Object.keys(data).sort()}
function isValidMonth(k){
 const m=data[k];
 if(!m) return false;
 const t=total(m);
 // 투자금이 있는데 평가금액 합계가 0이면 미완성 입력으로 간주
 return !(invested(m)>0 && t===0);
}
function validKeys(){return keys().filter(isValidMonth)}
function latestKey(){return validKeys().at(-1)}
function prevKey(k){const a=validKeys(),i=a.indexOf(k);return i>0?a[i-1]:null}
function total(m){return Object.keys(ACCOUNTS).reduce((s,k)=>s+Number(m?.[k]?.value||0),0)}
function invested(m){return Object.keys(ACCOUNTS).reduce((s,k)=>s+Number(m?.[k]?.invest||0),0)}
function firstKeyOfYear(k){
 const year=String(k).slice(0,4);
 return validKeys().find(x=>x.startsWith(year+"-")) || null;
}
function changeAmount(curr,base){return Number(curr||0)-Number(base||0)}
function changeRate(curr,base){return Number(base||0)?(Number(curr||0)-Number(base||0))/Number(base):null}
function signedMoney(n){return `${n>=0?"+":""}${money(n)}`}
function signedPct(n){return n==null?"-":`${n>=0?"+":""}${(n*100).toFixed(2)}%`}

const INVEST_ACCOUNTS=["pension","isa","toss"];

function investmentPrincipal(m){
 return INVEST_ACCOUNTS.reduce((s,k)=>s+Number(m?.[k]?.invest||0),0);
}
function investmentValue(m){
 return INVEST_ACCOUNTS.reduce((s,k)=>s+Number(m?.[k]?.value||0),0);
}
function investmentProfit(m){
 return investmentValue(m)-investmentPrincipal(m);
}
function investmentReturn(m){
 const p=investmentPrincipal(m);
 return p?investmentProfit(m)/p:null;
}



function go(id){
 document.querySelectorAll("section.wrap").forEach(x=>x.classList.add("hidden"));
 document.getElementById(id).classList.remove("hidden");
 document.querySelectorAll(".nav button").forEach(x=>x.classList.remove("on"));
 if(id==="home")navHome.classList.add("on");
 if(id==="assets")navAssets.classList.add("on");
 if(id==="invest")navInvest.classList.add("on");
 if(id==="market")navMarket.classList.add("on");
 if(id==="monthly")navMonthly.classList.add("on");
 renderAll(); scrollTo(0,0);
}

const GOAL_KEY="my_asset_v13_goal";

let goal=
  JSON.parse(
    localStorage.getItem(GOAL_KEY)||"null"
  ) || {
    year:2035,
    amount:300000000,
    monthlyContribution:1000000
  };


function monthsToGoal(year){

  const now=new Date();

  const end=
    new Date(
      Number(year),
      11,
      31
    );

  const months=
    (end.getFullYear()-now.getFullYear())*12
    +(end.getMonth()-now.getMonth());

  return Math.max(0,months);
}


/* 특정 연수익률로 목표년도 자산 계산 */

function futureAsset(
  current,
  monthly,
  months,
  annualRate
){

  const monthlyRate=
    Math.pow(
      1+annualRate,
      1/12
    )-1;


  if(
    Math.abs(monthlyRate)
    <0.0000001
  ){

    return current+
      monthly*months;

  }


  const growth=
    Math.pow(
      1+monthlyRate,
      months
    );


  return (
    current*growth
    +
    monthly*
    (
      (growth-1)/
      monthlyRate
    )
  );

}


/* 목표금액 달성에 필요한 연수익률 계산 */

function requiredAnnualReturn(
  current,
  monthly,
  target,
  months
){

  if(months<=0){
    return null;
  }


  /* 수익률 0%만으로 목표 달성 */

  if(
    current+
    monthly*months
    >=target
  ){

    return 0;

  }


  let low=0;
  let high=20;


  /* 100번 반복해 근사값 계산 */

  for(
    let i=0;
    i<100;
    i++
  ){

    const mid=
      (low+high)/2;


    const future=
      futureAsset(
        current,
        monthly,
        months,
        mid
      );


    if(future>=target){

      high=mid;

    }else{

      low=mid;

    }

  }


  return high;

}


function renderGoal(){

  const k=latestKey();

  if(!k || !data[k]) return;


  const current=
    total(data[k]);


  const target=
    Number(
      goal.amount||0
    );


  const monthly=
    Number(
      goal.monthlyContribution||0
    );


  const months=
    monthsToGoal(
      goal.year
    );


  const progress=
    target>0
    ?
    current/target*100
    :
    0;


  const remain=
    Math.max(
      0,
      target-current
    );


  const required=
    requiredAnnualReturn(
      current,
      monthly,
      target,
      months
    );


  goalAmountText.textContent=
    money(target);


  goalYearText.textContent=
    goal.year+"년";


  goalMonthlyText.textContent=
    money(monthly);


  goalProgressText.textContent=
    progress.toFixed(1)+"%";


  goalProgressBar.style.width=
    Math.min(
      100,
      Math.max(
        0,
        progress
      )
    )+"%";


  goalRemainText.textContent=
    money(remain);


  if(current>=target){

    goalRequiredText.textContent=
      "달성";

    goalMessage.textContent=
      "목표금액을 이미 달성했습니다.";

    return;

  }


  if(required===null){

    goalRequiredText.textContent=
      "-";

    goalMessage.textContent=
      "목표년도를 확인해주세요.";

    return;

  }


  goalRequiredText.textContent=
    "연 "+
    (required*100)
    .toFixed(1)
    +"%";


  goalMessage.textContent=
    "현재자산 "+
    money(current)+
    "에 매월 "+
    money(monthly)+
    "을 추가한다고 가정하면, "+
    goal.year+
    "년 목표 달성에 필요한 연평균수익률은 약 "+
    (required*100)
    .toFixed(1)+
    "%입니다.";

}


function openGoalModal(){

  modalTitle.textContent=
    "자산 목표 설정";


  modalContent.innerHTML=`

    <label>
      목표년도
    </label>

    <input
      id="gYear"
      type="number"
      value="${goal.year}"
    >


    <label>
      목표금액
    </label>

    <input
      id="gAmount"
      type="number"
      value="${goal.amount}"
    >


    <label>
      매월 추가 투자금
    </label>

    <input
      id="gMonthly"
      type="number"
      value="${goal.monthlyContribution||0}"
      placeholder="예: 1000000"
    >


    <div
      class="notice"
      style="margin-top:12px"
    >
      목표년도와 목표금액,
      매월 추가 투자금을 기준으로
      필요한 연평균수익률을
      자동 계산합니다.
    </div>


    <button
      class="btn"
      onclick="saveGoal()"
    >
      목표 저장하기
    </button>

  `;


  modalBg.classList.remove(
    "hidden"
  );

}


function saveGoal(){

  const year=
    Number(
      document
      .getElementById(
        "gYear"
      ).value
    );


  const amount=
    Number(
      document
      .getElementById(
        "gAmount"
      ).value
    );


  const monthlyContribution=
    Number(
      document
      .getElementById(
        "gMonthly"
      ).value
    )||0;


  if(
    !year ||
    !amount
  ){

    alert(
      "목표년도와 목표금액을 확인해주세요."
    );

    return;

  }


  goal={
    year,
    amount,
    monthlyContribution
  };


  localStorage.setItem(
    GOAL_KEY,
    JSON.stringify(goal)
  );


  closeModal();

  renderGoal();

}
  function assetBaseDate(key){

  if(!key) return "-";

  const [
    year,
    month
  ] = key
    .split("-")
    .map(Number);

  const lastDay =
    new Date(
      year,
      month,
      0
    ).getDate();

  return (
    year +
    "." +
    String(month).padStart(2,"0") +
    "." +
    String(lastDay).padStart(2,"0")
  );

}
  function currentMonthKey(){

  const d=new Date();

  return (
    d.getFullYear()+
    "-"+
    String(
      d.getMonth()+1
    ).padStart(2,"0")
  );

}


function confirmCurrentMonthAsset(){

  const month =
    currentMonthKey();

  const latest =
    latestKey();

  if(
    !latest ||
    !data[latest]
  ){

    alert(
      "기준이 될 기존 자산 기록이 없습니다."
    );

    return;
  }


  /*
  이미 이번 달 기록이 있으면
  이번 달 값을 기준으로,
  없으면 직전 월 값을 기준으로 사용
  */

  const base =
    data[month] ||
    data[latest];


  /*
  투자계좌 평가금액은
  현재 투자화면의 실시간 보유종목 합계
  */

  const pensionValue =
    holdingValueTotal(
      "pension"
    );

  const isaValue =
    holdingValueTotal(
      "isa"
    );

  const tossValue =
    holdingValueTotal(
      "toss"
    );


  modalTitle.textContent =
    "이번 달 자산 확정";


  modalContent.innerHTML = `

    <div class="notice">
      아직 저장되지 않습니다.<br>
      각 금액을 확인하거나 수정한 뒤
      최종 확정해주세요.
    </div>


    <div
      style="
        margin-top:14px;
        font-size:18px;
        font-weight:900;
      "
    >
      ${month.replace("-", "년 ")}월
    </div>


    <!-- 연금저축 -->

    <div
      class="card"
      style="margin-top:12px"
    >

      <b>연금저축</b>

      <label>
        투자원금
      </label>

      <input
        id="confirmPensionInvest"
        type="number"
        value="${base.pension?.invest || 0}"
      >

      <label>
        평가금액
      </label>

      <input
        id="confirmPensionValue"
        type="number"
        value="${Math.round(pensionValue)}"
      >

    </div>


    <!-- ISA -->

    <div class="card">

      <b>ISA</b>

      <label>
        투자원금
      </label>

      <input
        id="confirmIsaInvest"
        type="number"
        value="${base.isa?.invest || 0}"
      >

      <label>
        평가금액
      </label>

      <input
        id="confirmIsaValue"
        type="number"
        value="${Math.round(isaValue)}"
      >

    </div>


    <!-- 토스증권 -->

    <div class="card">

      <b>토스증권</b>

      <label>
        투자원금
      </label>

      <input
        id="confirmTossInvest"
        type="number"
        value="${base.toss?.invest || 0}"
      >

      <label>
        평가금액
      </label>

      <input
        id="confirmTossValue"
        type="number"
        value="${Math.round(tossValue)}"
      >

    </div>


    <!-- 청년도약계좌 -->

    <div class="card">

      <b>청년도약계좌</b>

      <label>
        납입원금
      </label>

      <input
        id="confirmSavingsInvest"
        type="number"
        value="${base.savings?.invest || 0}"
      >

      <label>
        현재금액
      </label>

      <input
        id="confirmSavingsValue"
        type="number"
        value="${base.savings?.value || 0}"
      >

    </div>


    <button
      class="btn"
      onclick="saveCurrentMonthAsset()"
    >
      최종 확정
    </button>


    <button
      class="btn gray"
      onclick="closeModal()"
    >
      취소
    </button>

  `;


  modalBg.classList.remove(
    "hidden"
  );

}
  function saveCurrentMonthAsset(){

  const month =
    currentMonthKey();


  function inputNumber(id){

    const el =
      document.getElementById(id);

    if(!el){
      return NaN;
    }

    return Number(
      el.value
    );

  }


  const pensionInvest =
    inputNumber(
      "confirmPensionInvest"
    );

  const pensionValue =
    inputNumber(
      "confirmPensionValue"
    );


  const isaInvest =
    inputNumber(
      "confirmIsaInvest"
    );

  const isaValue =
    inputNumber(
      "confirmIsaValue"
    );


  const tossInvest =
    inputNumber(
      "confirmTossInvest"
    );

  const tossValue =
    inputNumber(
      "confirmTossValue"
    );


  const savingsInvest =
    inputNumber(
      "confirmSavingsInvest"
    );

  const savingsValue =
    inputNumber(
      "confirmSavingsValue"
    );


  const values = [

    pensionInvest,
    pensionValue,

    isaInvest,
    isaValue,

    tossInvest,
    tossValue,

    savingsInvest,
    savingsValue

  ];


  if(
    values.some(
      v =>
        !Number.isFinite(v) ||
        v < 0
    )
  ){

    alert(
      "입력한 금액을 확인해주세요."
    );

    return;
  }


  const totalValue =
    pensionValue +
    isaValue +
    tossValue +
    savingsValue;


  const ok =
    confirm(

      month +
      " 자산을 최종 저장할까요?\n\n" +

      "연금저축: " +
      money(pensionValue) +
      "\n" +

      "ISA: " +
      money(isaValue) +
      "\n" +

      "토스증권: " +
      money(tossValue) +
      "\n" +

      "청년도약계좌: " +
      money(savingsValue) +
      "\n\n" +

      "총자산: " +
      money(totalValue)

    );


  if(!ok){
    return;
  }


  data[month] = {

    label:
      month.slice(0,4) +
      "년 " +
      Number(
        month.slice(5)
      ) +
      "월",


    pension:{

      invest:
        pensionInvest,

      value:
        pensionValue

    },


    isa:{

      invest:
        isaInvest,

      value:
        isaValue

    },


    toss:{

      invest:
        tossInvest,

      value:
        tossValue

    },


    savings:{

      invest:
        savingsInvest,

      value:
        savingsValue

    }

  };


  localStorage.setItem(
    MONTH_KEY,
    JSON.stringify(data)
  );


  closeModal();

  renderAll();


  alert(
    month +
    " 자산이 최종 확정되었습니다."
  );

}
function dashboardSnapshot(records, positions, now=Date.now()){
 const months=Object.keys(records).filter(k=>/^\d{4}-(0[1-9]|1[0-2])$/.test(k)).sort();
 const latest=months.at(-1), record=records[latest]||{};
 const number=n=>Number.isFinite(Number(n))?Number(n):0;
 let estimate=number(record.savings?.value), automatic=0, manual=0, missing=0, failed=0, older=0;
 const timestamps=[], fallback=[];
 for(const account of ['pension','isa','toss']){
   if(!Array.isArray(positions[account])){estimate+=number(record[account]?.value);fallback.push(ACCOUNTS[account].name);continue}
   for(const h of positions[account]){
     estimate+=number(h.value);
     if(!h.ticker||h.autoPrice===false){manual++;continue}
     automatic++;
     if(h.quoteError)failed++;
     const ts=h.quote?.timestamp;
     if(typeof ts!=='number'||!Number.isFinite(ts)||ts<=0||ts*1000>now+300000){missing++;continue}
     timestamps.push(ts);
     if(now-ts*1000>7*24*60*60*1000)older++;
   }
 }
 const recorded=Object.keys(ACCOUNTS).reduce((sum,a)=>sum+number(record[a]?.value),0);
 return {latest,estimate,recorded,difference:estimate-recorded,automatic,manual,missing,failed,older,fallback,
   oldest:timestamps.length?Math.min(...timestamps):null};
}
function renderDashboard(){
 const view=dashboardSnapshot(data,holdings);
 const node=document.getElementById('homeSnapshot');
 if(node)node.innerHTML=`<div class="dashboard-eyebrow">보유종목 기준 평가액</div>
   <div class="dashboard-value">${money(view.estimate)}</div>
   <div class="dashboard-difference ${view.difference>=0?'pos':'neg'}">월별 기록과 ${signedMoney(view.difference)} 차이</div>
   <p class="dashboard-description">저장된 종목 평가금액에 청년도약계좌의 월별 기록을 더한 값입니다. 시세·수동 입력 시점이 섞여 있으며 실시간 총자산은 아닙니다. 차액은 투자수익을 뜻하지 않습니다.</p>
   <div class="dashboard-health" aria-label="시세 확인 현황">
     <span>자동조회 대상 ${view.automatic}개</span><span>수동 관리 ${view.manual}개</span>
     ${view.missing?`<span>시세 미확인 ${view.missing}개</span>`:''}
     ${view.failed?`<span>최근 조회 실패 ${view.failed}개</span>`:''}
     ${view.older?`<span>7일 이전 시세 ${view.older}개</span>`:''}
   </div>
   <p class="dashboard-description">${view.oldest?'가장 오래된 종목 시세: '+escapeAttr(quoteTime(view.oldest*1000)):'아직 확인된 종목 시세가 없습니다.'}
     ${view.fallback.length?'<br>종목 목록이 없는 '+escapeAttr(view.fallback.join(', '))+'는 월별 기록을 사용합니다.':''}</p>
   <div class="dashboard-actions"><button class="btn" onclick="go('invest')">시세·보유종목 보기</button><button class="btn gray" onclick="confirmCurrentMonthAsset()">이번 달 기록하기</button></div>
   <button class="btn gray" style="font-size:12px;padding:10px" onclick="exportMyAssetBackup()">현재 데이터 백업</button>`;
 const recent=document.getElementById('homeRecent');
 if(recent)recent.innerHTML=validKeys().slice(-3).reverse().map(k=>{
   const previous=prevKey(k), value=total(data[k]);
   const change=previous?signedMoney(value-total(data[previous])):'첫 기록';
   return `<div class="dashboard-history"><span>${escapeAttr(data[k].label||k)}</span><b>${money(value)}</b><small>${previous?escapeAttr(data[previous].label||previous)+' 대비 ':''}${change}</small></div>`;
 }).join('')||'<div class="muted">아직 월별 기록이 없습니다.</div>';
}
  function renderHome(){
 const k=latestKey(),m=data[k],pk=prevKey(k),p=pk?total(data[pk]):0,t=total(m),d=t-p;
    if(
  document.getElementById(
    "assetBaseDateText"
  )
){

  assetBaseDateText.textContent =
    assetBaseDate(k) + " 기준";

}
 const yk=firstKeyOfYear(k), ybase=yk?total(data[yk]):0;
 const monthRate=pk?changeRate(t,p):null;
 const ytdAmt=yk?changeAmount(t,ybase):0;
 const ytdRate=yk?changeRate(t,ybase):null;

 const comparison=pk&&monthAfter(pk)===k?'전월 대비':'이전 기록 대비';
 homeMonth.textContent=m.label+" 기준";
 homeTotal.textContent=money(t);
 document.getElementById('homeWithoutPension').textContent=money(t-Number(m.pension?.value||0));
 document.getElementById('homePensionExcluded').textContent='총자산에서 연금저축 '+money(Number(m.pension?.value||0))+' 제외';
 homeChange.textContent=pk?`${comparison} ${signedMoney(d)} (${signedPct(monthRate)})`:"첫 기록";
 homeChange.className="change "+(d>=0?"pos":"neg");
 monthPerf.textContent=pk?`${signedMoney(d)} · ${signedPct(monthRate)}`:"-";
 document.querySelector('#monthPerf').previousElementSibling.textContent=comparison;
 ytdPerf.textContent=yk?`${signedMoney(ytdAmt)} · ${signedPct(ytdRate)}`:"-";

 const invProfit=investmentProfit(m);
 const invReturn=investmentReturn(m);
 assetGrowthRate.textContent=yk?signedPct(ytdRate):"-";
 assetGrowthRate.className="v "+(ytdRate==null||ytdRate>=0?"pos":"neg");
 assetGrowthAmount.textContent=yk?`자산 ${signedMoney(ytdAmt)}`:"기준 데이터 없음";

 investmentReturnRate.textContent=invReturn==null?"-":signedPct(invReturn);
 investmentReturnRate.className="v "+(invReturn==null||invReturn>=0?"pos":"neg");
 investmentReturnAmount.textContent=invReturn==null?"투자 데이터 없음":`평가손익 ${signedMoney(invProfit)}`;
 accountGrid.innerHTML=Object.entries(ACCOUNTS).map(([ak,a])=>{
   const v=m[ak]?.value||0;
   const delta=pk?v-Number(data[pk][ak]?.value||0):null;
   return `<div class="mini"><div class="name">${a.name}</div><div class="value">${money(v)}</div><div class="muted">기록 총자산의 ${t?(v/t*100).toFixed(1):0}%</div><div class="dashboard-account-delta ${delta==null?'muted':delta>=0?'pos':'neg'}">${delta==null?'첫 기록':comparison+' '+signedMoney(delta)}</div></div>`;
 }).join("");
 renderTrendChart();
 allocation.innerHTML=Object.entries(ACCOUNTS).map(([ak,a])=>{
   const v=m[ak]?.value||0,r=t?v/t*100:0;
   return `<div style="margin-bottom:14px"><div class="row"><span>${a.name}</span><b>${money(v)}</b></div><div class="bar"><i style="width:${r}%;background:${a.color}"></i></div><div class="muted" style="margin-top:4px">${r.toFixed(1)}%</div></div>`;
 }).join("");
 const inv=invested(m),pf=t-inv,rate=inv?pf/inv:0;
 summary.innerHTML=`<div class="row"><span class="muted">총 투자금액</span><b>${money(inv)}</b></div>
 <div class="row" style="margin-top:10px"><span class="muted">평가금액</span><b>${money(t)}</b></div>
 <div class="row" style="margin-top:10px"><span class="muted">평가손익</span><b class="${pf>=0?"pos":"neg"}">${pf>=0?"+":""}${money(pf)}</b></div>
 <div class="row" style="margin-top:10px"><span class="muted">수익률</span><b class="${rate>=0?"pos":"neg"}">${pct(rate)}</b></div>`;
 renderDashboard();
 renderGoal();
}

function renderTrendChart(){
  const svg = document.getElementById("trendChart");
  const box = document.getElementById("trendChartBox");
  const tooltip = document.getElementById("trendTooltip");

  const ks = validKeys();
  if(!ks.length){
    svg.innerHTML = "";
    if(tooltip) tooltip.style.display = "none";
    return;
  }

  const W = 420, H = 210, L = 44, R = 8, T = 12, B = 28;
  const plotW = W - L - R;
  const plotH = H - T - B;

  const totalVals = ks.map(k => total(data[k]));

  const lineSeries = [
    {key:"pension", label:"연금저축", color:"#1769e0", width:2},
    {key:"isa",     label:"ISA",     color:"#12a594", width:2},
    {key:"toss",    label:"토스증권", color:"#8b5cf6", width:2},
    {key:"savings", label:"청년도약계좌", color:"#f59e0b", width:2}
  ];

  const valuesBySeries = {
    total: totalVals
  };

  for(const s of lineSeries){
    valuesBySeries[s.key] = ks.map(k => Number(data[k][s.key]?.value || 0));
  }

  const allValues = [
    ...totalVals,
    ...lineSeries.flatMap(s => valuesBySeries[s.key])
  ];

  const maxRaw = Math.max(...allValues, 1);
  const maxY = Math.ceil((maxRaw * 1.08) / 10000000) * 10000000;
  const minY = 0;

  const x = i => L + (ks.length === 1 ? plotW / 2 : i * plotW / (ks.length - 1));
  const y = v => T + (maxY - v) / (maxY - minY) * plotH;

  let out = "";

  // grid + y labels
  const gridCount = 4;
  for(let g = 0; g <= gridCount; g++){
    const value = maxY - (maxY - minY) * (g / gridCount);
    const yy = T + plotH * (g / gridCount);

    out += `<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="#e8edf3" stroke-width="1"/>`;
    out += `<text x="${L-5}" y="${yy+3}" text-anchor="end" font-size="9" fill="#8a95a5">${Math.round(value/1000000)}M</text>`;
  }

  // total bars (behind)
  const barWidth = ks.length === 1 ? 28 : Math.min(26, (plotW / ks.length) * 0.5);
  totalVals.forEach((v, i) => {
    const xx = x(i) - barWidth / 2;
    const yy = y(v);
    const hh = H - B - yy;

    out += `
      <rect
        x="${xx}"
        y="${yy}"
        width="${barWidth}"
        height="${Math.max(hh, 0)}"
        rx="7"
        fill="rgba(23,32,51,.14)"
      />
    `;
  });

  // hover guide line
  out += `
    <line
      id="trendGuide"
      x1="${L}"
      y1="${T}"
      x2="${L}"
      y2="${H-B}"
      stroke="#94a3b8"
      stroke-width="1"
      stroke-dasharray="4 4"
      style="display:none"
    />
  `;

  // account lines
  for(const s of lineSeries){
    const vals = valuesBySeries[s.key];
    const pts = vals.map((v,i) => `${x(i)},${y(v)}`).join(" ");

    out += `
      <polyline
        points="${pts}"
        fill="none"
        stroke="${s.color}"
        stroke-width="${s.width}"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity=".95"
      />
    `;

    vals.forEach((v,i) => {
      out += `
        <circle
          cx="${x(i)}"
          cy="${y(v)}"
          r="2.8"
          fill="${s.color}"
        />
      `;
    });
  }

  // total top points only
  totalVals.forEach((v,i) => {
    out += `
      <circle
        cx="${x(i)}"
        cy="${y(v)}"
        r="2.6"
        fill="#172033"
        opacity=".9"
      />
    `;
  });

  // x labels
  ks.forEach((k, i) => {
    out += `<text x="${x(i)}" y="${H-8}" text-anchor="middle" font-size="9" fill="#7b8797">${Number(k.slice(5))}월</text>`;
  });

  // invisible hover columns
  ks.forEach((k, i) => {
    const left = i === 0 ? L : (x(i-1) + x(i)) / 2;
    const right = i === ks.length - 1 ? (W - R) : (x(i) + x(i+1)) / 2;

    out += `
      <rect
        class="hover-col"
        data-i="${i}"
        x="${left}"
        y="${T}"
        width="${right-left}"
        height="${plotH}"
        fill="transparent"
        style="cursor:pointer"
      />
    `;
  });

  svg.innerHTML = out;

  const guide = document.getElementById("trendGuide");

  function getMonthLabel(key){
    return data[key]?.label || key;
  }

  function tooltipHtml(i){
    const rows = [
      {label:"총자산", color:"rgba(23,32,51,.7)", value:totalVals[i]},
      ...lineSeries.map(s => ({
        label:s.label,
        color:s.color,
        value:valuesBySeries[s.key][i]
      }))
    ];

    return `
      <div class="tt-title">${getMonthLabel(ks[i])}</div>
      ${rows.map(r => `
        <div class="tt-row">
          <span><i style="background:${r.color}"></i>${r.label}</span>
          <b>${money(r.value)}</b>
        </div>
      `).join("")}
    `;
  }

  function showTooltip(i){
    tooltip.innerHTML = tooltipHtml(i);
    tooltip.style.display = "block";

    guide.setAttribute("x1", x(i));
    guide.setAttribute("x2", x(i));
    guide.style.display = "block";

    let leftPx = (x(i) / W) * box.clientWidth + 10;

    requestAnimationFrame(() => {
      const maxLeft = box.clientWidth - tooltip.offsetWidth - 6;
      if(leftPx > maxLeft) leftPx = maxLeft;
      if(leftPx < 6) leftPx = 6;

      tooltip.style.left = leftPx + "px";
      tooltip.style.top = "8px";
    });
  }

  function hideTooltip(){
    tooltip.style.display = "none";
    guide.style.display = "none";
  }

  svg.querySelectorAll(".hover-col").forEach(el => {
    const i = Number(el.dataset.i);

    el.addEventListener("mouseenter", () => showTooltip(i));
    el.addEventListener("mousemove", () => showTooltip(i));
    el.addEventListener("click", () => showTooltip(i));
  });

  box.addEventListener("mouseleave", hideTooltip);
}

function renderAssets(){
 const k=latestKey(),m=data[k],t=total(m);
 const pk=prevKey(k),pm=pk?data[pk]:null;
 const yk=firstKeyOfYear(k),ym=yk?data[yk]:null;

 assetTotal.textContent=money(t);

 const monthAmt=pm?changeAmount(t,total(pm)):0;
 const monthRate=pm?changeRate(t,total(pm)):null;
 const ytdAmt=ym?changeAmount(t,total(ym)):0;
 const ytdRate=ym?changeRate(t,total(ym)):null;

 assetPerformance.innerHTML=`
   <div class="metric-row metric-head"><span>구분</span><span>금액 변화</span><span>변화율</span></div>
   <div class="metric-row"><b>전월 대비</b><b class="${monthAmt>=0?"pos":"neg"}">${pm?signedMoney(monthAmt):"-"}</b><b class="${(monthRate??0)>=0?"pos":"neg"}">${pm?signedPct(monthRate):"-"}</b></div>
   <div class="metric-row"><b>연초 대비</b><b class="${ytdAmt>=0?"pos":"neg"}">${ym?signedMoney(ytdAmt):"-"}</b><b class="${(ytdRate??0)>=0?"pos":"neg"}">${ym?signedPct(ytdRate):"-"}</b></div>
 `;

 assetCards.innerHTML=Object.entries(ACCOUNTS).map(([ak,a])=>{
  const x=m[ak],pf=x.value-x.invest,r=x.invest?pf/x.invest:0;
  const prevVal=pm?Number(pm[ak]?.value||0):null;
  const firstVal=ym?Number(ym[ak]?.value||0):null;
  const mAmt=pm?changeAmount(x.value,prevVal):null;
  const mRate=pm?changeRate(x.value,prevVal):null;
  const yAmt=ym?changeAmount(x.value,firstVal):null;
  const yRate=ym?changeRate(x.value,firstVal):null;

  return `<div class="card">
    <div class="row"><b>${a.name}</b><b>${money(x.value)}</b></div>
    <div class="row" style="margin-top:8px"><span class="muted">투자금액</span><span>${money(x.invest)}</span></div>
    <div class="row" style="margin-top:6px"><span class="muted">평가손익</span><b class="${pf>=0?"pos":"neg"}">${pf>=0?"+":""}${money(pf)}</b></div>
    <div class="row" style="margin-top:6px"><span class="muted">계좌 수익률</span><b class="${r>=0?"pos":"neg"}">${pct(r)}</b></div>
    <div class="metric-row" style="margin-top:8px"><span class="muted">전월 대비</span><b class="${(mAmt??0)>=0?"pos":"neg"}">${pm?signedMoney(mAmt):"-"}</b><b class="${(mRate??0)>=0?"pos":"neg"}">${pm?signedPct(mRate):"-"}</b></div>
    <div class="metric-row"><span class="muted">연초 대비</span><b class="${(yAmt??0)>=0?"pos":"neg"}">${ym?signedMoney(yAmt):"-"}</b><b class="${(yRate??0)>=0?"pos":"neg"}">${ym?signedPct(yRate):"-"}</b></div>
  </div>`;
 }).join("");
}

function holdingValueTotal(account){
 return (holdings[account]||[]).reduce((sum,h)=>sum+Number(h.value||0),0);
}

function syncHoldingAccountToLatestMonth(account){
 const k=latestKey();
 if(!k || !data[k] || !data[k][account]) return;

 const newValue=holdingValueTotal(account);
 data[k][account].value=newValue;
 localStorage.setItem(MONTH_KEY,JSON.stringify(data));

 const msg=document.getElementById("syncMsg");
 if(msg){
   msg.innerHTML=`<div class="notice" style="margin-bottom:12px">${ACCOUNTS[account].name} 종목 합계 ${money(newValue)}가 ${data[k].label} 평가금액에 자동 반영되었습니다.</div>`;
 }
}

function syncAllHoldingAccountsToLatestMonth(){
 ["pension","isa","toss"].forEach(syncHoldingAccountToLatestMonth);
}

function renderInvest(){
 const k=latestKey(),m=data[k];
 const iv=investmentPrincipal(m);
 const vv=investmentValue(m);
 const pf=vv-iv;
 const r=iv?pf/iv:0;

 const yk=firstKeyOfYear(k);
 const ym=yk?data[yk]:null;
 const ytdInvValueChange=ym?changeAmount(vv,investmentValue(ym)):null;
 const ytdInvValueRate=ym?changeRate(vv,investmentValue(ym)):null;
 const principalAdded=ym?changeAmount(iv,investmentPrincipal(ym)):null;

 investSummary.innerHTML=`
 <div class="row"><span class="muted">투자계좌 원금</span><b>${money(iv)}</b></div>
 <div class="row" style="margin-top:10px"><span class="muted">투자계좌 평가액</span><b>${money(vv)}</b></div>
 <div class="row" style="margin-top:10px"><span class="muted">현재 평가손익</span><b class="${pf>=0?"pos":"neg"}">${signedMoney(pf)}</b></div>
 <div class="row" style="margin-top:10px"><span class="muted">현재 투자손익률</span><b class="${r>=0?"pos":"neg"}">${signedPct(r)}</b></div>
 <div style="height:10px"></div>
 <div class="metric-row metric-head"><span>연초 이후</span><span>금액</span><span>변화율</span></div>
 <div class="metric-row">
   <span class="muted">투자자산 평가액 변화</span>
   <b class="${(ytdInvValueChange??0)>=0?"pos":"neg"}">${ym?signedMoney(ytdInvValueChange):"-"}</b>
   <b class="${(ytdInvValueRate??0)>=0?"pos":"neg"}">${ym?signedPct(ytdInvValueRate):"-"}</b>
 </div>
 <div class="metric-row">
   <span class="muted">추가 투자원금</span>
   <b class="${(principalAdded??0)>=0?"pos":"neg"}">${ym?signedMoney(principalAdded):"-"}</b>
   <span>-</span>
 </div>`;

 holdingAccounts.innerHTML=["pension","isa","toss"].map(k=>renderHoldingAccount(k)).join("");
 renderUsdFxStatus();
}

function renderHoldingAccount(k){

  const a=
    ACCOUNTS[k];

  const arr=
    holdings[k] || [];


  return `
  <div class="account-block">

    <div class="account-title">

      <b>${a.name}</b>

      <div
        style="
          display:flex;
          gap:6px;
          flex-wrap:wrap;
          justify-content:flex-end
        "
      >

        ${
          k==="pension" ||
          k==="isa"
          ?
          `
          <button
            class="btn gray small"
            onclick="refreshKoreanPrices('${k}',this)"
          >
            ↻ 현재가
          </button>
          `
          :
          ""
        }


        ${
          k==="toss"
          ?
          `
          <button
            class="btn gray small"
            onclick="refreshTossPrices(this)"
          >
            ↻ 현재가
          </button>
          `
          :
          ""
        }


        <button
          class="btn gray small"
          onclick="manualSync('${k}')"
        >
          합계 반영
        </button>


        <button
          class="btn small"
          onclick="openHoldingModal('${k}',-1)"
        >
          + 종목 추가
        </button>

      </div>

    </div>


    <div class="card">

      <div
        class="row"
        style="
          padding-bottom:10px;
          border-bottom:1px solid #edf0f4
        "
      >

        <span class="muted">
          종목 평가금액 합계
        </span>

        <b>
          ${money(
            holdingValueTotal(k)
          )}
        </b>

      </div>


      ${
        arr.length
        ?
        arr
          .map(
            (h,i)=>
              holdingRow(
                k,
                h,
                i
              )
          )
          .join("")
        :
        `
        <div
          class="muted"
          style="padding-top:12px"
        >
          등록된 종목이 없습니다.
        </div>
        `
      }

    </div>

  </div>
  `;

}

function holdingRow(account,h,i){
 const r=pctFromHolding(h), auto=!!h.ticker&&h.autoPrice!==false;
 return `<div class="holding"><div class="row">
 <div><b>${escapeAttr(h.name)}</b> <span class="pill">${auto?'자동':'수동'}</span>
 <div class="muted">${h.qty!=null?'보유 '+h.qty+'주':'현금성 자산'}${r!=null?' · '+pct(r)+(isUsdHolding(h)?' (USD 기준)':''):''}</div></div>
 <div class="holding-amount">${isUsdHolding(h)?'<strong>'+usdMoney(h.usd.value)+'</strong><span class="muted">'+money(h.value)+'</span>':'<strong>'+money(h.value)+'</strong>'}</div>
 </div><div class="muted" style="margin-top:7px;line-height:1.65">${currencyHoldingDetails(h)}</div>
 ${h.ticker?'<div class="muted" style="margin-top:5px">시세코드 '+escapeAttr(h.ticker)+'</div>':''}
 ${quoteDescription(h)}
 <div class="holding-actions"><button class="btn gray small" aria-label="위로 이동" onclick="moveHolding('${account}',${i},-1)" ${i===0?'disabled':''}>↑ 위로</button><button class="btn gray small" aria-label="아래로 이동" onclick="moveHolding('${account}',${i},1)" ${i===holdings[account].length-1?'disabled':''}>↓ 아래로</button><button class="btn gray small" onclick="openHoldingModal('${account}',${i})">수정</button><button class="btn danger small" onclick="deleteHolding('${account}',${i})">삭제</button></div></div>`;
}

const quoteBusy = new Set();
function quoteTime(value){
 const date=new Date(value);
 return Number.isFinite(date.getTime()) ? date.toLocaleString('ko-KR') : '확인 불가';
}
function quoteDescription(h){
 const q=h.quote;
 const manual=h.autoPrice===false || !h.ticker;
 return `<div class="muted" style="margin-top:5px;font-size:12px">
 ${manual?'수동 입력':q?`시세 기준 ${escapeAttr(quoteTime(q.timestamp*1000))}<br>조회 ${escapeAttr(quoteTime(q.fetchedAt))} · Yahoo Finance (지연 가능)
 ${q.currency==='USD'&&!isUsdHolding(h)?`<br>원화 환산: $${q.price.toLocaleString('en-US',{maximumFractionDigits:4})} × ${q.fxRate.toLocaleString('ko-KR',{maximumFractionDigits:4})}원<br>환율 기준 ${escapeAttr(quoteTime(q.fxTimestamp*1000))}`:''}`:'아직 시세를 갱신하지 않았습니다.'}
 ${h.quoteError?`<br><span style="color:#b45309">${escapeAttr(h.quoteError)} · 기존 입력값 유지</span>`:''}
 </div>`;
}
async function quoteJSON(url){
 const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(25000)});
 if(!response.ok)throw new Error('시세 서버 응답 오류');
 return response.json();
}
function refreshTossPrices(button=null){return refreshAccountPrices('toss',button)}
function refreshKoreanPrices(account,button=null){return refreshAccountPrices(account,button)}
async function refreshAccountPrices(account,button=null){
 if(!['pension','isa','toss'].includes(account)||quoteBusy.has(account))return;
 const original=holdings[account]||[];
 const requested=original.filter(h=>h.ticker&&h.autoPrice!==false);
 if(!requested.length){alert('자동조회할 시세코드가 없습니다. 종목 수정에서 코드를 입력해주세요.');return}
 const versions=new Map(requested.map(h=>[h,JSON.stringify(h)]));
 quoteBusy.add(account);
 if(button){button.disabled=true;button.textContent='불러오는 중…'}
 try{
   const symbols=[...new Set(requested.map(h=>h.ticker.trim().toUpperCase()))];
   const results=[];
   for(let i=0;i<symbols.length;i+=50){
     const payload=await quoteJSON('/api/quotes?symbols='+encodeURIComponent(symbols.slice(i,i+50).join(',')));
     if(!Array.isArray(payload.items))throw new Error('시세 응답 형식이 올바르지 않습니다.');
     results.push(...payload.items);
   }
   const map=new Map(results.map(item=>[String(item.symbol).toUpperCase(),item]));
   let fx=null;
   if(results.some(item=>item.ok&&item.currency==='USD')){
     try{fx=await fetchUsdFx(true)}catch{ /* USD rows will retain previous values. */ }
   }
   // Remote sync or editing may replace the account while the request is pending.
   if(holdings[account]!==original)throw new Error('조회 중 자산 데이터가 변경되었습니다. 다시 조회해주세요.');
   let updated=0, skipped=0;
   const failed=[];
   const next=original.map(h=>{
     if(!versions.has(h))return h;
     if(versions.get(h)!==JSON.stringify(h)){skipped++;return h}
     const item=map.get(h.ticker.trim().toUpperCase());
     let reason=null;
     const positive=n=>typeof n==='number'&&Number.isFinite(n)&&n>0;
     if(!item?.ok||!positive(item.price)||!positive(item.timestamp))reason='시세 조회 실패';
     else if(!['USD','KRW'].includes(item.currency))reason='지원하지 않는 통화';
     else if(isUsdHolding(h)&&item.currency!=='USD')reason='입력 통화와 시세 통화 불일치';
     else if(item.timestamp>Date.now()/1000+300)reason='시세 시각 확인 필요';
     else if(item.currency==='USD'&&(!fx||!positive(fx.rate)||!positive(fx.timestamp)||fx.currency!=='KRW'||fx.timestamp>Date.now()/1000+300))reason='환율 조회 실패';
     else if(h.qty==null||typeof h.qty!=='number'||!Number.isFinite(h.qty)||h.qty<0)reason='보유수량 확인 필요';
     // Reject a response older than an already applied quote for this same ticker.
     else if(h.quote?.symbol===item.symbol&&h.quote.timestamp>item.timestamp)reason='기존 시세보다 오래된 응답';
     else if(item.currency==='USD'&&h.quote?.symbol===item.symbol&&h.quote.fxTimestamp>fx.timestamp)reason='기존 환율보다 오래된 응답';
     if(!reason&&isUsdHolding(h)&&h.fx?.timestamp>fx.timestamp)reason='기존 환율보다 오래된 응답';
     const price=reason?null:item.price*(item.currency==='USD'?fx.rate:1);
     if(!reason&&(!Number.isFinite(price*h.qty)||price*h.qty>Number.MAX_SAFE_INTEGER))reason='평가금액 범위 확인 필요';
     if(reason){failed.push(h.name+' ('+reason+')');return {...h,quoteError:reason}}
     updated++;
     const updatedHolding=isUsdHolding(h)?applyUsdRate({...h,usd:{...h.usd,current:item.price,value:item.price*h.qty}},fx):{...h,current:Math.round(price),value:Math.round(price*h.qty)};
     return {...updatedHolding,quoteError:null,
       quote:{symbol:item.symbol,price:item.price,currency:item.currency,timestamp:item.timestamp,
         fetchedAt:item.fetchedAt||new Date().toISOString(),fxRate:item.currency==='USD'?fx.rate:null,
         fxTimestamp:item.currency==='USD'?fx.timestamp:null}};
   });
   const updatedHoldings={...holdings,[account]:next};
   localStorage.setItem(HOLD_KEY,JSON.stringify(updatedHoldings));
   holdings=updatedHoldings;
   renderInvest();
   renderDashboard();
   const msg=document.getElementById('syncMsg');
   if(msg){msg.innerHTML=`<div class="notice" style="margin-bottom:12px">${ACCOUNTS[account].name}: ${updated}개 갱신${skipped?`, 수정 중인 ${skipped}개 제외`:''}.
     ${failed.length?`<br>${escapeAttr(failed.join(', '))}<br>조회 실패 종목은 기존 가격을 유지했습니다.`:''}
     <br>시세는 지연될 수 있습니다. 월별 자산 기록은 ‘합계 반영’을 눌러야 바뀝니다.</div>`}
 }catch(error){
   const msg=document.getElementById('syncMsg');
   if(msg){msg.textContent='시세 갱신 실패: '+(error.name==='TimeoutError'?'응답 시간이 초과되었습니다.':error.message)+' 기존 가격은 유지됩니다.'}
 }finally{
   quoteBusy.delete(account);
   if(button){button.disabled=false;button.textContent='↻ 현재가'}
 }
}

function manualSync(account){
 syncHoldingAccountToLatestMonth(account);
 renderAll();
}

// Native dollar amounts live separately; the original fields remain KRW for all totals.
let latestUsdFx=null, usdFxPending=null, holdingEditor=null;
const USD_RECOVERY_KEY='ma-currency-migration-backup-v1';
function isUsdHolding(h){return h.inputCurrency==='USD' && !!h.usd}
function usdMoney(value,price=false){
 return value==null?'—':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:price?4:2}).format(value);
}
function validUsdFx(fx){
 return !!fx && Number.isFinite(fx.rate)&&fx.rate>0&&Number.isFinite(fx.timestamp)&&fx.timestamp>0&&fx.timestamp<=Date.now()/1000+300&&fx.currency==='KRW';
}
function applyUsdRate(h,fx){
 if(!isUsdHolding(h)||!validUsdFx(fx))throw new Error('달러 금액 또는 환율을 확인해주세요.');
 const u=h.usd;
 if([u.avg,u.current,u.value].some(v=>v!=null&&(!Number.isFinite(v)||v<0))||!Number.isFinite(u.value))throw new Error('달러 금액을 확인해주세요.');
 if(!Number.isFinite(u.value*fx.rate)||u.value*fx.rate>Number.MAX_SAFE_INTEGER)throw new Error('평가금액이 허용 범위를 넘었습니다.');
 return {...h,avg:u.avg==null?null:Math.round(u.avg*fx.rate),current:u.current==null?null:Math.round(u.current*fx.rate),
   value:Math.round(u.value*fx.rate),fx:{rate:fx.rate,timestamp:fx.timestamp,currency:'KRW',fetchedAt:fx.fetchedAt||new Date().toISOString()}};
}
async function fetchUsdFx(force=false){
 if(!force && latestUsdFx && Date.now()-latestUsdFx.receivedAt<60000)return latestUsdFx;
 if(usdFxPending)return usdFxPending;
 usdFxPending=(async()=>{
   const result=await quoteJSON('/api/usdkrw');
   if(!validUsdFx(result))throw new Error('유효한 원·달러 환율을 받지 못했습니다.');
   if(latestUsdFx&&result.timestamp<latestUsdFx.timestamp)throw new Error('이전에 받은 환율보다 오래된 응답입니다.');
   latestUsdFx={...result,receivedAt:Date.now()};
   return latestUsdFx;
 })();
 try{return await usdFxPending}finally{usdFxPending=null}
}
function renderUsdFxStatus(message){
 const target=document.getElementById('usdFxStatus');
 if(target)target.textContent=message || (latestUsdFx?`1 USD = ${latestUsdFx.rate.toLocaleString('ko-KR',{maximumFractionDigits:4})}원 · 환율 기준 ${quoteTime(latestUsdFx.timestamp*1000)} (지연 가능)`:'달러 입력 시 최신 환율을 조회합니다.');
 const backup=document.getElementById('usdRecoveryButton');
 if(backup)backup.hidden=!localStorage.getItem(USD_RECOVERY_KEY);
}
async function refreshUsdValuations(button=null){
 if(button)button.disabled=true;
 const before=holdings;
 const signature=JSON.stringify(before);
 renderUsdFxStatus('원·달러 환율을 불러오는 중입니다…');
 try{
   const fx=await fetchUsdFx(true);
   if(holdings!==before||JSON.stringify(holdings)!==signature)throw new Error('조회 중 자산이 변경되었습니다. 다시 갱신해주세요.');
   const next={...holdings};
   let count=0;
   for(const account of ['pension','isa','toss'])next[account]=(holdings[account]||[]).map(h=>{
     if(!isUsdHolding(h))return h;
     if(h.fx?.timestamp>fx.timestamp)throw new Error('저장된 환율보다 오래된 응답입니다. 기존 금액을 유지합니다.');
     count++;return applyUsdRate(h,fx);
   });
   if(count && JSON.stringify(next)!==signature){localStorage.setItem(HOLD_KEY,JSON.stringify(next));holdings=next}
   renderInvest();renderDashboard();renderUsdFxStatus();
 }catch(error){renderUsdFxStatus('환율 갱신 실패 · 기존 원화 평가액 유지. '+error.message)}
 finally{if(button)button.disabled=false}
}
function exportUsdMigrationBackup(){
 const value=localStorage.getItem(USD_RECOVERY_KEY);
 if(!value){alert('아직 통화를 변경한 기록이 없습니다.');return}
 const url=URL.createObjectURL(new Blob([value],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download='MY-ASSET-before-USD.json';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function currencyHoldingDetails(h){
 if(!isUsdHolding(h))return `${h.avg!=null?`평균매수가 ${money(h.avg)} · 현재가 ${money(h.current)}`:''}
   ${h.quote?.currency==='USD'?`<br>달러 시세 ${usdMoney(h.quote.price,true)} · 평균매수가는 기존 원화 기록입니다. 수정에서 USD로 전환할 수 있습니다.`:''}`;
 return `평균매수가 ${usdMoney(h.usd.avg,true)} · 현재가 ${usdMoney(h.usd.current,true)}
   <br>원화 환산 ${money(h.current)} / 주 · 환율 ${h.fx.rate.toLocaleString('ko-KR',{maximumFractionDigits:4})}원
   <br>환율 기준 ${escapeAttr(quoteTime(h.fx.timestamp*1000))} · 지연 가능
   ${h.usd.avg!=null?'<br>종목 수익률은 달러 가격 기준이며 환차손익은 포함하지 않습니다.':''}`;
}
function openHoldingModal(account,index){
 const original=index>=0?holdings[account]?.[index]:null;
 const h=original||{name:'',ticker:'',qty:null,avg:null,current:null,value:null};
 const mode=isUsdHolding(h)?'USD':original?'KRW':account==='toss'?'USD':'KRW';
 holdingEditor={account,index,original,signature:original?JSON.stringify(original):null,mode,fx:isUsdHolding(h)?h.fx:null,saving:false,
   drafts:{KRW:{avg:h.avg??'',current:h.current??'',value:h.value??''},USD:isUsdHolding(h)?{...h.usd}:{avg:'',current:h.quote?.currency==='USD'?h.quote.price:'',value:''}}};
 const draft=holdingEditor.drafts[mode];
 modalTitle.textContent=original?'종목 수정':'종목 추가';
 modalContent.innerHTML=`
 <label for="hAccount">계좌</label><select id="hAccount">
   ${['pension','isa','toss'].map(a=>`<option value="${a}" ${a===account?'selected':''}>${ACCOUNTS[a].name}</option>`).join('')}
 </select>
 <label for="hName">종목명</label><input id="hName" value="${escapeAttr(h.name)}" placeholder="예: QQQM">
 <label for="hTicker">시세코드 (비우면 수동 입력)</label><input id="hTicker" value="${escapeAttr(h.ticker||'')}" placeholder="NVDA / 005930.KS">
 <label for="hCurrency">입력 통화</label><select id="hCurrency"><option value="KRW" ${mode==='KRW'?'selected':''}>KRW · 원화</option><option value="USD" ${mode==='USD'?'selected':''}>USD · 미국 달러</option></select>
 <div id="hCurrencyNote" class="notice" style="margin-top:10px"></div>
 <div class="form-grid">
 <div><label for="hQty">보유수량</label><input id="hQty" type="number" step="any" min="0" value="${h.qty??''}"></div>
 <div><label id="hAvgLabel" for="hAvg">평균매수가</label><input id="hAvg" type="number" step="any" min="0" value="${draft.avg??''}" placeholder="모르면 비워두세요"></div>
 </div><div class="form-grid">
 <div><label id="hCurrentLabel" for="hCurrent">현재가</label><input id="hCurrent" type="number" step="any" min="0" value="${draft.current??''}"></div>
 <div><label id="hValueLabel" for="hValue">평가금액</label><input id="hValue" type="number" step="any" min="0" value="${draft.value??''}"></div>
 </div>
 <div id="hFxArea"><p id="hFxStatus" class="muted" role="status" style="line-height:1.6"></p><button class="btn gray small" id="hFxRefresh" type="button">환율 다시 조회</button><p id="hKrwPreview" style="font-weight:800" aria-live="polite"></p></div>
 <div class="notice" style="margin-top:12px">주식은 수량 × 현재가로 평가금액을 계산합니다. 현금은 수량·가격을 비우고 평가금액만 입력하세요. 홈·계좌 합계는 원화 환산 금액입니다.</div>
 <button id="hSave" class="btn" onclick="saveHolding('${account}',${index})">${original?'수정 저장':'추가하기'}</button>`;
 modalBg.classList.remove('hidden');
 document.getElementById('hCurrency').onchange=()=>changeHoldingCurrency();
 for(const id of ['hQty','hAvg','hCurrent','hValue'])document.getElementById(id).addEventListener('input',()=>updateHoldingPreview());
 document.getElementById('hFxRefresh').onclick=()=>loadHoldingFx(true);
 updateHoldingCurrencyUI();updateHoldingPreview();
 if(mode==='USD')void loadHoldingFx();
}
function changeHoldingCurrency(){
 const e=holdingEditor;if(!e)return;
 e.drafts[e.mode]={avg:document.getElementById('hAvg').value,current:document.getElementById('hCurrent').value,value:document.getElementById('hValue').value};
 e.mode=document.getElementById('hCurrency').value;
 const draft=e.drafts[e.mode];
 for(const [id,key] of [['hAvg','avg'],['hCurrent','current'],['hValue','value']])document.getElementById(id).value=draft[key]??'';
 updateHoldingCurrencyUI();updateHoldingPreview();
 if(e.mode==='USD')void loadHoldingFx();
}
function updateHoldingCurrencyUI(){
 const e=holdingEditor;if(!e)return;
 const usd=e.mode==='USD',unit=usd?'USD · $':'원';
 document.getElementById('hAvgLabel').textContent=`평균매수가 (${unit})`;
 document.getElementById('hCurrentLabel').textContent=`현재가 (${unit})`;
 document.getElementById('hValueLabel').textContent=`평가금액 (${unit})`;
 document.getElementById('hFxArea').hidden=!usd;
 document.getElementById('hCurrencyNote').textContent=usd?
   (e.original&&!isUsdHolding(e.original)?'기존 원화 금액을 달러로 자동 변환하지 않습니다. 증권사의 달러 평균매수가·현재가를 입력하세요. 기존 기록은 최초 전환 전 백업으로 보관합니다.':'달러로 입력하세요. 평균매수가는 실제 달러 매수가이며, 원화 환산은 조회한 현재 환율 기준입니다.'):
   '한국 주식·국내 상장 ETF는 KRW를 사용하세요. 미국 주식을 달러로 입력하려면 USD를 선택하세요.';
}
async function loadHoldingFx(force=false){
 const e=holdingEditor;if(!e)return;
 document.getElementById('hFxStatus').textContent='환율 조회 중…';
 try{
   const fx=await fetchUsdFx(force);
   if(holdingEditor!==e||e.mode!=='USD')return;
   if(e.fx?.timestamp>fx.timestamp)throw new Error('기존 환율보다 오래된 응답입니다.');
   e.fx=fx;
   document.getElementById('hFxStatus').textContent=`1 USD = ${fx.rate.toLocaleString('ko-KR',{maximumFractionDigits:4})}원 · 기준 ${quoteTime(fx.timestamp*1000)} (지연 가능)`;
 }catch(error){if(holdingEditor===e)document.getElementById('hFxStatus').textContent='환율 조회 실패. 저장할 때 다시 조회합니다. '+error.message}
 if(holdingEditor===e)updateHoldingPreview();
}
function updateHoldingPreview(){
 const e=holdingEditor;if(!e)return;
 const q=document.getElementById('hQty'),c=document.getElementById('hCurrent'),v=document.getElementById('hValue');
 const computed=q.value!==''&&c.value!=='';
 v.readOnly=computed;
 if(computed){const n=Number(q.value)*Number(c.value);v.value=Number.isFinite(n)?(e.mode==='USD'?n:Math.round(n)):''}
 const preview=document.getElementById('hKrwPreview');
 if(preview)preview.textContent=e.mode==='USD'&&e.fx&&v.value!==''?`원화 환산 ${money(Number(v.value)*e.fx.rate)}`:'환율 조회 후 원화 금액을 표시합니다.';
}
function escapeAttr(s){return String(s??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function closeModal(){holdingEditor=null;modalBg.classList.add('hidden')}
async function saveHolding(originalAccount,index){
 const e=holdingEditor;
 if(!e||e.saving||e.account!==originalAccount||e.index!==index)return;
 const formSignature=()=>['hAccount','hName','hTicker','hCurrency','hQty','hAvg','hCurrent','hValue'].map(id=>document.getElementById(id)?.value).join('\u0000');
 const signature=formSignature();
 const newAccount=document.getElementById('hAccount').value;
 const obj={ticker:document.getElementById('hTicker').value.trim().toUpperCase(),name:document.getElementById('hName').value.trim(),
   qty:toNullableNumber(document.getElementById('hQty').value),avg:toNullableNumber(document.getElementById('hAvg').value),
   current:toNullableNumber(document.getElementById('hCurrent').value),value:toNullableNumber(document.getElementById('hValue').value)};
 if(!obj.name){alert('종목명을 입력해주세요.');return}
 if(!['pension','isa','toss'].includes(newAccount))return;
 if(obj.ticker&&!/^[A-Z0-9^][A-Z0-9.^=\-]{0,24}$/.test(obj.ticker)){alert('시세코드를 확인해주세요.');return}
 if([obj.qty,obj.avg,obj.current,obj.value].some(v=>v!==null&&(!Number.isFinite(v)||v<0||v>Number.MAX_SAFE_INTEGER))){alert('수량과 금액은 0 이상의 유효한 숫자로 입력해주세요.');return}
 if(e.mode==='USD' && obj.qty!==null && obj.current===null){alert('달러 현재가를 입력해주세요.');return}
 if(obj.qty!==null&&obj.current!==null)obj.value=obj.qty*obj.current;
 if(obj.value===null){alert('평가금액을 입력해주세요.');return}
 obj.autoPrice=!!obj.ticker;
 obj.inputCurrency=e.mode;
 e.saving=true;document.getElementById('hSave').disabled=true;
 try{
   let nextHolding=obj;
   if(e.mode==='USD'){
     if(/\.(KS|KQ)$/.test(obj.ticker))throw new Error('국내 시세코드는 KRW로 입력해주세요.');
     const fx=await fetchUsdFx();
     if(e.fx?.timestamp>fx.timestamp)throw new Error('기존 환율보다 오래된 응답입니다.');
     nextHolding=applyUsdRate({...obj,usd:{avg:obj.avg,current:obj.current,value:obj.value}},fx);
   }else obj.value=Math.round(obj.value);
   if(holdingEditor!==e)return;
   if(signature!==formSignature())throw new Error('조회 중 입력 내용이 변경되었습니다. 다시 저장해주세요.');
   const before=index>=0?holdings[originalAccount]?.[index]:null;
   if(index>=0&&(before!==e.original||JSON.stringify(before)!==e.signature))throw new Error('종목 데이터가 변경되었습니다. 닫고 다시 수정해주세요.');
   if(before&&before.ticker===obj.ticker&&before.current===nextHolding.current&&before.value===nextHolding.value&&isUsdHolding(before)===isUsdHolding(nextHolding)){
     if(before.quote)nextHolding.quote=before.quote;
     if(before.quoteError)nextHolding.quoteError=before.quoteError;
   }
   const next={...holdings};
   next[originalAccount]=[...(holdings[originalAccount]||[])];
   if(index>=0)next[originalAccount].splice(index,1);
   if(newAccount!==originalAccount)next[newAccount]=[...(holdings[newAccount]||[])];
   if(index>=0&&newAccount===originalAccount)next[newAccount].splice(index,0,nextHolding);
   else next[newAccount].push(nextHolding);
   const nextData=structuredClone(data),k=latestKey();
   if(k)for(const a of new Set([originalAccount,newAccount]))if(nextData[k]?.[a])nextData[k][a].value=next[a].reduce((sum,h)=>sum+Number(h.value||0),0);
   if(before && isUsdHolding(before)!==isUsdHolding(nextHolding) && !localStorage.getItem(USD_RECOVERY_KEY)){
     const storage=Object.fromEntries(Object.keys(localStorage).filter(k=>k.startsWith('my_asset_')).map(k=>[k,localStorage.getItem(k)]));
     localStorage.setItem(USD_RECOVERY_KEY,JSON.stringify({app:'MY ASSET',version:'1.0',createdAt:new Date().toISOString(),storage}));
   }
   // Persist before mutating in-memory state; rollback both data keys on quota failure.
   const previousHold=localStorage.getItem(HOLD_KEY),previousMonth=localStorage.getItem(MONTH_KEY);
   try{localStorage.setItem(HOLD_KEY,JSON.stringify(next));localStorage.setItem(MONTH_KEY,JSON.stringify(nextData))}
   catch(error){
     if(previousHold===null)localStorage.removeItem(HOLD_KEY);else localStorage.setItem(HOLD_KEY,previousHold);
     if(previousMonth===null)localStorage.removeItem(MONTH_KEY);else localStorage.setItem(MONTH_KEY,previousMonth);
     throw error;
   }
   holdings=next;data=nextData;closeModal();renderAll();renderUsdFxStatus();
 }catch(error){alert('저장하지 못했습니다. 기존 데이터는 유지됩니다.\n'+error.message)}
 finally{e.saving=false;if(holdingEditor===e)document.getElementById('hSave').disabled=false}
}


function toNullableNumber(v){return v===""?null:Number(v)}
function deleteHolding(account,index){
 if(confirm("이 종목을 삭제할까요?")){
   holdings[account].splice(index,1);
   localStorage.setItem(HOLD_KEY,JSON.stringify(holdings));
   syncHoldingAccountToLatestMonth(account);
   renderAll();
 }
}



async function refreshMarketData(manual=false){
  const status=document.getElementById("marketStatus");
  if(status) status.textContent="시장지수를 불러오는 중...";

  try{
    const res=await fetch("/api/market-history",{cache:"no-store"});
    if(!res.ok) throw new Error("서버 응답 오류");

    const payload=await res.json();
    if(!payload?.months) throw new Error("데이터 형식 오류");

    MARKET_DATA={...MARKET_DATA,...payload.months};

    localStorage.setItem(
      MARKET_STORE_KEY,
      JSON.stringify(MARKET_DATA)
    );

    const meta={
      updatedAt:payload.updatedAt||new Date().toISOString(),
      source:payload.source||"시장지수 API"
    };

    localStorage.setItem(
      MARKET_META_KEY,
      JSON.stringify(meta)
    );

    if(status){
      status.textContent=
        `자동 업데이트 완료 · ${new Date(meta.updatedAt).toLocaleString("ko-KR")} · ${meta.source}`;
    }

    renderMarket();
  }catch(err){
    const meta=JSON.parse(localStorage.getItem(MARKET_META_KEY)||"null");

    if(status){
      status.textContent=meta
        ? `자동 업데이트 실패 · 마지막 저장 데이터 ${new Date(meta.updatedAt).toLocaleString("ko-KR")} 사용`
        : "자동 업데이트 실패 · 앱 기본 데이터를 사용합니다.";
    }

    if(manual){
      alert("시장지수 자동 업데이트에 실패했습니다. 기존 저장값을 사용합니다.");
    }
  }
}

function marketReturn(indexKey,k){
 const row=MARKET_DATA[k];
 if(!row) return null;
 const base=MARKET_BASE[indexKey];
 return base ? (Number(row[indexKey])/base)-1 : null;
}

function portfolioSimpleReturn(k){
 const m=data[k];
 if(!m) return null;
 const p=investmentPrincipal(m);
 const v=investmentValue(m);
 return p ? (v-p)/p : null;
}

function fmtPercent(n){
 return n==null?"-":`${n>=0?"+":""}${(n*100).toFixed(2)}%`;
}

function renderMarket(){
 const marketChart = document.getElementById('marketChart');
 const commonKeys=validKeys().filter(k=>MARKET_DATA[k]);
 if(!commonKeys.length){
   marketMine.textContent=marketSP.textContent=marketNDX.textContent=marketKospi.textContent="-";
   marketChart.innerHTML="";
   marketTableBody.innerHTML='<tr><td colspan="5">비교 가능한 데이터가 없습니다.</td></tr>';
   return;
 }

 const latest=commonKeys.at(-1);
 const mine=portfolioSimpleReturn(latest);
 const sp=marketReturn("sp500",latest);
 const ndx=marketReturn("nasdaq100",latest);
 const kospi=marketReturn("kospi",latest);

 const applyMetric=(el,v)=>{
   el.textContent=fmtPercent(v);
   el.className="v "+(v==null||v>=0?"pos":"neg");
 };
 applyMetric(marketMine,mine);
 applyMetric(marketSP,sp);
 applyMetric(marketNDX,ndx);
 applyMetric(marketKospi,kospi);

 const series=[
   {key:"mine",label:"내 투자손익률",color:"#172033",values:commonKeys.map(portfolioSimpleReturn)},
   {key:"sp",label:"S&P500",color:"#1769e0",values:commonKeys.map(k=>marketReturn("sp500",k))},
   {key:"ndx",label:"나스닥100",color:"#8b5cf6",values:commonKeys.map(k=>marketReturn("nasdaq100",k))},
   {key:"kospi",label:"코스피",color:"#12a594",values:commonKeys.map(k=>marketReturn("kospi",k))}
 ];

 const W=420,H=230,L=48,R=10,T=12,B=30,plotW=W-L-R,plotH=H-T-B;
 const all=series.flatMap(s=>s.values.filter(v=>v!=null));
 let minY=Math.min(...all,0), maxY=Math.max(...all,0);
 const pad=Math.max((maxY-minY)*0.12,0.03);
 minY-=pad; maxY+=pad;
 const x=i=>L+(commonKeys.length===1?plotW/2:i*plotW/(commonKeys.length-1));
 const y=v=>T+(maxY-v)/(maxY-minY)*plotH;

 let out="";
 for(let g=0;g<=4;g++){
   const value=maxY-(maxY-minY)*(g/4);
   const yy=T+plotH*g/4;
   out+=`<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="#e8edf3" stroke-width="1"/>`;
   out+=`<text x="${L-5}" y="${yy+3}" text-anchor="end" font-size="9" fill="#8a95a5">${(value*100).toFixed(0)}%</text>`;
 }
 if(minY<0 && maxY>0){
   const zy=y(0);
   out+=`<line x1="${L}" y1="${zy}" x2="${W-R}" y2="${zy}" stroke="#aeb7c2" stroke-width="1.2" stroke-dasharray="3 3"/>`;
 }

 for(const s of series){
   const pts=s.values.map((v,i)=>v==null?null:`${x(i)},${y(v)}`).filter(Boolean).join(" ");
   out+=`<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="${s.key==="mine"?3:2}" stroke-linecap="round" stroke-linejoin="round"/>`;
   s.values.forEach((v,i)=>{
     if(v==null)return;
     out+=`<circle cx="${x(i)}" cy="${y(v)}" r="${s.key==="mine"?3.2:2.5}" fill="${s.color}">
       <title>${s.label} · ${commonKeys[i]} · ${fmtPercent(v)}</title>
     </circle>`;
   });
 }
 commonKeys.forEach((k,i)=>{
   out+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle" font-size="9" fill="#7b8797">${Number(k.slice(5))}월</text>`;
 });
 marketChart.innerHTML=out;

 marketTableBody.innerHTML=commonKeys.slice().reverse().map(k=>{
   const vals=[
     portfolioSimpleReturn(k),
     marketReturn("sp500",k),
     marketReturn("nasdaq100",k),
     marketReturn("kospi",k)
   ];
   return `<tr>
     <td>${Number(k.slice(5))}월</td>
     ${vals.map(v=>`<td class="${v==null?"":v>=0?"pos":"neg"}">${fmtPercent(v)}</td>`).join("")}
   </tr>`;
 }).join("");
}

function monthAfter(k){
 const [y,m]=k.split("-").map(Number);
 const d=new Date(y,m,1);
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}

function labelFromKey(k){
 const [y,m]=k.split("-").map(Number);
 return `${y}년 ${m}월`;
}

function moveHolding(account,index,direction){
 const list=holdings[account],target=index+direction;
 if(!list||![-1,1].includes(direction)||!Number.isInteger(index)||target<0||target>=list.length)return;
 const next={...holdings,[account]:list.slice()};
 [next[account][index],next[account][target]]=[next[account][target],next[account][index]];
 try{localStorage.setItem(HOLD_KEY,JSON.stringify(next));}catch{alert('순서를 저장하지 못했습니다. 다시 시도해주세요.');return;}
 holdings=next;renderInvest();
}
let currentInputKey=null,monthlyBase=null,monthlyDirty=false,monthlyBaseline='';
function monthlyPrevious(k){return Object.keys(data).filter(x=>x<k).sort().at(-1);}
function renderMonthly(force=false){
 if(monthlyDirty&&!force)return;
 const now=new Date(),today=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
 currentInputKey=currentInputKey||today;
 const previousKey=monthlyPrevious(currentInputKey),previous=data[previousKey];
 const saved=data[currentInputKey];
 monthlyBase=structuredClone(previous||{});monthlyBaseline=JSON.stringify(data);monthlyDirty=false;
 updateTitle.textContent=labelFromKey(currentInputKey)+' 기록';updateButton.textContent='이 달 기록 저장';
 const options=[...new Set([...Object.keys(data),today,currentInputKey,monthAfter(latestKey())])].sort().reverse();
 monthlyForm.innerHTML='<label for="recordMonth">기록할 월</label><select id="recordMonth" onchange="selectRecordMonth(this.value)">'+options.map(k=>'<option value="'+k+'" '+(k===currentInputKey?'selected':'')+'>'+labelFromKey(k)+(data[k]?' · 저장됨':' · 새 기록')+'</option>').join('')+'</select><div class="notice">이번 달 입금은 +, 출금은 −로 입력하세요. 누적 납입액은 자동 계산됩니다. 모든 금액은 원화입니다.</div>'+Object.entries(ACCOUNTS).map(([k,a])=>{
 const base=previous?.[k]?.invest??0,invest=saved?.[k]?.invest??base,value=saved?.[k]?.value??previous?.[k]?.value??0;
 return '<div class="card"><b>'+a.name+'</b><div class="muted">'+(previousKey?labelFromKey(previousKey):'이전 기록 없음')+' 누적 납입 '+money(base)+'</div><label for="'+k+'_delta">이번 달 순입금액 (원)</label><input id="'+k+'_delta" type="number" step="any" value="'+(invest-base)+'" oninput="monthlyDeltaChanged(&quot;'+k+'&quot;)"><div id="'+k+'_principal" class="notice">누적 납입액 '+money(invest)+'</div><details><summary>누적 납입액 직접 수정</summary><label for="'+k+'_invest">누적 납입액 (원)</label><input id="'+k+'_invest" type="number" min="0" step="any" value="'+invest+'" oninput="monthlyPrincipalChanged(&quot;'+k+'&quot;)"></details><label for="'+k+'_value">월말 평가금액 / 잔액 (원)</label><input id="'+k+'_value" type="number" min="0" step="any" value="'+value+'" oninput="monthlyDirty=true">'+(k!=='savings'?'<button class="btn gray small" onclick="fillMonthlyHolding(&quot;'+k+'&quot;)">현재 보유종목 합계 가져오기</button>':'')+'</div>';
 }).join('');
 document.getElementById('history').innerHTML=keys().slice().reverse().map(k=>'<div class="row" style="padding:12px 0;border-bottom:1px solid #edf0f4"><b>'+labelFromKey(k)+'</b><span>'+money(total(data[k]))+'</span><button class="btn gray small" onclick="selectRecordMonth(&quot;'+k+'&quot;)">수정</button></div>').join('');
}
function selectRecordMonth(k){
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(k))return;
 if(monthlyDirty&&!confirm('저장하지 않은 입력을 버리고 다른 월을 열까요?')){document.getElementById('recordMonth').value=currentInputKey;return;}
 currentInputKey=k;monthlyDirty=false;saveMsg.innerHTML='';renderMonthly(true);
}
function monthlyDeltaChanged(k){
 monthlyDirty=true;const raw=document.getElementById(k+'_delta').value;
 const n=(monthlyBase[k]?.invest??0)+Number(raw);
 document.getElementById(k+'_invest').value=raw===''?'':n;
 document.getElementById(k+'_principal').textContent='누적 납입액 '+(raw===''?'입력 필요':money(n));
}
function monthlyPrincipalChanged(k){
 monthlyDirty=true;const raw=document.getElementById(k+'_invest').value;
 document.getElementById(k+'_delta').value=raw===''?'':Number(raw)-(monthlyBase[k]?.invest??0);
 document.getElementById(k+'_principal').textContent='누적 납입액 '+(raw===''?'입력 필요':money(Number(raw)));
}
function fillMonthlyHolding(k){
 if(!['pension','isa','toss'].includes(k))return;
 if(!confirm('현재 저장된 보유종목 합계 '+money(holdingValueTotal(k))+'를 '+labelFromKey(currentInputKey)+' 평가금액에 넣을까요? 과거 시세를 조회하는 기능은 아닙니다.'))return;
 document.getElementById(k+'_value').value=holdingValueTotal(k);monthlyDirty=true;
}
function saveNextMonth(){
 if(JSON.stringify(data)!==monthlyBaseline){alert('다른 작업으로 월 기록이 변경되었습니다. 입력을 메모한 후 다시 불러와 주세요.');return;}
 const obj={label:labelFromKey(currentInputKey)};
 for(const k of Object.keys(ACCOUNTS)){
 const a=document.getElementById(k+'_invest').value,b=document.getElementById(k+'_value').value;
 if(a===''||b===''||![Number(a),Number(b)].every(n=>Number.isFinite(n)&&n>=0&&n<=Number.MAX_SAFE_INTEGER)){alert(ACCOUNTS[k].name+'의 누적 납입액과 평가금액을 0 이상의 금액으로 입력해주세요.');return;}
 obj[k]={invest:Number(a),value:Number(b)};
 }
 const next={...data,[currentInputKey]:obj};
 try{localStorage.setItem(MONTH_KEY,JSON.stringify(next));}catch{alert('기록을 저장하지 못했습니다. 입력값은 유지됩니다.');return;}
 data=next;monthlyDirty=false;renderAll();saveMsg.textContent=labelFromKey(currentInputKey)+' 기록을 저장했습니다. 입력한 평가금액을 그대로 반영했습니다.';
}
function clearNextMonthForm(){
 if(monthlyDirty&&!confirm('입력 중인 변경을 취소하고 저장된 값으로 되돌릴까요?'))return;
 monthlyDirty=false;renderMonthly(true);saveMsg.textContent='기록을 다시 불러왔습니다.';
}

function deleteLatestMonth(){
 const all=keys();
 const last=all.at(-1);
 if(!last || last==="2026-08"){
   alert("삭제할 추가 월 기록이 없습니다.");
   return;
 }
 if(confirm(`${labelFromKey(last)} 기록을 삭제할까요?`)){
   delete data[last];
   localStorage.setItem(MONTH_KEY,JSON.stringify(data));
   saveMsg.innerHTML='<div class="notice" style="margin-top:12px">최근 월 기록을 삭제했습니다.</div>';
   renderAll();
 }
}

function renderAll(){renderHome();renderAssets();renderInvest();renderMarket();renderMonthly()}
function exportMyAssetBackup(){

  try{

    const storage = {};

    /*
    MY ASSET 관련 localStorage만 백업
    */

    for(
      let i=0;
      i<localStorage.length;
      i++
    ){

      const key=
        localStorage.key(i);

      if(
        key &&
        key.startsWith(
          "my_asset_"
        )
      ){

        storage[key]=
          localStorage.getItem(
            key
          );

      }

    }


    const backup={

      app:
        "MY ASSET",

      version:
        "1.0",

      createdAt:
        new Date()
          .toISOString(),

      storage

    };


    const json=
      JSON.stringify(
        backup,
        null,
        2
      );


    const blob=
      new Blob(
        [json],
        {
          type:
            "application/json"
        }
      );


    const url=
      URL.createObjectURL(
        blob
      );


    const a=
      document.createElement(
        "a"
      );


    const now=
      new Date();


    const dateText=
      now.getFullYear()+
      "-"+
      String(
        now.getMonth()+1
      ).padStart(2,"0")+
      "-"+
      String(
        now.getDate()
      ).padStart(2,"0");


    a.href=url;

    a.download=
      "MY_ASSET_BACKUP_"+
      dateText+
      ".json";


    document.body
      .appendChild(a);


    a.click();


    a.remove();


    URL.revokeObjectURL(
      url
    );


    const msg=
      document.getElementById(
        "backupMessage"
      );


    if(msg){

      msg.textContent=
        "백업파일을 생성했습니다. 안전한 곳에 보관해주세요.";

    }

  }

  catch(error){

    console.error(
      "backup error:",
      error
    );


    alert(
      "백업파일 생성에 실패했습니다."
    );

  }

}
function importMyAssetBackup(event){
  if(window.MyAssetSync) void window.MyAssetSync.restore(event);
  else alert('앱 준비가 끝난 후 다시 시도해주세요.');
}
renderAll();
renderGoal();
refreshMarketData(false);

// The original app keeps its global functions for existing inline buttons.
// Only the synchronization adapter changes the three application state objects.
for (const [key, value] of [[MONTH_KEY,data],[HOLD_KEY,holdings],[GOAL_KEY,goal]]) {
  if(localStorage.getItem(key)===null) localStorage.setItem(key,JSON.stringify(value));
}
window.myAssetBridge = {
  apply(storage) {
    const keys=[MONTH_KEY,HOLD_KEY,GOAL_KEY];
    const values=keys.map(k=>JSON.parse(storage[k]));
    const before=keys.map(k=>localStorage.getItem(k));
    try { keys.forEach(k=>localStorage.setItem(k,storage[k])); }
    catch(error) {
      keys.forEach((k,i)=>{ if(before[i]===null) localStorage.removeItem(k); else localStorage.setItem(k,before[i]); });
      throw error;
    }
    [data,holdings,goal]=values;
    closeModal(); renderAll(); renderGoal();
  }
};

// Revalue stored USD amounts on open or return to the app; recorded monthly totals stay unchanged.
function hasUsdHoldings(){return ['pension','isa','toss'].some(a=>(holdings[a]||[]).some(isUsdHolding))}
if(hasUsdHoldings())void refreshUsdValuations();
document.addEventListener('visibilitychange',()=>{
 if(!document.hidden&&!holdingEditor&&hasUsdHoldings()&&(!latestUsdFx||Date.now()-latestUsdFx.receivedAt>60000))void refreshUsdValuations();
});



