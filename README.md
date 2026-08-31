# 퇴근시간 계산기

출근 시간을 입력하면 퇴근 시간을 자동으로 계산해주는 무료 웹 애플리케이션입니다.

🌐 **라이브 사이트**: [https://jeong-hyun-lee.github.io/](https://jeong-hyun-lee.github.io/)

## ✨ 주요 기능

- ⏰ **출근 시간 입력**: 간편한 시간 입력 인터페이스
- 📊 **자동 퇴근 시간 계산**: 출근 시간을 입력하면 퇴근 시간을 자동으로 계산
- 🕐 **하프데이 옵션**: 4시간/8시간 근무 선택 가능
- ⏳ **실시간 카운트다운**: 퇴근까지 남은 시간을 실시간으로 표시
- 🔔 **알림 기능**: 정시 알림으로 퇴근 시간을 놓치지 않도록 도와줍니다
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 사용 가능
- 💾 **로컬 스토리지**: 출근 시간과 설정이 자동으로 저장됩니다
- 🧩 **위젯 허브**: 로또 번호 생성기, 오늘의 한마디, 점심 메뉴 룰렛, 사다리타기, 연봉 실수령액 계산기

## 🚀 시작하기

### 필수 요구사항

- Node.js 20.19.0 이상 또는 22.12.0 이상
- npm 또는 yarn

### 설치

```sh
npm install
```

### 개발 서버 실행

```sh
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

### 프로덕션 빌드

```sh
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 빌드 미리보기

```sh
npm run preview
```

## 🛠️ 기술 스택

- **Vue 3** - 프론트엔드 프레임워크
- **Vite** - 빌드 도구
- **VueUse** - 유틸리티 함수 모음
- **Day.js** - 날짜/시간 처리
- **Service Worker** - 오프라인 지원 및 알림

## 📁 프로젝트 구조

```
time-calc/
├── public/              # 정적 파일
│   ├── favicon.ico
│   ├── og-image.png    # SEO 이미지
│   └── robots.txt
├── src/
│   ├── assets/          # 이미지, CSS 파일
│   ├── components/      # Vue 컴포넌트
│   │   ├── AppHeader.vue
│   │   ├── TimeInput.vue
│   │   ├── TimeInfoCards.vue
│   │   ├── CountdownDisplay.vue
│   │   ├── TimeCalculator.vue
│   │   ├── WidgetHeader.vue
│   │   └── widgets/       # 위젯 허브
│   │       ├── LottoWidget.vue
│   │       ├── QuoteWidget.vue
│   │       ├── LunchRouletteWidget.vue
│   │       ├── LadderWidget.vue
│   │       └── SalaryCalculatorWidget.vue
│   ├── composables/     # 재사용 가능한 로직
│   │   ├── useTimeCalculation.js
│   │   ├── useNotification.js
│   │   ├── useSEO.js
│   │   ├── useLotto.js
│   │   ├── useQuote.js
│   │   ├── useLunchRoulette.js
│   │   ├── useLadder.js
│   │   └── useSalaryCalculator.js
│   ├── data/             # 위젯 정적 데이터
│   │   ├── quotes.json
│   │   └── lunchMenus.json
│   └── main.js
├── index.html
└── vite.config.js
```

## 📦 배포

이 프로젝트는 [Cloudflare Pages](https://pages.cloudflare.com/) 무료 티어로 배포합니다.

### 최초 설정

1. [Cloudflare 대시보드](https://dash.cloudflare.com/) → Workers & Pages → Create → Pages → Connect to Git
2. 이 GitHub 저장소 선택
3. 빌드 설정:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Save and Deploy

### 이후 배포

`main` 브랜치에 push할 때마다 Cloudflare Pages가 자동으로 빌드 및 배포합니다. 배포 상태는 Cloudflare 대시보드의 Pages 프로젝트에서 확인할 수 있습니다.

서버리스 함수(Pages Functions)나 환경변수는 현재 사용하지 않습니다 — 모든 기능이 클라이언트에서만 동작하는 정적 사이트입니다.

## 🔧 개발 환경 설정

### 권장 IDE

- [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur 비활성화)

### 권장 브라우저 확장 프로그램

- **Chromium 기반 브라우저** (Chrome, Edge, Brave 등):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Chrome DevTools에서 Custom Object Formatter 활성화](http://bit.ly/object-formatters)
- **Firefox**:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Firefox DevTools에서 Custom Object Formatter 활성화](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 🤝 기여

버그 리포트나 기능 제안은 이슈를 통해 제출해주세요.

---

Made with ❤️ using Vue 3 + Vite
