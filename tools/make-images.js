// 코이노비아 로고 그림을 한꺼번에 만드는 도구예요.
//  - icons/favicon.svg, icons/favicon-32.png : 브라우저 탭 아이콘(파비콘)
//  - og.png : 링크를 보낼 때 뜨는 미리보기 그림
//  - tabs.js의 LOGO : 위쪽 메뉴와 맨 아래에 나오는 작은 로고(네 페이지 공통)
//  - tabs.js의 WORDMARK : 로고 옆 영문 워드마크 KOINOBIA. icons/logo/koinobia-wordmark.svg(tools/make-logo.py가 만듦)에서 가져와요
// 로고는 "엮인 세 고리 매듭": 끊기지 않는 한 줄이 세 고리를 이루고, 교차점마다 아래로 지나는 줄만 끊어 보여요.
// 세 고리는 성부·성자·성령, 그리고 세 앱을 뜻해요. 2026-11-22부터 먹 한 가지로, 굵기가 달라지는 띠(채운 면)로 그려요.
// 매듭 모양의 원본은 tools/knot-symbol.svg예요(koinobia-content의 Codex 시안 B, 512×512, path 세 개). 모양을 바꾸려면 그 파일을 바꿔요.
// 다시 만들 때: 저장소 맨 위에서  node tools/make-images.js
// (Playwright가 설치된 곳에서 실행해요.)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

// 먹색. 밝은 화면용과 어두운 화면용
const INK = '#1D1D1B', INK_DARK = '#ECECE8', PAGE = '#FFFFFF', ACCENT = '#33332F';

// 매듭 원본 읽기: path 세 개와, 먹이 칠해진 범위(제어점 기준)
const SYM_SRC = fs.readFileSync(path.join(__dirname, 'knot-symbol.svg'), 'utf8');
const SYM_D = [...SYM_SRC.matchAll(/ d="([^"]+)"/g)].map(m => m[1]);
if (SYM_D.length !== 3) throw new Error('tools/knot-symbol.svg에서 path 세 개를 찾지 못했어요');
const nums = SYM_D.join(' ').match(/-?\d+(?:\.\d+)?/g).map(Number);
const SX = nums.filter((_, i) => i % 2 === 0), SY = nums.filter((_, i) => i % 2 === 1);
const BOX = { x0: Math.min(...SX), x1: Math.max(...SX), y0: Math.min(...SY), y1: Math.max(...SY) };

// 매듭을 가로 폭 size로, 가운데를 (cx, cy)에 놓은 <g>. attr로 색을 정해요(fill="..." 또는 class="...")
function markFill(attr, size, cx, cy) {
  const k = size / (BOX.x1 - BOX.x0);
  const tx = cx - k * (BOX.x0 + BOX.x1) / 2, ty = cy - k * (BOX.y0 + BOX.y1) / 2;
  return `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(5)})" ${attr}>` + SYM_D.map(d => `<path d="${d}"/>`).join('') + '</g>';
}

// 탭 아이콘(SVG): 배경 없이 매듭만. 브라우저가 어두운 모드면 밝은 먹색으로 바뀌어요
const favicon = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><style>.ink{fill:${INK}}@media (prefers-color-scheme: dark){.ink{fill:${INK_DARK}}}</style>` +
  markFill('class="ink"', 480, 256, 256) + `</svg>\n`;
// PNG 탭 아이콘(SVG를 못 쓰는 브라우저용): 어두운 탭에서도 보이게 흰 둥근 네모 위에 그려요
const faviconPng = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" rx="112" fill="${PAGE}"/>${markFill(`fill="${INK}"`, 410, 256, 256)}</svg>`;
// 링크 미리보기용 매듭
const markOg = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">${markFill(`fill="${INK}"`, 470, 256, 256)}</svg>`;
// 메뉴·아래쪽 작은 로고: 색은 currentColor라 글자색(--ink)을 따라 밝은/어두운 화면에 맞춰 바뀌어요
const logoInline = `<svg viewBox="0 0 100 100" aria-hidden="true">${markFill('fill="currentColor"', 92, 50, 50)}</svg>`;

// 영문 워드마크: 로고 파일에서 바깥 여백(40)을 덜어 내고, 먹색을 currentColor로 바꿔 글자색을 따르게 해요
const WM_FILE = path.join(root, 'icons/logo/koinobia-wordmark.svg');
const wmSrc = fs.readFileSync(WM_FILE, 'utf8');
const wmBox = wmSrc.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const wmBody = wmSrc.replace(/^[\s\S]*?<\/title>\n?/, '').replace(/<\/svg>\s*$/, '').replace(/#1D1D1B/g, 'currentColor').replace(/\n/g, '');
const tight = [wmBox[0] + 40, wmBox[1] + 40, wmBox[2] - 80, wmBox[3] - 80].map(n => +n.toFixed(1)).join(' ');
const wordmarkInline = `<svg class="wm" viewBox="${tight}" aria-hidden="true">${wmBody}</svg>`;
if (/'/.test(wordmarkInline)) throw new Error('워드마크에 작은따옴표가 있으면 tabs.js에 넣을 수 없어요');

const ogHtml = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@700&family=IBM+Plex+Sans+KR:wght@500&display=swap">
<style>
html,body{margin:0;width:1200px;height:630px;background:${PAGE};}
body{display:flex;align-items:center;justify-content:center;gap:64px;}
.m{width:290px;height:290px;flex:none;} .m svg{width:100%;height:100%;display:block;}
body{flex-direction:column;gap:56px;}
.row{display:flex;align-items:center;gap:34px;}
.m{width:124px;height:124px;} .wm{height:92px;width:auto;display:block;color:${INK};}
p{font-family:'Gowun Batang',serif;font-weight:700;font-size:46px;margin:0;color:${ACCENT};letter-spacing:.02em;}
</style></head><body><div class="row"><div class="m">${markOg}</div>${wordmarkInline}</div><p>코이노비아 · 함께 나누는 삶</p></body></html>`;

(async () => {
  fs.mkdirSync(path.join(root, 'icons'), { recursive: true });
  fs.writeFileSync(path.join(root, 'icons/favicon.svg'), favicon);
  // tabs.js의 LOGO 한 줄을 새 로고로 바꿔 끼워요
  const tabsFile = path.join(root, 'tabs.js');
  const tabs = fs.readFileSync(tabsFile, 'utf8');
  const line = /^  var LOGO = '.*';$/m;
  if (!line.test(tabs)) throw new Error("tabs.js에서 var LOGO = '...'; 줄을 찾지 못했어요");
  // index.html의 RIBBON 한 줄(첫 화면·카드 매듭의 띠 모양)을 원본으로 바꿔 끼워요
  const idxFile = path.join(root, 'index.html');
  const idx = fs.readFileSync(idxFile, 'utf8');
  const rbLine = /^  var RIBBON = .*;$/m;
  if (!rbLine.test(idx)) throw new Error("index.html에서 var RIBBON = ...; 줄을 찾지 못했어요");
  fs.writeFileSync(idxFile, idx.replace(rbLine, () => '  var RIBBON = ' + JSON.stringify({ d: SYM_D, box: [BOX.x0, BOX.x1, BOX.y0, BOX.y1] }) + ';'));
  const wmLine = /^  var WORDMARK = '.*';$/m;
  if (!wmLine.test(tabs)) throw new Error("tabs.js에서 var WORDMARK = '...'; 줄을 찾지 못했어요");
  fs.writeFileSync(tabsFile, tabs.replace(line, () => `  var LOGO = '${logoInline}';`).replace(wmLine, () => `  var WORDMARK = '${wordmarkInline}';`));

  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {};
  const b = await chromium.launch(exe);
  const shot = async (html, w, h, out, transparent) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.screenshot({ path: out, omitBackground: transparent });
    await p.close();
  };
  const sq = (n, svg) => `<!doctype html><style>html,body{margin:0;background:transparent}svg{width:${n}px;height:${n}px;display:block}</style>${svg}`;
  await shot(sq(32, faviconPng), 32, 32, path.join(root, 'icons/favicon-32.png'), true);
  await shot(ogHtml, 1200, 630, path.join(root, 'og.png'), false);
  if (process.env.EXTRA) for (const n of [16, 180]) await shot(sq(n, faviconPng), n, n, path.join(process.env.EXTRA, `favicon-${n}.png`), true);
  await b.close();
})();
