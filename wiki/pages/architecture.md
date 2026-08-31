---
type: architecture
updated: 2026-09-01
---

# Architecture

## Components (`src/components/`)
- `AppHeader.vue`
- `CountdownDisplay.vue`
- `TimeCalculator.vue`
- `TimeInfoCards.vue`
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
- `src/components/widgets/LadderWidget.vue`
- `src/components/widgets/SalaryCalculatorWidget.vue`
- `src/composables/useLotto.js`
- `src/composables/useQuote.js`
- `src/composables/useLunchRoulette.js`
- `src/composables/useLadder.js`
- `src/composables/useSalaryCalculator.js`
- `src/data/quotes.json`
- `src/data/lunchMenus.json`

## Entry
- `src/App.vue`, `src/main.js`

## Note
README.md's "프로젝트 구조" section is stale in both directions as of 2026-09-01: it still lists `ThemeSelector.vue`/`useTheme.js` and a 7-테마 기능(테마 시스템은 `redesign/mono-ui`에서 완전히 제거됨), and it's missing every 위젯 허브 파일(`WidgetHeader.vue`, `components/widgets/*`, 관련 composables, `data/*.json`). 이 문서(`architecture.md`)는 위 목록대로 실제 `src/` 트리와 일치하는 상태이며, README.md 쪽 정리는 별도 후속 작업으로 남아 있음.

See [[overview]] for features and stack.

Source: `src/**/*.{vue,js}` file listing (재확인 2026-09-01).
