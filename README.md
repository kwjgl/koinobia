# 코이노비아

코이노비아(함께 나누는 삶)는 코이데, 디다코, 텔리오 세 앱으로 들어가는 대문 사이트예요. 빌드 없이 HTML·CSS·JS 파일만으로 돼 있어요.

## 탭 네 개
코이데·디다코처럼 휴대폰에서는 화면 아래 탭 막대, 컴퓨터(넓은 화면)에서는 위쪽 띠에 메뉴 글자가 보여요.

| 탭 | 주소 | 파일 | 내용을 고치는 곳 |
|---|---|---|---|
| 홈 | `/` | `index.html` | `site.js` |
| 이야기 | `/about/` | `about/index.html` | `about/index.html`의 글(①~⑥ 표시) |
| 앱 | `/apps/` | `apps/index.html` | `site.js`의 `apps`(이름·설명·`screens` 사진) |
| 소식 | `/news/` | `news/index.html` | `news.js` |

후원 안내 `/support/` ─ 탭에는 없고 바닥글·이야기 페이지에서 들어가요.

같이 쓰는 파일
- `tabs.js`: 탭 목록(이름·주소·그림). 탭을 더하거나 이름을 바꿀 때 맨 위 `TABS`만 고쳐요.
- `tabs.css`: 탭 막대와 위쪽 메뉴 모양.
- `page.css`: 이야기·앱·소식 페이지의 모양(색·글꼴은 대문과 같은 값). 색을 바꾸면 `index.html`의 `:root`도 같이 바꿔요.
- 각 페이지는 `<body data-tab="about">`처럼 자기가 어느 탭인지 적어 둬요.
- **파일 버전 번호**: 각 페이지는 `page.css?v=20261111`처럼 같이 쓰는 파일 끝에 번호를 붙여 불러요. `page.css`, `tabs.css`, `tabs.js`, `site.js`, `news.js`를 고치면 네 페이지(`index.html`, `about/`, `apps/`, `news/`)의 이 번호를 모두 오늘 날짜로 바꿔 주세요. 안 바꾸면 방문자 브라우저가 예전 파일을 그대로 써서 바뀐 모습이 안 보일 수 있어요.

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
- 탭: 홈(index.html), 이야기(about/index.html), 앱(apps/index.html), 소식(news/index.html)
- 탭 목록은 tabs.js의 TABS, 모양은 tabs.css
- 이야기·앱·소식의 모양은 page.css, 색은 :root 변수만 써(새 색을 만들지 마)
- 앱 정보와 화면 사진 목록은 site.js의 apps, 소식은 news.js
- 말투는 "~해요"체로 쉽고 따뜻하게
고친 파일은 전체 내용을 다시 보여 주고, 무엇을 바꿨는지 한 줄씩 알려 줘.
```

## 문의·후원·개인정보 처리방침 켜기
`site.js` 맨 위 설정에서 한 줄씩 채우면 돼요.
- `contactEmail`: 이메일을 적으면 아래쪽에 "문의"가 나타나요.
- `donateUrl`: `/support/` 페이지의 후원하기 버튼 주소예요. 비워 두면 후원 방법이 준비 중이라고 안내해요.
- `privacyUrl`: 주소를 적으면 "준비 중"이 "개인정보 처리방침" 링크로 바뀌어요.
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
- 그림을 다시 만들려면 저장소 맨 위에서 `node tools/make-images.js`를 실행해요(Playwright가 있는 곳에서).
- 이야기·앱·소식 페이지도 같은 미리보기 그림(`og.png`)을 써요. 각 페이지 `<head>`의 `og:url`은 그 페이지 주소예요.
- `index.html`의 `og:image`와 `og:url`은 새 도메인(https://koinobia.com/)으로 맞춰 두었어요. 도메인을 또 바꾸면 이 두 주소도 같이 바꿔 주세요. 안 바꾸면 미리보기 그림이 안 나올 수 있어요.
