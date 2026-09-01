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
		<div class="input-wrapper" @click="handleWrapperClick">
			<input
				ref="timeInput"
				id="start-time"
				type="time"
				:value="modelValue"
				@change="handleChange"
				@click="handleInputClick"
			/>
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
import { ref } from 'vue'

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

const timeInput = ref(null)

const presets = ['08:00', '08:30', '09:00', '09:30', '10:00']

const openTimePicker = () => {
	if (!timeInput.value) return

	timeInput.value.focus()

	// showPicker는 지원되는 브라우저에서만 동작
	if (typeof timeInput.value.showPicker === 'function') {
		try {
			timeInput.value.showPicker()
		} catch (error) {
			// showPicker 실패 시 무시 (일부 브라우저에서 제한될 수 있음)
		}
	}
}

const handleInputClick = () => {
	// input 필드 클릭 시 시간 선택기 열기
	openTimePicker()
}

const handleWrapperClick = (event) => {
	// wrapper 클릭 시 (input 필드가 아닌 영역)
	if (event.target !== timeInput.value) {
		event.preventDefault()
		openTimePicker()
	}
}

const handleChange = (event) => {
	emit('update:modelValue', event.target.value)
	emit('change', event.target.value)
}

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
	border-color: var(--color-primary);
	background: #ffffff;
	box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
	transform: translateY(-2px);
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
