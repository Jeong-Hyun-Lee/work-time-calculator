<template>
	<div class="widget-card">
		<WidgetHeader icon="🍱" title="점심 메뉴 룰렛" />
		<p class="roulette-result" :class="{ spinning: isSpinning }">
			{{ isSpinning ? '고민 중...' : result || '룰렛을 돌려보세요' }}
		</p>
		<button type="button" class="btn-solid" :disabled="isSpinning" @click="spin">
			룰렛 돌리기
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
	transition: opacity 0.2s ease;
}

.roulette-result.spinning {
	opacity: 0.5;
}
</style>
