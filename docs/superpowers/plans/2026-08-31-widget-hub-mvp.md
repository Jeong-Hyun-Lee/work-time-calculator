# 위젯 허브 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 퇴근시간 계산기를 앵커로 두고, 5개의 캐주얼 위젯(로또 번호 생성기/오늘의 한마디/점심 메뉴 룰렛/사다리타기/연봉 실수령액 계산기)을 같은 페이지 아래쪽 그리드에 추가한다. Cloudflare Pages 무료 배포까지 마무리한다.

**Architecture:** 기존 Vue 3 + Vite SPA에 위젯 컴포넌트/컴포저블을 추가하는 방식. 신규 의존성/라우터/상태관리 없음. 각 위젯은 독립적인 `<script setup>` 컴포넌트 + 동명의 컴포저블(`useXxx.js`)로 구성되고, `App.vue`가 이들을 그리드에 배치한다.

**Tech Stack:** Vue 3 `<script setup>`, Vite, 순수 CSS(커스텀 프로퍼티), Day.js — 무변경. 신규 라이브러리 추가 없음.

## Global Constraints

- 기존 컴포넌트(`AppHeader.vue`, `TimeInput.vue`, `TimeInfoCards.vue`, `CountdownDisplay.vue`)와 기존 컴포저블(`useTimeCalculation.js`, `useNotification.js`, `useSEO.js`) 무변경
- 새 색상 토큰 추가 금지 — `src/assets/base.css`의 기존 팔레트(canvas/paper/surface-alt/ink/ink-soft/mid-gray/hairline/ember)만 재사용
- `vue-router`, Pinia 등 신규 상태관리/라우팅 라이브러리 도입 금지 — 위젯 간 공유 상태 없음, 한 페이지 동시 노출
- Cloudflare Pages Functions(서버리스 프록시) 불필요 — 5개 위젯 모두 외부 API를 쓰지 않음
- 연봉 실수령액 계산기(Task 6)의 세율/보험료율은 이 계획에 명시된 2026년 기준 리서치 값을 그대로 사용하고, 화면에 "참고용, 실제 급여와 다를 수 있음" 문구를 반드시 노출
- 로또/오늘의 한마디 위젯에는 각각 지정된 면책 문구를 반드시 노출
- 이 프로젝트에는 테스트 러너가 없다. 각 태스크의 검증은 `npm run build` 통과 + `grep` 잔여 참조 확인 + 브라우저 육안 확인으로 대체한다.
- 모든 파일 경로는 프로젝트 루트(`c:\Users\krinjosl\Desktop\workspace\work-time-calculator`) 기준 상대 경로
- 들여쓰기는 기존 코드베이스와 동일하게 탭(tab) 사용

---

## Task 1: 공유 기반 — 그리드 셸, WidgetHeader, 버튼 유틸리티, TimeCalculator 레이아웃 전환

**Files:**
- Modify: `src/assets/base.css` (유틸리티 클래스 추가)
- Modify: `src/components/TimeCalculator.vue` (`<style scoped>` 블록만 — 뷰포트 고정 레이아웃을 자연 스크롤로 전환)
- Modify: `src/App.vue` (위젯 그리드 셸 추가)
- Create: `src/components/WidgetHeader.vue`

**Interfaces:**
- Produces: 전역 유틸리티 클래스 `.widget-card`, `.btn-solid`, `.btn-outline` (base.css). `App.vue`의 전역 `.widget-grid`, `.widget--sm`, `.widget--md` 그리드 span 클래스. `WidgetHeader.vue` 컴포넌트 — props `icon`(String, 이모지), `title`(String, required), 기본 슬롯(우측 보조 액션).
- Consumes: 없음 (기반 태스크)

- [ ] **Step 1: `src/assets/base.css`의 `:root` 블록 바로 다음, `*,*::before,*::after` 리셋 앞에 유틸리티 클래스 추가**

기존 `:root { ... }` 블록 뒤에 아래를 삽입 (기존 `:root`/`*`/`body` 규칙은 그대로 유지):

```css
.widget-card {
	background: var(--color-paper);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-card);
	box-shadow: var(--shadow-card);
	padding: var(--spacing-20);
}

.btn-solid {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: var(--color-ink-soft);
	color: var(--color-paper);
	border: none;
	border-radius: var(--radius-control);
	padding: var(--spacing-8) var(--spacing-16);
	font-size: var(--text-body);
	font-weight: 500;
	font-family: var(--font-sans);
	cursor: pointer;
	transition: opacity 0.2s ease;
}

.btn-solid:hover {
	opacity: 0.85;
}

.btn-solid:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.btn-outline {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	color: var(--color-ink);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-control);
	padding: var(--spacing-8) var(--spacing-16);
	font-size: var(--text-body);
	font-weight: 500;
	font-family: var(--font-sans);
	cursor: pointer;
	transition: background 0.2s ease;
}

.btn-outline:hover {
	background: var(--color-surface-alt);
}
```

- [ ] **Step 2: `src/components/TimeCalculator.vue`의 `<style scoped>` 블록을 아래로 교체**

`<style scoped>`부터 `</style>`까지 전체를 아래로 교체 (template/script는 무변경):

```vue
<style scoped>
.time-calculator {
	display: flex;
	justify-content: center;
	background: var(--color-canvas);
	padding: var(--spacing-16);
}

.container {
	background: var(--color-paper);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-card);
	padding: var(--spacing-20);
	box-shadow: var(--shadow-card);
	max-width: 1000px;
	width: 100%;
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

@media (max-width: 768px) {
	.time-calculator {
		padding: var(--spacing-16);
	}

	.container {
		padding: var(--spacing-20);
	}
}

@media (max-width: 480px) {
	.time-calculator {
		padding: var(--spacing-12);
	}

	.container {
		padding: var(--spacing-16);
		border-radius: 20px;
	}
}
</style>
```

이 교체로 `height: 100vh`/`overflow: hidden`(`.time-calculator`)과 `height: calc(100vh - 2rem)`/`overflow: auto`(`.container`) 뷰포트 고정 트랩이 제거되고, 페이지가 콘텐츠 높이만큼 자연스럽게 늘어나 아래 위젯 그리드가 이어질 수 있게 된다. `::-webkit-scrollbar` 규칙은 `.container`가 더 이상 내부 스크롤을 갖지 않으므로 함께 제거한다(이 태스크의 변경으로 무의미해진 규칙).

- [ ] **Step 3: `src/App.vue` 전체를 아래로 교체**

```vue
<script setup>
import TimeCalculator from './components/TimeCalculator.vue'
</script>

<template>
	<TimeCalculator />
	<div class="widget-grid"></div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.widget-grid {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	gap: var(--spacing-16);
	max-width: 1280px;
	margin: 0 auto;
	padding: var(--spacing-24) var(--spacing-16);
}

.widget--sm {
	grid-column: span 4;
}

.widget--md {
	grid-column: span 6;
}

@media (max-width: 768px) {
	.widget--sm,
	.widget--md {
		grid-column: span 12;
	}
}
</style>
```

`.widget-grid`는 이번 태스크에서는 비어 있다 — Task 2~6에서 각자 자신의 위젯을 이 그리드 안에 하나씩 추가한다.

- [ ] **Step 4: `src/components/WidgetHeader.vue` 신규 생성**

```vue
<template>
	<div class="widget-header">
		<span v-if="icon" class="widget-header-icon">{{ icon }}</span>
		<h2 class="widget-header-title">{{ title }}</h2>
		<div class="widget-header-action">
			<slot />
		</div>
	</div>
</template>

<script setup>
defineProps({
	icon: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		required: true,
	},
})
</script>

<style scoped>
.widget-header {
	display: flex;
	align-items: center;
	gap: var(--spacing-8);
	margin-bottom: var(--spacing-16);
}

.widget-header-icon {
	font-size: 1.25rem;
	line-height: 1;
	flex-shrink: 0;
}

.widget-header-title {
	flex: 1;
	font-size: var(--text-subheading);
	font-weight: 600;
	color: var(--color-ink);
	margin: 0;
}

.widget-header-action {
	flex-shrink: 0;
}
</style>
```

- [ ] **Step 5: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

`npm run dev`로 브라우저에서 확인: 퇴근시간 계산기 카드가 더 이상 화면 높이에 고정되지 않고 자연스럽게 표시되며, 그 아래에 빈 여백(`.widget-grid`, 아직 위젯 없음)이 생겼는지 확인. 페이지 전체가 필요 시 스크롤되는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add src/assets/base.css src/components/TimeCalculator.vue src/App.vue src/components/WidgetHeader.vue
git commit -m "feat: 위젯 그리드 셸 및 공용 버튼/카드 유틸리티 추가"
```

---

## Task 2: 로또 번호 생성기

**Files:**
- Create: `src/composables/useLotto.js`
- Create: `src/components/widgets/LottoWidget.vue`
- Modify: `src/App.vue` (위젯 등록)

**Interfaces:**
- Consumes: Task 1의 `.widget-card`, `.btn-solid`, `WidgetHeader.vue`, `.widget--md`
- Produces: `useLotto()` — `{ numbers: Ref<number[]>, generate: () => void }`

- [ ] **Step 1: `src/composables/useLotto.js` 신규 생성**

```js
import { ref } from 'vue'

export function useLotto() {
	const numbers = ref([])

	const generate = () => {
		const pool = Array.from({ length: 45 }, (_, i) => i + 1)
		const picked = []

		while (picked.length < 6) {
			const randomBuffer = new Uint32Array(1)
			crypto.getRandomValues(randomBuffer)
			const index = randomBuffer[0] % pool.length
			picked.push(pool[index])
			pool.splice(index, 1)
		}

		numbers.value = picked.sort((a, b) => a - b)
	}

	return {
		numbers,
		generate,
	}
}
```

- [ ] **Step 2: `src/components/widgets/LottoWidget.vue` 신규 생성**

```vue
<template>
	<div class="widget-card">
		<WidgetHeader icon="🎱" title="로또 번호 생성기" />
		<div v-if="numbers.length" class="lotto-balls">
			<span v-for="n in numbers" :key="n" class="ball">{{ n }}</span>
		</div>
		<p v-else class="lotto-empty">번호 생성 버튼을 눌러보세요</p>
		<button type="button" class="btn-solid" @click="generate">번호 생성</button>
		<p class="lotto-disclaimer">당첨을 예측하지 않는 재미용 랜덤 생성기입니다</p>
	</div>
</template>

<script setup>
import WidgetHeader from '../WidgetHeader.vue'
import { useLotto } from '../../composables/useLotto'

const { numbers, generate } = useLotto()
</script>

<style scoped>
.lotto-balls {
	display: flex;
	flex-wrap: wrap;
	gap: var(--spacing-8);
	margin-bottom: var(--spacing-16);
}

.ball {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 1px solid var(--color-hairline);
	background: var(--color-surface-alt);
	font-size: var(--text-subheading);
	font-weight: 600;
	color: var(--color-ink);
	font-variant-numeric: tabular-nums;
}

.lotto-empty {
	font-size: var(--text-body);
	color: var(--color-mid-gray);
	margin-bottom: var(--spacing-16);
}

.lotto-disclaimer {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-top: var(--spacing-12);
}
</style>
```

- [ ] **Step 3: `src/App.vue` 수정 — LottoWidget 등록**

`<script setup>` 블록의 `import TimeCalculator from './components/TimeCalculator.vue'` 다음 줄에 추가:

```js
import LottoWidget from './components/widgets/LottoWidget.vue'
```

`<template>` 블록의 `<div class="widget-grid"></div>`를 아래로 교체:

```html
	<div class="widget-grid">
		<div class="widget--md">
			<LottoWidget />
		</div>
	</div>
```

- [ ] **Step 4: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

`npm run dev`로 브라우저에서 "번호 생성" 클릭 시 서로 다른 6개 숫자(1~45)가 오름차순으로 표시되는지, 여러 번 클릭해도 정상 동작하는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/composables/useLotto.js src/components/widgets/LottoWidget.vue src/App.vue
git commit -m "feat: 로또 번호 생성기 위젯 추가"
```

---

## Task 3: 오늘의 한마디 (명언)

**Files:**
- Create: `src/data/quotes.json`
- Create: `src/composables/useQuote.js`
- Create: `src/components/widgets/QuoteWidget.vue`
- Modify: `src/App.vue` (위젯 등록)

**Interfaces:**
- Consumes: Task 1의 `.widget-card`, `.btn-outline`, `WidgetHeader.vue`, `.widget--sm`
- Produces: `useQuote()` — `{ quote: Ref<{text: string}>, next: () => void }`

- [ ] **Step 1: `src/data/quotes.json` 신규 생성**

모두 저작권 문제 없는 자체 작성 문구(실존 인물 인용 없음), 최소 30개:

```json
[
	{ "text": "오늘 하루도 잘 버티고 있는 당신, 이미 충분히 잘하고 있어요." },
	{ "text": "커피 한 잔의 여유가 오후를 바꿉니다." },
	{ "text": "작은 진전도 진전입니다." },
	{ "text": "퇴근 후의 나를 위해, 지금 조금만 더 힘내봐요." },
	{ "text": "완벽하지 않아도 괜찮아요, 오늘도 해냈으니까요." },
	{ "text": "잠깐의 휴식이 다음 한 시간을 만듭니다." },
	{ "text": "실수해도 괜찮아요, 배우는 중이니까요." },
	{ "text": "오늘의 나는 어제의 나보다 조금 더 단단합니다." },
	{ "text": "바쁜 하루 속에서도 나를 잃지 마세요." },
	{ "text": "작은 성취를 축하하는 습관을 가져보세요." },
	{ "text": "지금 이 순간에 집중하면 걱정은 잠시 멀어집니다." },
	{ "text": "당신의 속도로 가도 괜찮습니다." },
	{ "text": "오늘 하루, 스스로에게 다정하게 대해주세요." },
	{ "text": "가끔은 아무것도 안 하는 것도 필요합니다." },
	{ "text": "일도 중요하지만, 당신의 건강이 먼저입니다." },
	{ "text": "포기하지 않고 여기까지 온 것만으로도 대단해요." },
	{ "text": "오후의 나른함도 하루의 일부입니다." },
	{ "text": "작은 목표부터 하나씩 지워나가세요." },
	{ "text": "동료와의 짧은 대화가 하루를 밝혀줄 수 있어요." },
	{ "text": "너무 애쓰지 않아도, 당신은 잘하고 있습니다." },
	{ "text": "오늘 하루도 무사히, 감사한 일입니다." },
	{ "text": "가끔은 멈춰서 숨을 고르는 것도 전략입니다." },
	{ "text": "완벽한 하루보다 무사히 지나가는 하루가 더 소중할 때가 있어요." },
	{ "text": "당신의 노력은 어딘가에서 반드시 쌓이고 있습니다." },
	{ "text": "오늘도 출근한 당신, 이미 승리했습니다." },
	{ "text": "잠깐의 딴생각이 창의력의 시작일 수 있어요." },
	{ "text": "퇴근길의 노을을 놓치지 마세요." },
	{ "text": "스스로를 다그치기보다 응원해주세요." },
	{ "text": "오늘 한 걸음, 내일 두 걸음이면 충분합니다." },
	{ "text": "지금 이 페이지를 보고 있다는 건, 잠깐의 쉼이 필요했다는 뜻이겠죠. 잘 쉬어가세요." }
]
```

- [ ] **Step 2: `src/composables/useQuote.js` 신규 생성**

```js
import { ref } from 'vue'
import dayjs from 'dayjs'
import quotes from '../data/quotes.json'

export function useQuote() {
	const seed = Number(dayjs().format('YYYYMMDD'))
	const index = ref(seed % quotes.length)
	const quote = ref(quotes[index.value])

	const next = () => {
		let nextIndex = Math.floor(Math.random() * quotes.length)
		if (quotes.length > 1 && nextIndex === index.value) {
			nextIndex = (nextIndex + 1) % quotes.length
		}
		index.value = nextIndex
		quote.value = quotes[nextIndex]
	}

	return {
		quote,
		next,
	}
}
```

- [ ] **Step 3: `src/components/widgets/QuoteWidget.vue` 신규 생성**

```vue
<template>
	<div class="widget-card">
		<WidgetHeader icon="💬" title="오늘의 한마디" />
		<p class="quote-text">{{ quote.text }}</p>
		<button type="button" class="btn-outline" @click="next">다른 명언 보기</button>
		<p class="quote-disclaimer">재미로 보는 콘텐츠이며 실제 운세와 무관합니다</p>
	</div>
</template>

<script setup>
import WidgetHeader from '../WidgetHeader.vue'
import { useQuote } from '../../composables/useQuote'

const { quote, next } = useQuote()
</script>

<style scoped>
.quote-text {
	font-size: var(--text-body-lg);
	line-height: 1.6;
	color: var(--color-ink);
	margin-bottom: var(--spacing-16);
}

.quote-disclaimer {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-top: var(--spacing-12);
}
</style>
```

- [ ] **Step 4: `src/App.vue` 수정 — QuoteWidget 등록**

`<script setup>`의 `import LottoWidget ...` 다음 줄에 추가:

```js
import QuoteWidget from './components/widgets/QuoteWidget.vue'
```

`.widget-grid` 안, `LottoWidget`을 감싼 `<div class="widget--md">` 블록 다음에 추가:

```html
		<div class="widget--sm">
			<QuoteWidget />
		</div>
```

- [ ] **Step 5: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

`npm run dev`로 브라우저에서 명언이 표시되는지, "다른 명언 보기" 클릭 시 문구가 바뀌는지, 새로고침해도 같은 날엔 처음엔 같은 문구로 시작하는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add src/data/quotes.json src/composables/useQuote.js src/components/widgets/QuoteWidget.vue src/App.vue
git commit -m "feat: 오늘의 한마디 위젯 추가"
```

---

## Task 4: 점심 메뉴 룰렛

**Files:**
- Create: `src/data/lunchMenus.json`
- Create: `src/composables/useLunchRoulette.js`
- Create: `src/components/widgets/LunchRouletteWidget.vue`
- Modify: `src/App.vue` (위젯 등록)

**Interfaces:**
- Consumes: Task 1의 `.widget-card`, `.btn-solid`, `WidgetHeader.vue`, `.widget--sm`
- Produces: `useLunchRoulette()` — `{ result: Ref<string|null>, isSpinning: Ref<boolean>, spin: () => void }`

- [ ] **Step 1: `src/data/lunchMenus.json` 신규 생성**

```json
[
	"김치찌개", "된장찌개", "돈까스", "제육볶음", "짜장면",
	"짬뽕", "초밥", "파스타", "샐러드", "비빔밥",
	"칼국수", "냉면", "삼겹살", "치킨", "국밥",
	"떡볶이", "카레라이스", "쌀국수", "햄버거", "샌드위치"
]
```

- [ ] **Step 2: `src/composables/useLunchRoulette.js` 신규 생성**

```js
import { ref } from 'vue'
import menus from '../data/lunchMenus.json'

export function useLunchRoulette() {
	const result = ref(null)
	const isSpinning = ref(false)

	const spin = () => {
		if (isSpinning.value) return
		isSpinning.value = true
		result.value = null

		setTimeout(() => {
			const index = Math.floor(Math.random() * menus.length)
			result.value = menus[index]
			isSpinning.value = false
		}, 600)
	}

	return {
		result,
		isSpinning,
		spin,
	}
}
```

- [ ] **Step 3: `src/components/widgets/LunchRouletteWidget.vue` 신규 생성**

```vue
<template>
	<div class="widget-card">
		<WidgetHeader icon="🍱" title="점심 메뉴 룰렛" />
		<p class="roulette-result" :class="{ spinning: isSpinning }">
			{{ isSpinning ? '고민 중...' : result || '룰렛을 돌려보세요' }}
		</p>
		<button type="button" class="btn-solid" :disabled="isSpinning" @click="spin">
			룰렛 돌리기
		</button>
	</div>
</template>

<script setup>
import WidgetHeader from '../WidgetHeader.vue'
import { useLunchRoulette } from '../../composables/useLunchRoulette'

const { result, isSpinning, spin } = useLunchRoulette()
</script>

<style scoped>
.roulette-result {
	font-size: var(--text-heading-sm);
	font-weight: 600;
	color: var(--color-ink);
	margin-bottom: var(--spacing-16);
	transition: opacity 0.2s ease;
}

.roulette-result.spinning {
	opacity: 0.5;
}
</style>
```

- [ ] **Step 4: `src/App.vue` 수정 — LunchRouletteWidget 등록**

`<script setup>`의 `import QuoteWidget ...` 다음 줄에 추가:

```js
import LunchRouletteWidget from './components/widgets/LunchRouletteWidget.vue'
```

`.widget-grid` 안, `QuoteWidget`을 감싼 `<div class="widget--sm">` 블록 다음에 추가:

```html
		<div class="widget--sm">
			<LunchRouletteWidget />
		</div>
```

- [ ] **Step 5: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

`npm run dev`로 브라우저에서 "룰렛 돌리기" 클릭 시 약 0.6초 후 메뉴 하나가 표시되는지, 돌아가는 동안 버튼이 비활성화되는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add src/data/lunchMenus.json src/composables/useLunchRoulette.js src/components/widgets/LunchRouletteWidget.vue src/App.vue
git commit -m "feat: 점심 메뉴 룰렛 위젯 추가"
```

---

## Task 5: 사다리타기

**Files:**
- Create: `src/composables/useLadder.js`
- Create: `src/components/widgets/LadderWidget.vue`
- Modify: `src/App.vue` (위젯 등록)

**Interfaces:**
- Consumes: Task 1의 `.widget-card`, `.btn-solid`, `WidgetHeader.vue`, `.widget--md`
- Produces: `useLadder()` — `{ namesInput: Ref<string>, results: Ref<{name:string,outcome:string}[]>, error: Ref<string>, generate: () => void }`

- [ ] **Step 1: `src/composables/useLadder.js` 신규 생성**

```js
import { ref } from 'vue'

export function useLadder() {
	const namesInput = ref('')
	const results = ref([])
	const error = ref('')

	const generate = () => {
		error.value = ''
		const participants = namesInput.value
			.split(/[\n,]/)
			.map((name) => name.trim())
			.filter((name) => name.length > 0)

		if (participants.length < 2) {
			error.value = '참가자를 2명 이상 입력해주세요'
			results.value = []
			return
		}

		if (participants.length > 10) {
			error.value = '참가자는 최대 10명까지 입력할 수 있어요'
			results.value = []
			return
		}

		const outcomes = [...participants]
		for (let i = outcomes.length - 1; i > 0; i--) {
			const randomBuffer = new Uint32Array(1)
			crypto.getRandomValues(randomBuffer)
			const j = randomBuffer[0] % (i + 1)
			;[outcomes[i], outcomes[j]] = [outcomes[j], outcomes[i]]
		}

		results.value = participants.map((name, i) => ({
			name,
			outcome: outcomes[i],
		}))
	}

	return {
		namesInput,
		results,
		error,
		generate,
	}
}
```

- [ ] **Step 2: `src/components/widgets/LadderWidget.vue` 신규 생성**

```vue
<template>
	<div class="widget-card">
		<WidgetHeader icon="🪜" title="사다리타기" />
		<textarea
			v-model="namesInput"
			class="ladder-input"
			placeholder="참가자 이름을 줄바꿈 또는 쉼표로 구분해서 입력하세요 (2~10명)"
			rows="3"
		></textarea>
		<button type="button" class="btn-solid" @click="generate">결과 만들기</button>
		<p v-if="error" class="ladder-error">{{ error }}</p>
		<ul v-if="results.length" class="ladder-results">
			<li v-for="item in results" :key="item.name">
				<span>{{ item.name }}</span>
				<span class="ladder-arrow">→</span>
				<span>{{ item.outcome }}</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
import WidgetHeader from '../WidgetHeader.vue'
import { useLadder } from '../../composables/useLadder'

const { namesInput, results, error, generate } = useLadder()
</script>

<style scoped>
.ladder-input {
	width: 100%;
	padding: var(--spacing-8) var(--spacing-12);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-control);
	background: var(--color-canvas);
	font-family: var(--font-sans);
	font-size: var(--text-body);
	color: var(--color-ink);
	resize: vertical;
	margin-bottom: var(--spacing-12);
}

.ladder-error {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-top: var(--spacing-8);
}

.ladder-results {
	list-style: none;
	margin-top: var(--spacing-16);
	display: flex;
	flex-direction: column;
	gap: var(--spacing-8);
}

.ladder-results li {
	display: flex;
	align-items: center;
	gap: var(--spacing-8);
	font-size: var(--text-body);
	color: var(--color-ink);
}

.ladder-arrow {
	color: var(--color-mid-gray);
}
</style>
```

- [ ] **Step 3: `src/App.vue` 수정 — LadderWidget 등록**

`<script setup>`의 `import LunchRouletteWidget ...` 다음 줄에 추가:

```js
import LadderWidget from './components/widgets/LadderWidget.vue'
```

`.widget-grid` 안, `LunchRouletteWidget`을 감싼 `<div class="widget--sm">` 블록 다음에 추가:

```html
		<div class="widget--md">
			<LadderWidget />
		</div>
```

- [ ] **Step 4: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

`npm run dev`로 브라우저에서: 1명만 입력 후 "결과 만들기" 클릭 시 에러 문구가 뜨는지, 이름 3~4개를 줄바꿈으로 입력 후 결과가 1:1 매칭 리스트로 표시되는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/composables/useLadder.js src/components/widgets/LadderWidget.vue src/App.vue
git commit -m "feat: 사다리타기 위젯 추가"
```

---

## Task 6: 연봉 실수령액 계산기

**Files:**
- Create: `src/composables/useSalaryCalculator.js`
- Create: `src/components/widgets/SalaryCalculatorWidget.vue`
- Modify: `src/App.vue` (위젯 등록)

**Interfaces:**
- Consumes: Task 1의 `.widget-card`, `.btn-solid`, `WidgetHeader.vue`, `.widget--md`
- Produces: `useSalaryCalculator()` — `{ annualSalaryInput: Ref<string>, result: Ref<object|null>, calculate: () => void }`

**요율 출처 (2026년 기준, 이 계획 작성 시점에 웹 검색으로 확인)**: 국민연금 근로자 부담 4.75%(기준소득월액 하한 40만원/상한 637만원), 건강보험 근로자 부담 3.595%, 장기요양보험은 건강보험료의 12.95%, 고용보험 근로자 부담 0.9%. 소득세는 부양가족 미반영·근로소득세액공제 미적용 근사치로, 2023년 개정 이후 안정적으로 유지되고 있는 종합소득세 누진세율표를 사용한다 — 정식 근로소득 간이세액표(부양가족수별 매트릭스)보다 단순화된 참고용 계산이며, 위젯에 그 사실을 명시한다.

- [ ] **Step 1: `src/composables/useSalaryCalculator.js` 신규 생성**

```js
import { ref } from 'vue'

// 2026년 기준 4대보험 근로자 부담 요율 (참고용, 매년 변경될 수 있음)
const NATIONAL_PENSION_RATE = 0.0475
const NATIONAL_PENSION_MIN_BASE = 400000
const NATIONAL_PENSION_MAX_BASE = 6370000
const HEALTH_INSURANCE_RATE = 0.03595
const LONG_TERM_CARE_RATE = 0.1295 // 건강보험료 대비 비율
const EMPLOYMENT_INSURANCE_RATE = 0.009

const BASIC_DEDUCTION = 1500000 // 본인 기본공제만 반영 (부양가족 미반영)
const LOCAL_TAX_RATE = 0.1 // 지방소득세 = 소득세의 10%

function calcEarnedIncomeDeduction(annualSalary) {
	if (annualSalary <= 5000000) {
		return annualSalary * 0.7
	}
	if (annualSalary <= 15000000) {
		return 3500000 + (annualSalary - 5000000) * 0.4
	}
	if (annualSalary <= 45000000) {
		return 7500000 + (annualSalary - 15000000) * 0.15
	}
	if (annualSalary <= 100000000) {
		return 12000000 + (annualSalary - 45000000) * 0.05
	}
	return 14750000 + (annualSalary - 100000000) * 0.02
}

const TAX_BRACKETS = [
	{ limit: 14000000, rate: 0.06, deduction: 0 },
	{ limit: 50000000, rate: 0.15, deduction: 1260000 },
	{ limit: 88000000, rate: 0.24, deduction: 5760000 },
	{ limit: 150000000, rate: 0.35, deduction: 15440000 },
	{ limit: 300000000, rate: 0.38, deduction: 19940000 },
	{ limit: 500000000, rate: 0.4, deduction: 25940000 },
	{ limit: 1000000000, rate: 0.42, deduction: 35940000 },
	{ limit: Infinity, rate: 0.45, deduction: 65940000 },
]

function calcIncomeTax(taxBase) {
	if (taxBase <= 0) return 0
	const bracket = TAX_BRACKETS.find((b) => taxBase <= b.limit)
	return Math.max(0, taxBase * bracket.rate - bracket.deduction)
}

export function useSalaryCalculator() {
	const annualSalaryInput = ref('')
	const result = ref(null)

	const calculate = () => {
		const annualSalaryManwon = Number(annualSalaryInput.value)
		if (!annualSalaryManwon || annualSalaryManwon <= 0) {
			result.value = null
			return
		}

		const annualSalary = annualSalaryManwon * 10000
		const monthlySalary = annualSalary / 12

		const pensionBase = Math.min(
			Math.max(monthlySalary, NATIONAL_PENSION_MIN_BASE),
			NATIONAL_PENSION_MAX_BASE,
		)
		const monthlyNationalPension = Math.floor(pensionBase * NATIONAL_PENSION_RATE)
		const monthlyHealthInsurance = Math.floor(monthlySalary * HEALTH_INSURANCE_RATE)
		const monthlyLongTermCare = Math.floor(monthlyHealthInsurance * LONG_TERM_CARE_RATE)
		const monthlyEmploymentInsurance = Math.floor(monthlySalary * EMPLOYMENT_INSURANCE_RATE)

		const earnedIncomeDeduction = calcEarnedIncomeDeduction(annualSalary)
		const taxBase = Math.max(0, annualSalary - earnedIncomeDeduction - BASIC_DEDUCTION)
		const annualIncomeTax = calcIncomeTax(taxBase)
		const monthlyIncomeTax = Math.floor(annualIncomeTax / 12)
		const monthlyLocalTax = Math.floor(monthlyIncomeTax * LOCAL_TAX_RATE)

		const totalDeduction =
			monthlyNationalPension +
			monthlyHealthInsurance +
			monthlyLongTermCare +
			monthlyEmploymentInsurance +
			monthlyIncomeTax +
			monthlyLocalTax

		result.value = {
			monthlyGross: Math.floor(monthlySalary),
			nationalPension: monthlyNationalPension,
			healthInsurance: monthlyHealthInsurance,
			longTermCare: monthlyLongTermCare,
			employmentInsurance: monthlyEmploymentInsurance,
			incomeTax: monthlyIncomeTax,
			localTax: monthlyLocalTax,
			totalDeduction,
			netPay: Math.floor(monthlySalary) - totalDeduction,
		}
	}

	return {
		annualSalaryInput,
		result,
		calculate,
	}
}
```

- [ ] **Step 2: `src/components/widgets/SalaryCalculatorWidget.vue` 신규 생성**

```vue
<template>
	<div class="widget-card">
		<WidgetHeader icon="💰" title="연봉 실수령액 계산기" />
		<div class="salary-input-row">
			<input
				v-model="annualSalaryInput"
				type="number"
				min="0"
				placeholder="세전 연봉 (만원)"
				class="salary-input"
				@keyup.enter="calculate"
			/>
			<button type="button" class="btn-solid" @click="calculate">계산하기</button>
		</div>
		<div v-if="result" class="salary-result">
			<div class="salary-net">
				<span class="salary-net-label">월 실수령액</span>
				<span class="salary-net-value">{{ formatWon(result.netPay) }}원</span>
			</div>
			<ul class="salary-breakdown">
				<li><span>국민연금</span><span>{{ formatWon(result.nationalPension) }}원</span></li>
				<li><span>건강보험</span><span>{{ formatWon(result.healthInsurance) }}원</span></li>
				<li><span>장기요양보험</span><span>{{ formatWon(result.longTermCare) }}원</span></li>
				<li><span>고용보험</span><span>{{ formatWon(result.employmentInsurance) }}원</span></li>
				<li><span>소득세</span><span>{{ formatWon(result.incomeTax) }}원</span></li>
				<li><span>지방소득세</span><span>{{ formatWon(result.localTax) }}원</span></li>
			</ul>
		</div>
		<p class="salary-disclaimer">
			2026년 요율 기준 참고용 계산이며(부양가족·비과세액 미반영), 실제 급여와 다를 수 있습니다.
		</p>
	</div>
</template>

<script setup>
import WidgetHeader from '../WidgetHeader.vue'
import { useSalaryCalculator } from '../../composables/useSalaryCalculator'

const { annualSalaryInput, result, calculate } = useSalaryCalculator()

function formatWon(value) {
	return value.toLocaleString('ko-KR')
}
</script>

<style scoped>
.salary-input-row {
	display: flex;
	gap: var(--spacing-8);
	margin-bottom: var(--spacing-16);
}

.salary-input {
	flex: 1;
	padding: var(--spacing-8) var(--spacing-12);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-control);
	background: var(--color-canvas);
	font-size: var(--text-body);
	color: var(--color-ink);
}

.salary-result {
	margin-bottom: var(--spacing-12);
}

.salary-net {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: var(--color-ink-soft);
	color: var(--color-paper);
	border-radius: var(--radius-nested);
	padding: var(--spacing-12) var(--spacing-16);
	margin-bottom: var(--spacing-12);
}

.salary-net-label {
	font-size: var(--text-caption);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.salary-net-value {
	font-size: var(--text-heading-sm);
	font-weight: 600;
	font-variant-numeric: tabular-nums;
}

.salary-breakdown {
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: var(--spacing-4);
}

.salary-breakdown li {
	display: flex;
	justify-content: space-between;
	font-size: var(--text-body);
	color: var(--color-mid-gray);
}

.salary-disclaimer {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-top: var(--spacing-12);
}
</style>
```

- [ ] **Step 3: `src/App.vue` 수정 — SalaryCalculatorWidget 등록**

`<script setup>`의 `import LadderWidget ...` 다음 줄에 추가:

```js
import SalaryCalculatorWidget from './components/widgets/SalaryCalculatorWidget.vue'
```

`.widget-grid` 안, `LadderWidget`을 감싼 `<div class="widget--md">` 블록 다음에 추가:

```html
		<div class="widget--md">
			<SalaryCalculatorWidget />
		</div>
```

- [ ] **Step 4: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

`npm run dev`로 브라우저에서 연봉(예: 4000만원) 입력 후 "계산하기" 클릭 시 월 실수령액과 공제 내역(국민연금/건강보험/장기요양보험/고용보험/소득세/지방소득세)이 모두 표시되는지, 값이 음수가 아닌지 확인. 0 또는 빈 값 입력 시 결과가 표시되지 않는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/composables/useSalaryCalculator.js src/components/widgets/SalaryCalculatorWidget.vue src/App.vue
git commit -m "feat: 연봉 실수령액 계산기 위젯 추가"
```

---

## Task 7: Cloudflare Pages 배포 준비 및 문서화

**Files:**
- Modify: `README.md`
- Modify: `wiki/pages/overview.md`
- Modify: `wiki/pages/log.md`

이 태스크는 실제 Cloudflare 대시보드 조작(계정 로그인, GitHub 연결)을 포함하지 않는다 — 에이전트에게 Cloudflare 계정 접근 권한이 없으므로, 사용자가 그대로 따라 할 수 있는 배포 안내문서를 작성하는 것까지가 이 태스크의 범위다.

- [ ] **Step 1: `README.md`의 "📦 배포" 섹션을 아래로 교체**

기존 "## 📦 배포" 섹션(GitHub Pages/Actions 관련 내용) 전체를 찾아서 아래로 교체:

```markdown
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
```

- [ ] **Step 2: `wiki/pages/overview.md`의 배포 관련 서술을 Cloudflare Pages로 갱신**

파일을 읽고 "GitHub Pages" 또는 "GitHub Actions" 자동배포를 언급하는 문장을 찾아 "Cloudflare Pages, `main` 브랜치 push 시 자동 빌드/배포"로 교체. 그 외 내용(기능 목록, 스택 등)은 건드리지 않는다. 파일 하단에 위젯 허브 MVP 5종(로또/오늘의 한마디/점심 메뉴 룰렛/사다리타기/연봉 실수령액 계산기)이 추가됐다는 한 줄을 기능 목록에 보탠다.

- [ ] **Step 3: `wiki/pages/log.md`에 항목 추가**

파일 끝에 추가:

```markdown

## [2026-08-31] ingest | 위젯 허브 MVP 구현 및 Cloudflare 배포 문서화
로또/오늘의 한마디/점심 메뉴 룰렛/사다리타기/연봉 실수령액 계산기 5개 위젯 구현 완료.
overview.md의 GitHub Pages/Actions 배포 서술을 Cloudflare Pages로 갱신 (드리프트 해소).
Updated: overview.md, README.md.
```

- [ ] **Step 4: 검증**

Run: `npm run build`
Expected: 에러 없이 빌드 성공 (문서 변경만 있었으므로 코드 변경 없음, 회귀 없어야 함)

`README.md`와 `wiki/pages/overview.md`를 열어 GitHub Pages/Actions 관련 문구가 더 이상 남아있지 않은지 확인.

- [ ] **Step 5: 커밋**

```bash
git add README.md wiki/pages/overview.md wiki/pages/log.md
git commit -m "docs: Cloudflare Pages 배포 안내 및 위젯 허브 MVP 위키 반영"
```

---

## Self-Review Notes

- **스펙 커버리지**: `2026-08-31-widget-hub-mvp-design.md`의 확정 MVP 5개 위젯, 그리드 레이아웃 규칙, 다크 인버전 절제 규칙, 각 위젯 면책 문구, Cloudflare 배포 계획이 모두 Task 1~7에 매핑됨. GA는 설계 문서에 TODO로만 남기기로 했으므로 이 구현 계획에는 태스크 없음(의도적).
- **플레이스홀더 스캔**: "TBD"/"나중에" 없음. 연봉계산기 요율은 실제 웹 검색으로 확인한 2026년 수치를 사용(설계 문서 단계와 달리 이 계획에는 실제 값을 채워 넣음).
- **타입/이름 일관성**: `useLotto`/`useQuote`/`useLunchRoulette`/`useLadder`/`useSalaryCalculator` 각 컴포저블이 반환하는 필드명이 대응하는 Widget.vue의 `<script setup>` 구조분해와 정확히 일치하는지 확인 완료. `App.vue`에 각 태스크가 추가하는 import/등록 블록이 이전 태스크가 남긴 마지막 위젯 바로 다음에 이어지도록 순서를 맞춤(Task 2→3→4→5→6 순서로 로또→명언→룰렛→사다리타기→연봉계산기).
