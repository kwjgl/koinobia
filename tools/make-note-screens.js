// "소식" 탭 개발 노트에 붙는 사진(screens/notes/ 폴더)을 다시 찍는 도구예요.
// 앱 화면이 바뀌었을 때 저장소 맨 위에서 실행하세요(Playwright가 있는 곳에서).
//   node tools/make-note-screens.js
// 코이데·디다코 데모 화면에서 글과 맞는 장면을 찾아 찍어요. 어떤 사진이 어느 글에 붙는지는 news.js의 images를 보세요.
// 다른 주소에서 찍으려면 주소를 넘겨요(코이데 app/ 주소, 디다코 맨 위 주소 순서):
//   node tools/make-note-screens.js http://localhost:8101/app/ http://localhost:8102/
const { chromium } = require('playwright');
const OUT = require('path').join(__dirname, '..', 'screens', 'notes') + '/';
const K = process.argv[2] || 'https://koide.koinobia.com/app/', D = process.argv[3] || 'https://didako.koinobia.com/';
const AS_P = '%EB%B0%95%EB%AF%BC%EC%9E%AC', AS_N = '%EC%83%88%EC%82%AC%EB%9E%8C';
const HIDE = '.demo,.demo-tag{display:none!important}';
let b;
async function page(url, wait = 4000) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(url); await p.waitForTimeout(wait); await p.addStyleTag({ content: HIDE }); return p;
}
const shot = (p, name, opt = {}) => p.screenshot({ path: OUT + name + '.jpg', type: 'jpeg', quality: 82, ...opt }).then(() => console.log('찍음', name));
// 글자가 있는 곳을 화면 위에서 off 만큼 아래로 오게 스크롤
async function scrollTo(p, text, off) {
  const ok = await p.evaluate(([t, o]) => {
    const el = [...document.querySelectorAll('body *')].find(e => e.offsetParent && e.children.length === 0 && e.textContent.includes(t));
    if (!el) return false;
    let s = el.parentElement; while (s && s !== document.body && !(/auto|scroll/.test(getComputedStyle(s).overflowY) && s.scrollHeight > s.clientHeight)) s = s.parentElement;
    const top = el.getBoundingClientRect().top;
    if (s && s !== document.body) s.scrollTop += top - o; else window.scrollBy(0, top - o);
    return true;
  }, [text, off]);
  if (!ok) console.log('못 찾음', text);
  await p.waitForTimeout(700);
}
// 글자가 든 카드(높이 minH 넘는 첫 조상)만 잘라 찍기
async function card(p, text, name, minH = 120) {
  await scrollTo(p, text, 200);
  const box = await p.evaluate(([t, h]) => {
    let el = [...document.querySelectorAll('body *')].find(e => e.offsetParent && e.children.length === 0 && e.textContent.includes(t));
    while (el && el.getBoundingClientRect().height < h) el = el.parentElement;
    const r = el.getBoundingClientRect(); return { x: Math.max(0, r.x - 6), y: Math.max(0, r.y - 6), width: Math.min(390, r.width + 12), height: r.height + 12 };
  }, [text, minH]);
  await shot(p, name, { clip: box });
}
(async () => {
  b = await chromium.launch();
  let p;
  // 코이데 공동체(박민재)
  p = await page(K + 'index.html?demo&as=' + AS_P + '&at=home');
  await scrollTo(p, '사랑방 가족들이 함께', 260); await shot(p, 'koide-together-sentence');
  await card(p, '그림 · ', 'koide-month-picture', 200);
  await p.close();
  // 기도의 끈: 두 가정을 위해 기도한 뒤
  p = await page(K + 'index.html?demo&as=' + AS_P + '&at=home');
  for (let i = 0; i < 2; i++) {
    await p.getByText('기도했어요', { exact: true }).first().click(); await p.waitForTimeout(2500);
    await p.keyboard.press('Escape'); await p.waitForTimeout(500);
    await p.getByText('다음 가정', { exact: true }).first().click(); await p.waitForTimeout(1500);
  }
  await card(p, '기도의 끈', 'koide-prayer-cord', 70);
  await p.close();
  // 기도를 열며
  p = await page(K + 'index.html?demo&as=' + AS_P + '&at=pray');
  await p.getByText(/기도 시작/).first().click(); await p.waitForTimeout(3600);
  await shot(p, 'koide-pray-open'); await p.close();
  // 코이데 노트(예시 노트)
  const N = K + 'note.html?demo&as=' + AS_N + '&at=';
  p = await page(N + 'today'); await shot(p, 'koide-note-today'); await p.close();
  p = await page(N + 'more'); await shot(p, 'koide-note-more'); await p.close();
  p = await page(N + 'note'); await shot(p, 'koide-note-items'); await p.close();
  p = await page(N + 'look'); await shot(p, 'koide-note-look');
  await scrollTo(p, '지난 기록', 90); await shot(p, 'koide-note-badges'); await p.close();
  p = await page(N + 'pilgrim'); await shot(p, 'koide-pilgrim'); await p.close();
  // 디다코 문답
  p = await page(D + 'app/', 1500);
  await p.getByText('데모로 둘러보기').click(); await p.waitForTimeout(2500); await p.addStyleTag({ content: HIDE });
  await scrollTo(p, '오늘 우리 교회가 함께 읽는 말씀', 200);
  await p.getByText('우리가 늘 깨어 있기 때문에').click(); await p.waitForTimeout(1200); await shot(p, 'didako-quiz-again');
  await p.getByText('아버지께서 만물보다 크시기 때문에').click(); await p.waitForTimeout(1200); await shot(p, 'didako-quiz-right');
  await p.close();
  // 디다코 노트
  p = await page(D + 'note/?demo', 2500);
  await p.getByText('카카오로 시작하기').click(); await p.waitForTimeout(1500);
  await p.fill('input:visible', 'DEMO'); await p.getByText('들어가기').click(); await p.waitForTimeout(2000);
  await p.fill('input:visible', '박민재'); await p.getByText('다음', { exact: true }).click(); await p.waitForTimeout(2000);
  const nb = await p.$('button:visible:has-text("다음"), button:visible:has-text("시작"), button:visible:has-text("들어가기")'); if (nb) { await nb.click(); await p.waitForTimeout(1800); }
  await p.evaluate(() => document.querySelector('[data-act="demo-fill"]').click()); await p.waitForTimeout(2000);
  await p.reload(); await p.waitForTimeout(3000); await p.addStyleTag({ content: HIDE });
  await p.evaluate(() => location.hash = '#/mine'); await p.waitForTimeout(2000); await shot(p, 'didako-note-mine');
  await p.evaluate(() => location.hash = '#/write'); await p.waitForTimeout(2000); await shot(p, 'didako-note-write');
  await b.close();
})();
