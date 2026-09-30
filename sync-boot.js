// Keep only one editor per origin: old tabs must never overwrite newer local data.
const app = document.querySelector('.app');
app.inert = true;
const note = document.createElement('div');
note.style.cssText = 'padding:18px;background:#fff8db;text-align:center;font:14px sans-serif';
note.textContent = '앱을 여는 중입니다…';
document.body.prepend(note);
async function start() {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/app.js'; script.onload = resolve; script.onerror = reject;
    document.body.append(script);
  });
  await import('/sync-client.js');
  app.inert = false;
  note.remove();
}
if (!navigator.locks) {
  note.textContent = '안전한 저장을 위해 HTTPS 주소와 최신 브라우저로 접속해주세요.';
} else {
  navigator.locks.request('my-asset-single-editor-v1', { ifAvailable: true }, async lock => {
    if (!lock) {
      note.textContent = '다른 탭에서 MY ASSET을 사용 중입니다. 그 탭을 닫은 뒤 이 페이지를 새로고침해주세요.';
      return;
    }
    try {
      await start();
      await new Promise(() => {}); // Released by the browser when this tab closes.
    } catch (e) {
      note.textContent = '앱을 열지 못했습니다. 새로고침해주세요. 기존 기기 데이터는 보관되어 있습니다.';
      console.error(e);
    }
  });
}
