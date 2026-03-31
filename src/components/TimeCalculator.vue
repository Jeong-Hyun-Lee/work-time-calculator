<template>
	<div
		class="time-calculator"
		:class="{
			'broly-theme-bg': isBrolyTheme,
			'vegito-theme-bg': isVegitoTheme,
		}"
	>
		<div
			class="background-animation"
			v-if="!isBrolyTheme && !isVegitoTheme"
		></div>
		<!-- 브로리 에너지 오라 배경 -->
		<div v-if="isBrolyTheme" class="broly-aura-field"></div>
		<!-- 전기 효과 (베지트 테마) -->
		<ElectricEffects
			v-if="isVegitoTheme"
			:primary-color="'#00bfff'"
			:secondary-color="'#00ffff'"
			:accent-color="'#87ceeb'"
		/>
		<!-- 전기 효과 (브로리 테마) -->
		<ElectricEffects
			v-if="isBrolyTheme"
			:primary-color="'#7cfc00'"
			:secondary-color="'#ffff00'"
			:accent-color="'#32cd32'"
		/>
		<!-- 브로리 dim 오버레이 -->
		<div v-if="isBrolyTheme" class="broly-dim-overlay"></div>
		<!-- 베지트 dim 오버레이 -->
		<div v-if="isVegitoTheme" class="vegito-dim-overlay"></div>
		<div
			class="container"
			:class="{
				'broly-transparent': isBrolyTheme,
				'vegito-transparent': isVegitoTheme,
			}"
		>
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
import { useTheme } from '../composables/useTheme'
import { computed } from 'vue'
import ElectricEffects from './ElectricEffects.vue'

// 테마 초기화
const { currentTheme } = useTheme()
const isVegitoTheme = computed(() => currentTheme.value === 'vegito')
const isBrolyTheme = computed(() => currentTheme.value === 'broly')

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
	background: var(
		--theme-background,
		linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
	);
	padding: 1rem;
	position: relative;
	overflow: hidden;
	transition: background 0.5s ease;
}

/* 브로리 테마 배경 이미지 */
.time-calculator.broly-theme-bg {
	background-image: url('@/assets/brory.png');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-attachment: fixed;
	position: relative;
}

/* 베지트 테마 배경 이미지 */
.time-calculator.vegito-theme-bg {
	background-image: url('@/assets/vegito.jpg');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-attachment: fixed;
	position: relative;
}

/* 브로리 dim 오버레이 */
.broly-dim-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 0;
	pointer-events: none;
}

/* 베지트 dim 오버레이 */
.vegito-dim-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 0;
	pointer-events: none;
}

/* 녹색 에너지 필드 */
.green-energy-field {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: radial-gradient(
		ellipse at 20% 50%,
		rgba(0, 255, 127, 0.4) 0%,
		rgba(0, 255, 127, 0.2) 25%,
		rgba(0, 200, 100, 0.1) 50%,
		transparent 70%
	);
	animation: greenFieldPulse 6s ease-in-out infinite;
	pointer-events: none;
	z-index: 0;
}

@keyframes greenFieldPulse {
	0%,
	100% {
		opacity: 0.4;
		transform: scale(1) rotate(0deg);
	}
	25% {
		opacity: 0.5;
		transform: scale(1.1) rotate(5deg);
	}
	50% {
		opacity: 0.3;
		transform: scale(1.2) rotate(0deg);
	}
	75% {
		opacity: 0.5;
		transform: scale(1.1) rotate(-5deg);
	}
}

/* 브로리 에너지 오라 필드 */
.broly-aura-field {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: radial-gradient(
		ellipse at 50% 50%,
		rgba(255, 255, 0, 0.5) 0%,
		rgba(124, 252, 0, 0.4) 20%,
		rgba(50, 205, 50, 0.3) 40%,
		rgba(34, 139, 34, 0.2) 60%,
		transparent 80%
	);
	animation: brolyAuraPulse 5s ease-in-out infinite;
	pointer-events: none;
	z-index: 0;
}

@keyframes brolyAuraPulse {
	0%,
	100% {
		opacity: 0.5;
		transform: scale(1) rotate(0deg);
	}
	25% {
		opacity: 0.6;
		transform: scale(1.1) rotate(10deg);
	}
	50% {
		opacity: 0.4;
		transform: scale(1.2) rotate(0deg);
	}
	75% {
		opacity: 0.6;
		transform: scale(1.1) rotate(-10deg);
	}
}

.background-animation {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background:
		radial-gradient(
			circle at 20% 50%,
			rgba(255, 255, 255, 0.1) 0%,
			transparent 50%
		),
		radial-gradient(
			circle at 80% 80%,
			rgba(255, 255, 255, 0.1) 0%,
			transparent 50%
		),
		radial-gradient(
			circle at 40% 20%,
			rgba(255, 255, 255, 0.05) 0%,
			transparent 50%
		);
	animation: float 20s ease-in-out infinite;
	pointer-events: none;
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-20px) rotate(5deg);
	}
}

::-webkit-scrollbar {
	border-radius: 4px;
	width: 0;
}
::-webkit-scrollbar-thumb {
	background: rgba(227, 229, 232, 0.16);
	border-radius: 4px;
}

.container {
	overflow: auto;
	background: var(--theme-container-bg, rgba(255, 255, 255, 0.95));
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 32px;
	padding: 2rem;
	box-shadow:
		0 20px 60px rgba(0, 0, 0, 0.15),
		0 0 0 1px rgba(255, 255, 255, 0.5) inset;
	max-width: 1000px;
	width: calc(100% - 2rem);
	height: calc(100vh - 2rem);
	max-height: calc(100vh - 2rem);
	position: relative;
	z-index: 1;
	animation: slideUp 0.6s ease-out;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	transition: background 0.5s ease;
}

/* 브로리 테마일 때 container 반투명 처리 */
.container.broly-transparent {
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	box-shadow:
		0 20px 60px rgba(0, 0, 0, 0.3),
		0 0 0 1px rgba(124, 252, 0, 0.3) inset;
}

/* 베지트 테마일 때 container 반투명 처리 */
.container.vegito-transparent {
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	box-shadow:
		0 20px 60px rgba(0, 0, 0, 0.3),
		0 0 0 1px rgba(0, 191, 255, 0.3) inset;
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
		padding: 1rem;
	}

	.container {
		padding: 1.5rem;
		border-radius: 24px;
		width: calc(100% - 2rem);
		height: calc(100vh - 2rem);
		max-height: calc(100vh - 2rem);
	}
}

@media (max-width: 480px) {
	.time-calculator {
		padding: 0.75rem;
	}

	.container {
		padding: 1.25rem;
		border-radius: 20px;
		width: calc(100% - 1.5rem);
		height: calc(100vh - 1.5rem);
		max-height: calc(100vh - 1.5rem);
	}
}
</style>
