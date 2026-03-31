<template>
	<div class="countdown-section">
		<!-- 브로리 에너지 효과 배경 -->
		<div v-if="isBrolyTheme" class="broly-energy-background">
			<div class="energy-streak streak-1"></div>
			<div class="energy-streak streak-2"></div>
			<div class="energy-streak streak-3"></div>
			<div class="energy-streak streak-4"></div>
			<div class="energy-streak streak-5"></div>
			<div class="energy-streak streak-6"></div>
		</div>

		<div
			v-if="diffInSeconds > 0"
			class="countdown"
			:class="{
				'vegito-theme': isVegitoTheme,
				'broly-theme': isBrolyTheme,
				warning: diffInSeconds <= 7200 && diffInSeconds > 3600,
				urgent: diffInSeconds <= 3600,
			}"
		>
			<!-- 베지트 에너지파 Progress Bar -->
			<div v-if="isVegitoTheme" class="energy-wave-container">
				<div class="goku-silhouette">
					<img class="goku-svg" :src="vegitoSilhouetteImg" alt="Vegito" />
				</div>
				<div class="energy-wave-bar">
					<div class="energy-wave" :style="{ width: energyProgress + '%' }">
						<div class="energy-glow"></div>
						<div class="energy-particles">
							<div class="particle" v-for="i in particles" :key="i"></div>
						</div>
					</div>
				</div>
			</div>
			<!-- 브로리 에너지파 Progress Bar -->
			<div v-if="isBrolyTheme" class="energy-wave-container">
				<div class="goku-silhouette broly-silhouette">
					<img class="goku-svg" :src="brorySilhouetteImg" alt="Broly" />
				</div>
				<div class="energy-wave-bar">
					<div
						class="energy-wave broly-energy"
						:style="{ width: energyProgress + '%' }"
					>
						<div class="energy-glow broly-glow"></div>
						<div class="energy-particles">
							<div
								class="particle broly-particle"
								v-for="i in particles"
								:key="i"
							></div>
						</div>
					</div>
				</div>
			</div>

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
		<div
			v-else
			class="countdown overdue"
			:class="{
				'vegito-theme': isVegitoTheme,
				'broly-theme': isBrolyTheme,
			}"
		>
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
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import vegitoSilhouetteImg from '@/assets/vegito.webp'
import brorySilhouetteImg from '@/assets/brory.webp'

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

// 현재 테마 확인
const currentTheme = useStorage('theme', 'default')
const isVegitoTheme = computed(() => currentTheme.value === 'vegito')
const isBrolyTheme = computed(() => currentTheme.value === 'broly')

// 전체 근무 시간 계산 (하프데이면 4시간, 아니면 9시간)
const TOTAL_WORK_SECONDS = computed(() => {
	return props.isHalfDay ? 14400 : 32400 // 4시간 = 14400초, 9시간 = 32400초
})

// 에너지파 진행률 계산 (경과 시간 / 전체 시간)
const energyProgress = computed(() => {
	if (props.diffInSeconds <= 0) return 100
	const elapsed = TOTAL_WORK_SECONDS.value - props.diffInSeconds
	return Math.min(100, Math.max(0, (elapsed / TOTAL_WORK_SECONDS.value) * 100))
})

// 파티클 배열
const particles = [1, 2, 3, 4, 5]
</script>

<style scoped>
.countdown-section {
	margin-top: auto;
	flex-shrink: 0;
	position: relative;
	/* 스크롤 방지를 위해 overflow hidden, 하지만 애니메이션은 clip-path로 처리 */
	/* overflow: hidden; */
}

/* 전기 효과 배경 (드래곤볼 테마일 때만) */
.lightning-background {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
	opacity: 0.6;
	display: block;
}

.lightning {
	position: absolute;
	width: 4px;
	background: linear-gradient(
		to bottom,
		transparent,
		#00bfff,
		#00ffff,
		#ffffff,
		#00ffff,
		#00bfff,
		transparent
	);
	box-shadow: 0 0 15px #00bfff, 0 0 30px #00ffff, 0 0 45px #87ceeb;
	animation: lightning 0.4s ease-in-out infinite;
	opacity: 0;
}

.lightning-1 {
	left: 10%;
	top: 0;
	height: 30%;
	animation-delay: 0s;
	animation-duration: 0.3s;
}

.lightning-2 {
	left: 30%;
	top: 20%;
	height: 40%;
	animation-delay: 0.1s;
	animation-duration: 0.4s;
}

.lightning-3 {
	left: 50%;
	top: 10%;
	height: 35%;
	animation-delay: 0.2s;
	animation-duration: 0.35s;
}

.lightning-4 {
	left: 70%;
	top: 0;
	height: 45%;
	animation-delay: 0.15s;
	animation-duration: 0.4s;
}

.lightning-5 {
	left: 90%;
	top: 15%;
	height: 30%;
	animation-delay: 0.25s;
	animation-duration: 0.3s;
}

@keyframes lightning {
	0% {
		opacity: 0;
		transform: translateY(-10px) scaleY(0);
	}
	10% {
		opacity: 1;
		transform: translateY(0) scaleY(1);
	}
	20% {
		opacity: 0.8;
	}
	30% {
		opacity: 1;
	}
	40% {
		opacity: 0.6;
	}
	50% {
		opacity: 1;
	}
	60% {
		opacity: 0.4;
	}
	70% {
		opacity: 0.9;
	}
	80% {
		opacity: 0.3;
	}
	90% {
		opacity: 0.7;
	}
	100% {
		opacity: 0;
		transform: translateY(10px) scaleY(0);
	}
}

/* 브로리 에너지 효과 배경 */
.broly-energy-background {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
	opacity: 0.7;
}

.energy-streak {
	position: absolute;
	width: 3px;
	background: linear-gradient(
		to bottom,
		transparent,
		#7cfc00,
		#ffff00,
		#ffffff,
		#ffff00,
		#7cfc00,
		transparent
	);
	box-shadow: 0 0 20px #7cfc00, 0 0 40px #ffff00, 0 0 60px #32cd32;
	opacity: 0;
	animation: energyStreak 0.6s ease-in-out infinite;
}

.streak-1 {
	left: 10%;
	top: 0;
	height: 40%;
	animation-delay: 0s;
}

.streak-2 {
	left: 25%;
	top: 10%;
	height: 50%;
	animation-delay: 0.1s;
}

.streak-3 {
	left: 45%;
	top: 0;
	height: 45%;
	animation-delay: 0.2s;
}

.streak-4 {
	left: 65%;
	top: 5%;
	height: 55%;
	animation-delay: 0.15s;
}

.streak-5 {
	left: 80%;
	top: 0;
	height: 40%;
	animation-delay: 0.25s;
}

.streak-6 {
	left: 95%;
	top: 15%;
	height: 45%;
	animation-delay: 0.3s;
}

@keyframes energyStreak {
	0% {
		opacity: 0;
		transform: translateY(-15px) scaleY(0);
	}
	10% {
		opacity: 1;
		transform: translateY(0) scaleY(1);
	}
	20% {
		opacity: 0.9;
	}
	30% {
		opacity: 1;
	}
	40% {
		opacity: 0.7;
	}
	50% {
		opacity: 1;
	}
	60% {
		opacity: 0.5;
	}
	70% {
		opacity: 0.95;
	}
	80% {
		opacity: 0.4;
	}
	90% {
		opacity: 0.8;
	}
	100% {
		opacity: 0;
		transform: translateY(15px) scaleY(0);
	}
}

.countdown {
	background: var(
		--theme-countdown,
		linear-gradient(135deg, #667eea 0%, #764ba2 100%)
	);
	padding: 1.5rem;
	border-radius: 24px;
	text-align: center;
	color: white;
	box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
	position: relative;
	overflow: hidden;
	animation: glow 3s ease-in-out infinite;
	transition: all 0.5s ease;
	z-index: 1;
}

.countdown.vegito-theme {
	background: linear-gradient(
		135deg,
		#0a0a1a 0%,
		#1a1a2e 30%,
		#0f3460 60%,
		#1a1a2e 100%
	);
	border: 2px solid #00bfff;
	box-shadow: 0 15px 40px rgba(0, 191, 255, 0.5),
		0 0 30px rgba(0, 191, 255, 0.4), inset 0 0 40px rgba(0, 191, 255, 0.2);
	position: relative;
	overflow: hidden;
	--silhouette-glow-a: #00bfff;
	--silhouette-glow-b: #00ffff;
	--silhouette-glow-c: #87ceeb;
}

/* 브로리 테마 */
.countdown.broly-theme {
	background: linear-gradient(
		135deg,
		#0a1a0a 0%,
		#1a2e1a 30%,
		#0f340f 60%,
		#1a2e1a 100%
	);
	border: 2px solid #7cfc00;
	box-shadow: 0 15px 40px rgba(124, 252, 0, 0.6),
		0 0 40px rgba(124, 252, 0, 0.5), inset 0 0 50px rgba(124, 252, 0, 0.3);
	position: relative;
	overflow: hidden;
	--silhouette-glow-a: #7cfc00;
	--silhouette-glow-b: #ffff00;
	--silhouette-glow-c: #32cd32;
}

/* 브로리 에너지 오라 배경 */
.countdown.broly-theme::after {
	content: '';
	position: absolute;
	top: -20%;
	left: -20%;
	width: 140%;
	height: 140%;
	background: radial-gradient(
		circle at 50% 50%,
		rgba(255, 255, 0, 0.4) 0%,
		rgba(124, 252, 0, 0.3) 20%,
		rgba(50, 205, 50, 0.2) 40%,
		rgba(34, 139, 34, 0.1) 60%,
		transparent 80%
	);
	animation: brolyAura 6s ease-in-out infinite;
	pointer-events: none;
	z-index: 0;
}

@keyframes brolyAura {
	0%,
	100% {
		transform: rotate(0deg) scale(1);
		opacity: 0.4;
	}
	25% {
		transform: rotate(90deg) scale(1.1);
		opacity: 0.5;
	}
	50% {
		transform: rotate(180deg) scale(1.2);
		opacity: 0.4;
	}
	75% {
		transform: rotate(270deg) scale(1.1);
		opacity: 0.5;
	}
}

/* 베지트 에너지 필드 배경 */
.countdown.vegito-theme::after {
	content: '';
	position: absolute;
	top: -20%;
	left: -20%;
	width: 140%;
	height: 140%;
	background: radial-gradient(
		circle at 30% 50%,
		rgba(0, 191, 255, 0.3) 0%,
		rgba(0, 191, 255, 0.15) 30%,
		transparent 60%
	);
	animation: vegitoEnergySwirl 8s ease-in-out infinite;
	pointer-events: none;
	z-index: 0;
}

@keyframes vegitoEnergySwirl {
	0%,
	100% {
		transform: rotate(0deg) scale(1);
		opacity: 0.3;
	}
	25% {
		transform: rotate(90deg) scale(1.1);
		opacity: 0.4;
	}
	50% {
		transform: rotate(180deg) scale(1.2);
		opacity: 0.3;
	}
	75% {
		transform: rotate(270deg) scale(1.1);
		opacity: 0.4;
	}
}

/* 손오공 에너지파 Progress Bar */
.energy-wave-container {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1.5rem;
	padding: 0.5rem 0;
	width: 100%;
	overflow: hidden;
}

.goku-silhouette {
	flex-shrink: 0;
	z-index: 2;
	width: 60px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.broly-silhouette {
	transform: scaleX(-1);
}

.goku-svg {
	width: 100%;
	height: 100%;
	display: block;
	object-fit: contain;
	filter: drop-shadow(0 0 15px var(--silhouette-glow-a, #00bfff))
		drop-shadow(0 0 30px var(--silhouette-glow-b, #00ffff));
	animation: silhouettePower 2s ease-in-out infinite;
}

@keyframes silhouettePower {
	0%,
	100% {
		transform: scale(1);
		filter: drop-shadow(0 0 15px var(--silhouette-glow-a, #00bfff))
			drop-shadow(0 0 30px var(--silhouette-glow-b, #00ffff));
	}
	50% {
		transform: scale(1.15);
		filter: drop-shadow(0 0 25px var(--silhouette-glow-a, #00bfff))
			drop-shadow(0 0 50px var(--silhouette-glow-b, #00ffff))
			drop-shadow(0 0 75px var(--silhouette-glow-c, #87ceeb));
	}
}

.energy-wave-bar {
	position: relative;
	flex: 1;
	height: 40px;
	background: rgba(0, 0, 0, 0.7);
	border-radius: 20px;
	overflow: hidden;
	border: 2px solid #00bfff;
	box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 191, 255, 0.5),
		0 0 30px rgba(0, 191, 255, 0.3);
}

.energy-wave {
	position: relative;
	height: 100%;
	background: linear-gradient(
		90deg,
		#0066ff 0%,
		#00bfff 20%,
		#00ffff 40%,
		#87ceeb 60%,
		#b0e0e6 80%,
		#ffffff 100%
	);
	border-radius: 18px;
	transition: width 0.3s ease;
	overflow: hidden;
	box-shadow: 0 0 25px rgba(0, 191, 255, 1), 0 0 50px rgba(0, 191, 255, 0.8),
		0 0 75px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.5);
	animation: energyPulse 1.2s ease-in-out infinite;
}

@keyframes energyPulse {
	0%,
	100% {
		box-shadow: 0 0 25px rgba(0, 191, 255, 1), 0 0 50px rgba(0, 191, 255, 0.8),
			0 0 75px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.5);
	}
	50% {
		box-shadow: 0 0 40px rgba(0, 191, 255, 1.2), 0 0 80px rgba(0, 191, 255, 1),
			0 0 120px rgba(0, 255, 255, 0.8), inset 0 0 50px rgba(255, 255, 255, 0.8);
	}
}

.energy-glow {
	position: absolute;
	top: 0;
	right: 0;
	width: 120px;
	height: 100%;
	background: linear-gradient(
		90deg,
		transparent,
		rgba(0, 191, 255, 0.4),
		rgba(0, 255, 255, 0.7),
		rgba(255, 255, 255, 1)
	);
	animation: glowMove 1.5s ease-in-out infinite;
}

/* 브로리 에너지파 */
.energy-wave.broly-energy {
	background: linear-gradient(
		90deg,
		#228b22 0%,
		#32cd32 20%,
		#7cfc00 40%,
		#adff2f 60%,
		#ffff00 80%,
		#ffffff 100%
	);
	box-shadow: 0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(124, 252, 0, 0.9),
		0 0 90px rgba(50, 205, 50, 0.7), inset 0 0 35px rgba(255, 255, 255, 0.6);
	animation: brolyEnergyPulse 1s ease-in-out infinite;
}

@keyframes brolyEnergyPulse {
	0%,
	100% {
		box-shadow: 0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(124, 252, 0, 0.9),
			0 0 90px rgba(50, 205, 50, 0.7), inset 0 0 35px rgba(255, 255, 255, 0.6);
	}
	50% {
		box-shadow: 0 0 50px rgba(255, 255, 0, 1.3),
			0 0 100px rgba(124, 252, 0, 1.1), 0 0 150px rgba(50, 205, 50, 0.9),
			inset 0 0 55px rgba(255, 255, 255, 0.9);
	}
}

.energy-glow.broly-glow {
	background: linear-gradient(
		90deg,
		transparent,
		rgba(124, 252, 0, 0.5),
		rgba(255, 255, 0, 0.8),
		rgba(255, 255, 255, 1)
	);
}

.particle.broly-particle {
	box-shadow: 0 0 20px #ffff00, 0 0 40px #7cfc00, 0 0 60px #32cd32;
}

@keyframes glowMove {
	0% {
		transform: translateX(-100px);
		opacity: 0;
	}
	50% {
		opacity: 1;
	}
	100% {
		transform: translateX(200px);
		opacity: 0;
	}
}

.energy-particles {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.particle {
	position: absolute;
	width: 5px;
	height: 5px;
	background: #ffffff;
	border-radius: 50%;
	box-shadow: 0 0 15px #00bfff, 0 0 30px #00ffff, 0 0 45px #87ceeb;
	animation: particleFloat 2.5s ease-in-out infinite;
}

.particle:nth-child(1) {
	left: 20%;
	top: 20%;
	animation-delay: 0s;
}

.particle:nth-child(2) {
	left: 40%;
	top: 60%;
	animation-delay: 0.5s;
}

.particle:nth-child(3) {
	left: 60%;
	top: 30%;
	animation-delay: 1s;
}

.particle:nth-child(4) {
	left: 80%;
	top: 70%;
	animation-delay: 1.5s;
}

.particle:nth-child(5) {
	left: 50%;
	top: 50%;
	animation-delay: 2s;
}

@keyframes particleFloat {
	0%,
	100% {
		transform: translateY(0) translateX(0) scale(1);
		opacity: 0.9;
	}
	25% {
		transform: translateY(-8px) translateX(5px) scale(1.3);
		opacity: 1;
	}
	50% {
		transform: translateY(-15px) translateX(-3px) scale(1.6);
		opacity: 1;
	}
	75% {
		transform: translateY(-8px) translateX(3px) scale(1.3);
		opacity: 1;
	}
}

/* 2시간 이하 - 경고 단계 */
.countdown.warning {
	background: var(
		--theme-warning,
		linear-gradient(135deg, #f59e0b 0%, #f97316 100%)
	);
	box-shadow: 0 15px 40px rgba(245, 158, 11, 0.4);
	animation: glowWarning 2s ease-in-out infinite;
}

.countdown.warning.vegito-theme {
	background: linear-gradient(
		135deg,
		#0a0a1a 0%,
		#1a1a2e 30%,
		#0f3460 50%,
		#0066ff 70%,
		#00bfff 100%
	);
	border-color: #00bfff;
	box-shadow: 0 15px 40px rgba(0, 191, 255, 0.7),
		0 0 40px rgba(0, 191, 255, 0.5), inset 0 0 40px rgba(0, 191, 255, 0.3);
}

.countdown.warning.broly-theme {
	background: linear-gradient(
		135deg,
		#0a1a0a 0%,
		#1a2e1a 30%,
		#0f340f 50%,
		#228b22 70%,
		#32cd32 100%
	);
	border-color: #32cd32;
	box-shadow: 0 15px 40px rgba(50, 205, 50, 0.8),
		0 0 50px rgba(50, 205, 50, 0.6), inset 0 0 50px rgba(124, 252, 0, 0.4);
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

@keyframes pulseWarning {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.02);
	}
}

.countdown.warning .countdown-icon {
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

/* 1시간 이하 - 긴급 단계 */
.countdown.urgent {
	background: var(
		--theme-urgent,
		linear-gradient(135deg, #ef4444 0%, #dc2626 100%)
	);
	box-shadow: 0 15px 40px rgba(239, 68, 68, 0.4);
	animation: glowUrgent 1s ease-in-out infinite;
}

.countdown.urgent.vegito-theme {
	background: linear-gradient(
		135deg,
		#000033 0%,
		#000066 20%,
		#0066ff 50%,
		#00bfff 80%,
		#00ffff 100%
	);
	border-color: #00ffff;
	box-shadow: 0 15px 40px rgba(0, 255, 255, 0.8),
		0 0 50px rgba(0, 255, 255, 0.6), 0 0 80px rgba(0, 191, 255, 0.4),
		inset 0 0 50px rgba(0, 255, 255, 0.4);
}

.countdown.urgent.broly-theme {
	background: linear-gradient(
		135deg,
		#001a00 0%,
		#003300 20%,
		#32cd32 50%,
		#7cfc00 80%,
		#ffff00 100%
	);
	border-color: #ffff00;
	box-shadow: 0 15px 40px rgba(255, 255, 0, 0.9),
		0 0 60px rgba(255, 255, 0, 0.7), 0 0 100px rgba(124, 252, 0, 0.5),
		inset 0 0 60px rgba(255, 255, 0, 0.5);
}

.countdown.urgent.broly-theme .energy-wave {
	background: linear-gradient(
		90deg,
		#228b22 0%,
		#32cd32 20%,
		#7cfc00 40%,
		#adff2f 60%,
		#ffff00 80%,
		#ffffff 100%
	);
	animation: brolyEnergyPulseUrgent 0.5s ease-in-out infinite;
}

@keyframes brolyEnergyPulseUrgent {
	0%,
	100% {
		box-shadow: 0 0 50px rgba(255, 255, 0, 1.2), 0 0 100px rgba(255, 255, 0, 1),
			0 0 150px rgba(124, 252, 0, 0.8), inset 0 0 50px rgba(255, 255, 255, 0.7);
	}
	50% {
		box-shadow: 0 0 70px rgba(255, 255, 0, 1.5),
			0 0 140px rgba(255, 255, 0, 1.3), 0 0 200px rgba(124, 252, 0, 1),
			inset 0 0 70px rgba(255, 255, 255, 1);
	}
}

.countdown.urgent.vegito-theme .energy-wave {
	background: linear-gradient(
		90deg,
		#0066ff 0%,
		#0080ff 15%,
		#00bfff 30%,
		#00ffff 50%,
		#87ceeb 70%,
		#b0e0e6 85%,
		#ffffff 100%
	);
	animation: energyPulseUrgent 0.6s ease-in-out infinite;
}

.countdown.urgent.broly-theme {
	background: linear-gradient(
		135deg,
		#001a00 0%,
		#003300 20%,
		#32cd32 50%,
		#7cfc00 80%,
		#ffff00 100%
	);
	border-color: #ffff00;
	box-shadow: 0 15px 40px rgba(255, 255, 0, 0.9),
		0 0 60px rgba(255, 255, 0, 0.7), 0 0 100px rgba(124, 252, 0, 0.5),
		inset 0 0 60px rgba(255, 255, 0, 0.5);
}

.countdown.urgent.broly-theme .energy-wave {
	background: linear-gradient(
		90deg,
		#228b22 0%,
		#32cd32 20%,
		#7cfc00 40%,
		#adff2f 60%,
		#ffff00 80%,
		#ffffff 100%
	);
	animation: brolyEnergyPulseUrgent 0.5s ease-in-out infinite;
}

@keyframes brolyEnergyPulseUrgent {
	0%,
	100% {
		box-shadow: 0 0 50px rgba(255, 255, 0, 1.2), 0 0 100px rgba(255, 255, 0, 1),
			0 0 150px rgba(124, 252, 0, 0.8), inset 0 0 50px rgba(255, 255, 255, 0.7);
	}
	50% {
		box-shadow: 0 0 70px rgba(255, 255, 0, 1.5),
			0 0 140px rgba(255, 255, 0, 1.3), 0 0 200px rgba(124, 252, 0, 1),
			inset 0 0 70px rgba(255, 255, 255, 1);
	}
}

@keyframes energyPulseUrgent {
	0%,
	100% {
		box-shadow: 0 0 40px rgba(0, 255, 255, 1), 0 0 80px rgba(0, 255, 255, 0.9),
			0 0 120px rgba(0, 191, 255, 0.7), inset 0 0 40px rgba(255, 255, 255, 0.6);
	}
	50% {
		box-shadow: 0 0 60px rgba(0, 255, 255, 1.3),
			0 0 120px rgba(0, 255, 255, 1.1), 0 0 180px rgba(0, 191, 255, 0.9),
			inset 0 0 60px rgba(255, 255, 255, 0.9);
	}
}

@keyframes glowUrgent {
	0%,
	100% {
		box-shadow: 0 15px 40px rgba(239, 68, 68, 0.4),
			0 0 20px rgba(239, 68, 68, 0.3);
	}
	50% {
		box-shadow: 0 25px 60px rgba(239, 68, 68, 0.6),
			0 0 30px rgba(239, 68, 68, 0.5);
	}
}

@keyframes pulseUrgent {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
}

.countdown.urgent .countdown-icon {
	animation: shakeUrgent 0.3s ease-in-out infinite, spin 3s linear infinite;
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

.countdown.urgent .countdown-value .number {
	animation: numberPulse 1s ease-in-out infinite;
}

@keyframes numberPulse {
	0%,
	100% {
		transform: scale(1);
		color: white;
	}
	50% {
		transform: scale(1.1);
		color: #fef2f2;
	}
}

.countdown.urgent::before {
	animation: rotateUrgent 5s linear infinite;
}

@keyframes rotateUrgent {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
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

.countdown::before {
	content: '';
	position: absolute;
	top: -30%;
	left: -30%;
	width: 160%;
	height: 160%;
	background: radial-gradient(
		circle,
		rgba(255, 255, 255, 0.1) 0%,
		transparent 70%
	);
	animation: rotate 10s linear infinite;
	pointer-events: none;
}

/* 드래곤볼 테마에서는 before 효과 제거 (after로 대체) */
.countdown.vegito-theme::before {
	display: none;
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.countdown.overdue {
	background: var(
		--theme-overdue,
		linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
	);
	box-shadow: 0 15px 40px rgba(245, 87, 108, 0.4);
	animation: glowOverdue 3s ease-in-out infinite;
}

.countdown.overdue.vegito-theme {
	background: linear-gradient(
		135deg,
		#1a1a2e 0%,
		#16213e 30%,
		#6a0dad 60%,
		#9370db 100%
	);
	border-color: #9370db;
	box-shadow: 0 15px 40px rgba(147, 112, 219, 0.5),
		0 0 30px rgba(147, 112, 219, 0.3), inset 0 0 30px rgba(147, 112, 219, 0.1);
}

.countdown.overdue.broly-theme {
	background: linear-gradient(
		135deg,
		#1a2e1a 0%,
		#162e16 30%,
		#6a8d6a 60%,
		#93db93 100%
	);
	border-color: #93db93;
	box-shadow: 0 15px 40px rgba(147, 219, 147, 0.6),
		0 0 40px rgba(147, 219, 147, 0.4), inset 0 0 40px rgba(124, 252, 0, 0.2);
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

.countdown-icon {
	font-size: 2rem;
	margin-bottom: 0.75rem;
	display: block;
	animation: spin 3s linear infinite;
}

.countdown.vegito-theme .countdown-icon {
	font-size: 2.5rem;
	filter: drop-shadow(0 0 15px #00bfff) drop-shadow(0 0 30px #00ffff);
	text-shadow: 0 0 20px #00bfff, 0 0 40px #00ffff;
}

.countdown.broly-theme .countdown-icon {
	font-size: 2.5rem;
	filter: drop-shadow(0 0 20px #7cfc00) drop-shadow(0 0 40px #ffff00);
	text-shadow: 0 0 25px #7cfc00, 0 0 50px #ffff00;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.countdown-label {
	font-size: 0.875rem;
	margin-bottom: 1rem;
	opacity: 0.95;
	font-weight: 500;
	letter-spacing: 0.05em;
	text-transform: uppercase;
}

.countdown-value {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	flex-wrap: wrap;
	position: relative;
	z-index: 1;
}

.copy-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.35rem;
	margin-top: 1rem;
	padding: 0.5rem 1rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: rgba(255, 255, 255, 0.95);
	background: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.4);
	border-radius: 12px;
	cursor: pointer;
	transition: background 0.2s, transform 0.15s;
	position: relative;
	z-index: 1;

	position: absolute;
	bottom: 1rem;
	right: 1rem;
}

.copy-btn:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: scale(1.02);
}

.copy-btn:active {
	transform: scale(0.98);
}

.copy-icon {
	font-size: 1rem;
	line-height: 1;
}

.copy-icon.copied {
	color: #86efac;
}

.copy-text {
	opacity: 0.95;
}

.time-unit {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
}

.number {
	font-size: 2.25rem;
	font-weight: 800;
	letter-spacing: -0.02em;
	line-height: 1;
	font-variant-numeric: tabular-nums;
}

.unit {
	font-size: 0.875rem;
	opacity: 0.9;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

.separator {
	font-size: 2rem;
	font-weight: 300;
	opacity: 0.7;
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

@media (max-width: 768px) {
	.countdown {
		padding: 1.25rem;
	}

	.goku-silhouette {
		width: 50px;
		height: 50px;
	}

	.energy-wave-bar {
		height: 30px;
	}

	.number {
		font-size: 1.75rem;
	}

	.separator {
		font-size: 1.5rem;
	}
}

@media (max-width: 480px) {
	.goku-silhouette {
		width: 40px;
		height: 40px;
	}

	.energy-wave-bar {
		height: 25px;
	}

	.number {
		font-size: 2rem;
	}

	.separator {
		font-size: 1.5rem;
	}

	.countdown-icon {
		font-size: 2.5rem;
	}
}
</style>
