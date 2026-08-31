<template>
	<div class="info-section">
		<div class="info-card" data-card="start">
			<div class="label">출근 시간</div>
			<div class="value">{{ startTime }}</div>
		</div>

		<div class="info-card" data-card="current">
			<div class="label">현재 시간</div>
			<div class="value">{{ currentTime }}</div>
		</div>

		<div class="info-card highlight-card" data-card="end">
			<div class="label">퇴근 시간</div>
			<div class="value highlight">{{ endTime }}</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	startTime: {
		type: String,
		required: true,
	},
	currentTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
})
</script>

<style scoped>
.info-section {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: var(--spacing-16);
	margin-bottom: var(--spacing-24);
	flex-shrink: 0;
}

.info-card {
	background: var(--color-surface-alt);
	padding: var(--spacing-20) var(--spacing-16);
	border-radius: var(--radius-nested);
	text-align: center;
	border: 1px solid var(--color-hairline);
}

.info-card .label {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-bottom: var(--spacing-8);
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.info-card .value {
	font-size: var(--text-heading-sm);
	font-weight: 600;
	color: var(--color-ink);
	letter-spacing: -0.025em;
}

.highlight-card {
	background: var(--color-ink-soft);
	border: none;
}

.highlight-card .value.highlight {
	color: var(--color-paper);
	font-size: var(--text-heading);
}

@media (max-width: 768px) {
	.info-section {
		grid-template-columns: 1fr;
		gap: var(--spacing-16);
	}
}
</style>
