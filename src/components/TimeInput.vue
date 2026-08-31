<template>
	<div class="input-section">
		<div class="input-section-header">
			<label for="start-time">
				<span class="label-icon">🕐</span>
				출근 시간 입력
			</label>
		<div class="halfday-checkbox-section">
			<label class="halfday-label">
				<input
					type="checkbox"
					:checked="isHalfDay"
					@change="handleHalfDayChange"
					class="halfday-checkbox"
				/>
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

const handleHalfDayChange = (event) => {
	emit('update:isHalfDay', event.target.checked)
	emit('change', props.modelValue)
}
</script>

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
