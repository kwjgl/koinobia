# 코이노비아

코이노비아(함께 나누는 삶)는 코이데, 디다코, 텔리오 세 앱으로 들어가는 대문 사이트예요. 빌드 없이 HTML·CSS·JS 파일만으로 돼 있어요.

## 탭 다섯 개
코이데·디다코처럼 휴대폰에서는 화면 아래 탭 막대, 컴퓨터(넓은 화면)에서는 위쪽 띠에 메뉴 글자가 보여요.

| 탭 | 주소 | 파일 | 내용을 고치는 곳 |
|---|---|---|---|
| 홈 | `/` | `index.html` | `site.js` |
| 이야기 | `/about/` | `about/index.html` | `about/index.html`의 글(①~⑥ 표시) |
| 앱 | `/apps/` | `apps/index.html` | `site.js`의 `apps`(이름·설명·`screens` 사진) |
| 교회 | `/church/` | `church/index.html` | `church/index.html`의 글 |
| 소식 | `/news/` | `news/index.html` | `news.js` |

- 교회 탭은 코이데 교회·디다코 교회 소개, 지키는 약속, 시작 순서, 자주 묻는 질문, 문의만 있어요. **요금표와 무료 기간은 정해지기 전이라 쓰지 않았어요.** 정해지면 `church/index.html`의 "이용료는 얼마인가요?" 답을 고치고 요금표를 더해요. 맨 위 [교회 신청하기 · 곧 엽니다]는 앱의 교회 신청서(`church_apply`)를 켜는 날 같이 열어요. 탭에 `새` 배지를 다시 달려면 `tabs.js`의 `TABS`에서 그 탭 줄 끝에 `true`를 더해요.

후원 안내 `/support/`, 개인정보 처리방침 `/privacy/` ─ 탭에는 없고 바닥글에서 들어가요. 방침 글은 `privacy/index.html`에 있고, 앱이 정보를 저장·공개하는 방식이 바뀌면 이 글도 같이 고치고 맨 아래 시행일을 바꿔 주세요.

같이 쓰는 파일
- `tabs.js`: 탭 목록(이름·주소·그림). 탭을 더하거나 이름을 바꿀 때 맨 위 `TABS`만 고쳐요.
- `tabs.css`: 탭 막대와 위쪽 메뉴 모양.
- `page.css`: 이야기·앱·소식 페이지의 모양(색·글꼴은 대문과 같은 값). 색을 바꾸면 `index.html`의 `:root`도 같이 바꿔요.
- 각 페이지는 `<body data-tab="about">`처럼 자기가 어느 탭인지 적어 둬요.
- **파일 버전 번호**: 각 페이지는 `page.css?v=20261111`처럼 같이 쓰는 파일 끝에 번호를 붙여 불러요. `page.css`, `tabs.css`, `tabs.js`, `site.js`, `news.js`를 고치면 여섯 페이지(`index.html`, `about/`, `apps/`, `church/`, `news/`, `support/`)와 `privacy/`의 이 번호를 모두 오늘 날짜로 바꿔 주세요. 안 바꾸면 방문자 브라우저가 예전 파일을 그대로 써서 바뀐 모습이 안 보일 수 있어요.

## 홈에 있는 것
- 코이데 이달의 그림 줄: 앱이 그리는 모습 그대로(기도가 가득 찬 달) 첫 해 9월부터 둘째 해 8월까지 24장. 그림은 `screens/months/`(코이데 저장소의 `app/art-data.js`와 `prototype/img/`로 장면을 그려 520×244 WebP로 줄인 것), 달 이름은 `index.html`의 `MONTHS`. 코이데에 새 달 그림이 더해지면 이 줄도 같이 늘려요.
- 질문으로 묵상하기 표지 줄: 성경 66권, 책마다 표지 한 장(여러 부로 나뉜 책은 1부). 그림은 `screens/covers/`(디다코 저장소 `note/img/walk/`의 표지를 480×270 WebP로 줄인 것), 책 이름과 순서는 `index.html`의 `BOOKS`. 새 표지가 바뀌면 같은 이름으로 바꿔 올려요.
- 세 층(노트·공동체·교회) 계단 카드: 화면 사진은 `screens/layers/`(디다코 데모 화면).
- 쓰는 법: 홈 화면에 두기(아이폰·안드로이드).
- 소식: `news.js` 공지 중 날짜가 가장 최근인 세 개가 저절로 나와요.

## 소식 올리기
`news.js`를 열고 맨 위 설명대로 공지(`type: 'notice'`)나 개발 노트(`type: 'note'`) 한 덩어리를 더해요. 개발 노트는 날짜 없이, 적힌 순서대로 공지 아래에 보여요.
- 개발 노트에 사진을 붙이려면 `images: [['/screens/notes/사진.jpg', '사진 설명']]`처럼 적어요. 노트용 사진은 `screens/notes/`에 있고, 앱 화면이 바뀌면 `node tools/make-note-screens.js`로 다시 찍어요. GitHub 웹에서 연필(✏️) 버튼으로 고치고 저장(Commit)하면 1~2분 뒤 사이트에 보여요.

## 앱 화면 사진 바꾸기
- 사진은 `screens/koide/`, `screens/didako/`에 있어요(휴대폰 `phone-1~4.jpg`, 컴퓨터 `pc-1.jpg`).
- 같은 이름으로 사진을 바꿔 올리면 끝이에요. 사진 아래 설명이나 장수를 바꾸려면 `site.js`의 `screens`를 고쳐요.
- 각 앱의 데모 모드로 다시 찍으려면 저장소 맨 위에서 `node tools/make-screens.js`(Playwright가 있는 곳에서).
- 텔리오처럼 `screens`가 없는 앱은 "화면은 준비 중이에요"로 보여요.

## 챗지피티 같은 AI에게 고쳐 달라고 할 때
아래 글을 먼저 붙여 넣고, 그 다음에 고칠 파일 내용과 바라는 점을 적어 주세요.

```
이 사이트는 빌드 도구 없이 HTML·CSS·JS 파일만으로 된 GitHub Pages 사이트야.
- 탭: 홈(index.html), 이야기(about/index.html), 앱(apps/index.html), 교회(church/index.html), 소식(news/index.html)
- 탭 목록은 tabs.js의 TABS, 모양은 tabs.css
- 이야기·앱·소식의 모양은 page.css, 색은 :root 변수만 써(새 색을 만들지 마)
- 앱 정보와 화면 사진 목록은 site.js의 apps, 소식은 news.js
- 말투는 "~해요"체로 쉽고 따뜻하게
고친 파일은 전체 내용을 다시 보여 주고, 무엇을 바꿨는지 한 줄씩 알려 줘.
```

## 문의·후원·개인정보 처리방침 켜기
`site.js` 맨 위 설정에서 한 줄씩 채우면 돼요.
- `contactEmail`: 이메일을 적으면 아래쪽에 "문의"가 나타나고, 교회 페이지의 [문의하기]도 이 주소로 열려요. 지금은 개인정보 보호책임자 메일(`koinobia.admin@gmail.com`)로 켜 두었어요. 문의 전용 주소가 생기면 여기만 바꿔요.
- `donateUrl`: `/support/` 페이지의 후원하기 버튼 주소예요. 비워 두면 후원 방법이 준비 중이라고 안내해요.
- `privacyUrl`: 주소를 적으면 "준비 중"이 "개인정보 처리방침" 링크로 바뀌어요. 지금은 `https://koinobia.com/privacy/`로 켜 두었어요.
- `apps`의 `url`: 디다코·텔리오 주소를 적으면 "곧 만나요"가 [열기] 버튼으로 바뀌어요.
- `apps`의 `understand`: "기도와 말씀" 구역에 나오는 카드예요. 제목(`title`)과 [작은 제목, 풀이] 세 쌍(`items`)을 고치면 돼요. 이 칸이 있는 앱만 카드가 생겨요.
- `understandNote`: "기도와 말씀" 구역 아래의 작은 글이에요. 비우면 숨겨져요.

## GitHub Pages 켜기
저장소 Settings → Pages → Deploy from a branch → `main` / `(root)` 로 저장하세요. 잠시 뒤 https://koinobia.com/ 에서 보여요(www도 같은 곳으로 와요). 예전 https://kwjgl.github.io/koinobia/ 주소는 GitHub이 새 주소로 넘겨 줘요.

## 도메인
- `koinobia.com`은 가비아에서 관리해요. 자동 연장이 켜져 있는지 가끔 확인해 주세요.
- 이 저장소에 연결한 도메인은 Settings → Pages의 Custom domain에서 정해요. 그러면 저장소 맨 위에 `CNAME` 파일이 생기는데, **지우지 마세요.** 지우면 도메인 연결이 풀려요.
- 코이데는 따로 `kwjgl/koide` 저장소에서 https://koide.koinobia.com/app/ 로 열려요.

## 아이콘과 링크 미리보기 그림
- 대문은 앱이 아니라서 휴대폰 홈 화면 아이콘은 두지 않아요. 로고(엮인 세 고리 매듭)는 브라우저 탭 아이콘(`icons/favicon.svg`, `icons/favicon-32.png`)과 카카오톡 같은 링크 미리보기 그림(`og.png`)에만 작게 써요.
- 대문 첫 화면의 큰 매듭과 "우리 앱" 카드 구석의 작은 매듭도 이 로고와 같은 모양·방향이에요(고리 하나가 위로. 왼쪽 아래가 기도, 오른쪽 아래가 말씀, 위 가운데가 자람). 로고를 바꾸면 `index.html`의 `Knot`도 같이 맞춰 주세요.
- 앱 아이콘(`icons/app-koide.svg`, `icons/app-didako.svg`, `icons/app-telio.svg`)은 홈의 앱 탭·카드, "기도와 말씀" 카드, "앱" 탭에 같이 쓰여요. 코이데(pray-for)·디다코(gbs)·텔리오(prokope) 저장소의 앱 아이콘이 바뀌면 이 파일도 같은 그림으로 바꿔요. SVG 주석 안에는 `--`를 쓰지 마세요(그림이 깨져요).
- 그림을 다시 만들려면 저장소 맨 위에서 `node tools/make-images.js`를 실행해요(Playwright가 있는 곳에서).
- 위쪽 메뉴와 맨 아래의 로고는 매듭 + 영문 워드마크 KOINOBIA예요(2026-11-18 확정). 로고 파일은 `icons/logo/`에 있고, `tools/make-logo.py`로 만들어요(만드는 법은 그 파일 맨 위에 적었어요). 로고 파일을 바꾸면 `node tools/make-images.js`를 다시 실행해 메뉴 로고(`tabs.js`)와 미리보기 그림(`og.png`)에도 반영해요. 쓰는 규칙은 브랜드 가이드라인의 ‘로고와 상징’에 있어요(브랜드 문서는 2026-11-19부터 비공개 저장소 `kwjgl/koinobia-content`의 `docs/brand/`에 있어요).
- 이야기·앱·소식 페이지도 같은 미리보기 그림(`og.png`)을 써요. 각 페이지 `<head>`의 `og:url`은 그 페이지 주소예요.
- `index.html`의 `og:image`와 `og:url`은 새 도메인(https://koinobia.com/)으로 맞춰 두었어요. 도메인을 또 바꾸면 이 두 주소도 같이 바꿔 주세요. 안 바꾸면 미리보기 그림이 안 나올 수 있어요.
