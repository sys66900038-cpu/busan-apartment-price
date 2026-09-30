// Shared by the browser and server. Authentication and caches are never included.
export const SYNC_KEYS = ['my_asset_v4_monthly', 'my_asset_v4_holdings', 'my_asset_v13_goal'];
export const MAX_BYTES = 1000000;
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
export function validateSnapshot(storage) {
  if (!object(storage) || Object.keys(storage).length !== SYNC_KEYS.length ||
      !SYNC_KEYS.every(k => typeof storage[k] === 'string')) throw new Error('자산 데이터 형식이 올바르지 않습니다.');
  if (new TextEncoder().encode(JSON.stringify(storage)).length > MAX_BYTES) throw new Error('동기화 데이터는 1MB 이하여야 합니다.');
  const [monthly, holdings, goal] = SYNC_KEYS.map(k => JSON.parse(storage[k]));
  if (!object(monthly) || !Object.keys(monthly).length || !Object.entries(monthly).every(([k, v]) =>
      /^\d{4}-(0[1-9]|1[0-2])$/.test(k) && object(v) &&
      ['pension', 'isa', 'toss', 'savings'].every(a => object(v[a]) &&
        Number.isFinite(v[a].invest) && Number.isFinite(v[a].value)))) throw new Error('월별 자산 데이터가 올바르지 않습니다.');
  if (!object(holdings) || !['pension', 'isa', 'toss'].every(a => Array.isArray(holdings[a]) &&
      holdings[a].every(h => object(h) && typeof h.name === 'string' &&
        ['qty', 'avg', 'current', 'value'].every(k => h[k] == null || Number.isFinite(h[k]))))) throw new Error('보유종목 데이터가 올바르지 않습니다.');
  if (!object(goal) || !['year', 'amount', 'monthlyContribution'].every(k => Number.isFinite(goal[k]))) throw new Error('목표 데이터가 올바르지 않습니다.');
  return storage;
}
function canonical(x) {
  if (Array.isArray(x)) return x.map(canonical);
  if (object(x)) return Object.fromEntries(Object.keys(x).sort().map(k => [k, canonical(x[k])]));
  return x;
}
export function same(a, b) {
  return !!a && !!b && SYNC_KEYS.every(k => JSON.stringify(canonical(JSON.parse(a[k]))) === JSON.stringify(canonical(JSON.parse(b[k]))));
}
// No clock comparisons: a database revision is the only concurrency authority.
export function decide(local, base, remote, revision) {
  if (!base) return 'choose';
  if (!remote) return 'choose';
  if (same(local, remote.storage)) return 'equal';
  if (remote.revision !== revision) return same(local, base) ? 'pull' : 'conflict';
  return same(local, base) ? 'idle' : 'push';
}
