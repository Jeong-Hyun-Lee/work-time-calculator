<template>
	<div class="widget-card input-section">
		<div class="input-section-header">
			<label for="start-time">
				<span class="label-icon">🕐</span>
				출근 시간
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
				<span class="checkbox-label-text">하프데이</span>
			</label>
		</div>
	</div>
		<VueDatePicker
			v-model="timeModel"
			time-picker
			auto-apply
			teleport
			:input-attrs="{ id: 'start-time', clearable: false }"
			:aria-labels="{ input: '출근 시간' }"
			:time-config="{
				is24: true,
				minutesIncrement: MINUTE_STEP,
				minutesGridIncrement: MINUTE_GRID_STEP,
			}"
			:formats="{ input: 'HH:mm' }"
		>
			<template #input-icon>
				<ClockIcon class="dp-clock-icon" />
			</template>
		</VueDatePicker>
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
import { computed } from 'vue'
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

const pad = (value) => String(value).padStart(2, '0')

// VueDatePicker의 time-picker 모드는 { hours, minutes } 객체를 다루므로
// 저장 포맷인 'HH:mm' 문자열과 양방향으로 변환
const timeModel = computed({
	get() {
		const [hours, minutes] = props.modelValue.split(':').map(Number)
		if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
		return { hours, minutes }
	},
	set(value) {
		if (!value) return

		const next = `${pad(value.hours)}:${pad(value.minutes)}`
		emit('update:modelValue', next)
		emit('change', next)
	},
})

const selectPreset = (preset) => {
	emit('update:modelValue', preset)
	emit('change', preset)
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
