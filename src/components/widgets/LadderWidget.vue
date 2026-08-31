<template>
	<div class="widget-card">
		<WidgetHeader icon="🪜" title="사다리타기" />
		<textarea
			v-model="namesInput"
			class="ladder-input"
			placeholder="참가자 이름을 줄바꿈 또는 쉼표로 구분해서 입력하세요 (2~10명)"
			rows="3"
		></textarea>
		<button type="button" class="btn-solid" @click="generate">결과 만들기</button>
		<p v-if="error" class="ladder-error">{{ error }}</p>
		<ul v-if="results.length" class="ladder-results">
			<li v-for="item in results" :key="item.name">
				<span>{{ item.name }}</span>
				<span class="ladder-arrow">→</span>
				<span>{{ item.outcome }}</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
import WidgetHeader from '../WidgetHeader.vue'
import { useLadder } from '../../composables/useLadder'

const { namesInput, results, error, generate } = useLadder()
</script>

<style scoped>
.ladder-input {
	width: 100%;
	padding: var(--spacing-8) var(--spacing-12);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-control);
	background: var(--color-canvas);
	font-family: var(--font-sans);
	font-size: var(--text-body);
	color: var(--color-ink);
	resize: vertical;
	margin-bottom: var(--spacing-12);
}

.ladder-error {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-top: var(--spacing-8);
}

.ladder-results {
	list-style: none;
	margin-top: var(--spacing-16);
	display: flex;
	flex-direction: column;
	gap: var(--spacing-8);
}

.ladder-results li {
	display: flex;
	align-items: center;
	gap: var(--spacing-8);
	font-size: var(--text-body);
	color: var(--color-ink);
}

.ladder-arrow {
	color: var(--color-mid-gray);
}
</style>
