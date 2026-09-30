const positive = n => typeof n === 'number' && Number.isFinite(n) && n > 0;
export function normalizeQuote(symbol, json, now = Date.now()) {
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error('제공처에서 종목을 찾지 못했습니다.');
  const meta = result.meta || {};
  let price = null, timestamp = null;
  const closes = result.indicators?.quote?.[0]?.close || [];
  for (let i = closes.length - 1; i >= 0; i--) {
    const time = result.timestamp?.[i];
    if (positive(closes[i]) && positive(time) && time <= now / 1000 + 300) {
      price = closes[i]; timestamp = time; break;
    }
  }
  // Metadata may be newer than the last complete minute bar, including at market close.
  if (positive(meta.regularMarketPrice) && positive(meta.regularMarketTime) &&
      meta.regularMarketTime <= now / 1000 + 300 && (!timestamp || meta.regularMarketTime >= timestamp)) {
    price = meta.regularMarketPrice; timestamp = meta.regularMarketTime;
  }
  if (!positive(price) || !positive(timestamp)) throw new Error('유효한 가격 또는 시세 시각이 없습니다.');
  return { symbol, providerSymbol: meta.symbol || symbol, price, timestamp,
    previousClose: positive(meta.chartPreviousClose) ? meta.chartPreviousClose : null,
    currency: meta.currency || null, exchange: meta.exchangeName || null,
    marketState: meta.marketState || null, source: 'Yahoo Finance',
    fetchedAt: new Date(now).toISOString() };
}

export function createQuoteService({ fetchImpl = fetch, now = Date.now } = {}) {
  const cache = new Map(), pending = new Map();
  let active = 0;
  const queue = [];
  return async function quote(rawSymbol) {
    const symbol = String(rawSymbol).trim().toUpperCase();
    if (!/^[A-Z0-9^][A-Z0-9.^=\-]{0,24}$/.test(symbol)) throw new Error('시세코드 형식을 확인해주세요.');
    const hit = cache.get(symbol);
    if (hit && now() - hit.at < 60000) return hit.data;
    if (pending.has(symbol)) return pending.get(symbol);
    if (pending.size >= 200) throw new Error('조회 요청이 많습니다. 잠시 후 다시 시도해주세요.');
    const task = (async () => {
      if (active >= 6) await new Promise(resolve => queue.push(resolve));
      else active++;
      try {
        const response = await fetchImpl('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(symbol) + '?range=5d&interval=1m', {
          headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' }, signal: AbortSignal.timeout(12000)
        });
        if (!response.ok) throw new Error(response.status === 429 ? '시세 제공처 요청 제한입니다. 잠시 후 다시 시도해주세요.' : '시세 제공처 응답 오류 (' + response.status + ')');
        const data = normalizeQuote(symbol, await response.json(), now());
        if (cache.size >= 300) cache.delete(cache.keys().next().value);
        cache.set(symbol, { at: now(), data });
        return data;
      } finally {
        const next = queue.shift();
        if (next) next(); else active--;
      }
    })();
    pending.set(symbol, task);
    try { return await task; } finally { pending.delete(symbol); }
  };
}
