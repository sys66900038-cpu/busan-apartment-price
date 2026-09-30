import { validateSnapshot } from './sync-core.js';

export function installSyncRoutes(app, { env = process.env, fetchImpl = fetch } = {}) {
  const url = (env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = env.SUPABASE_PUBLISHABLE_KEY || '';
  const enabled = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) && !!key && !key.startsWith('sb_secret_');
  const request = async (route, { token, method = 'GET', body } = {}) => {
    const r = await fetchImpl(url + route, { method, headers: {
      apikey: key, ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json'
    }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(15000) });
    const result = await r.json().catch(() => null);
    if (!r.ok) {
      const e = new Error(r.status === 401 || r.status === 403 ? '로그인이 만료되었습니다. 다시 로그인해주세요.' :
        r.status === 429 ? '요청이 많습니다. 잠시 후 다시 시도해주세요.' : 'Supabase 요청에 실패했습니다. 프로젝트 설정을 확인해주세요.');
      e.status = [400, 401, 403, 429].includes(r.status) ? r.status : 502;
      throw e;
    }
    return result;
  };
  app.get('/api/sync/config', (req, res) => res.set('Cache-Control', 'no-store').json({ enabled }));
  const wrap = fn => async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (!enabled) return res.status(503).json({ error: 'Supabase 환경변수를 설정해주세요. 기기 저장은 계속 사용할 수 있습니다.' });
    try { await fn(req, res); }
    catch (e) { res.status(e.status || 502).json({ error: e.status ? e.message : '서버 연결에 실패했습니다. 기기 데이터는 유지됩니다.' }); }
  };
  // Supabase also applies its own authentication rate limits.
  const attempts = new Map();
  const limitLogin = (req, res, next) => {
    const now = Date.now();
    for (const [id, v] of attempts) if (v.until <= now) attempts.delete(id);
    const ip = req.ip;
    const count = attempts.get(ip) || { until: now + 60000, count: 0 };
    count.count++; attempts.set(ip, count);
    if (count.count > 15) return res.status(429).json({ error: '잠시 후 다시 로그인해주세요.' });
    next();
  };
  app.post('/api/sync/login', limitLogin, wrap(async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || email.length > 320 || typeof password !== 'string' || !password || password.length > 1024)
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    try { res.json(await request('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } })); }
    catch (e) { if (e.status === 400) e.message = '이메일·비밀번호 또는 계정의 이메일 인증 상태를 확인해주세요.'; throw e; }
  }));
  app.post('/api/sync/refresh', wrap(async (req, res) => {
    if (typeof req.body?.refresh_token !== 'string' || req.body.refresh_token.length > 4096)
      return res.status(400).json({ error: '다시 로그인해주세요.' });
    res.json(await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: req.body.refresh_token } }));
  }));
  async function authenticate(req) {
    const header = req.get('Authorization') || '';
    if (!/^Bearer [^\s]+$/.test(header) || header.length > 8192) {
      const e = new Error('로그인이 필요합니다.'); e.status = 401; throw e;
    }
    const token = header.slice(7);
    const user = await request('/auth/v1/user', { token });
    if (!user?.id) { const e = new Error('로그인이 필요합니다.'); e.status = 401; throw e; }
    return { token, user };
  }
  app.get('/api/sync', wrap(async (req, res) => {
    const { token, user } = await authenticate(req);
    const rows = await request('/rest/v1/my_asset_sync?select=storage,revision,updated_at&user_id=eq.' + encodeURIComponent(user.id), { token });
    res.json({ user: { id: user.id, email: user.email }, snapshot: rows[0] || null });
  }));
  app.put('/api/sync', wrap(async (req, res) => {
    const { token } = await authenticate(req);
    try {
      validateSnapshot(req.body?.storage);
      if (!Number.isSafeInteger(req.body.revision) || req.body.revision < 0) throw new Error('저장 버전이 올바르지 않습니다.');
    } catch (e) { return res.status(400).json({ error: e.message }); }
    const result = await request('/rest/v1/rpc/save_my_asset', { token, method: 'POST', body: {
      p_expected_revision: req.body.revision, p_storage: req.body.storage
    } });
    if (result.conflict) return res.status(409).json({ error: '다른 기기에서 변경되었습니다. 사용할 데이터를 선택해주세요.' });
    res.json(result);
  }));
  app.post('/api/sync/logout', wrap(async (req, res) => {
    const { token } = await authenticate(req);
    await request('/auth/v1/logout?scope=local', { token, method: 'POST' });
    res.json({ ok: true });
  }));
}
