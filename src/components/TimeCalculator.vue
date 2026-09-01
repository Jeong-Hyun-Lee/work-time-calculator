<template>
	<div class="time-calculator">
		<div class="widget-card time-calculator-card">
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

// 첫 렌더에 diffInSeconds 기본값(0)으로 "야근 시간 경과"가 잠깐 보이는 것 방지
calculateTime()

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
	display: flex;
	justify-content: center;
	background: var(--color-canvas);
	padding: var(--spacing-16);
}

.time-calculator-card {
	flex: none;
	max-width: 1000px;
	width: 100%;
	margin: 0 auto;
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
}

@media (max-width: 480px) {
	.time-calculator {
		padding: var(--spacing-12);
	}
}
</style>
