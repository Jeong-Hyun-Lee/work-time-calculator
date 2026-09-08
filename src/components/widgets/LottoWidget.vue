<template>
	<div class="widget-card accent-amber">
		<WidgetHeader icon="🎱" :title="$t('lotto.title')" />
		<div v-if="lines.length" class="lotto-lines">
			<div v-for="(line, lineIndex) in lines" :key="`${round}-${lineIndex}`" class="lotto-balls">
				<span
					v-for="(n, index) in line"
					:key="`${round}-${lineIndex}-${n}`"
					class="ball"
					:style="{ animationDelay: `${(lineIndex * line.length + index) * 0.04}s` }"
					>{{ n }}</span
				>
			</div>
		</div>
		<p v-else class="lotto-empty">{{ $t('lotto.empty') }}</p>
		<button type="button" class="btn-solid" @click="handleGenerate">
			{{ $t('lotto.generate') }}
		</button>
		<p class="lotto-disclaimer">{{ $t('lotto.disclaimer') }}</p>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import WidgetHeader from '../WidgetHeader.vue'
import { useLotto } from '../../composables/useLotto'

const { lines, generate } = useLotto()

// 생성할 때마다 공 등장 애니메이션을 다시 재생하기 위한 키
const round = ref(0)

const handleGenerate = () => {
	round.value += 1
	generate()
}
</script>

<style scoped>
/* 5줄을 그대로 세로로 쌓으면 카드가 400px까지 높아지고 오른쪽 절반이 비므로,
   폭이 남는 동안은 한 행에 두 줄씩 담는다. 좁아지면 자동으로 한 줄씩 내려감 */
.lotto-lines {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	column-gap: var(--spacing-24);
	row-gap: var(--spacing-8);
	margin-bottom: var(--spacing-16);
}

/* 한 줄(공 6개)은 절대 중간에서 쪼개지지 않아야 조합을 읽을 수 있음 */
.lotto-balls {
	display: flex;
	flex-wrap: nowrap;
	gap: var(--spacing-4);
}

/* 5줄이 되면서 40px 공으로는 카드가 너무 높아져, 같은 행의 스탯 카드까지 늘어남 */
.ball {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	border: 1px solid var(--color-hairline);
	background: var(--color-surface-alt);
	font-size: var(--text-body);
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
