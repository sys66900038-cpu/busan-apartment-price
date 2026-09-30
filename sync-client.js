import { SYNC_KEYS, validateSnapshot, same, decide } from '/sync-core.js';

const META = 'ma-sync-meta-v1', SESSION = 'ma-sync-session-v1', RECOVERY = 'ma-sync-recovery-v1';
const panel = document.createElement('section');
panel.id = 'sync-panel';
panel.style.cssText = 'margin:12px 16px;padding:14px;border:1px solid #d9e3f0;border-radius:14px;background:white;font-size:13px';
panel.innerHTML = `<details><summary style="cursor:pointer;font-weight:700">PC·휴대폰 동기화</summary>
  <p id="sync-status" role="status" aria-live="polite">설정 확인 중…</p>
  <form id="sync-login" style="display:grid;gap:8px">
    <label>이메일 <input name="email" type="email" autocomplete="username" required style="width:100%"></label>
    <label>비밀번호 <input name="password" type="password" autocomplete="current-password" required style="width:100%"></label>
    <button class="btn" type="submit">로그인</button>
  </form>
  <div id="sync-signed" hidden><p id="sync-email"></p>
    <button id="sync-now" class="btn gray small">지금 동기화</button>
    <button id="sync-logout" class="btn gray small">로그아웃</button>
  </div>
  <div id="sync-choice" hidden style="margin-top:12px;padding:10px;background:#fff8db;border-radius:8px">
    <p id="sync-choice-text"></p>
    <button id="sync-cloud" class="btn gray small">서버 데이터 사용</button>
    <button id="sync-local" class="btn gray small">이 기기 데이터 사용</button>
    <p>선택 전 양쪽 데이터를 기기에 보관합니다. 아래 버튼으로 내려받을 수 있습니다.</p>
  </div>
  <button id="sync-recovery" class="btn gray small" style="margin-top:10px">보관된 데이터 내려받기</button>
  <p style="color:#68788d">기기 저장과 기존 JSON 백업은 계속 사용할 수 있습니다. 로그인은 이 탭을 닫을 때까지 유지됩니다.</p>
</details>`;
document.querySelector('.header').after(panel);
const $ = id => document.getElementById(id);
const status = message => { $('sync-status').textContent = message; };
function readJSON(store, key, fallback) {
  const value = store.getItem(key);
  return value ? JSON.parse(value) : fallback;
}
let meta;
try { meta = readJSON(localStorage, META, {}); }
catch { throw new Error('동기화 기록이 손상되었습니다. 기존 데이터를 백업한 뒤 복구가 필요합니다.'); }
let session = readJSON(sessionStorage, SESSION, null);
let busy = false, enabled = false, choice = null, editing = false, lastAttempt = 0;
const saveMeta = () => localStorage.setItem(META, JSON.stringify(meta));
const snapshot = () => validateSnapshot(Object.fromEntries(SYNC_KEYS.map(k => [k, localStorage.getItem(k)])));
function allStorage() {
  return Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('my_asset_')).map(k => [k, localStorage.getItem(k)]));
}
function remember(reason, storage, remote = null) {
  const records = readJSON(localStorage, RECOVERY, []);
  records.unshift({ app: 'MY ASSET', version: '1.0', createdAt: new Date().toISOString(), reason, storage, remote });
  // Failure (including quota) aborts replacement; do not silently discard the safety copy.
  localStorage.setItem(RECOVERY, JSON.stringify(records.slice(0, 3)));
}
function download(value, name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function showAuth() {
  $('sync-login').hidden = !!session;
  $('sync-login').style.display = session ? 'none' : 'grid';
  $('sync-signed').hidden = !session;
  $('sync-email').textContent = session?.user?.email || '';
}
function showChoice(remote, message) {
  choice = { remote };
  $('sync-choice').hidden = false;
  $('sync-cloud').hidden = !remote;
  $('sync-choice-text').textContent = message;
  panel.querySelector('details').open = true;
  status('자동 동기화를 멈췄습니다. 사용할 데이터를 선택해주세요.');
}
function clearChoice() { choice = null; $('sync-choice').hidden = true; }
async function raw(path, method = 'GET', body, token) {
  const r = await fetch(path, { method, cache: 'no-store', headers: {
    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(25000) });
  const value = await r.json().catch(() => ({ error: '서버 응답을 읽지 못했습니다.' }));
  if (!r.ok) { const e = new Error(value.error || '연결에 실패했습니다.'); e.status = r.status; throw e; }
  return value;
}
function storeSession(value) {
  session = { access_token: value.access_token, refresh_token: value.refresh_token,
    expires_at: value.expires_at || Math.floor(Date.now() / 1000) + value.expires_in, user: value.user };
  sessionStorage.setItem(SESSION, JSON.stringify(session));
  showAuth();
}
async function api(path, method = 'GET', body) {
  if (!session) throw new Error('로그인이 필요합니다.');
  if (session.expires_at * 1000 < Date.now() + 60000) {
    try { storeSession(await raw('/api/sync/refresh', 'POST', { refresh_token: session.refresh_token })); }
    catch (e) { if ([400, 401, 403].includes(e.status)) { session = null; sessionStorage.removeItem(SESSION); showAuth(); } throw e; }
  }
  return raw(path, method, body, session.access_token);
}
function bind(user) {
  if (meta.userId && meta.userId !== user.id) throw new Error('이 기기의 자산은 다른 계정에 연결되어 있습니다. 원래 계정으로 로그인해주세요.');
  if (!meta.userId) { meta = { userId: user.id, revision: 0, base: null, paused: true }; saveMeta(); }
}
function checkRemote(remote) {
  if (remote) {
    validateSnapshot(remote.storage);
    if (!Number.isSafeInteger(remote.revision) || remote.revision < 1) throw new Error('서버 저장 버전이 올바르지 않습니다.');
  }
  return remote;
}
async function getRemote() {
  const value = await api('/api/sync');
  bind(value.user);
  return checkRemote(value.snapshot);
}
function acceptBase(remote) {
  meta = { userId: meta.userId, revision: remote.revision, base: remote.storage, paused: false };
  saveMeta();
  clearChoice();
}
function applyRemote(remote) {
  remember('서버 데이터 적용 전', allStorage(), remote);
  // Commit application data before the baseline. A failed metadata write yields a safe conflict.
  window.myAssetBridge.apply(remote.storage);
  acceptBase(remote);
  editing = false;
  status('서버 데이터를 불러왔습니다.');
}
async function push(storage, revision) {
  const saved = checkRemote(await api('/api/sync', 'PUT', { storage, revision }));
  // Never replace local data here: the user may have edited while the request was in flight.
  acceptBase(saved);
  status(same(snapshot(), saved.storage) ? '동기화 완료 · ' + new Date().toLocaleTimeString('ko-KR') : '추가 변경사항을 저장 중입니다.');
}
function unsafeToRender() {
  return editing || !!document.activeElement?.matches('input, textarea, select') ||
    !document.getElementById('modalBg').classList.contains('hidden');
}
async function reconcile() {
  if (!enabled || !session || choice) return;
  const remote = await getRemote();
  const local = snapshot();
  const action = meta.paused ? 'choose' : decide(local, meta.base, remote, meta.revision);
  if (action === 'equal') { acceptBase(remote); status('동기화 완료'); }
  else if (action === 'push') await push(local, meta.revision);
  else if (action === 'pull' && !unsafeToRender()) applyRemote(remote);
  else if (action === 'idle') status('동기화 완료');
  else showChoice(remote, !remote ? '서버에 아직 데이터가 없습니다. 원본 데이터가 있는 기기에서 최초 업로드해주세요.' :
    action === 'pull' ? '다른 기기의 변경이 있습니다. 화면에 입력 중인 내용이 있어 적용을 기다립니다.' :
    '기기와 서버의 데이터가 다르거나 첫 연결입니다. 사용할 쪽을 선택해주세요.');
}
async function run(work = reconcile) {
  if (busy) return;
  busy = true; lastAttempt = Date.now();
  panel.querySelectorAll('button').forEach(b => b.disabled = true);
  try { await work(); }
  catch (e) {
    if (e.status === 409) {
      try { showChoice(await getRemote(), '다른 기기에서 먼저 저장했습니다. 사용할 데이터를 다시 선택해주세요.'); }
      catch { status('충돌 확인 중 연결이 끊겼습니다. 기기 데이터는 유지됩니다. 다시 동기화해주세요.'); }
    } else {
      if ([401, 403].includes(e.status)) { session = null; sessionStorage.removeItem(SESSION); showAuth(); clearChoice(); }
      status(e.name === 'TimeoutError' || e.name === 'TypeError' ? '연결 대기 중입니다. 기기 데이터는 유지됩니다.' : e.message);
    }
  } finally {
    busy = false;
    panel.querySelectorAll('button').forEach(b => b.disabled = false);
    $('sync-login').querySelector('button').disabled = !enabled;
  }
}
$('sync-login').addEventListener('submit', e => {
  e.preventDefault();
  void run(async () => {
    const form = e.target;
    const password = form.elements.password.value;
    form.elements.password.value = '';
    storeSession(await raw('/api/sync/login', 'POST', { email: form.elements.email.value.trim(), password }));
    clearChoice();
    await reconcile();
  });
});
$('sync-now').onclick = () => { clearChoice(); void run(); };
$('sync-logout').onclick = () => void run(async () => {
  try { await api('/api/sync/logout', 'POST'); } catch { /* Local sign-out must work offline. */ }
  session = null; sessionStorage.removeItem(SESSION); clearChoice(); showAuth();
  status('로그아웃했습니다. 이 기기의 자산과 미전송 변경사항은 보관됩니다.');
});
async function choose(useCloud) {
  const shown = choice;
  if (!shown) return;
  if (!confirm(useCloud ? '서버 데이터로 이 기기의 자산과 입력 중인 내용을 바꿀까요? 변경 전 데이터는 별도로 보관됩니다.' :
    '이 기기의 자산 전체를 서버에 저장할까요? 서버의 기존 데이터도 별도로 보관됩니다.')) return;
  const latest = await getRemote();
  if ((latest?.revision || 0) !== (shown.remote?.revision || 0)) {
    showChoice(latest, '선택하는 동안 서버 데이터가 다시 변경되었습니다. 다시 선택해주세요.'); return;
  }
  if (useCloud) {
    if (!latest) throw new Error('서버에 데이터가 없습니다.');
    applyRemote(latest);
  } else {
    remember('기기 데이터 업로드 전', allStorage(), latest);
    await push(snapshot(), latest?.revision || 0);
  }
}
$('sync-cloud').onclick = () => void run(() => choose(true));
$('sync-local').onclick = () => void run(() => choose(false));
$('sync-recovery').onclick = () => {
  try {
    const records = readJSON(localStorage, RECOVERY, []);
    if (!records.length) { alert('아직 보관된 데이터가 없습니다. 현재 데이터는 기존 백업 버튼으로 저장할 수 있습니다.'); return; }
    const index = Number(prompt(records.map((x, i) => `${i + 1}: ${x.createdAt} ${x.reason}`).join('\n') + '\n내려받을 번호를 입력하세요.', '1')) - 1;
    if (!Number.isInteger(index) || !records[index]) return;
    const record = records[index];
    const cloud = record.remote && confirm('확인: 당시 서버 데이터 다운로드\n취소: 당시 기기 데이터 다운로드');
    download({ app: 'MY ASSET', version: '1.0', createdAt: record.createdAt, storage: cloud ? record.remote.storage : record.storage }, 'MY-ASSET-recovery.json');
  } catch (e) { alert(e.message); }
};
// Old-format JSON backups remain compatible. Pause cloud writes after a restore.
window.MyAssetSync = {
  async restore(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (busy) { alert('동기화가 끝난 후 다시 복원해주세요.'); event.target.value = ''; return; }
    await run(async () => {
      try {
        if (file.size > 2000000) throw new Error('백업파일이 너무 큽니다.');
        const backup = JSON.parse(await file.text());
        if (backup?.app !== 'MY ASSET' || !backup.storage) throw new Error('MY ASSET 백업파일이 아닙니다.');
        if (!SYNC_KEYS.some(k => typeof backup.storage[k] === 'string')) throw new Error('백업에 자산 데이터가 없습니다.');
        // Earlier backups may omit the default goal/monthly keys; retain the current values for those keys.
        const restored = Object.fromEntries(SYNC_KEYS.map(k => [k, backup.storage[k] ?? localStorage.getItem(k)]));
        validateSnapshot(restored);
        if (!confirm('백업파일로 자산을 복원할까요? 현재 기기 데이터는 별도로 보관되며, 서버 반영은 직접 선택할 때까지 멈춥니다.')) return;
        remember('JSON 복원 전', allStorage());
        meta.paused = true; saveMeta();
        window.myAssetBridge.apply(restored);
        // Market caches are optional and are not sent to the cloud.
        for (const k of ['my_asset_v11_market', 'my_asset_v11_market_meta']) {
          if (typeof backup.storage[k] === 'string') {
            try { JSON.parse(backup.storage[k]); localStorage.setItem(k, backup.storage[k]); } catch { /* Ignore malformed cache only. */ }
          }
        }
        location.reload();
      } finally { event.target.value = ''; }
    });
  }
};
document.addEventListener('input', e => { if (!panel.contains(e.target)) editing = true; });
showAuth();
try {
  enabled = (await raw('/api/sync/config')).enabled;
  status(enabled ? '로그인하면 PC·휴대폰 동기화를 연결할 수 있습니다.' : 'Supabase 설정 전입니다. 기기 저장·백업은 정상 사용 가능합니다.');
  $('sync-login').querySelector('button').disabled = !enabled;
  if (enabled && session) await run();
} catch { status('서버에 연결할 수 없습니다. 기기 저장·백업은 계속 사용할 수 있습니다.'); }
let previous = snapshot();
setInterval(() => {
  const current = snapshot();
  const changed = !same(current, previous);
  previous = current;
  if (!busy && session && enabled && !choice && (changed || Date.now() - lastAttempt > 15000)) void run();
}, 2000);
window.addEventListener('online', () => void run());
document.addEventListener('visibilitychange', () => { if (!document.hidden) void run(); });
