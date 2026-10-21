// 탭 아이콘(icons/favicon.svg, icons/favicon-32.png)과 링크 미리보기 그림(og.png)을 만드는 도구예요.
// 로고는 "엮인 세 고리 매듭": 끊기지 않는 한 줄이 세 고리를 이루고, 교차점마다 아래로 지나는 줄만 끊어 보여요.
// 다시 만들 때: 저장소 맨 위에서  node tools/make-images.js
// (Playwright가 설치된 곳에서 실행해요. 색은 index.html의 밝은 모드 값과 같아요.)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const ACCENT = '#2B6A62', ON_ACCENT = '#FFFFFF', PAGE = '#F3F5F2', INK = '#1B2523';

// 삼엽 매듭 한 바퀴를 점으로 찍고, 교차점에서 아래로 지나는 줄을 끊어 선 조각들(path)로 돌려준다.
// size: 매듭 가로 폭(선 중심 기준), sw: 선 굵기 (clear는 쓰지 않음)
function knotPath(size, sw, clear, cx = 256, cy = 256) {
  const N = 1800, raw = [];
  for (let i = 0; i < N; i++) {
    const t = 2 * Math.PI * i / N;
    raw.push([Math.sin(t) + 2 * Math.sin(2 * t), -(Math.cos(t) - 2 * Math.cos(2 * t))]);
  }
  const xs = raw.map(p => p[0]), ys = raw.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = size / (x1 - x0);
  const pts = raw.map(p => [cx + (p[0] - (x0 + x1) / 2) * k, cy + (p[1] - (y0 + y1) / 2) * k]);

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
  // 한 교차점당 선분 쌍이 하나여야 한다(셋)
  if (hits.length !== 3) throw new Error('교차점이 3개가 아니에요: ' + hits.length);
  // 줄을 따라 만나는 순서대로 위/아래를 번갈아 정한다
  const visits = [];
  hits.forEach(([i, j], n) => { visits.push([i, n]); visits.push([j, n]); });
  visits.sort((a, b) => a[0] - b[0]);
  const under = visits.filter((_, n) => n % 2 === 1).map(v => v[0]);
  const over = visits.filter((_, n) => n % 2 === 0).map(v => v[0]);
  // 아래 줄은 교차점 앞뒤로 같은 길이만 끊는다(끊는 길이 합 = 선 굵기의 약 1.8배).
  // 끊긴 두 끝이 위 줄 바로 옆에서 들어갔다 나오는 것처럼 보여야 "이어진 한 줄"로 읽혀요.
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
  const st = cut.indexOf(true);
  const runs = [[]];
  for (let n = 0; n < N; n++) {
    const i = (st + n) % N;
    if (cut[i]) { if (runs[runs.length - 1].length) runs.push([]); }
    else runs[runs.length - 1].push(pts[i]);
  }
  return runs.filter(r => r.length > 1)
    .map(r => 'M' + r.filter((_, n) => n % 3 === 0 || n === r.length - 1).map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L')).join('');
}

const markSvg = (color, sw, size, clear) =>
  `<g fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${knotPath(size, sw, clear)}"/></g>`;

// 탭 아이콘: --accent 둥근 네모 위에 흰 선. 밝은 탭·어두운 탭 어디서나 보인다.
const favicon = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" rx="112" fill="${ACCENT}"/>${markSvg(ON_ACCENT, 34, 300, 0)}</svg>\n`;
// 링크 미리보기용: 배경 없이 선만
const markOg = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">${markSvg(ACCENT, 34, 330, 0)}</svg>`;

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
  const sq = (n) => `<!doctype html><style>html,body{margin:0;background:transparent}svg{width:${n}px;height:${n}px;display:block}</style>${favicon}`;
  await shot(sq(32), 32, 32, path.join(root, 'icons/favicon-32.png'), true);
  await shot(ogHtml, 1200, 630, path.join(root, 'og.png'), false);
  if (process.env.EXTRA) for (const n of [16, 180]) await shot(sq(n), n, n, path.join(process.env.EXTRA, `favicon-${n}.png`), true);
  await b.close();
})();
