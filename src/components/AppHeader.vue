<template>
	<div class="header">
		<div class="icon-wrapper">
			<ClockIcon />
		</div>
		<h1>퇴근시간 계산기</h1>
		<p class="subtitle">출근 시간을 입력하면 퇴근 시간을 자동으로 계산합니다</p>
	</div>
</template>

<script setup>
import ClockIcon from './icons/ClockIcon.vue'
</script>

<style scoped>
.header {
	text-align: center;
	margin-bottom: var(--spacing-24);
	flex-shrink: 0;
}

.icon-wrapper {
	width: 40px;
	height: 40px;
	margin: 0 auto var(--spacing-12);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color-ink);
}

.icon-wrapper svg {
	width: 32px;
	height: 32px;
}

h1 {
	color: var(--color-ink);
	margin-bottom: var(--spacing-4);
	font-size: var(--text-heading-lg);
	font-weight: 600;
	letter-spacing: -0.025em;
}

.subtitle {
	color: var(--color-mid-gray);
	font-size: var(--text-body);
	font-weight: 400;
	margin: 0;
}

@media (max-width: 480px) {
	h1 {
		font-size: var(--text-heading);
	}
}
</style>
