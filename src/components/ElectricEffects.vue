<template>
	<div class="electric-effects" :style="styleVars">
		<!-- 전기 효과 배경 -->
		<div class="lightning-bg">
			<div
				class="lightning-bolt"
				:class="`bolt-${i}`"
				v-for="i in 12"
				:key="`bolt-${i}`"
			></div>
		</div>
		<!-- 추가 전기 효과 -->
		<div class="electric-field">
			<div
				class="electric-spark"
				:class="`spark-${i}`"
				v-for="i in 12"
				:key="`spark-${i}`"
			></div>
		</div>
		<!-- 전기 파티클 -->
		<div class="electric-particles">
			<div
				class="electric-particle"
				v-for="i in 20"
				:key="`particle-${i}`"
			></div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	primaryColor: {
		type: String,
		default: '#00bfff', // 베지트 기본 색상
	},
	secondaryColor: {
		type: String,
		default: '#00ffff', // 베지트 보조 색상
	},
	accentColor: {
		type: String,
		default: '#87ceeb', // 베지트 액센트 색상
	},
})

// CSS 변수로 색상 전달
const styleVars = computed(() => ({
	'--electric-primary': props.primaryColor,
	'--electric-secondary': props.secondaryColor,
	'--electric-accent': props.accentColor,
}))
</script>

<style scoped>
.electric-effects {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
}

/* 전기 효과 배경 */
.lightning-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
}

.lightning-bolt {
	position: absolute;
	width: 5px;
	background: linear-gradient(
		to bottom,
		transparent,
		var(--electric-primary),
		var(--electric-secondary),
		#ffffff,
		var(--electric-secondary),
		var(--electric-primary),
		transparent
	);
	box-shadow: 0 0 20px var(--electric-primary), 0 0 40px var(--electric-secondary),
		0 0 60px var(--electric-accent), 0 0 80px var(--electric-primary);
	opacity: 0;
	transform-origin: top;
	animation: lightningStrike 0.4s ease-in-out infinite;
}

/* 좌측 번개 볼트 (위에서 아래로 더 넓게 분산) */
.bolt-1 {
	left: 2%;
	top: -5%;
	height: 40%;
	animation-delay: 0s;
}

.bolt-2 {
	left: 5%;
	top: 5%;
	height: 50%;
	animation-delay: 0.1s;
}

.bolt-3 {
	left: 8%;
	top: 15%;
	height: 45%;
	animation-delay: 0.2s;
}

.bolt-4 {
	left: 3%;
	top: 30%;
	height: 55%;
	animation-delay: 0.15s;
}

.bolt-5 {
	left: 10%;
	top: 45%;
	height: 40%;
	animation-delay: 0.25s;
}

.bolt-6 {
	left: 6%;
	top: 60%;
	height: 45%;
	animation-delay: 0.3s;
}

/* 우측 번개 볼트 (위에서 아래로 더 넓게 분산) */
.bolt-7 {
	left: 90%;
	top: -5%;
	height: 50%;
	animation-delay: 0.35s;
}

.bolt-8 {
	left: 95%;
	top: 8%;
	height: 55%;
	animation-delay: 0.4s;
}

.bolt-9 {
	left: 92%;
	top: 20%;
	height: 45%;
	animation-delay: 0.45s;
}

.bolt-10 {
	left: 97%;
	top: 35%;
	height: 50%;
	animation-delay: 0.5s;
}

.bolt-11 {
	left: 88%;
	top: 50%;
	height: 40%;
	animation-delay: 0.55s;
}

.bolt-12 {
	left: 94%;
	top: 65%;
	height: 60%;
	animation-delay: 0.6s;
}

@keyframes lightningStrike {
	0% {
		opacity: 0;
		transform: translateY(-20px) scaleY(0);
	}
	5% {
		opacity: 1;
		transform: translateY(0) scaleY(1);
	}
	10% {
		opacity: 0.8;
	}
	15% {
		opacity: 1;
	}
	20% {
		opacity: 0.6;
	}
	25% {
		opacity: 1;
	}
	30% {
		opacity: 0.5;
	}
	35% {
		opacity: 0.9;
	}
	40% {
		opacity: 0.4;
	}
	45% {
		opacity: 0.8;
	}
	50% {
		opacity: 0.3;
	}
	55% {
		opacity: 0.7;
	}
	60% {
		opacity: 0.2;
	}
	65% {
		opacity: 0.6;
	}
	70% {
		opacity: 0;
	}
	100% {
		opacity: 0;
		transform: translateY(20px) scaleY(0);
	}
}

/* 추가 전기 효과 */
.electric-field {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
}

.electric-spark {
	position: absolute;
	width: 8px;
	height: 8px;
	background: radial-gradient(
		circle,
		#ffffff 0%,
		var(--electric-secondary) 50%,
		transparent 100%
	);
	border-radius: 50%;
	box-shadow: 0 0 20px var(--electric-secondary), 0 0 40px var(--electric-primary),
		0 0 60px var(--electric-accent), 0 0 80px var(--electric-secondary);
	opacity: 0;
	animation: electricSpark 1.5s ease-in-out infinite;
}

/* 좌측 스파크 (위아래 더 넓게 분산) */
.spark-1 {
	left: 3%;
	top: 2%;
	animation-delay: 0s;
}

.spark-2 {
	left: 8%;
	top: 20%;
	animation-delay: 0.2s;
}

.spark-3 {
	left: 5%;
	top: 40%;
	animation-delay: 0.4s;
}

.spark-4 {
	left: 10%;
	top: 60%;
	animation-delay: 0.6s;
}

.spark-5 {
	left: 6%;
	top: 80%;
	animation-delay: 0.8s;
}

.spark-6 {
	left: 4%;
	top: 95%;
	animation-delay: 1s;
}

/* 우측 스파크 (위아래 더 넓게 분산) */
.spark-7 {
	left: 90%;
	top: 5%;
	animation-delay: 1.2s;
}

.spark-8 {
	left: 95%;
	top: 25%;
	animation-delay: 1.4s;
}

.spark-9 {
	left: 92%;
	top: 45%;
	animation-delay: 1.6s;
}

.spark-10 {
	left: 97%;
	top: 65%;
	animation-delay: 1.8s;
}

.spark-11 {
	left: 94%;
	top: 85%;
	animation-delay: 2s;
}

.spark-12 {
	left: 96%;
	top: 98%;
	animation-delay: 2.2s;
}

@keyframes electricSpark {
	0% {
		opacity: 0;
		transform: scale(0) rotate(0deg);
	}
	10% {
		opacity: 1;
		transform: scale(1.5) rotate(180deg);
	}
	20% {
		opacity: 0.8;
		transform: scale(1.2) rotate(360deg);
	}
	30% {
		opacity: 1;
		transform: scale(1.8) rotate(540deg);
	}
	40% {
		opacity: 0.6;
		transform: scale(1.3) rotate(720deg);
	}
	50% {
		opacity: 1;
		transform: scale(2) rotate(900deg);
	}
	60% {
		opacity: 0.4;
		transform: scale(1.1) rotate(1080deg);
	}
	70% {
		opacity: 0.8;
		transform: scale(1.6) rotate(1260deg);
	}
	80% {
		opacity: 0.3;
		transform: scale(0.9) rotate(1440deg);
	}
	90% {
		opacity: 0.6;
		transform: scale(1.4) rotate(1620deg);
	}
	100% {
		opacity: 0;
		transform: scale(0) rotate(1800deg);
	}
}

/* 전기 파티클 */
.electric-particles {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
}

.electric-particle {
	position: absolute;
	width: 4px;
	height: 4px;
	background: var(--electric-secondary);
	border-radius: 50%;
	box-shadow: 0 0 10px var(--electric-secondary), 0 0 20px var(--electric-primary);
	opacity: 0;
	animation: electricParticle 3s ease-in-out infinite;
}

/* 좌측 파티클 (위아래 더 넓게 분산) */
.electric-particle:nth-child(1) {
	left: 3%;
	top: 0%;
	animation-delay: 0s;
}

.electric-particle:nth-child(2) {
	left: 8%;
	top: 8%;
	animation-delay: 0.15s;
}

.electric-particle:nth-child(3) {
	left: 5%;
	top: 16%;
	animation-delay: 0.3s;
}

.electric-particle:nth-child(4) {
	left: 10%;
	top: 24%;
	animation-delay: 0.45s;
}

.electric-particle:nth-child(5) {
	left: 6%;
	top: 32%;
	animation-delay: 0.6s;
}

.electric-particle:nth-child(6) {
	left: 4%;
	top: 40%;
	animation-delay: 0.75s;
}

.electric-particle:nth-child(7) {
	left: 9%;
	top: 48%;
	animation-delay: 0.9s;
}

.electric-particle:nth-child(8) {
	left: 7%;
	top: 56%;
	animation-delay: 1.05s;
}

.electric-particle:nth-child(9) {
	left: 2%;
	top: 64%;
	animation-delay: 1.2s;
}

.electric-particle:nth-child(10) {
	left: 11%;
	top: 72%;
	animation-delay: 1.35s;
}

/* 우측 파티클 (위아래 더 넓게 분산) */
.electric-particle:nth-child(11) {
	left: 90%;
	top: 4%;
	animation-delay: 1.5s;
}

.electric-particle:nth-child(12) {
	left: 95%;
	top: 12%;
	animation-delay: 1.65s;
}

.electric-particle:nth-child(13) {
	left: 92%;
	top: 20%;
	animation-delay: 1.8s;
}

.electric-particle:nth-child(14) {
	left: 97%;
	top: 28%;
	animation-delay: 1.95s;
}

.electric-particle:nth-child(15) {
	left: 88%;
	top: 36%;
	animation-delay: 2.1s;
}

.electric-particle:nth-child(16) {
	left: 94%;
	top: 44%;
	animation-delay: 2.25s;
}

.electric-particle:nth-child(17) {
	left: 96%;
	top: 52%;
	animation-delay: 2.4s;
}

.electric-particle:nth-child(18) {
	left: 91%;
	top: 60%;
	animation-delay: 2.55s;
}

.electric-particle:nth-child(19) {
	left: 98%;
	top: 68%;
	animation-delay: 2.7s;
}

.electric-particle:nth-child(20) {
	left: 93%;
	top: 76%;
	animation-delay: 2.85s;
}

@keyframes electricParticle {
	0% {
		opacity: 0;
		transform: translateY(0) scale(0);
	}
	10% {
		opacity: 1;
		transform: translateY(-10px) scale(1);
	}
	20% {
		opacity: 0.8;
		transform: translateY(-20px) scale(1.2);
	}
	30% {
		opacity: 1;
		transform: translateY(-30px) scale(1);
	}
	40% {
		opacity: 0.6;
		transform: translateY(-40px) scale(1.3);
	}
	50% {
		opacity: 1;
		transform: translateY(-50px) scale(1.1);
	}
	60% {
		opacity: 0.4;
		transform: translateY(-60px) scale(1.4);
	}
	70% {
		opacity: 0.8;
		transform: translateY(-70px) scale(1);
	}
	80% {
		opacity: 0.3;
		transform: translateY(-80px) scale(1.2);
	}
	90% {
		opacity: 0.6;
		transform: translateY(-90px) scale(1);
	}
	100% {
		opacity: 0;
		transform: translateY(-100px) scale(0);
	}
}
</style>

