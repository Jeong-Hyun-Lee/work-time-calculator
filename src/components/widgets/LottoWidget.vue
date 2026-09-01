<template>
	<div class="widget-card accent-amber">
		<WidgetHeader icon="🎱" title="로또 번호 생성기" />
		<div v-if="numbers.length" class="lotto-balls">
			<span
				v-for="(n, index) in numbers"
				:key="`${round}-${n}`"
				class="ball"
				:style="{ animationDelay: `${index * 0.06}s` }"
				>{{ n }}</span
			>
		</div>
		<p v-else class="lotto-empty">번호 생성 버튼을 눌러보세요</p>
		<button type="button" class="btn-solid" @click="handleGenerate">번호 생성</button>
		<p class="lotto-disclaimer">당첨을 예측하지 않는 재미용 랜덤 생성기입니다</p>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import WidgetHeader from '../WidgetHeader.vue'
import { useLotto } from '../../composables/useLotto'

const { numbers, generate } = useLotto()

// 생성할 때마다 공 등장 애니메이션을 다시 재생하기 위한 키
const round = ref(0)

const handleGenerate = () => {
	round.value += 1
	generate()
}
</script>

<style scoped>
.lotto-balls {
	display: flex;
	flex-wrap: wrap;
	gap: var(--spacing-8);
	margin-bottom: var(--spacing-16);
}

.ball {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 1px solid var(--color-hairline);
	background: var(--color-surface-alt);
	font-size: var(--text-subheading);
	font-weight: 600;
	color: var(--color-ink);
	font-variant-numeric: tabular-nums;
	animation: ballPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

@keyframes ballPop {
	from {
		opacity: 0;
		transform: scale(0.4) translateY(8px);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
}

.lotto-empty {
	font-size: var(--text-body);
	color: var(--color-mid-gray);
	margin-bottom: var(--spacing-16);
}

.lotto-disclaimer {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-top: var(--spacing-12);
}
</style>
