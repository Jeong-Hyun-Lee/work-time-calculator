<template>
	<div class="widget-card accent-violet">
		<WidgetHeader icon="💬" :title="$t('quote.title')" />
		<Transition name="quote" mode="out-in">
			<p class="quote-text" :key="quote.text">{{ quote.text }}</p>
		</Transition>
		<button type="button" class="btn-outline" @click="next">
			{{ $t('quote.next') }}
		</button>
		<p class="quote-disclaimer">{{ $t('quote.disclaimer') }}</p>
	</div>
</template>

<script setup>
import WidgetHeader from '../WidgetHeader.vue'
import { useQuote } from '../../composables/useQuote'

const { quote, next } = useQuote()
</script>

<style scoped>
.quote-text {
	font-size: var(--text-body-lg);
	line-height: 1.6;
	color: var(--color-ink);
	margin-bottom: var(--spacing-16);
}

.quote-enter-active,
.quote-leave-active {
	transition:
		opacity 0.25s ease,
		transform 0.25s ease;
}

.quote-enter-from {
	opacity: 0;
	transform: translateY(6px);
}

.quote-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}

.quote-disclaimer {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-top: var(--spacing-12);
}
</style>
