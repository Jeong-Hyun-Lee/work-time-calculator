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
	margin-bottom: 1.5rem;
	flex-shrink: 0;
}

.input-section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.75rem;
}

.input-section label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: var(--theme-text, #374151);
	font-weight: 600;
	font-size: 1rem;
	transition: color 0.3s ease;
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
	padding: 1rem 1.25rem;
	font-size: 1.1rem;
	border: 2px solid #e5e7eb;
	border-radius: 16px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	background: var(--theme-input-bg, #f9fafb);
	font-weight: 600;
	color: var(--theme-text, #1a1a2e);
	cursor: pointer;
}

.input-section input[type='time']:hover {
	border-color: #d1d5db;
	background: var(--theme-input-bg-hover, #ffffff);
}

.input-section input[type='time']:focus {
	outline: none;
	border-color: var(--theme-primary, #667eea);
	background: var(--theme-input-bg-focus, #ffffff);
	box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
	transform: translateY(-2px);
}

.halfday-checkbox-section {
	margin: 0;
}

.halfday-label {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	cursor: pointer;
	user-select: none;
	color: var(--theme-text, #374151);
	font-weight: 600;
	font-size: 1rem;
	transition: color 0.3s ease;
}

.halfday-label:hover {
	color: var(--theme-primary, #667eea);
}

.halfday-checkbox {
	width: 20px;
	height: 20px;
	cursor: pointer;
	accent-color: var(--theme-primary, #667eea);
}

.checkbox-label-text {
	font-size: 1rem;
}
</style>
