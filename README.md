# 코이노비아

코이노비아(함께 나누는 삶)는 코이데, 디다코, 프로코페 세 앱으로 들어가는 대문 페이지예요. 빌드 없이 `index.html`과 `site.js`만으로 돼 있어요.

## 문의·후원·개인정보 처리방침 켜기
`site.js` 맨 위 설정에서 한 줄씩 채우면 돼요.
- `contactEmail`: 이메일을 적으면 아래쪽에 "문의"가 나타나요.
- `donateUrl`: 주소를 적으면 "후원하기"가 나타나요.
- `privacyUrl`: 주소를 적으면 "준비 중"이 "개인정보 처리방침" 링크로 바뀌어요.
- `apps`의 `url`: 디다코·프로코페 주소를 적으면 "곧 만나요"가 [열기] 버튼으로 바뀌어요.

## GitHub Pages 켜기
저장소 Settings → Pages → Deploy from a branch → `main` / `(root)` 로 저장하세요. 잠시 뒤 https://koinobia.com/ 에서 보여요(www도 같은 곳으로 와요). 예전 https://kwjgl.github.io/koinobia/ 주소는 GitHub이 새 주소로 넘겨 줘요.

## 도메인
- `koinobia.com`은 가비아에서 관리해요. 자동 연장이 켜져 있는지 가끔 확인해 주세요.
- 이 저장소에 연결한 도메인은 Settings → Pages의 Custom domain에서 정해요. 그러면 저장소 맨 위에 `CNAME` 파일이 생기는데, **지우지 마세요.** 지우면 도메인 연결이 풀려요.
- 코이데는 따로 `kwjgl/koide` 저장소에서 https://koide.koinobia.com/app/ 로 열려요.

## 아이콘과 링크 미리보기 그림
- 대문은 앱이 아니라서 휴대폰 홈 화면 아이콘은 두지 않아요. 로고(엮인 세 고리 매듭)는 브라우저 탭 아이콘(`icons/favicon.svg`, `icons/favicon-32.png`)과 카카오톡 같은 링크 미리보기 그림(`og.png`)에만 작게 써요.
- 그림을 다시 만들려면 저장소 맨 위에서 `node tools/make-images.js`를 실행해요(Playwright가 있는 곳에서).
- `index.html`의 `og:image`와 `og:url`은 새 도메인(https://koinobia.com/)으로 맞춰 두었어요. 도메인을 또 바꾸면 이 두 주소도 같이 바꿔 주세요. 안 바꾸면 미리보기 그림이 안 나올 수 있어요.
