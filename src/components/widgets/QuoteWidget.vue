<template>
	<div class="widget-card accent-violet">
		<WidgetHeader icon="💬" title="오늘의 한마디" />
		<p class="quote-text">{{ quote.text }}</p>
		<button type="button" class="btn-outline" @click="next">다른 명언 보기</button>
		<p class="quote-disclaimer">재미로 보는 콘텐츠이며 실제 운세와 무관합니다</p>
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

.quote-disclaimer {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-top: var(--spacing-12);
}
</style>
