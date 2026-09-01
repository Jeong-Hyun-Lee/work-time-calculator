# 무채색 UI 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** work-time-calculator(퇴근시간 계산기)의 UI를 기존 7종 그라데이션/드래곤볼 테마 시스템에서 단일 라이트 무채색(shadcn 스타일) 디자인으로 완전히 교체한다.

**Architecture:** Vue 3 + Vite SPA. 순수 CSS 커스텀 프로퍼티 토큰 교체 + 컴포넌트별 템플릿/스타일 리라이트. 상태/로직(시간 계산, 알림, localStorage)은 무변경. 빌드 도구/의존성 추가 없음(Tailwind, 컴포넌트 라이브러리 도입하지 않고 기존 scoped `<style>` 방식 유지).

**Tech Stack:** Vue 3 `<script setup>`, Vite, 순수 CSS(커스텀 프로퍼티), VueUse(`useStorage`, `useWebNotification`) — 무변경.

## Global Constraints

- 계산 로직/알림/로컬스토리지 키 무변경 (`useTimeCalculation.js`, `useNotification.js`, `useSEO.js` 손대지 않음)
- 테마 전환 기능(다중 테마, ThemeSelector) 완전 제거 — 되살리지 않음
- 카운트다운 경고/긴급 상태에 색상 구분 넣지 않음 (ember `#e7000b`는 이 스코프에서 사용하지 않음)
- 기존부터 있던 미사용 아이콘 컴포넌트(`IconCommunity` 등)는 이번 작업과 무관하므로 삭제하지 않음
- **이 프로젝트에는 테스트 러너가 없다** (package.json에 test 스크립트 없음, Vitest/Playwright 미설치). 아래 각 태스크의 "검증" 단계는 자동화 테스트 대신 `npm run build` 통과 + `grep`을 통한 잔여 참조 확인 + 브라우저 육안 확인으로 대체한다. 이 계획에서 "테스트"라는 표현이 나오면 이 검증 방식을 의미한다.
- 모든 파일 경로는 프로젝트 루트(`c:\Users\krinjosl\Desktop\workspace\work-time-calculator`) 기준 상대 경로

---

## Task 1: 디자인 토큰 — base.css / index.html / App.vue

**Files:**
- Modify: `src/assets/base.css` (전체 교체)
- Modify: `index.html:1-6` (Google Fonts 링크 추가)
- Modify: `index.html:44-46` (theme-color meta)
- Modify: `src/App.vue:16-19` (`body { font-family }` 규칙 제거)

**Interfaces:**
- Produces: 이후 모든 태스크가 사용할 CSS 커스텀 프로퍼티 — `--color-canvas`, `--color-paper`, `--color-surface-alt`, `--color-ink`, `--color-ink-soft`, `--color-mid-gray`, `--color-hairline`, `--color-ember`, `--font-sans`, `--text-caption`, `--text-body`, `--text-body-lg`, `--text-subheading`, `--text-heading-sm`, `--text-heading`, `--text-heading-lg`, `--text-display`, `--radius-small`, `--radius-nested`, `--radius-control`, `--radius-card`, `--spacing-4`, `--spacing-8`, `--spacing-12`, `--spacing-16`, `--spacing-20`, `--spacing-24`, `--spacing-48`, `--shadow-card`

- [ ] **Step 1: `src/assets/base.css` 전체를 아래 내용으로 교체**

```css
:root {
	--color-canvas: #f5f5f5;
	--color-paper: #ffffff;
	--color-surface-alt: #fafafa;
	--color-ink: #0a0a0a;
	--color-ink-soft: #171717;
	--color-mid-gray: #737373;
	--color-hairline: #e5e5e5;
	--color-ember: #e7000b;

	--font-sans:
		'Inter',
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		Oxygen,
		Ubuntu,
		Cantarell,
		'Fira Sans',
		'Droid Sans',
		'Helvetica Neue',
		sans-serif;

	--text-caption: 12px;
	--text-body: 14px;
	--text-body-lg: 16px;
	--text-subheading: 18px;
	--text-heading-sm: 24px;
	--text-heading: 30px;
	--text-heading-lg: 36px;
	--text-display: 48px;

	--radius-small: 6px;
	--radius-nested: 10px;
	--radius-control: 18px;
	--radius-card: 24px;

	--spacing-4: 4px;
	--spacing-8: 8px;
	--spacing-12: 12px;
	--spacing-16: 16px;
	--spacing-20: 20px;
	--spacing-24: 24px;
	--spacing-48: 48px;

	--shadow-card:
		0 0 0 1px rgba(23, 23, 23, 0.05),
		0 1px 3px rgba(0, 0, 0, 0.1),
		0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

*,
*::before,
*::after {
	box-sizing: border-box;
	margin: 0;
	font-weight: normal;
}

body {
	min-height: 100vh;
	color: var(--color-ink);
	background: var(--color-canvas);
	line-height: 1.6;
	font-family: var(--font-sans);
	font-size: var(--text-body);
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 2: `index.html`의 `<meta name="viewport" .../>` 바로 다음 줄에 Google Fonts 링크 삽입**

`index.html:5` (`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`) 다음 줄에 추가:

```html
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
			<link
				href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
				rel="stylesheet"
			/>
```

- [ ] **Step 3: `index.html`의 theme-color meta 값 변경**

`index.html:45-46`을 찾아서:

```html
			<meta name="theme-color" content="#667eea" />
			<meta name="msapplication-TileColor" content="#667eea" />
```

다음으로 교체:

```html
			<meta name="theme-color" content="#0a0a0a" />
			<meta name="msapplication-TileColor" content="#0a0a0a" />
```

- [ ] **Step 4: `src/App.vue`의 충돌하는 `body { font-family }` 규칙 제거**

`src/App.vue` 전체를 아래로 교체 (Step 1에서 정의한 `--font-sans` 토큰이 실제로 적용되도록 `body` 셀렉터의 하드코딩된 font-family만 제거, `*` 리셋은 유지):

```vue
<script setup>
import TimeCalculator from './components/TimeCalculator.vue'
</script>

<template>
	<TimeCalculator />
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
</style>
```

- [ ] **Step 5: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공 (`dist/` 생성)

브라우저에서 `npm run dev` 실행 후 개발자도구 Network 탭에서 `fonts.googleapis.com` 요청이 200으로 로드되는지, 페이지 배경이 `#f5f5f5`(연한 회색)으로 바뀌었는지 육안 확인.

- [ ] **Step 6: 커밋**

```bash
git add src/assets/base.css index.html src/App.vue
git commit -m "style: 디자인 토큰 교체 및 Inter 웹폰트 적용"
```

---

## Task 2: TimeCalculator.vue — 테마 시스템 제거 + 컨테이너 리스타일

**Files:**
- Modify: `src/components/TimeCalculator.vue` (전체 교체)
- Delete: `src/components/ElectricEffects.vue`
- Delete: `src/assets/vegito.jpg`
- Delete: `src/assets/brory.png`

**Interfaces:**
- Consumes: Task 1의 `--color-canvas`, `--color-paper`, `--color-hairline`, `--radius-card`, `--spacing-16/20`, `--shadow-card`
- Produces: `.time-calculator`, `.container` 클래스 (다른 태스크가 의존하지 않음, leaf 스타일)

- [ ] **Step 1: `src/components/TimeCalculator.vue` 전체를 아래로 교체**

```vue
<template>
	<div class="time-calculator">
		<div class="container">
			<AppHeader />

			<TimeInput
				v-model="startTime"
				v-model:isHalfDay="isHalfDay"
				@change="handleStartTimeChange"
			/>

			<TimeInfoCards
				:start-time="formattedStartTime"
				:current-time="formattedCurrentTime"
				:end-time="formattedEndTime"
			/>

			<CountdownDisplay
				:diff-in-seconds="diffInSeconds"
				:hours="hours"
				:minutes="minutes"
				:remaining-seconds="remainingSeconds"
				:overdue-hours="overdueHours"
				:overdue-mins="overdueMins"
				:overdue-secs="overdueSecs"
				:is-half-day="isHalfDay"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './AppHeader.vue'
import TimeInput from './TimeInput.vue'
import TimeInfoCards from './TimeInfoCards.vue'
import CountdownDisplay from './CountdownDisplay.vue'
import { useTimeCalculation } from '../composables/useTimeCalculation'
import {
	registerServiceWorker,
	useHourlyNotification,
} from '../composables/useNotification'
import { useWebNotification } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

const startTime = useStorage('startTime', '09:55')
const isHalfDay = useStorage('isHalfDay', false)

const {
	diffInSeconds,
	formattedStartTime,
	formattedCurrentTime,
	formattedEndTime,
	hours,
	minutes,
	remainingSeconds,
	overdueHours,
	overdueMins,
	overdueSecs,
	calculateTime,
} = useTimeCalculation(startTime, isHalfDay)

const { checkHourlyNotification, resetNotifiedHours } = useHourlyNotification(
	hours,
	minutes,
	remainingSeconds,
	diffInSeconds,
)

// useWebNotification을 사용하여 권한 확인
const notification = useWebNotification({
	title: '퇴근시간 계산기',
	body: '',
})

let intervalId = null

// 출근 시간 변경 핸들러
const handleStartTimeChange = () => {
	// 출근 시간이 변경되면 알림 추적 초기화
	resetNotifiedHours()
	calculateTime()
}

// 시간 계산 및 알림 체크를 함께 수행
const calculateTimeWithNotification = () => {
	calculateTime()
	checkHourlyNotification()
}

onMounted(async () => {
	// Service Worker 등록
	await registerServiceWorker()

	// useWebNotification을 사용하여 권한 요청
	if (notification.isSupported.value && !notification.permissionGranted.value) {
		if ('Notification' in window && Notification.permission === 'default') {
			await Notification.requestPermission()
		}
	}

	calculateTimeWithNotification()
	intervalId = setInterval(() => {
		calculateTimeWithNotification()
	}, 1000)
})

onUnmounted(() => {
	if (intervalId) {
		clearInterval(intervalId)
	}
})
</script>

<style scoped>
.time-calculator {
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--color-canvas);
	padding: var(--spacing-16);
	overflow: hidden;
}

.container {
	overflow: auto;
	background: var(--color-paper);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-card);
	padding: var(--spacing-20);
	box-shadow: var(--shadow-card);
	max-width: 1000px;
	width: calc(100% - 2rem);
	height: calc(100vh - 2rem);
	max-height: calc(100vh - 2rem);
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

::-webkit-scrollbar {
	width: 0;
}

@media (max-width: 768px) {
	.time-calculator {
		padding: var(--spacing-16);
	}

	.container {
		padding: var(--spacing-20);
		width: calc(100% - 2rem);
		height: calc(100vh - 2rem);
		max-height: calc(100vh - 2rem);
	}
}

@media (max-width: 480px) {
	.time-calculator {
		padding: var(--spacing-12);
	}

	.container {
		padding: var(--spacing-16);
		border-radius: 20px;
		width: calc(100% - 1.5rem);
		height: calc(100vh - 1.5rem);
		max-height: calc(100vh - 1.5rem);
	}
}
</style>
```

이 교체로 `useTheme`, `ElectricEffects`, `isVegitoTheme`/`isBrolyTheme`, `background-animation`, `broly-aura-field`, dim-overlay 등 테마 전용 마크업/로직이 모두 제거된다. `ref` import는 원본에서도 실제로는 사용되지 않던 기존 dead import이므로(이번 변경과 무관) 그대로 둔다.

- [ ] **Step 2: 이제 참조가 사라진 ElectricEffects.vue 삭제**

```bash
git rm src/components/ElectricEffects.vue
```

- [ ] **Step 3: 이제 참조가 사라진 배경 이미지 에셋 삭제**

```bash
git rm src/assets/vegito.jpg src/assets/brory.png
```

- [ ] **Step 4: 검증**

Run: `grep -rn "ElectricEffects\|useTheme\|isVegitoTheme\|isBrolyTheme\|vegito.jpg\|brory.png" src/`
Expected: `src/components/TimeCalculator.vue`에서 매치 없음 (CountdownDisplay.vue, ThemeSelector.vue 등 아직 손대지 않은 파일에서는 매치가 남아있는 게 정상 — 각자의 태스크에서 제거됨)

Run: `npm run build`
Expected: 에러 없이 빌드 성공

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "refactor: TimeCalculator 테마 시스템 제거 및 카드 스타일 적용"
```

---

## Task 3: AppHeader.vue — ThemeSelector 제거 + 헤더 리스타일

**Files:**
- Modify: `src/components/AppHeader.vue` (전체 교체)
- Delete: `src/components/ThemeSelector.vue`
- Delete: `src/composables/useTheme.js`
- Delete: `src/components/GokuSilhouette.vue`

**Interfaces:**
- Consumes: Task 1의 `--color-ink`, `--color-mid-gray`, `--text-heading-lg`, `--text-heading`, `--text-body`, `--spacing-4/12/24`
- Produces: 없음 (leaf 컴포넌트)

- [ ] **Step 1: `src/components/AppHeader.vue` 전체를 아래로 교체**

```vue
<template>
	<div class="header">
		<div class="icon-wrapper">
			<ClockIcon />
		</div>
		<h1>퇴근시간 계산기</h1>
		<p class="subtitle">출근 시간을 입력하면 퇴근 시간을 자동으로 계산합니다</p>
	</div>
</template>

<script setup>
import ClockIcon from './icons/ClockIcon.vue'
</script>

<style scoped>
.header {
	text-align: center;
	margin-bottom: var(--spacing-24);
	flex-shrink: 0;
}

.icon-wrapper {
	width: 40px;
	height: 40px;
	margin: 0 auto var(--spacing-12);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color-ink);
}

.icon-wrapper svg {
	width: 32px;
	height: 32px;
}

h1 {
	color: var(--color-ink);
	margin-bottom: var(--spacing-4);
	font-size: var(--text-heading-lg);
	font-weight: 600;
	letter-spacing: -0.025em;
}

.subtitle {
	color: var(--color-mid-gray);
	font-size: var(--text-body);
	font-weight: 400;
	margin: 0;
}

@media (max-width: 480px) {
	h1 {
		font-size: var(--text-heading);
	}
}
</style>
```

- [ ] **Step 2: 참조가 사라진 테마 관련 파일 삭제**

```bash
git rm src/components/ThemeSelector.vue src/composables/useTheme.js src/components/GokuSilhouette.vue
```

`GokuSilhouette.vue`는 어느 컴포넌트에서도 import되지 않고 있던 파일이지만(사전 확인 완료), 드래곤볼 테마 전용으로 만들어진 컴포넌트이며 사용자가 승인한 설계 문서(`docs/superpowers/specs/2026-08-31-mono-ui-redesign-design.md`)의 삭제 목록에 포함되어 있어 함께 제거한다.

- [ ] **Step 3: 검증**

Run: `grep -rln "ThemeSelector\|useTheme\|GokuSilhouette" src/`
Expected: `CountdownDisplay.vue`만 남고(아직 `useTheme` 관련 자체 `useStorage('theme', ...)` 참조가 남아있음, Task 6에서 제거) 그 외 매치 없음

Run: `npm run build`
Expected: 에러 없이 빌드 성공

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "refactor: AppHeader에서 테마 선택기 제거 및 헤더 리스타일"
```

---

## Task 4: TimeInput.vue 리스타일

**Files:**
- Modify: `src/components/TimeInput.vue` (`<style>` 블록만 교체, `<template>`/`<script>` 무변경)

**Interfaces:**
- Consumes: Task 1의 `--color-ink`, `--color-canvas`, `--color-surface-alt`, `--color-paper`, `--color-hairline`, `--radius-control`, `--text-body`, `--text-body-lg`, `--spacing-8/12/24`

- [ ] **Step 1: `src/components/TimeInput.vue`의 `<style scoped>` 블록 전체를 아래로 교체 (template/script 유지)**

`<style scoped>`부터 `</style>`까지를 아래 내용으로 교체:

```vue
<style scoped>
.input-section {
	margin-bottom: var(--spacing-24);
	flex-shrink: 0;
}

.input-section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: var(--spacing-12);
}

.input-section label {
	display: flex;
	align-items: center;
	gap: var(--spacing-8);
	color: var(--color-ink);
	font-weight: 600;
	font-size: var(--text-body-lg);
}

.label-icon {
	font-size: 1.2rem;
}

.input-wrapper {
	position: relative;
	cursor: pointer;
}

.input-section input[type='time'] {
	width: 100%;
	padding: var(--spacing-8) var(--spacing-12);
	font-size: var(--text-body-lg);
	border: 1px solid transparent;
	border-radius: var(--radius-control);
	transition:
		border-color 0.2s ease,
		background 0.2s ease;
	background: var(--color-canvas);
	font-weight: 600;
	color: var(--color-ink);
	cursor: pointer;
}

.input-section input[type='time']:hover {
	background: var(--color-surface-alt);
}

.input-section input[type='time']:focus {
	outline: none;
	border-color: var(--color-hairline);
	background: var(--color-paper);
}

.halfday-checkbox-section {
	margin: 0;
}

.halfday-label {
	display: flex;
	align-items: center;
	gap: var(--spacing-12);
	cursor: pointer;
	user-select: none;
	color: var(--color-ink);
	font-weight: 600;
	font-size: var(--text-body);
}

.halfday-label:hover {
	color: var(--color-mid-gray);
}

.halfday-checkbox {
	width: 20px;
	height: 20px;
	cursor: pointer;
	accent-color: var(--color-ink);
}

.checkbox-label-text {
	font-size: var(--text-body);
}
</style>
```

- [ ] **Step 2: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

`npm run dev`로 브라우저에서 시간 입력 필드 클릭 시 타임피커가 정상 열리고, 하프데이 체크박스 토글이 여전히 동작하는지 육안 확인 (스타일만 변경, 로직 무변경이므로 회귀 없어야 함).

- [ ] **Step 3: 커밋**

```bash
git add src/components/TimeInput.vue
git commit -m "style: TimeInput 인풋/체크박스 무채색 토큰 적용"
```

---

## Task 5: TimeInfoCards.vue 리스타일 (Stat Block 패턴)

**Files:**
- Modify: `src/components/TimeInfoCards.vue` (전체 교체)

**Interfaces:**
- Consumes: Task 1의 `--color-surface-alt`, `--color-ink-soft`, `--color-paper`, `--color-ink`, `--color-mid-gray`, `--color-hairline`, `--radius-nested`, `--text-caption`, `--text-heading-sm`, `--text-heading`, `--spacing-8/16/20/24`

- [ ] **Step 1: `src/components/TimeInfoCards.vue` 전체를 아래로 교체**

스타일 레퍼런스의 Stat Block 컴포넌트 정의("라벨 12px 대문자 + 값 30~48px/600, 카드 크롬 없이 타이포그래피만으로 구성")를 따라 이모지 아이콘과 바운스 애니메이션을 제거한다.

```vue
<template>
	<div class="info-section">
		<div class="info-card" data-card="start">
			<div class="label">출근 시간</div>
			<div class="value">{{ startTime }}</div>
		</div>

		<div class="info-card" data-card="current">
			<div class="label">현재 시간</div>
			<div class="value">{{ currentTime }}</div>
		</div>

		<div class="info-card highlight-card" data-card="end">
			<div class="label">퇴근 시간</div>
			<div class="value highlight">{{ endTime }}</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	startTime: {
		type: String,
		required: true,
	},
	currentTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
})
</script>

<style scoped>
.info-section {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: var(--spacing-16);
	margin-bottom: var(--spacing-24);
	flex-shrink: 0;
}

.info-card {
	background: var(--color-surface-alt);
	padding: var(--spacing-20) var(--spacing-16);
	border-radius: var(--radius-nested);
	text-align: center;
	border: 1px solid var(--color-hairline);
}

.info-card .label {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-bottom: var(--spacing-8);
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.info-card .value {
	font-size: var(--text-heading-sm);
	font-weight: 600;
	color: var(--color-ink);
	letter-spacing: -0.025em;
}

.highlight-card {
	background: var(--color-ink-soft);
	border: none;
}

.highlight-card .value.highlight {
	color: var(--color-paper);
	font-size: var(--text-heading);
}

@media (max-width: 768px) {
	.info-section {
		grid-template-columns: 1fr;
		gap: var(--spacing-16);
	}
}
</style>
```

- [ ] **Step 2: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

`npm run dev`로 출근 시간을 바꿔가며 세 카드(출근/현재/퇴근)의 값이 정상 갱신되는지, "퇴근 시간" 카드만 어두운 배경으로 강조되는지 육안 확인.

- [ ] **Step 3: 커밋**

```bash
git add src/components/TimeInfoCards.vue
git commit -m "style: TimeInfoCards를 Stat Block 패턴으로 리스타일"
```

---

## Task 6: CountdownDisplay.vue — 에너지 이펙트 제거 + 카운트다운 리스타일

**Files:**
- Modify: `src/components/CountdownDisplay.vue` (전체 교체)
- Delete: `src/assets/vegito.webp`
- Delete: `src/assets/brory.webp`

**Interfaces:**
- Consumes: Task 1의 `--color-ink-soft`, `--color-paper`, `--color-mid-gray`, `--color-hairline`, `--radius-card`, `--radius-control`, `--text-caption`, `--text-display`, `--text-heading`, `--text-heading-lg`, `--text-body`, `--spacing-8/12/16/24`
- Produces: 없음 (leaf 컴포넌트, props는 TimeCalculator가 이미 공급 중이며 무변경)

원본 카운트다운 라벨 텍스트("퇴근기모리장단까지 남은 시간" 등)는 기존에 있던 오타성 문구이지만 이번 작업 범위(비주얼 리디자인)와 무관하므로 그대로 둔다 — 별도로 사용자에게 보고한다.

- [ ] **Step 1: `src/components/CountdownDisplay.vue` 전체를 아래로 교체**

```vue
<template>
	<div class="countdown-section">
		<div v-if="diffInSeconds > 0" class="countdown">
			<div class="countdown-icon">⏳</div>
			<div class="countdown-label">퇴근기모리장단까지 남은 시간</div>
			<div class="countdown-value">
				<span class="time-unit">
					<span class="number">{{ String(hours).padStart(2, '0') }}</span>
					<span class="unit">시간</span>
				</span>
				<span class="separator">:</span>
				<span class="time-unit">
					<span class="number">{{ String(minutes).padStart(2, '0') }}</span>
					<span class="unit">분</span>
				</span>
				<span class="separator">:</span>
				<span class="time-unit">
					<span class="number">{{
						String(remainingSeconds).padStart(2, '0')
					}}</span>
					<span class="unit">초</span>
				</span>
			</div>
			<button
				type="button"
				class="copy-btn"
				:aria-label="copyLabel"
				@click="copyRemainingTime"
			>
				<span class="copy-icon" :class="{ copied: justCopied }">
					{{ justCopied ? '✓' : '📋' }}
				</span>
				<span class="copy-text">{{ justCopied ? '복사됨!' : '복사' }}</span>
			</button>
		</div>
		<div v-else class="countdown overdue">
			<div class="countdown-icon">🎉</div>
			<div class="countdown-label">야근 시간 경과</div>
			<div class="countdown-value">
				<span class="time-unit">
					<span class="number">{{
						String(overdueHours).padStart(2, '0')
					}}</span>
					<span class="unit">시간</span>
				</span>
				<span class="separator">:</span>
				<span class="time-unit">
					<span class="number">{{ String(overdueMins).padStart(2, '0') }}</span>
					<span class="unit">분</span>
				</span>
				<span class="separator">:</span>
				<span class="time-unit">
					<span class="number">{{ String(overdueSecs).padStart(2, '0') }}</span>
					<span class="unit">초</span>
				</span>
			</div>
			<button
				type="button"
				class="copy-btn"
				:aria-label="copyLabelOverdue"
				@click="copyOverdueTime"
			>
				<span class="copy-icon" :class="{ copied: justCopied }">
					{{ justCopied ? '✓' : '📋' }}
				</span>
				<span class="copy-text">{{ justCopied ? '복사됨!' : '복사' }}</span>
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const justCopied = ref(false)
let copyTimeout = null

const copyLabel = '남은 시간 텍스트 복사'
const copyLabelOverdue = '야근 시간 텍스트 복사'

function copyToClipboard(text) {
	if (copyTimeout) clearTimeout(copyTimeout)
	navigator.clipboard
		.writeText(text)
		.then(() => {
			justCopied.value = true
			copyTimeout = setTimeout(() => {
				justCopied.value = false
			}, 2000)
		})
		.catch(() => {})
}

function copyRemainingTime() {
	const h = String(props.hours).padStart(2, '0')
	const m = String(props.minutes).padStart(2, '0')
	const s = String(props.remainingSeconds).padStart(2, '0')
	copyToClipboard(`퇴근기모리 장단까지 ${h}시간 ${m}분 ${s}초 `)
}

function copyOverdueTime() {
	const h = String(props.overdueHours).padStart(2, '0')
	const m = String(props.overdueMins).padStart(2, '0')
	const s = String(props.overdueSecs).padStart(2, '0')
	copyToClipboard(`야근 시간 ${h}시간 ${m}분 ${s}초`)
}

const props = defineProps({
	diffInSeconds: {
		type: Number,
		required: true,
	},
	hours: {
		type: Number,
		required: true,
	},
	minutes: {
		type: Number,
		required: true,
	},
	remainingSeconds: {
		type: Number,
		required: true,
	},
	overdueHours: {
		type: Number,
		required: true,
	},
	overdueMins: {
		type: Number,
		required: true,
	},
	overdueSecs: {
		type: Number,
		required: true,
	},
	isHalfDay: {
		type: Boolean,
		default: false,
	},
})
</script>

<style scoped>
.countdown-section {
	margin-top: auto;
	flex-shrink: 0;
}

.countdown {
	background: var(--color-ink-soft);
	padding: var(--spacing-24);
	border-radius: var(--radius-card);
	text-align: center;
	color: var(--color-paper);
	position: relative;
}

.countdown-icon {
	font-size: 2rem;
	margin-bottom: var(--spacing-12);
	display: block;
}

.countdown-label {
	font-size: var(--text-caption);
	margin-bottom: var(--spacing-16);
	color: var(--color-mid-gray);
	font-weight: 500;
	letter-spacing: 0.05em;
	text-transform: uppercase;
}

.countdown-value {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--spacing-8);
	flex-wrap: wrap;
}

.time-unit {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
}

.number {
	font-size: var(--text-display);
	font-weight: 600;
	letter-spacing: -0.025em;
	line-height: 1.1;
	font-variant-numeric: tabular-nums;
}

.unit {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

.separator {
	font-size: 2rem;
	font-weight: 300;
	color: var(--color-mid-gray);
	margin: 0 0.25rem;
}

.copy-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.35rem;
	margin-top: var(--spacing-16);
	padding: var(--spacing-8) var(--spacing-16);
	font-size: var(--text-body);
	font-weight: 500;
	color: var(--color-paper);
	background: transparent;
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-control);
	cursor: pointer;
	transition: background 0.2s;
	position: absolute;
	bottom: var(--spacing-16);
	right: var(--spacing-16);
}

.copy-btn:hover {
	background: rgba(255, 255, 255, 0.08);
}

.copy-icon {
	font-size: 1rem;
	line-height: 1;
}

.copy-text {
	opacity: 0.9;
}

@media (max-width: 768px) {
	.countdown {
		padding: var(--spacing-20);
	}

	.number {
		font-size: var(--text-heading-lg);
	}

	.separator {
		font-size: 1.5rem;
	}
}

@media (max-width: 480px) {
	.number {
		font-size: var(--text-heading);
	}

	.separator {
		font-size: 1.5rem;
	}

	.countdown-icon {
		font-size: 2.5rem;
	}
}
</style>
```

이 교체로 `isVegitoTheme`/`isBrolyTheme`(및 `useStorage('theme', ...)`), 에너지파 progress bar(`goku-silhouette`, `energy-wave-bar`, `energy-particles`), 라이트닝/에너지 스트릭 배경, `TOTAL_WORK_SECONDS`/`energyProgress`/`particles`(더 이상 쓰이는 곳 없음), `warning`/`urgent` 색상 분기가 모두 제거된다. 정상/경고/긴급 상태는 시각적으로 동일하게 표시되며 숫자 값으로만 구분된다(설계 문서에서 사용자가 승인한 방향).

- [ ] **Step 2: 참조가 사라진 이미지 에셋 삭제**

```bash
git rm src/assets/vegito.webp src/assets/brory.webp
```

- [ ] **Step 3: 검증**

Run: `grep -rn "isVegitoTheme\|isBrolyTheme\|goku-silhouette\|energy-wave\|vegito\|brory" src/`
Expected: 매치 없음 (전체 프로젝트에서 테마 관련 참조가 완전히 사라져야 함 — 이 태스크가 마지막 소비자였음)

Run: `npm run build`
Expected: 에러 없이 빌드 성공

`npm run dev`로 카운트다운 숫자가 1초마다 갱신되는지, 복사 버튼 클릭 시 클립보드 복사와 "복사됨!" 표시가 정상 동작하는지 육안 확인.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "refactor: CountdownDisplay 에너지 이펙트 제거 및 리스타일"
```

---

## Task 7: 최종 검증 및 마무리

**Files:** 없음 (검증 전용 태스크)

- [ ] **Step 1: 테마 시스템 잔여 참조 전체 검색**

Run: `grep -rln "theme\|Theme" src/ --include=*.vue --include=*.js`
Expected: `useTimeCalculation.js`/`useNotification.js` 등 무관한 파일에서 "theme"라는 단어가 우연히 포함되지 않는 한 매치 없음. 매치가 있다면 어느 파일인지 확인하고 해당 태스크로 돌아가 정리.

- [ ] **Step 2: 삭제 대상 파일이 실제로 삭제됐는지 확인**

Run: `git status --short`
Expected: 아래 8개 파일이 삭제(`D`)로 표시되지 않고 이미 커밋에 포함되어 있어야 함(워킹 트리 깨끗함) — `src/composables/useTheme.js`, `src/components/ThemeSelector.vue`, `src/components/ElectricEffects.vue`, `src/components/GokuSilhouette.vue`, `src/assets/vegito.jpg`, `src/assets/vegito.webp`, `src/assets/brory.png`, `src/assets/brory.webp`

- [ ] **Step 3: 전체 빌드 및 미리보기**

Run: `npm run build`
Expected: 에러 없이 성공

Run: `npm run preview`
Expected: 로컬 서버 기동, 브라우저에서 최종 UI(캔버스 배경, 흰 카드, 중첩 회색 스탯 카드, 다크 카운트다운 블록)가 설계 문서와 일치하는지 확인 후 서버 종료(Ctrl+C)

- [ ] **Step 4: 커밋 (필요한 경우)**

Step 1~3에서 발견된 잔여 정리가 있었다면:

```bash
git add -A
git commit -m "chore: 리디자인 잔여 참조 정리"
```

발견된 것이 없다면 이 태스크는 커밋 없이 종료.

---

## Self-Review Notes

- **스펙 커버리지**: 설계 문서의 토큰/삭제 목록/컴포넌트별 변경 사항이 Task 1~6에 모두 매핑됨. 검증 계획(빌드, grep, 수동 QA)은 Task 7에 통합.
- **플레이스홀더 스캔**: "TBD"/"나중에" 등 표현 없음. 모든 스텝에 실행 가능한 완전한 코드/명령이 포함됨.
- **타입/이름 일관성**: 각 태스크가 소비하는 CSS 커스텀 프로퍼티 이름이 Task 1의 Produces 목록과 정확히 일치하는지 확인 완료 (`--color-*`, `--text-*`, `--radius-*`, `--spacing-*`, `--shadow-card`).
