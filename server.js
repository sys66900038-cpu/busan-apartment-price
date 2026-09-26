const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(__dirname));

const SYMBOLS = {
  sp500: "^GSPC",
  nasdaq100: "^NDX",
  kospi: "^KS11"
};

let marketCache = {
  expiresAt: 0,
  payload: null
};

function monthKeyFromUnix(ts) {
  const d = new Date(ts * 1000);

  return (
    d.getUTCFullYear() +
    "-" +
    String(d.getUTCMonth() + 1).padStart(2, "0")
  );
}

async function fetchYahooDaily(symbol) {

  const now = Math.floor(Date.now() / 1000);

  // 2025년 12월부터 데이터 요청
  const start = Math.floor(
    Date.UTC(2025, 11, 1) / 1000
  );

  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/" +
    encodeURIComponent(symbol) +
    "?period1=" + start +
    "&period2=" + now +
    "&interval=1d" +
    "&events=history" +
    "&includeAdjustedClose=true";

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Yahoo request failed: ${symbol} ${response.status}`
    );
  }

  const json = await response.json();

  const result =
    json?.chart?.result?.[0];

  if (!result) {
    throw new Error(
      `시장 데이터를 찾을 수 없습니다: ${symbol}`
    );
  }

  const timestamps =
    result.timestamp || [];

  const closes =
    result.indicators?.quote?.[0]?.close || [];

  const monthly = {};

  for (let i = 0; i < timestamps.length; i++) {

    const close = closes[i];

    if (
      close == null ||
      !Number.isFinite(Number(close))
    ) {
      continue;
    }

    const key =
      monthKeyFromUnix(timestamps[i]);

    /*
      같은 달 데이터가 계속 덮어써지므로
      최종적으로 해당 월의 마지막 거래일 종가가 남음
    */
    monthly[key] = Number(close);
  }

  return monthly;
}


/*
================================
시장지수 API
================================
*/

app.get(
  "/api/market-history",
  async (req, res) => {

    try {

      /*
      6시간 캐시
      */

      if (
        marketCache.payload &&
        Date.now() < marketCache.expiresAt
      ) {

        return res.json(
          marketCache.payload
        );
      }


      /*
      S&P500
      Nasdaq100
      KOSPI
      동시에 요청
      */

      const [
        sp500,
        nasdaq100,
        kospi
      ] = await Promise.all([

        fetchYahooDaily(
          SYMBOLS.sp500
        ),

        fetchYahooDaily(
          SYMBOLS.nasdaq100
        ),

        fetchYahooDaily(
          SYMBOLS.kospi
        )

      ]);


      /*
      월 목록 만들기
      */

      const allKeys = [
        ...new Set([
          ...Object.keys(sp500),
          ...Object.keys(nasdaq100),
          ...Object.keys(kospi)
        ])
      ].sort();


      const months = {};


      for (const key of allKeys) {

        if (
          !key.startsWith("2026-")
        ) {
          continue;
        }

        months[key] = {

          sp500:
            sp500[key] ?? null,

          nasdaq100:
            nasdaq100[key] ?? null,

          kospi:
            kospi[key] ?? null

        };

      }


      const payload = {

        source:
          "Yahoo Finance chart data",

        updatedAt:
          new Date().toISOString(),

        months

      };


      /*
      캐시 저장
      */

      marketCache = {

        expiresAt:
          Date.now() +
          6 * 60 * 60 * 1000,

        payload

      };


      res.json(payload);

    }

    catch (error) {

      console.error(
        "market-history error:",
        error
      );

      res.status(502).json({

        error:
          "시장지수 데이터를 불러오지 못했습니다."

      });

    }

  }
);


/*
================================
메인 페이지
================================
*/

app.get("*", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "index.html"
    )
  );

});


app.listen(PORT, () => {

  console.log(
    `MY ASSET server running on port ${PORT}`
  );

});
