"""코이노비아 로고 파일(icons/logo/*.svg)을 만드는 도구예요.

확정안(2026-11-18): Tenor Sans 대문자 + 고리 O + 가로획 없는 A(Λ) + 자간 0.11em
                    + 매듭 심볼 80%(글자 앞) + 중간 두께(+0.014em)
글자는 Tenor Sans 글꼴 파일에서 윤곽선을 꺼내 그림으로 바꾸므로, 만든 SVG는 글꼴 없이도 똑같이 보여요.
매듭은 icons/favicon.svg(tools/make-images.js가 만듦)의 선을 그대로 가져와요.

다시 만들 때(저장소 맨 위에서):
  pip install fonttools
  curl -o /tmp/TenorSans.ttf "https://fonts.gstatic.com/s/tenorsans/v21/bx6ANxqUneKx06UkIXISr3I.ttf"
  python3 tools/make-logo.py /tmp/TenorSans.ttf icons/favicon.svg icons/logo
  node tools/make-images.js      # 메뉴 로고(tabs.js)와 링크 미리보기(og.png)에도 반영
Tenor Sans는 SIL 오픈 폰트 라이선스(OFL)라 로고에 써도 돼요.
"""
import math
import re
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONT, FAVICON, OUT = sys.argv[1], sys.argv[2], sys.argv[3]

CAP = 700            # 대문자 높이(폰트 단위, 1em = 1000)
STEM = 91            # Tenor Sans 'I'의 세로획 굵기
BOLD = 14            # 중간 두께: 윤곽선 바깥으로 7씩 더함
TRACK = 110          # 자간 0.11em
OVER = 12            # 둥근 글자의 위아래 넘침
RING_OUT = CAP + 2 * OVER          # 고리 바깥 지름(굵기 보정 전)
RING_SB = 50                       # 고리 좌우 여백(폰트의 O와 같음)
KNOT_EM = 0.92                     # 심볼 크기 = 1.15em × 80%
GAP = 420                          # 심볼과 K 사이(잉크 기준)
KERN = {('K', 'O'): -30, ('I', 'A'): -10}

INK = {'light': '#1D1D1B', 'dark': '#ECECE8'}
KNOT_TONES = {'light': ('#1F1F1D', '#4A4945', '#77756E'),
              'dark': ('#F2F2EE', '#C9C8C2', '#A09E97')}

font = TTFont(FONT)
gs = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font['hmtx']


def glyph_path(ch, x):
    pen = SVGPathPen(gs)
    # 폰트 좌표(y 위쪽) → SVG 좌표(y 아래쪽, 대문자 윗선 = 0)
    gs[cmap[ord(ch)]].draw(TransformPen(pen, (1, 0, 0, -1, x, CAP)))
    return pen.getCommands()


def fmt(n):
    return ('%.1f' % n).rstrip('0').rstrip('.')


def open_a(x):
    """가로획 없는 A(Λ). 폰트 A의 좌우 끝(30~702)과 같은 자리에 그린다."""
    l, r, top = x + 30, x + 702, -OVER
    apex = (l + r) / 2
    w = STEM * 0.95                       # 사선은 세로획보다 살짝 가늘게
    theta = math.atan2(CAP + OVER, apex - l)
    th = w / math.sin(theta)              # 사선의 가로 두께
    slope = (CAP + OVER) / (apex - l)
    inner_y = CAP - slope * (apex - (l + th))
    pts = [(l, CAP), (apex, top), (r, CAP), (r - th, CAP), (apex, inner_y), (l + th, CAP)]
    return 'M' + ' L'.join(fmt(a) + ' ' + fmt(b) for a, b in pts) + 'Z'


def knot_paths():
    svg = open(FAVICON, encoding='utf-8').read()
    return re.findall(r' d="([^"]+)"', svg)


def build(tone, with_knot):
    ink = INK[tone]
    letters, rings = [], []
    x = 0.0
    if with_knot:
        knot_px = KNOT_EM * 1000
        k = knot_px / 512
        knot_w = (506 - 6) * k            # 획 굵기를 포함한 실제 잉크 폭
        kx, ky = -6 * k, CAP / 2 - 256 * k
        x = knot_w + GAP - 120            # K의 왼쪽 여백(120)을 뺀다
    else:
        x = -120
    word = 'KOINOBIA'
    for i, ch in enumerate(word):
        if ch == 'O':
            r = RING_OUT / 2 - (STEM + BOLD) / 2 + BOLD / 2
            cx = x + RING_SB + RING_OUT / 2
            rings.append((cx, CAP / 2, r))
            adv = RING_OUT + 2 * RING_SB
        elif ch == 'A':
            letters.append(open_a(x))
            adv = hmtx[cmap[ord(ch)]][0]
        else:
            letters.append(glyph_path(ch, x))
            adv = hmtx[cmap[ord(ch)]][0]
        if i < len(word) - 1:
            x += adv + TRACK + KERN.get((ch, word[i + 1]), 0)
        else:
            right = x + 702 + BOLD / 2      # Λ의 오른쪽 잉크 끝
    m = 40
    left = (0 if with_knot else 0) - m
    top = -OVER - BOLD - m
    height = CAP + 2 * (OVER + BOLD + m)
    width = right + 2 * m
    if with_knot:
        height = max(height, KNOT_EM * 1000 * (490 - 22) / 512 + 2 * m)
        top = CAP / 2 - height / 2
    out = []
    out.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s %s %s %s" role="img" aria-label="KOINOBIA 코이노비아">'
               % (fmt(left), fmt(top), fmt(width), fmt(height)))
    out.append('<title>코이노비아 KOINOBIA</title>')
    if with_knot:
        t0, t1, t2 = KNOT_TONES[tone]
        out.append('<g transform="translate(%s %s) scale(%s)" fill="none" stroke-width="60" stroke-linecap="round" stroke-linejoin="round">'
                   % (fmt(kx), fmt(ky), ('%.5f' % k)))
        for d, c in zip(knot_paths(), (t0, t1, t2)):
            out.append('<path stroke="%s" d="%s"/>' % (c, d))
        out.append('</g>')
    out.append('<g fill="%s" stroke="%s" stroke-width="%d" stroke-linejoin="round">' % (ink, ink, BOLD))
    for d in letters:
        out.append('<path d="%s"/>' % d)
    out.append('</g>')
    out.append('<g fill="none" stroke="%s" stroke-width="%d">' % (ink, STEM + BOLD))
    for cx, cy, r in rings:
        out.append('<circle cx="%s" cy="%s" r="%s"/>' % (fmt(cx), fmt(cy), fmt(r)))
    out.append('</g>')
    out.append('</svg>')
    return '\n'.join(out) + '\n'


for tone in ('light', 'dark'):
    suffix = '' if tone == 'light' else '-dark'
    open('%s/koinobia-logo%s.svg' % (OUT, suffix), 'w', encoding='utf-8').write(build(tone, True))
    open('%s/koinobia-wordmark%s.svg' % (OUT, suffix), 'w', encoding='utf-8').write(build(tone, False))
print('ok')
