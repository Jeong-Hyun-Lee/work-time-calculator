---
type: architecture
updated: 2026-09-01
---

# Architecture

## Components (`src/components/`)
- `AppHeader.vue`
- `CountdownDisplay.vue`
- `ElectricEffects.vue`
- `GokuSilhouette.vue`
- `ThemeSelector.vue`
- `TimeCalculator.vue`
- `TimeInfoCards.vue`
- `TimeInput.vue`
- `icons/` — ClockIcon, IconCommunity, IconDocumentation, IconEcosystem, IconSupport, IconTooling

## Composables (`src/composables/`)
- `useNotification.js`
- `useSEO.js`
- `useTheme.js`
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
README.md's "프로젝트 구조" section lists an older component set (missing `TimeCalculator.vue`, `ElectricEffects.vue`, `GokuSilhouette.vue`, `icons/`) — drift between that doc and the actual `src/` tree as of 2026-08-31.

See [[overview]] for features and stack.

Source: `src/**/*.{vue,js}` file listing (read 2026-08-31).
