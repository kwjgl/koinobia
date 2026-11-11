// "앱" 탭에 나오는 앱 화면 사진(screens/ 폴더)을 다시 찍는 도구예요.
// 앱 화면이 바뀌었을 때 저장소 맨 위에서 실행하세요(Playwright가 있는 곳에서).
//   node tools/make-screens.js
// 각 앱의 데모 모드로 들어가서 휴대폰 화면 4장, PC 화면 1장을 찍어요. 맨 위의 "데모" 표시는 가리고 찍어요.
// 다른 주소에서 찍으려면 주소를 넘겨요(코이데 주소, 디다코 주소 순서):
//   node tools/make-screens.js http://localhost:8101/app/ http://localhost:8102/app/
const { chromium } = require('playwright');
const path = require('path');

const KOIDE = process.argv[2] || 'https://koide.koinobia.com/app/';
const DIDAKO = process.argv[3] || 'https://didako.koinobia.com/app/';
const OUT = path.join(__dirname, '..', 'screens');

const APPS = [
  {
    id: 'koide',
    url: KOIDE + '?demo',
    hide: '.demo { display: none !important; }',
    enter: page => page.getByText('데모: 박민재로 들어가기').click(),
    // 휴대폰 사진: [파일 이름, 누를 탭]
    phone: [['phone-1', '#tabs [data-v="home"]'], ['phone-2', '#tabs [data-v="mine"]'],
            ['phone-3', '#tabs [data-v="pray"]'], ['phone-4', '#tabs [data-v="history"]']],
    pcTab: '[data-v="home"]'
  },
  {
    id: 'didako',
    url: DIDAKO,
    hide: '.demo-tag { display: none !important; }',
    enter: page => page.getByText('데모로 둘러보기').click(),
    phone: [['phone-1', '#tabs [data-tab="week"]'], ['phone-2', '#tabs [data-tab="shelf"]'],
            ['phone-3', '#tabs [data-tab="share"]'], ['phone-4', '#tabs [data-tab="record"]']],
    pcTab: null
  }
];

async function open(browser, app, viewport, scale) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: scale });
  await page.goto(app.url);
  await page.waitForTimeout(1500);
  await app.enter(page);
  await page.waitForTimeout(2000);
  await page.addStyleTag({ content: app.hide });
  return page;
}

(async () => {
  const browser = await chromium.launch();
  for (const app of APPS) {
    const phone = await open(browser, app, { width: 390, height: 844 }, 2);
    for (const [name, tab] of app.phone) {
      await phone.click(tab);
      await phone.waitForTimeout(1500);
      await phone.evaluate(() => window.scrollTo(0, 0));
      await phone.screenshot({ path: path.join(OUT, app.id, name + '.jpg'), type: 'jpeg', quality: 82 });
      console.log('찍음:', app.id, name);
    }
    await phone.close();
    const pc = await open(browser, app, { width: 1440, height: 900 }, 1);
    if (app.pcTab) { await pc.click(app.pcTab).catch(() => {}); await pc.waitForTimeout(1500); }
    await pc.screenshot({ path: path.join(OUT, app.id, 'pc-1.jpg'), type: 'jpeg', quality: 82 });
    console.log('찍음:', app.id, 'pc-1');
    await pc.close();
  }
  await browser.close();
})();
