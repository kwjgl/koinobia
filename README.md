# 코이노비아

코이노비아(함께 나누는 삶)는 코이데, 디다코, 프로코페 세 앱으로 들어가는 대문 페이지예요. 빌드 없이 `index.html`과 `site.js`만으로 돼 있어요.

## 문의·후원·개인정보 처리방침 켜기
`site.js` 맨 위 설정에서 한 줄씩 채우면 돼요.
- `contactEmail`: 이메일을 적으면 아래쪽에 "문의"가 나타나요.
- `donateUrl`: 주소를 적으면 "후원하기"가 나타나요.
- `privacyUrl`: 주소를 적으면 "준비 중"이 "개인정보 처리방침" 링크로 바뀌어요.
- `apps`의 `url`: 디다코·프로코페 주소를 적으면 "곧 만나요"가 [열기] 버튼으로 바뀌어요.

## GitHub Pages 켜기
저장소 Settings → Pages → Deploy from a branch → `main` / `(root)` 로 저장하세요. 잠시 뒤 https://kwjgl.github.io/koinobia/ 에서 보여요.

나중에 도메인을 사면 그 주소를 이 대문에 연결할 거예요.

## 아이콘과 링크 미리보기 그림
- 대문은 앱이 아니라서 휴대폰 홈 화면 아이콘은 두지 않아요. 로고(엮인 세 고리 매듭)는 브라우저 탭 아이콘(`icons/favicon.svg`, `icons/favicon-32.png`)과 카카오톡 같은 링크 미리보기 그림(`og.png`)에만 작게 써요.
- 그림을 다시 만들려면 저장소 맨 위에서 `node tools/make-images.js`를 실행해요(Playwright가 있는 곳에서).
- **도메인을 연결하면** `index.html`의 `og:image`와 `og:url` 주소를 새 도메인으로 바꿔 주세요. 안 바꾸면 미리보기 그림이 안 나올 수 있어요.
