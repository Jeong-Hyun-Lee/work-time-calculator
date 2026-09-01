<template>
	<header class="app-header">
		<div class="app-header-inner">
			<span class="app-header-icon">
				<ClockIcon />
			</span>
			<h1>퇴근시간 계산기</h1>
			<p class="subtitle">출근 시간만 넣으면 나머지는 알아서</p>
		</div>
	</header>
</template>

<script setup>
import ClockIcon from './icons/ClockIcon.vue'
</script>

<style scoped>
.app-header {
	max-width: 1280px;
	margin: 0 auto;
	padding: var(--spacing-24) var(--spacing-16) var(--spacing-16);
}

.app-header-inner {
	display: flex;
	align-items: center;
	gap: var(--spacing-8);
	border-bottom: 1px solid var(--color-hairline);
	padding-bottom: var(--spacing-12);
}

.app-header-icon {
	display: flex;
	width: 22px;
	height: 22px;
	color: var(--color-ink);
	flex-shrink: 0;
}

.app-header-icon :deep(svg) {
	width: 100%;
	height: 100%;
}

h1 {
	font-size: var(--text-subheading);
	font-weight: 600;
	letter-spacing: -0.02em;
	color: var(--color-ink);
}

.subtitle {
	margin-left: auto;
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
}

@media (max-width: 600px) {
	.subtitle {
		display: none;
	}
}
</style>
