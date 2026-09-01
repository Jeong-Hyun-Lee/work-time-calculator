<template>
	<div class="countdown-section widget-card widget-card--dark" :class="stateClass">
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
			<div class="countdown-progress">
				<div class="countdown-progress-fill" :style="{ width: progress + '%' }"></div>
			</div>
			<button
				type="button"
				class="btn-outline-inverse copy-btn"
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
			<div class="countdown-progress">
				<div class="countdown-progress-fill" :style="{ width: '100%' }"></div>
			</div>
			<button
				type="button"
				class="btn-outline-inverse copy-btn"
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
import { ref, computed } from 'vue'

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
	copyToClipboard(`퇴근기모리장단까지 ${h}시간 ${m}분 ${s}초`)
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

const TOTAL_WORK_SECONDS = computed(() => (props.isHalfDay ? 4 * 3600 : 9 * 3600))

const stateClass = computed(() => {
	if (props.diffInSeconds <= 0) return 'is-overdue'
	if (props.diffInSeconds <= 3600) return 'is-urgent'
	if (props.diffInSeconds <= 7200) return 'is-warning'
	return ''
})

const progress = computed(() => {
	if (props.diffInSeconds <= 0) return 100
	const elapsed = TOTAL_WORK_SECONDS.value - props.diffInSeconds
	return Math.min(100, Math.max(0, (elapsed / TOTAL_WORK_SECONDS.value) * 100))
})
</script>

<style scoped>
.countdown-section {
	justify-content: center;
	animation:
		cardEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards,
		glow 3s ease-in-out infinite;
}

.countdown {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	position: relative;
}

/* master 기본 테마: 회전하는 광원 오버레이 (카드 전체를 덮음) */
.countdown-section::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	/* 정사각형이라 회전해도 모서리가 드러나지 않고,
	   중심에서 벗어난 작은 밝은 점이 카드 위를 훑고 지나감 */
	width: 200%;
	aspect-ratio: 1;
	transform-origin: center;
	margin: -100% 0 0 -100%;
	background: radial-gradient(
		circle at 32% 50%,
		rgba(255, 255, 255, 0.22) 0%,
		rgba(255, 255, 255, 0.1) 8%,
		transparent 18%
	);
	animation: rotate 10s linear infinite;
	pointer-events: none;
}

@keyframes glow {
	0%,
	100% {
		box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
	}
	50% {
		box-shadow: 0 20px 50px rgba(102, 126, 234, 0.6);
	}
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.countdown-icon {
	font-size: 2rem;
	margin-bottom: var(--spacing-12);
	display: block;
	animation: spin 3s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* 2시간 이하 — 경고 */
.countdown-section.is-warning {
	background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
	animation:
		cardEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards,
		glowWarning 2s ease-in-out infinite;
}

@keyframes glowWarning {
	0%,
	100% {
		box-shadow: 0 15px 40px rgba(245, 158, 11, 0.4);
	}
	50% {
		box-shadow: 0 20px 50px rgba(245, 158, 11, 0.6);
	}
}

.is-warning .countdown-icon {
	animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
	0%,
	100% {
		transform: translateX(0);
	}
	25% {
		transform: translateX(-3px);
	}
	75% {
		transform: translateX(3px);
	}
}

/* 1시간 이하 — 긴급 */
.countdown-section.is-urgent {
	background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	animation:
		cardEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards,
		glowUrgent 1s ease-in-out infinite;
}

@keyframes glowUrgent {
	0%,
	100% {
		box-shadow:
			0 15px 40px rgba(239, 68, 68, 0.4),
			0 0 20px rgba(239, 68, 68, 0.3);
	}
	50% {
		box-shadow:
			0 25px 60px rgba(239, 68, 68, 0.6),
			0 0 30px rgba(239, 68, 68, 0.5);
	}
}

.is-urgent .countdown-icon {
	animation:
		shakeUrgent 0.3s ease-in-out infinite,
		spin 3s linear infinite;
}

@keyframes shakeUrgent {
	0%,
	100% {
		transform: translateX(0) translateY(0);
	}
	25% {
		transform: translateX(-5px) translateY(-2px);
	}
	50% {
		transform: translateX(0) translateY(0);
	}
	75% {
		transform: translateX(5px) translateY(2px);
	}
}

.is-urgent .number {
	animation: numberPulse 1s ease-in-out infinite;
}

@keyframes numberPulse {
	0%,
	100% {
		transform: scale(1);
		color: #ffffff;
	}
	50% {
		transform: scale(1.1);
		color: #fef2f2;
	}
}

/* 야근 경과 */
.countdown-section.is-overdue {
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	animation:
		cardEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards,
		glowOverdue 3s ease-in-out infinite;
}

@keyframes glowOverdue {
	0%,
	100% {
		box-shadow: 0 15px 40px rgba(245, 87, 108, 0.4);
	}
	50% {
		box-shadow: 0 20px 50px rgba(245, 87, 108, 0.6);
	}
}

.countdown-label {
	font-size: var(--text-caption);
	margin-bottom: var(--spacing-16);
	color: var(--color-ink-inverse-soft);
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
	color: var(--color-ink-inverse-soft);
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

.separator {
	font-size: 2rem;
	font-weight: 300;
	color: var(--color-ink-inverse-soft);
	margin: 0 0.25rem;
	animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
	0%,
	100% {
		opacity: 0.7;
	}
	50% {
		opacity: 0.3;
	}
}

.countdown-icon,
.countdown-label,
.countdown-value,
.countdown-progress,
.copy-btn {
	position: relative;
	z-index: 1;
}

.countdown-progress {
	width: 100%;
	height: 6px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.25);
	overflow: hidden;
	margin-top: var(--spacing-16);
	margin-bottom: var(--spacing-16);
}

.countdown-progress-fill {
	height: 100%;
	background: var(--color-accent);
	border-radius: 999px;
	transition: width 1s linear;
}

.copy-btn {
	gap: 0.35rem;
	align-self: flex-end;
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
