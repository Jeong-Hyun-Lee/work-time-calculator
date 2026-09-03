<template>
	<div class="widget-card input-section">
		<div class="input-section-header">
			<label for="start-time">
				<span class="label-icon">🕐</span>
				{{ $t('time.startTime') }}
			</label>
		<div class="halfday-checkbox-section">
			<label class="halfday-label">
				<input
					type="checkbox"
					:checked="isHalfDay"
					@change="handleHalfDayChange"
					class="halfday-checkbox-input"
				/>
				<span class="halfday-toggle-track">
					<span class="halfday-toggle-thumb"></span>
				</span>
				<span class="checkbox-label-text">{{ $t('time.halfDay') }}</span>
			</label>
		</div>
	</div>
		<div
			class="picker-wrap"
			@wheel="handleInputWheel"
			@focusin="seedInputState"
			@focusout="resyncInputText"
		>
			<VueDatePicker
				v-model="timeModel"
				time-picker
				auto-apply
				teleport
				:input-attrs="{ id: 'start-time', clearable: false }"
				:aria-labels="{
					input: $t('time.startTime'),
					incrementValue: (type) =>
						type === 'hours'
							? $t('time.increaseHour')
							: $t('time.increaseMinute', { step: MINUTE_STEP }),
					decrementValue: (type) =>
						type === 'hours'
							? $t('time.decreaseHour')
							: $t('time.decreaseMinute', { step: MINUTE_STEP }),
				}"
				:time-config="{
					is24: true,
					minutesIncrement: MINUTE_STEP,
					minutesGridIncrement: MINUTE_GRID_STEP,
				}"
				:formats="{ input: 'HH:mm' }"
				:text-input="{
					format: parseTimeInput,
					enterSubmit: true,
					tabSubmit: true,
					applyOnBlur: true,
					selectOnFocus: true,
				}"
				@menu-mounted="bindMenu"
				@menu-unmounted="unbindMenu"
			>
				<template #input-icon>
					<ClockIcon class="dp-clock-icon" />
				</template>
			</VueDatePicker>
		</div>
		<div class="preset-row">
			<button
				v-for="preset in presets"
				:key="preset"
				type="button"
				class="preset-chip"
				:class="{ active: modelValue === preset }"
				@click="selectPreset(preset)"
			>
				{{ preset }}
			</button>
		</div>
	</div>
</template>

<script setup>
import { computed, nextTick, onUnmounted } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import ClockIcon from './icons/ClockIcon.vue'

const props = defineProps({
	modelValue: {
		type: String,
		required: true,
	},
	isHalfDay: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['update:modelValue', 'change', 'update:isHalfDay'])

const presets = ['08:00', '08:30', '09:00', '09:30', '10:00']

// 화살표 버튼은 1분, 분 오버레이 그리드는 5분 간격(1분이면 셀 60개라 고르기 힘듦)
const MINUTE_STEP = 1
const MINUTE_GRID_STEP = 5
const MINUTES_PER_HOUR = 60
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR

const pad = (value) => String(value).padStart(2, '0')

const isValidTime = (hours, minutes) =>
	Number.isInteger(hours) &&
	Number.isInteger(minutes) &&
	hours >= 0 &&
	hours <= 23 &&
	minutes >= 0 &&
	minutes <= 59

// 라이브러리 기본 파서는 '99:99' 같은 값을 조용히 09:00으로 정규화해 버린다.
// 파싱 전에 원문을 직접 검사해서, 실제로 존재하는 시각일 때만 Date를 돌려준다.
const parseTimeInput = (text) => {
	const match = /^(\d{1,2}):(\d{2})$/.exec(String(text).trim())
	if (!match) return null

	const hours = Number(match[1])
	const minutes = Number(match[2])
	if (!isValidTime(hours, minutes)) return null

	const date = new Date()
	date.setHours(hours, minutes, 0, 0)
	return date
}

// 무효한 글자를 남긴 채 포커스를 잃으면 표시와 실제 값이 어긋나므로 되돌린다.
// 라이브러리도 blur를 처리하므로 다음 틱으로 미뤄 순서 의존을 없앤다.
const resyncInputText = (event) => {
	const wrap = event.currentTarget
	setTimeout(() => {
		const input = wrap.querySelector('.dp--input')
		if (input && input.value !== props.modelValue) {
			input.value = props.modelValue
		}
	}, 0)
}

// VueDatePicker의 time-picker 모드는 { hours, minutes } 객체를 다루므로
// 저장 포맷인 'HH:mm' 문자열과 양방향으로 변환
const timeModel = computed({
	get() {
		const [hours, minutes] = props.modelValue.split(':').map(Number)
		if (!isValidTime(hours, minutes)) return null
		return { hours, minutes }
	},
	set(value) {
		if (!value) return

		const hours = Number(value.hours)
		const minutes = Number(value.minutes)
		if (!isValidTime(hours, minutes)) return

		const next = `${pad(hours)}:${pad(minutes)}`
		emit('update:modelValue', next)
		emit('change', next)
	},
})

// 자정을 넘기면 하루 안에서 순환
const adjustTime = (deltaMinutes) => {
	const current = timeModel.value
	if (!current) return

	const total =
		(((current.hours * MINUTES_PER_HOUR + current.minutes + deltaMinutes) %
			MINUTES_PER_DAY) +
			MINUTES_PER_DAY) %
		MINUTES_PER_DAY

	timeModel.value = {
		hours: Math.floor(total / MINUTES_PER_HOUR),
		minutes: total % MINUTES_PER_HOUR,
	}
	syncInputState()
}

const menuInput = () => document.getElementById('start-time')

// textInput을 켜면 라이브러리가 입력 텍스트 상태를 따로 들고 있다.
// 사용자가 타이핑하기 전에는 그게 비어 있어서, blur나 메뉴 클릭처럼
// 그 상태를 적용하는 경로에서 new Date()(현재 시각)로 폴백해 버린다.
// 모델 값을 심어 두면 어느 경로로 가든 올바른 값이 나온다.
const seedInputState = () => {
	const input = menuInput()
	if (!input) return

	input.value = props.modelValue
	input.dispatchEvent(new Event('input', { bubbles: true }))
}

// 라이브러리 밖에서 모델을 바꾸면(스크롤, 프리셋) 내부 상태는 옛 값으로 남아
// blur 때 그 값으로 되돌려 버린다. 새 모델이 내려온 뒤 다시 심는다.
const syncInputState = () => nextTick(seedInputState)

// 입력 영역 위 스크롤. 포커스가 있을 때만 동작시켜,
// 그냥 페이지를 넘기려던 스크롤이 시간을 바꿔버리는 일을 막는다
const handleInputWheel = (event) => {
	if (!event.target.closest('.dp--input-wrap')) return

	const input = menuInput()
	if (!input || document.activeElement !== input) return

	event.preventDefault()
	adjustTime(event.deltaY < 0 ? MINUTE_STEP : -MINUTE_STEP)
}

// 메뉴는 body로 teleport 되어 템플릿 @wheel이 닿지 않으므로
// 라이브러리가 주는 menu-mounted 훅에서 직접 건다
let removeMenuListeners = null

const bindMenu = (menuEl) => {
	unbindMenu()

	// .dp--time-col에는 시/분 사이의 ':' 구분자 칸도 포함되므로
	// 증감 버튼을 가진 칸만 남긴다. 그러면 첫 칸이 시, 둘째가 분이다.
	const [hourColumn] = [...menuEl.querySelectorAll('.dp--time-col')].filter((column) =>
		column.querySelector('.dp--inc-dec-button'),
	)

	// 칸 위가 아니어도 메뉴 어디서든 굴릴 수 있게 달력 컨테이너에 위임한다
	const wheelTarget = menuEl.querySelector('.dp--instance-calendar') ?? menuEl

	const onWheel = (event) => {
		// 팝오버 위에서는 페이지가 같이 스크롤되지 않아야 함
		event.preventDefault()

		const overHour =
			hourColumn && event.target.closest('.dp--time-col') === hourColumn
		const step = overHour ? MINUTES_PER_HOUR : MINUTE_STEP
		adjustTime(event.deltaY < 0 ? step : -step)
	}

	// 타이핑 중이면 무효한 중간값('10:2')이 남아 있을 수 있으므로,
	// 클릭이 처리되기 전(capture 단계)에 모델 값을 다시 심는다.
	const onMouseDownCapture = () => seedInputState()

	wheelTarget.addEventListener('wheel', onWheel, { passive: false })
	menuEl.addEventListener('mousedown', onMouseDownCapture, true)

	removeMenuListeners = () => {
		wheelTarget.removeEventListener('wheel', onWheel)
		menuEl.removeEventListener('mousedown', onMouseDownCapture, true)
	}
}

const unbindMenu = () => {
	if (!removeMenuListeners) return
	removeMenuListeners()
	removeMenuListeners = null
}

// 메뉴가 열린 채로 컴포넌트가 사라지면 menu-unmounted가 안 올 수 있음
onUnmounted(unbindMenu)

const selectPreset = (preset) => {
	emit('update:modelValue', preset)
	emit('change', preset)
	syncInputState()
}

const handleHalfDayChange = (event) => {
	emit('update:isHalfDay', event.target.checked)
	emit('change', props.modelValue)
}
</script>

<style scoped>
.input-section {
	justify-content: center;
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

/* VueDatePicker 입력 필드를 기존 위젯 컨트롤 스타일에 맞춤.
   메뉴는 body로 teleport 되므로 테마 변수는 main.css(전역)에 있음 */
.input-section :deep(.dp--input) {
	width: 100%;
	padding: var(--spacing-8) var(--spacing-12);
	font-family: var(--font-sans);
	font-size: var(--text-body-lg);
	font-weight: 600;
	color: var(--color-ink);
	background: var(--color-canvas);
	border: 1px solid var(--color-field-border);
	border-radius: var(--radius-control);
	box-shadow: inset 0 1px 2px rgba(26, 26, 46, 0.06);
	cursor: pointer;
	transition:
		border-color 0.2s ease,
		background 0.2s ease,
		box-shadow 0.2s ease;
}

.input-section :deep(.dp--input-icon-pad) {
	padding-left: var(--dp-input-icon-padding);
}

.picker-wrap {
	display: contents;
}

.dp-clock-icon {
	/* inline svg는 baseline 여백이 붙어 부모 박스가 커지고, 그만큼 세로 중앙이 어긋남 */
	display: block;
	width: 18px;
	height: 18px;
	margin-left: var(--spacing-12);
	color: var(--color-mid-gray);
}

.input-section :deep(.dp--input:hover) {
	background: #ffffff;
	border-color: var(--color-ink-soft);
}

.input-section :deep(.dp--input-focus) {
	border-color: var(--color-primary);
	background: #ffffff;
	box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.input-section :deep(.dp--input-icon) {
	color: var(--color-mid-gray);
}

.preset-row {
	display: flex;
	flex-wrap: wrap;
	gap: var(--spacing-8);
	margin-top: var(--spacing-12);
}

.preset-chip {
	padding: var(--spacing-4) var(--spacing-12);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-control);
	background: var(--color-canvas);
	color: var(--color-mid-gray);
	font-size: var(--text-caption);
	font-family: var(--font-sans);
	cursor: pointer;
	transition:
		background 0.15s ease,
		color 0.15s ease,
		border-color 0.15s ease;
}

.preset-chip:hover {
	background: var(--color-surface-alt);
	color: var(--color-ink);
}

.preset-chip.active {
	background: var(--color-ink-soft);
	border-color: var(--color-ink-soft);
	color: var(--color-paper);
}

.preset-chip:focus-visible {
	outline: 2px solid var(--color-ink);
	outline-offset: 2px;
}

.halfday-checkbox-section {
	margin: 0;
}

.halfday-label {
	display: flex;
	align-items: center;
	gap: var(--spacing-8);
	cursor: pointer;
	user-select: none;
	color: var(--color-ink);
	font-weight: 600;
	font-size: var(--text-body);
}

.halfday-label:hover .halfday-toggle-track {
	background: var(--color-mid-gray);
}

.halfday-checkbox-input {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.halfday-toggle-track {
	position: relative;
	width: 36px;
	height: 20px;
	border-radius: 999px;
	background: var(--color-hairline);
	transition: background 0.2s ease;
	flex-shrink: 0;
}

.halfday-toggle-thumb {
	position: absolute;
	top: 2px;
	left: 2px;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: var(--color-paper);
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
	transition: transform 0.2s ease;
}

.halfday-checkbox-input:checked + .halfday-toggle-track {
	background: var(--color-ink-soft);
}

.halfday-checkbox-input:checked + .halfday-toggle-track .halfday-toggle-thumb {
	transform: translateX(16px);
}

.halfday-checkbox-input:focus-visible + .halfday-toggle-track {
	outline: 2px solid var(--color-ink);
	outline-offset: 2px;
}

.checkbox-label-text {
	font-size: var(--text-body);
}
</style>
