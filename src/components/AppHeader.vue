<template>
	<div class="header">
		<div class="header-top">
			<div class="icon-wrapper">
				<ClockIcon />
			</div>
			<ThemeSelector />
		</div>
		<h1>퇴근시간 계산기</h1>
		<p class="subtitle">출근 시간을 입력하면 퇴근 시간을 자동으로 계산합니다</p>
	</div>
</template>

<script setup>
import ClockIcon from './icons/ClockIcon.vue'
import ThemeSelector from './ThemeSelector.vue'
</script>

<style scoped>
.header {
	text-align: center;
	margin-bottom: 1.5rem;
	flex-shrink: 0;
}

.header-top {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 1rem;
}

.icon-wrapper {
	width: 60px;
	height: 60px;
	margin: 0 auto;
	background: linear-gradient(
		135deg,
		var(--theme-primary, #667eea) 0%,
		var(--theme-secondary, #764ba2) 100%
	);
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
	animation: pulse 2s ease-in-out infinite;
	transition: all 0.3s ease;
}

@keyframes pulse {
	0%,
	100% {
		transform: scale(1);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
	}
	50% {
		transform: scale(1.05);
		box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
	}
}

.icon-wrapper svg {
	width: 40px;
	height: 40px;
	color: white;
}

h1 {
	color: var(--theme-text, #1a1a2e);
	margin-bottom: 0.25rem;
	font-size: 2rem;
	font-weight: 800;
	letter-spacing: -0.02em;
	background: linear-gradient(
		135deg,
		var(--theme-primary, #667eea) 0%,
		var(--theme-secondary, #764ba2) 100%
	);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	transition: all 0.3s ease;
}

.subtitle {
	color: var(--theme-text-secondary, #6b7280);
	font-size: 0.875rem;
	font-weight: 400;
	margin: 0;
	transition: color 0.3s ease;
}

@media (max-width: 768px) {
	.header-top {
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	h1 {
		font-size: 2rem;
	}

	.icon-wrapper {
		width: 50px;
		height: 50px;
	}

	.icon-wrapper svg {
		width: 32px;
		height: 32px;
	}
}

@media (max-width: 480px) {
	h1 {
		font-size: 1.75rem;
	}

	.subtitle {
		font-size: 0.875rem;
	}
}
</style>
