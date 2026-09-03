<template>
	<div class="widget-card accent-sky">
		<WidgetHeader icon="🍱" :title="$t('lunch.title')" />
		<p class="roulette-result" :class="{ spinning: isSpinning }">
			{{ result || $t('lunch.empty') }}
		</p>
		<button type="button" class="btn-solid" :disabled="isSpinning" @click="spin">
			{{ $t('lunch.spin') }}
		</button>
	</div>
</template>

<script setup>
import WidgetHeader from '../WidgetHeader.vue'
import { useLunchRoulette } from '../../composables/useLunchRoulette'

const { result, isSpinning, spin } = useLunchRoulette()
</script>

<style scoped>
.roulette-result {
	font-size: var(--text-heading-sm);
	font-weight: 600;
	color: var(--color-ink);
	margin-bottom: var(--spacing-16);
	transition:
		opacity 0.2s ease,
		transform 0.2s ease;
	animation: settle 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.roulette-result.spinning {
	opacity: 0.45;
	transform: scale(0.96);
	animation: none;
}

@keyframes settle {
	from {
		transform: scale(1.12);
	}
	to {
		transform: scale(1);
	}
}
</style>
