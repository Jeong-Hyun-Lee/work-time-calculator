<template>
	<div class="countdown-section">
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
			<button
				type="button"
				class="copy-btn"
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
			<button
				type="button"
				class="copy-btn"
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
import { ref } from 'vue'

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
	copyToClipboard(`퇴근기모리 장단까지 ${h}시간 ${m}분 ${s}초 `)
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
</script>

<style scoped>
.countdown-section {
	margin-top: auto;
	flex-shrink: 0;
}

.countdown {
	background: var(--color-ink-soft);
	padding: var(--spacing-24);
	border-radius: var(--radius-card);
	text-align: center;
	color: var(--color-paper);
	position: relative;
}

.countdown-icon {
	font-size: 2rem;
	margin-bottom: var(--spacing-12);
	display: block;
}

.countdown-label {
	font-size: var(--text-caption);
	margin-bottom: var(--spacing-16);
	color: var(--color-mid-gray);
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
	color: var(--color-mid-gray);
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

.separator {
	font-size: 2rem;
	font-weight: 300;
	color: var(--color-mid-gray);
	margin: 0 0.25rem;
}

.copy-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.35rem;
	margin-top: var(--spacing-16);
	padding: var(--spacing-8) var(--spacing-16);
	font-size: var(--text-body);
	font-weight: 500;
	color: var(--color-paper);
	background: transparent;
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-control);
	cursor: pointer;
	transition: background 0.2s;
	position: absolute;
	bottom: var(--spacing-16);
	right: var(--spacing-16);
}

.copy-btn:hover {
	background: rgba(255, 255, 255, 0.08);
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
