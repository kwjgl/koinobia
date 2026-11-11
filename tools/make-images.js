// 코이노비아 로고 그림을 한꺼번에 만드는 도구예요.
//  - icons/favicon.svg, icons/favicon-32.png : 브라우저 탭 아이콘(파비콘)
//  - og.png : 링크를 보낼 때 뜨는 미리보기 그림
//  - tabs.js의 LOGO : 위쪽 메뉴와 맨 아래에 나오는 작은 로고(네 페이지 공통)
// 로고는 "엮인 세 고리 매듭": 끊기지 않는 한 줄이 세 고리를 이루고, 교차점마다 아래로 지나는 줄만 끊어 보여요.
// 세 고리는 성부·성자·성령, 그리고 세 앱을 뜻해요. 고리마다 먹의 진하기를 달리해(먹 세 톤) 셋이면서 하나로 보이게 해요.
// 다시 만들 때: 저장소 맨 위에서  node tools/make-images.js
// (Playwright가 설치된 곳에서 실행해요.)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

// 먹 세 톤. 밝은 화면용과 어두운 화면용. index.html·page.css의 --logo-1·2·3과 같은 값이에요
const TONES = ['#1F1F1D', '#4A4945', '#77756E'];
const TONES_DARK = ['#F2F2EE', '#C9C8C2', '#A09E97'];
const PAGE = '#FFFFFF', INK = '#1D1D1B', ACCENT = '#33332F';

// 삼엽 매듭 한 바퀴를 점으로 찍고, 교차점에서 아래로 지나는 줄을 끊은 뒤, 고리(톤)별 선 조각(path) 세 개로 돌려준다.
// size: 매듭 가로 폭(선 중심 기준), sw: 선 굵기, (cx, cy): 가운데. 고리 하나가 위로 솟은 모양이에요.
function knotPaths(size, sw, cx, cy) {
  const N = 1800, raw = [];
  for (let i = 0; i < N; i++) {
    const t = 2 * Math.PI * i / N;
    raw.push([Math.sin(t) + 2 * Math.sin(2 * t), Math.cos(t) - 2 * Math.cos(2 * t), -Math.sin(3 * t)]);
  }
  const xs = raw.map(p => p[0]), ys = raw.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = size / (x1 - x0);
  const pts = raw.map(p => [cx + (p[0] - (x0 + x1) / 2) * k, cy + (p[1] - (y0 + y1) / 2) * k]);
  const z = raw.map(p => p[2]);
  // 교차점 찾기(선분끼리 만나는 곳)
  const seg = (p, q, r, s) => {
    const d = (q[0] - p[0]) * (s[1] - r[1]) - (q[1] - p[1]) * (s[0] - r[0]);
    if (Math.abs(d) < 1e-12) return false;
    const a = ((r[0] - p[0]) * (s[1] - r[1]) - (r[1] - p[1]) * (s[0] - r[0])) / d;
    const b = ((r[0] - p[0]) * (q[1] - p[1]) - (r[1] - p[1]) * (q[0] - p[0])) / d;
    return a >= 0 && a < 1 && b >= 0 && b < 1;
  };
  const hits = [];
  for (let i = 0; i < N; i++) for (let j = i + 20; j < N; j++) {
    if (i === 0 && j > N - 20) continue;
    if (seg(pts[i], pts[(i + 1) % N], pts[j], pts[(j + 1) % N])) hits.push([i, j]);
  }
  if (hits.length !== 3) throw new Error('교차점이 3개가 아니에요: ' + hits.length);
  // 교차점에서 깊이(z)가 낮은 줄이 아래로 지나가요. 그러면 위·아래가 번갈아 나와요
  const under = hits.map(([i, j]) => (z[i] < z[j] ? i : j));
  // 아래 줄은 교차점 앞뒤로 같은 길이만 끊는다(끊는 길이 합 = 선 굵기의 약 1.8배)
  const half = sw * 0.9;
  const cum = [0];
  for (let i = 1; i < N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const per = cum[N - 1] + Math.hypot(pts[0][0] - pts[N - 1][0], pts[0][1] - pts[N - 1][1]);
  const cut = new Array(N).fill(false);
  under.forEach(u => {
    for (let i = 0; i < N; i++) {
      let d = Math.abs(cum[i] - cum[u]); d = Math.min(d, per - d);
      if (d < half) cut[i] = true;
    }
  });
  // 끊긴 곳에서 출발해 한 바퀴 돌면 줄이 세 조각으로 나뉘어요. 조각마다 톤 하나씩 칠해요.
  // 톤이 바뀌는 자리가 늘 다른 줄 밑으로 들어가는 곳이라, 이음매가 보이지 않아요
  const st = cut.indexOf(true);
  const runs = [];
  let cur = null;
  for (let n = 0; n < N; n++) {
    const i = (st + n) % N;
    if (cut[i]) { cur = null; continue; }
    if (!cur) runs.push(cur = []);
    cur.push(pts[i]);
  }
  if (runs.length !== 3) throw new Error('줄 조각이 3개가 아니에요: ' + runs.length);
  const fmt = r => 'M' + r.filter((_, n) => n % 3 === 0 || n === r.length - 1).map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
  return runs.map(fmt);
}

// 고리 셋을 각자의 색으로 그린 <g>. colors는 색 값 셋이나 CSS 변수 셋(null이면 class="t0"~"t2"로 색을 정해요)
const markG = (colors, size, sw, cx, cy) =>
  `<g fill="none" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">` +
  knotPaths(size, sw, cx, cy).map((d, t) => `<path ${colors ? `stroke="${colors[t]}"` : `class="t${t}"`} d="${d}"/>`).join('') + '</g>';

// 탭 아이콘(SVG): 배경 없이 매듭만. 선을 조금 굵게 해서 작게 줄여도 또렷해요.
// 브라우저가 어두운 모드면 밝은 톤으로 바뀌어요
const FAV_SIZE = 440, FAV_SW = 60;
const favicon = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><style>` +
  TONES.map((c, i) => `.t${i}{stroke:${c}}`).join('') +
  `@media (prefers-color-scheme: dark){` + TONES_DARK.map((c, i) => `.t${i}{stroke:${c}}`).join('') + `}</style>` +
  markG(null, FAV_SIZE, FAV_SW, 256, 256) +
  `</svg>\n`;
// PNG 탭 아이콘(SVG를 못 쓰는 브라우저용): 어두운 탭에서도 보이게 흰 둥근 네모 위에 그려요
const faviconPng = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" rx="112" fill="${PAGE}"/>${markG(TONES, 400, 56, 256, 256)}</svg>`;
// 링크 미리보기용 매듭
const markOg = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">${markG(TONES, 400, 46, 256, 256)}</svg>`;
// 메뉴·아래쪽 작은 로고: 색은 CSS 변수라 밝은/어두운 화면에 맞춰 바뀌어요
const logoInline = `<svg viewBox="0 0 100 100" aria-hidden="true">${markG(['var(--logo-1)', 'var(--logo-2)', 'var(--logo-3)'], 82, 9.5, 50, 50)}</svg>`;

const ogHtml = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@700&family=IBM+Plex+Sans+KR:wght@500&display=swap">
<style>
html,body{margin:0;width:1200px;height:630px;background:${PAGE};}
body{display:flex;align-items:center;justify-content:center;gap:64px;}
.m{width:290px;height:290px;flex:none;} .m svg{width:100%;height:100%;display:block;}
h1{font-family:'Gowun Batang',serif;font-weight:700;font-size:140px;line-height:1.15;margin:0;color:${INK};letter-spacing:-2px;}
p{font-family:'Gowun Batang',serif;font-weight:700;font-size:54px;margin:10px 0 0 6px;color:${ACCENT};}
</style></head><body><div class="m">${markOg}</div><div><h1>코이노비아</h1><p>함께 나누는 삶</p></div></body></html>`;

(async () => {
  fs.mkdirSync(path.join(root, 'icons'), { recursive: true });
  fs.writeFileSync(path.join(root, 'icons/favicon.svg'), favicon);
  // tabs.js의 LOGO 한 줄을 새 로고로 바꿔 끼워요
  const tabsFile = path.join(root, 'tabs.js');
  const tabs = fs.readFileSync(tabsFile, 'utf8');
  const line = /^  var LOGO = '.*';$/m;
  if (!line.test(tabs)) throw new Error("tabs.js에서 var LOGO = '...'; 줄을 찾지 못했어요");
  fs.writeFileSync(tabsFile, tabs.replace(line, () => `  var LOGO = '${logoInline}';`));

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
