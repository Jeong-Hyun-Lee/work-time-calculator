<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useStorage, useWebNotification } from '@vueuse/core'
import AppHeader from './components/AppHeader.vue'
import TimeInput from './components/TimeInput.vue'
import StatTile from './components/StatTile.vue'
import CountdownDisplay from './components/CountdownDisplay.vue'
import LottoWidget from './components/widgets/LottoWidget.vue'
import QuoteWidget from './components/widgets/QuoteWidget.vue'
import LunchRouletteWidget from './components/widgets/LunchRouletteWidget.vue'
import LadderWidget from './components/widgets/LadderWidget.vue'
import SalaryCalculatorWidget from './components/widgets/SalaryCalculatorWidget.vue'
import { useTimeCalculation } from './composables/useTimeCalculation'
import {
	registerServiceWorker,
	useHourlyNotification,
} from './composables/useNotification'

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

<template>
	<div class="background-animation"></div>

	<AppHeader />

	<main class="tile-grid">
		<div class="tile tile--4">
			<TimeInput
				v-model="startTime"
				v-model:isHalfDay="isHalfDay"
				@change="handleStartTimeChange"
			/>
		</div>

		<div class="tile tile--8">
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

		<div class="tile tile--2">
			<StatTile label="출근 시간" :value="formattedStartTime" />
		</div>
		<div class="tile tile--2">
			<StatTile label="현재 시간" :value="formattedCurrentTime" />
		</div>
		<div class="tile tile--2">
			<StatTile label="퇴근 시간" :value="formattedEndTime" dark />
		</div>

		<div class="tile tile--6">
			<LottoWidget />
		</div>

		<div class="tile tile--4">
			<QuoteWidget />
		</div>
		<div class="tile tile--4">
			<LunchRouletteWidget />
		</div>
		<div class="tile tile--4">
			<LadderWidget />
		</div>

		<div class="tile tile--12">
			<SalaryCalculatorWidget />
		</div>
	</main>
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

/* master 기본 테마의 떠다니는 배경 레이어 */
.background-animation {
	position: fixed;
	inset: 0;
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
	z-index: 0;
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

.app-header,
.tile-grid {
	position: relative;
	z-index: 1;
}

.tile-grid {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	gap: var(--spacing-12);
	max-width: 1280px;
	margin: 0 auto;
	padding: 0 var(--spacing-16) var(--spacing-48);
}

.tile {
	display: flex;
	flex-direction: column;
}

.tile--2 {
	grid-column: span 2;
}

.tile--4 {
	grid-column: span 4;
}

.tile--6 {
	grid-column: span 6;
}

.tile--8 {
	grid-column: span 8;
}

.tile--12 {
	grid-column: span 12;
}

.tile:nth-child(1) .widget-card {
	animation-delay: 0s;
}
.tile:nth-child(2) .widget-card {
	animation-delay: 0.05s;
}
.tile:nth-child(3) .widget-card {
	animation-delay: 0.1s;
}
.tile:nth-child(4) .widget-card {
	animation-delay: 0.13s;
}
.tile:nth-child(5) .widget-card {
	animation-delay: 0.16s;
}
.tile:nth-child(6) .widget-card {
	animation-delay: 0.2s;
}
.tile:nth-child(7) .widget-card {
	animation-delay: 0.24s;
}
.tile:nth-child(8) .widget-card {
	animation-delay: 0.28s;
}
.tile:nth-child(9) .widget-card {
	animation-delay: 0.32s;
}
.tile:nth-child(10) .widget-card {
	animation-delay: 0.36s;
}

@media (max-width: 1024px) {
	.tile--2 {
		grid-column: span 4;
	}

	.tile--4,
	.tile--6,
	.tile--8 {
		grid-column: span 6;
	}
}

@media (max-width: 768px) {
	.tile--2,
	.tile--4,
	.tile--6,
	.tile--8 {
		grid-column: span 12;
	}
}
</style>
