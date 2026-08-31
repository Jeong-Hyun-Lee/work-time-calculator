<template>
	<div class="widget-header">
		<span v-if="icon" class="widget-header-icon">{{ icon }}</span>
		<h2 class="widget-header-title">{{ title }}</h2>
		<div class="widget-header-action">
			<slot />
		</div>
	</div>
</template>

<script setup>
defineProps({
	icon: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		required: true,
	},
})
</script>

<style scoped>
.widget-header {
	display: flex;
	align-items: center;
	gap: var(--spacing-8);
	margin-bottom: var(--spacing-16);
}

.widget-header-icon {
	font-size: 1.25rem;
	line-height: 1;
	flex-shrink: 0;
}

.widget-header-title {
	flex: 1;
	font-size: var(--text-subheading);
	font-weight: 600;
	color: var(--color-ink);
	margin: 0;
}

.widget-header-action {
	flex-shrink: 0;
}
</style>
