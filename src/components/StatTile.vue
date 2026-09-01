<template>
	<div class="widget-card stat-tile" :class="{ 'widget-card--dark': dark }">
		<span class="stat-label">{{ label }}</span>
		<span class="stat-value">{{ value }}</span>
	</div>
</template>

<script setup>
defineProps({
	label: {
		type: String,
		required: true,
	},
	value: {
		type: String,
		required: true,
	},
	dark: {
		type: Boolean,
		default: false,
	},
})
</script>

<style scoped>
.stat-tile {
	justify-content: center;
	gap: var(--spacing-4);
}

.stat-label {
	font-size: var(--text-caption);
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--color-mid-gray);
}

.widget-card--dark .stat-label {
	color: var(--color-ink-inverse-soft);
}

.stat-value {
	font-size: var(--text-heading-sm);
	font-weight: 600;
	letter-spacing: -0.02em;
	font-variant-numeric: tabular-nums;
}
</style>
