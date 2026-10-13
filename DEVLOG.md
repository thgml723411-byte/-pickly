# MIQ 개발일지

## 2026-08-06

### 오늘 진행한 일

**1. 오늘 고친 버그**
- `ProtectedRoute.jsx` — 로그인 여부 조건이 반대(`if(user)`일 때 `/login`으로 리다이렉트)로 되어 있었고, `children`을 반환하는 코드 자체가 없어(`return ( )`) 로그인 상태에서도 `/recommend`·`/mypage`가 빈 화면으로 뜨던 문제 → `!user`일 때 `/login`으로 리다이렉트, 로그인 상태면 `children` 반환하도록 수정. 사용하지 않던 `React`/`useState`/`useEffect`/`onAuthStateChanged`/`auth`/`styles` import도 정리 (어제부터 이어진 미적용 이슈 해결)
- `Header.jsx`의 `fnclogout` — 로그아웃 실패 시 `catch` 블록이 비어 있어 사용자에게 아무 피드백이 없던 문제 → `console.error` 로깅과 `alert` 안내 메시지 추가
- `Login.jsx` — `<form onSubmit={handleSubmit}>`가 정의되지 않은 `handleSubmit`을 참조해 로그인 폼 제출 시 `ReferenceError` 크래시 발생 → 실제 정의된 `funSubmit`으로 수정
- `SignUp.jsx` — 컴포넌트가 `(user)`로 props 전체 객체를 받고 있었는데(`({ user })`가 아님) `<SignUp/>`은 props 없이 호출되어도 빈 객체 자체는 truthy라서 `if(user && !isLoading)`가 마운트 시 항상 참이 되어 `<Navigate>`를 반환 → 그런데 `Navigate`는 import조차 되어 있지 않아 회원가입 페이지 진입 즉시 `ReferenceError`로 크래시하던 문제 발견. `Login`이 이미 라우터 레벨에서 로그인 여부를 분기하는 패턴과 동일하게, 이미 로그인된 사용자의 리다이렉트 처리를 `Router.jsx`의 `/signup` 라우트로 옮기고 `SignUp.jsx`의 깨진 분기 코드는 제거
- `Router.jsx` — 위 수정에 맞춰 `/signup` 라우트를 `/login`과 동일하게 `user ? <Navigate to='/mypage'/> : <SignUp/>` 형태로 변경
- `firestore.js` — `saveRecommendationResul` 함수명 오타(→ `saveRecommendationResult`) 및 `export` 누락으로 다른 파일에서 import 불가능하던 문제 수정. 단, 이 함수가 호출하는 `updateDoc`은 `firestore.rules`의 `allow update: if false`(recommendations)에 막혀 있어 실제 연동 시 permission-denied 예상 — 규칙 조정 필요 (신규 발견, 미해결)
- `vite build`로 전체 재확인, 컴파일 에러 없음 (Sass legacy API 경고만 존재, 기능 영향 없음)

### 남은 이슈 / 다음 할 일
- [ ] `functions/src/index.js`: `require('firebase-functions/v2/tttps')` 오타(→ `https`) (이어짐, 미해결)
- [ ] `functions/src/index.js`: 함수명 `getRecommndatio` 오타, `HttpsError` code 인자 누락 (이어짐, 미해결)
- [ ] 프런트(`recommendationApi.js`) REST 호출과 백엔드 `onCall` 구현 방식 불일치 (이어짐, 미해결)
- [ ] `functions/src/ai/openaiProvider.js`: `apikey`→`apiKey`, `response.create`→`responses.create`, 반환값 누락 (이어짐, 미해결)
- [ ] `firestore.rules`: `recommendations`의 `allow update: if false`가 `saveRecommendationResult`의 `updateDoc` 호출과 충돌 — AI 결과 저장 플로우 설계 시 규칙 조정 또는 create 시점에 한 번에 저장하는 방식으로 변경 필요 (신규 발견, 미해결)
- [ ] 위 이슈들로 `/recommend` 플로우는 아직 엔드투엔드로 동작하지 않음
- [ ] `MyPage.jsx`는 아직 디자인 톤 미적용 (이어짐, 미해결)
- [ ] `Recommend` 결과는 현재 로컬 샘플 데이터(`sampleRe`)이며 실제 API 연동 전 (이어짐, 미해결)

## 2026-08-05

### 오늘 진행한 일

**1. AI 추천 백엔드 1차 구현 (Cloud Functions)**
- `functions/src/index.js` 신규 작성 — `getRecommndatio` onCall 함수. 요청 데이터에서 `contentType`/`genre`/`mood`/`atmosphere` 필수값을 검증한 뒤 `aiService.createRecommendation` 호출
- `functions/src/ai/aiService.js` 신규 작성 — 사용자 취향 데이터(콘텐츠 종류/장르/기분/분위기/좋아하는 작품/피하고 싶은 요소)로 OpenAI에 보낼 프롬프트를 구성하는 로직
- `functions/src/ai/openaiProvider.js` 신규 작성 — OpenAI SDK 초기화 및 API 호출 래퍼
- `functions/package.json`에 `openai` 패키지 의존성 추가 (`npm install`), `functions/.env.local` · `functions/.gitignore` 신규 작성해 API 키를 로컬에 분리 보관

**2. Firestore 규칙 보완**
- `firestore.rules`에 `recommendations` 컬렉션 규칙 추가 — 본인(`userId`) 소유 문서만 read/create/delete 허용, update는 금지 (어제 남은 이슈였던 항목)
- `src/firebase/firestore.js` 점검

### 남은 이슈 / 다음 할 일
- [ ] `functions/src/index.js`: `require('firebase-functions/v2/tttps')` 오타(→ `https`)로 배포/실행 시 모듈을 찾지 못해 크래시 예상 (신규 발견, 미해결)
- [ ] `functions/src/index.js`: 함수명 `getRecommndatio` 오타, `HttpsError`도 `(code, message)` 시그니처인데 메시지만 전달해 code 누락 (신규 발견, 미해결)
- [ ] 프런트(`recommendationApi.js`)는 `fetch(FUNCTIONS_URL + '/recommend')`로 REST 호출하는데 백엔드는 `onCall`(callable) 함수로 구현돼 있어 호출 방식 불일치 — 연동 시 실패 예상 (신규 발견, 미해결)
- [ ] `functions/src/ai/openaiProvider.js`: `new OpenAI({apikey})`가 `apiKey`가 아니라 `apikey`로 되어 있어 인증 실패 가능성, `openai.response.create` → `openai.responses.create` 오타, 마지막에 `response.output_text` 대신 `return`만 있어 항상 `undefined` 반환 (신규 발견, 미해결)
- [ ] 위 이슈들로 `/recommend` 플로우는 아직 엔드투엔드로 동작하지 않음 — 다음 작업에서 수정 필요
- [ ] `ProtectedRoute`가 라우터에 아직 적용되지 않음 (이어짐, 미해결)
- [ ] `MyPage.jsx`는 아직 디자인 톤 미적용 (이어짐, 미해결)
- [ ] `Recommend` 결과는 현재 로컬 샘플 데이터(`sampleRe`)이며 실제 API 연동 전 (이어짐, 미해결)

## 2026-08-04

### 오늘 진행한 일

**1. 오늘 고친 버그**
- `Recommend.jsx` 빈 화면 — 미정의 컴포넌트 `<Form>`(→ `<form>`)과 브라우저 내장 객체 `FormData`(→ state인 `formData`)를 잘못 참조해서 렌더링 시 크래시 → 수정
- `Login.jsx` 빈 화면 (앱 전체 영향) — `firebase/auth.js`가 export하는 함수명은 `login`인데 `signIn`을 import해서 `Router.jsx`가 정적으로 물고 있는 전체 모듈 그래프가 깨짐 → import/호출명 수정
- `SignUp.jsx` 빌드 실패 (앱 전체 영향) — `./signUp.module.scss` 파일 자체가 존재하지 않아 빌드가 깨짐 → 파일 생성
- `SignUp.jsx`의 `creatSignup` catch 블록 — 존재하지 않는 `error`/`setErrorMessage`를 참조해 이메일 형식 오류·약한 비밀번호 케이스에서 `ReferenceError` 발생 위험 → `err`/`setErrmessage`로 수정
- `SignUp.jsx` 비밀번호 확인 입력 멈춤 버그 — 실시간 일치 메시지(`fncpass`)를 추가하면서 `setPasswordConfirm` 호출이 빠져 입력이 반영 안 되던 문제 → 수정, `confirmMessage` 렌더링도 완성
- `global.scss` — `html, body, #root { height: 100% }`로 인해 콘텐츠가 뷰포트보다 길어지는 페이지(Recommend)에서 풋터 아래 배경 없는 빈 영역이 생기던 문제 → `min-height: 100%`로 수정
- `Recommend.module.scss` — `.results`에 `overflow` 제한이 없어 절대위치 봉투 이미지가 풋터 뒤까지 새어나가던 문제 → `overflow: hidden` 추가, 폼과 결과 섹션 사이 여백(`margin-top`) 추가

**2. 기능 개선**
- `SignUp.jsx`: 인라인 비밀번호 일치 검사를 `checkPasswordMatch()` 함수로 분리

**3. 디자인 작업 (Recommend / SignUp / Login)**
- `Recommend` 입력 폼을 아이보리 카드형 레이아웃으로 리디자인, 결과 카드 섹션은 별도로 버건디 톤(`--color-primary` 그라디언트) 디자인 적용
- `public/images/wine envelope.jpg`(편지봉투 사진) 소재로 여러 방식 실험 — 카드 배경 → 카드마다 사진 헤더 → 화면 중앙 대형 봉투 히어로로 정착, idle float 애니메이션 추가
- 추천 결과 카드 4장에 `cardBurst` 키프레임 적용 — 제출 시 봉투 위치에서 카드마다 다른 각도·타이밍으로 튀어나오며 그리드 자리에 안착
- 카드 그리드를 반응형 4열(데스크톱)/2열(태블릿)/1열(모바일) 고정 배열로 변경, 폼 너비를 페이지 공통 max-width(1080px)로 확장
- `SignUp`/`Login`에 `signUp.module.scss`/`Login.module.scss` 신규 작성 — Recommend와 동일한 디자인 시스템(세리프 타이틀, 아이보리 카드 폼) 적용, `<iabel>` 오타 → `<label>` 수정, 로딩 중 버튼 비활성화 처리
- `.gitignore` 정비 — 기본 Vite 템플릿 항목(로그, 에디터 디렉토리 등) 추가, 중복·오타(`.env.`)였던 환경변수 항목 정리

### 남은 이슈 / 다음 할 일
- [ ] Cloud Functions에 `/recommend` 엔드포인트가 아직 없음 (이어짐, 미해결)
- [ ] `ProtectedRoute`가 라우터에 아직 적용되지 않음 (이어짐, 미해결)
- [ ] `firestore.rules`에 `recommendations` 컬렉션 규칙이 없음 — `saveRecommendation`/`getRecommendations`/`deleteRecommendation` 호출 시 permission-denied 예상 (신규 발견, 감사 중 작업이 중단되어 미적용 상태)
- [ ] `MyPage.jsx`는 아직 디자인 톤 미적용
- [ ] `Recommend` 결과는 현재 로컬 샘플 데이터(`sampleRe`)이며 Firestore/API에 실제로 저장되지 않음

## 2026-08-03

### 프로젝트 개요
AI 개인 맞춤 미디어 큐레이션 서비스. 사용자가 취향/기분을 입력하면 AI가 영화·드라마·음악을 추천.
스택: React + Vite / Firebase(Auth, Firestore, Functions, Hosting) / OpenAI API.

### 오늘 진행한 일

**1. 초기 상태 점검**
- 페이지/컴포넌트 스캐폴딩 확인: `Home`, `Login`, `SignUp`, `Recommend`, `MyPage`, `NotFound` + `Header`, `Footer`, `Loading`, `SearchForm`, `RecommendationCard/List`
- Firebase 연동 모듈(`firebase.js`, `auth.js`, `firestore.js`), `ProtectedRoute`, Cloud Functions(OpenAI 연동) 구조 확인
- Firestore 규칙: 로그인한 본인만 `users/{userId}` read/write 가능하도록 설정되어 있음을 확인

**2. 오늘 고친 버그**
- `Router.jsx`: `<Routes>`가 비어 있어 화면이 헤더만 뜨던 문제 → 6개 페이지 라우트 연결 완료, `Signup`→`SignUp` 컴포넌트명 오타 수정
- `main.jsx`: `import'./styles/reset/scss'` 경로 오타 및 `ReactDOM.createRoot`(미import) 참조 에러 수정, `styles/reset.scss` · `styles/global.scss` 신규 작성
- `Home.jsx`: `Style` import 누락으로 인한 `ReferenceError` 크래시 → `Home.module.scss` 생성 후 연결
- `Header.jsx`: `Header.module.scss` 누락 파일 생성
- `.env`: Firebase 프로젝트(`miq01-e12df`) 설정값을 채워 넣어 `auth/invalid-api-key`로 인한 흰 화면(앱 마운트 실패) 문제 해결
- `Home.jsx`: `sampleData`의 `descripthion` 오타 → `description` 수정 (인기 콘텐츠 카드 설명이 안 보이던 문제)
- 매 수정마다 `vite build` + 헤드리스 브라우저로 콘솔 에러/렌더링 결과 확인하며 진행

**3. 디자인 작업 (Header / Home / Footer)**
- `global.scss`에 CSS 변수(`--color-*`, `--font-serif`)를 정의해 세 컴포넌트가 공유하도록 구성
- 1차: 인디고/퍼플 톤의 모던 SaaS 스타일 (sticky 헤더, 히어로 CTA, 카드 그리드)
- 2차: 무드보드 레퍼런스(Pantone — Sceptre Red, Cerulean Blue, Transparent Yellow, Java Brown, Potting Soil) 기반으로 리디자인
  - 헤더/푸터: Java Brown 다크 배경 + 크림 텍스트, 활성 메뉴는 Cerulean Blue
  - 히어로: Transparent Yellow 배경 + 세리프 타이틀 + Sceptre Red CTA 버튼
  - 특징 카드: 왼쪽 Sceptre Red 컬러 바 강조
  - 인기 콘텐츠 카드: 카테고리별 색상 스와치(영화=레드, 음악=블루, 도서=브라운)로 Pantone 카드 레이아웃을 오마주

### 남은 이슈 / 다음 할 일
- [ ] Cloud Functions에 `/recommend` 엔드포인트가 없음 — `recommendationApi.js`가 호출하는 엔드포인트가 백엔드에 없어서 실제 추천 실행 시 404 예상 (미해결)
- [ ] `ProtectedRoute`가 라우터에 아직 적용되지 않음 — `Recommend`/`MyPage`를 로그인 필수로 감쌀지 결정 필요
- [ ] 로그인/회원가입 폼 에러 핸들링 없음 (`signIn`/`signUp` 실패 시 화면에 피드백 없음)
- [ ] `Login`/`SignUp`/`Recommend`/`MyPage`는 아직 오늘 디자인 톤 미적용 (Header/Home/Footer만 작업함)
