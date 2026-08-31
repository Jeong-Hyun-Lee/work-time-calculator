<script setup>
import TimeCalculator from './components/TimeCalculator.vue'
import LottoWidget from './components/widgets/LottoWidget.vue'
import QuoteWidget from './components/widgets/QuoteWidget.vue'
</script>

<template>
	<TimeCalculator />
	<div class="widget-grid">
		<div class="widget--md">
			<LottoWidget />
		</div>
		<div class="widget--sm">
			<QuoteWidget />
		</div>
	</div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.widget-grid {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	gap: var(--spacing-16);
	max-width: 1280px;
	margin: 0 auto;
	padding: var(--spacing-24) var(--spacing-16);
}

.widget--sm {
	grid-column: span 4;
}

.widget--md {
	grid-column: span 6;
}

@media (max-width: 768px) {
	.widget--sm,
	.widget--md {
		grid-column: span 12;
	}
}
</style>
