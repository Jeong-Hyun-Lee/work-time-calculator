# 퇴근시간 계산기 — 무채색 UI 리디자인 설계

- 날짜: 2026-08-31
- 브랜치: `redesign/mono-ui`
- 상태: 승인됨 (사용자 확인 완료)

## 배경

기존 UI는 7종 그라데이션 테마(기본/다크/오션/포레스트/선셋/베지트/브로리)와 드래곤볼 이펙트(GokuSilhouette, ElectricEffects, 에너지파 progress bar)로 구성된 화려한 스타일. 사용자가 shadcn/ui 기반 "clinical blueprint on frosted paper" 스타일 레퍼런스를 제시하며 전체 디자인을 단일 라이트 무채색 톤으로 교체 요청. 테마 전환 기능 자체를 제거하기로 확정.

## 목표

- 스타일 레퍼런스의 컬러/타이포/spacing/radius/shadow 토큰을 프로젝트에 이식
- 기존 다중 테마 시스템(로직 + 관련 컴포넌트/이펙트/에셋)을 완전히 제거하고 단일 라이트 디자인으로 교체
- 시간 계산/알림/로컬스토리지 등 비주얼과 무관한 로직은 무변경

## 비목표

- 기능 추가/변경 없음 (계산 로직, 알림, PWA 서비스워커 동작 그대로)
- `useTimeCalculation.js`, `useNotification.js`, `useSEO.js` 무변경
- 기존부터 있던 미사용 아이콘 컴포넌트(IconCommunity/IconDocumentation/IconEcosystem/IconSupport/IconTooling) 삭제하지 않음 — 이번 작업과 무관한 기존 dead code

## 사용자 확정 사항

1. 테마 기능은 모두 제거하고 전체 테마를 새 디자인으로 교체 (7종 테마, ThemeSelector, 관련 이펙트/에셋 전부 삭제)
2. 카운트다운 경고/긴급/야근초과 상태는 완전 무채색 — ember(#e7000b)는 절대 사용하지 않고 라벨 텍스트로만 상태 구분
3. Google Fonts Inter(400/500/600) 웹폰트 추가 로드

## 디자인 토큰

`src/assets/base.css`의 `:root`를 아래 값으로 교체 (Vue 기본 스캐폴드 팔레트 `--vt-c-*` 및 다크모드 `@media (prefers-color-scheme: dark)` 블록 삭제):

| 토큰 | 값 | 역할 |
|---|---|---|
| `--color-canvas` | `#f5f5f5` | 페이지 배경 |
| `--color-paper` | `#ffffff` | 카드(최상위 컨테이너) 배경 |
| `--color-surface-alt` | `#fafafa` | 중첩 카드(TimeInfoCards) 배경 |
| `--color-ink` | `#0a0a0a` | 본문/헤딩 텍스트 |
| `--color-ink-soft` | `#171717` | 다크 강조 카드(퇴근시간, 카운트다운) 배경 |
| `--color-mid-gray` | `#737373` | 보조 텍스트, 라벨 |
| `--color-hairline` | `#e5e5e5` | 보더, 인풋 아웃라인 |
| `--color-ember` | `#e7000b` | 미사용 (destructive 전용, 이번 스코프에 destructive UI 없음) |

타이포 스케일(px): caption 12 / body 14 / body-lg 16 / subheading 18 / heading-sm 24 / heading 30 / heading-lg 36 / display 48. Radius: cards 24px, inputs/buttons/badges 18px, nested 10px, small 6px. Spacing 4px 배수(4/8/12/16/20/24/48).

`index.html`에 Google Fonts Inter link 추가, `theme-color`/`msapplication-TileColor` meta를 `#667eea` → `#0a0a0a`로 변경.

## 삭제 파일

- `src/composables/useTheme.js`
- `src/components/ThemeSelector.vue`
- `src/components/ElectricEffects.vue`
- `src/components/GokuSilhouette.vue`
- `src/assets/brory.png`, `src/assets/brory.webp`
- `src/assets/vegito.jpg`, `src/assets/vegito.webp`

## 컴포넌트별 변경

### AppHeader.vue
- `ThemeSelector` import/사용 제거 → header-top의 우측 컨트롤 없어짐, 아이콘+타이틀 중앙 정렬 레이아웃으로 단순화
- `.icon-wrapper` 그라데이션 배경/pulse 애니메이션 제거, ClockIcon을 ink 색 단독 아이콘으로 (배경 박스 없음, 32~40px)
- `h1` 그라데이션 text-clip 제거, `--text-heading-lg`(36px/600) ink 단색, letter-spacing 토큰 적용
- `.subtitle` mid-gray, body 사이즈 유지

### TimeCalculator.vue
- `isVegitoTheme`/`isBrolyTheme` computed 및 관련 템플릿 분기(`ElectricEffects`, aura-field, dim-overlay, `broly-theme-bg`/`vegito-theme-bg` 클래스) 전부 제거
- `useTheme` import 제거
- `.time-calculator` 배경을 `--color-canvas` 단색으로, `.background-animation` 블롭 애니메이션 제거
- `.container` → Card 토큰: `--color-paper` bg, radius 24px, `1px solid --color-hairline`, 스펙 그림자(`0 0 0 1px rgba(23,23,23,.05), 0 1px 3px rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)`), padding `--spacing-20`(반응형 축소 유지)
- `backdrop-filter: blur(...)` 제거 (토큰에 없음)

### TimeInput.vue
- `input[type=time]`: resting bg `--color-canvas`, border 없음(포커스 시 `1px solid --color-hairline`), radius 18px, padding `8px 10px`, font-size body(14px)~body-lg(16px)
- 컬러 글로우 박스섀도우/`translateY` 리프트 제거
- 하프데이 체크박스 `accent-color`를 `--color-ink`로, hover 텍스트 컬러를 theme-primary 대신 ink로

### TimeInfoCards.vue
- 카드 3개: `--color-surface-alt`(#fafafa) bg, radius `--radius-nested`(10px), `1px solid --color-hairline`(선택적) — 바깥 Paper 카드 안에서 톤 차등을 위해 캔버스/페이퍼보다 한 단계 다른 표면 사용
- 상단 그라데이션 바(`::before` scaleX), 이모지(🌅⏰🌇) bounce 애니메이션, hover 컬러 글로우 제거
- 라벨: caption(12px uppercase mid-gray), 값: heading-sm~heading(24~30px/600 ink) — Stat Block 패턴
- "퇴근 시간" 카드(`highlight-card`)만 `--color-ink-soft` 배경 + `--color-paper` 텍스트로 반전 강조 (스펙의 유일한 크로매틱 인터랙션인 다크 인버전을 재사용)

### CountdownDisplay.vue
- `isVegitoTheme`/`isBrolyTheme`, 에너지파 progress bar(goku-silhouette, energy-wave-bar, particles), 라이트닝/에너지 스트릭 배경, 관련 keyframes 전부 제거
- `.countdown` → `--color-ink-soft` bg, `--color-paper` 텍스트, radius 24px, 그림자 없음(다크 필 자체로 카드와 구분되므로 별도 elevation 불필요)
- `.number` → display 사이즈(48px) tabular-nums, `.unit`/`.countdown-label` → caption 톤
- `warning`/`urgent` 클래스와 색상 그라데이션·박스섀도우 애니메이션 전부 제거. 남은 시간 임박 여부는 색상으로 구분하지 않음 — 정상/경고/긴급 상태가 시각적으로 동일하게 표시되고 숫자 값만으로 구분됨(사용자가 명시적으로 선택한 완전 무채색 방향). 야근 경과(overdue) 시에는 기존대로 `countdown-label` 텍스트가 "야근 시간 경과"로 바뀌는 것만 유지
- `.copy-btn` → Outline 버튼 토큰(투명 배경, `1px solid --color-hairline`, ink 텍스트, radius 18px)

## 검증 계획

- `npm run dev`로 로컬 구동 후 브라우저에서 육안 확인: 배경/카드/인풋/카운트다운 톤, 반응형 768px/480px 브레이크포인트
- 하프데이 체크박스, 시간 입력, 카운트다운 갱신, 클립보드 복사 등 기존 기능 회귀 없는지 수동 확인
- `npm run build` 성공 확인 (에셋 삭제로 인한 미해결 import 없는지)
- 삭제 대상 파일에 대한 잔여 참조가 없는지 grep으로 확인 후 진행
