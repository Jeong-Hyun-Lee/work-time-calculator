---
type: architecture
updated: 2026-09-09
---

# Architecture

## Components (`src/components/`)
- `AppHeader.vue`
- `CountdownDisplay.vue`
- `StatTile.vue`
- `TimeInput.vue`
- `icons/` — ClockIcon, IconCommunity, IconDocumentation, IconEcosystem, IconSupport, IconTooling

## Composables (`src/composables/`)
- `useNotification.js`
- `useSEO.js`
- `useTimeCalculation.js`

## Widget Hub (신규)
- `src/components/WidgetHeader.vue` — widget card header (icon + title)
- `src/components/widgets/LottoWidget.vue`
- `src/components/widgets/QuoteWidget.vue`
- `src/components/widgets/LunchRouletteWidget.vue`
- `src/components/widgets/HoesikRouletteWidget.vue` — 한국 로케일 전용(`isKoreaOnlyLocale`)
- `src/components/widgets/LadderWidget.vue`
- `src/components/widgets/SalaryCalculatorWidget.vue`
- `src/composables/useLotto.js` — 클릭당 5줄 생성
- `src/composables/useQuote.js`
- `src/composables/useLunchRoulette.js`
- `src/composables/useHoesikRoulette.js`
- `src/composables/useLadder.js`
- `src/composables/useSalaryCalculator.js`
- `src/data/quotes.json`
- `src/data/lunchMenus.json`
- `src/data/hoesikMenus.json` — 로케일 키 없는 단일 배열(한국 전용이라 분기 불필요)

타일 폭은 로케일과 무관하게 12칸이 채워지도록 짜여 있음: 한국 전용인 회식 룰렛(4칸)과 연봉 계산기(8칸)가 합쳐 12칸이라, 둘이 함께 사라지는 다른 로케일에서는 사다리타기가 위 줄로 올라와 빈 칸이 생기지 않음. `App.vue`의 `.tile:nth-child(n + 11)` 규칙은 타일이 늘어나도 등장 애니메이션 지연이 0으로 떨어지지 않게 받아주는 장치.

## PWA / Service Worker
`vite-plugin-pwa`(generateSW, `registerType: 'autoUpdate'`)가 담당. 설정은 `vite.config.js` 한 곳.

- **manifest** — 플러그인이 설정에서 생성하고 `index.html`에 링크까지 주입. 수동 `public/manifest.webmanifest`는 없음
- **Service Worker** — Workbox가 `dist/sw.js` 생성, `registerSW.js`로 자동 등록. 앱 코드에서 수동 `navigator.serviceWorker.register`를 하지 않음
- **알림 처리** — 액션 버튼 클릭은 SW에서만 받을 수 있어 `public/notification-sw.js`를 `workbox.importScripts`로 생성된 SW에 합침. 예전 `public/service-worker.js`(수동 작성)는 제거됨
- **캐싱** — 앱 셸 프리캐시(og-image.png는 소셜 카드 전용이라 `globIgnores`로 제외) + Google Fonts 런타임 캐시(stylesheet SWR, 폰트 파일 CacheFirst)
- **아이콘** — `public/icon-512.png`(any + maskable), `public/apple-touch-icon.png`. `favicon.svg` 도안을 그라디언트 배경에 얹은 것이며, 알림 아이콘도 같은 `/icon-512.png`를 씀

설치(PWA)해야 Windows 토스트 헤더가 origin 대신 앱 이름·아이콘으로 표시됨. 미설치 브라우저에서는 origin 표시가 그대로이고, 이는 스푸핑 방지 때문에 사이트가 바꿀 수 없는 부분.

알림 자체는 여전히 페이지가 열려 있어야 발신됨(`App.vue`의 매초 `setInterval` 검사). 탭을 닫아도 오는 알림은 서버 + Web Push가 필요하며 미구현.

## Entry
- `src/App.vue` — 전체 앱 상태 소유 + bento grid 렌더링
- `src/main.js` — `initAnalytics()` 호출 후 `createApp(App).mount('#app')`
- `src/analytics.js` — GA4 gtag.js 초기화. `GA_MEASUREMENT_ID` 상수가 비어있거나 `import.meta.env.PROD`가 false면 no-op

## Note
README.md's "프로젝트 구조" section is stale in both directions as of 2026-09-01: it still lists `ThemeSelector.vue`/`useTheme.js` and a 7-테마 기능(테마 시스템은 `redesign/mono-ui`에서 완전히 제거됨), and it's missing every 위젯 허브 파일(`WidgetHeader.vue`, `components/widgets/*`, 관련 composables, `data/*.json`). 이 문서(`architecture.md`)는 위 목록대로 실제 `src/` 트리와 일치하는 상태이며, README.md 쪽 정리는 별도 후속 작업으로 남아 있음.

`src/composables/useSEO.js`는 어느 컴포넌트도 import하지 않는 미사용 코드이며, 내부 description에 이미 제거된 "다양한 테마" 문구가 남아 있음 — 정리는 후속 작업.

See [[overview]] for features and stack.

Source: `src/**/*.{vue,js}` file listing (재확인 2026-09-01).
