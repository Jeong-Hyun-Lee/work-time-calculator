<template>
	<div class="widget-card accent-violet">
		<WidgetHeader icon="🪜" title="사다리타기" />

		<div class="ladder-inputs">
			<textarea
				v-model="namesInput"
				class="ladder-input"
				aria-label="참가자 이름"
				placeholder="참가자 (쉼표 구분, 2~8명)&#10;예: 철수, 영희, 민수"
				rows="3"
			></textarea>
			<textarea
				v-model="prizesInput"
				class="ladder-input"
				aria-label="결과 목록"
				placeholder="결과 (비우면 당첨 1개 + 나머지 꽝)&#10;예: 커피, 꽝, 꽝"
				rows="3"
			></textarea>
		</div>

		<button type="button" class="btn-solid" @click="generate">사다리 만들기</button>

		<p v-if="error" class="ladder-error" role="alert">{{ error }}</p>

		<div v-if="players.length" class="ladder-board">
			<div class="ladder-labels">
				<button
					v-for="(name, index) in players"
					:key="`player-${index}`"
					type="button"
					class="ladder-chip"
					:class="{ active: activeIndex === index }"
					@click="highlight(index)"
				>
					{{ name }}
				</button>
			</div>

			<svg class="ladder-svg" :viewBox="viewBox" preserveAspectRatio="none">
				<line
					v-for="(col, index) in players.length"
					:key="`rail-${index}`"
					:x1="xFor(index)"
					:y1="yFor(0)"
					:x2="xFor(index)"
					:y2="yFor(rows + 1)"
					class="ladder-rail"
				/>
				<line
					v-for="(rung, index) in rungs"
					:key="`rung-${index}`"
					:x1="xFor(rung.col)"
					:y1="yFor(rung.row)"
					:x2="xFor(rung.col + 1)"
					:y2="yFor(rung.row)"
					class="ladder-rung"
				/>
				<polyline
					v-if="activeIndex !== null"
					:key="`trace-${activeIndex}`"
					:points="activePoints"
					class="ladder-trace"
				/>
			</svg>

			<div class="ladder-labels">
				<span
					v-for="(prize, index) in prizes"
					:key="`prize-${index}`"
					class="ladder-prize"
					:class="{ active: activeIndex !== null && endColFor(activeIndex) === index }"
				>
					{{ prize }}
				</span>
			</div>
		</div>

		<ul v-if="results.length" class="ladder-results">
			<li
				v-for="(item, index) in results"
				:key="`result-${index}`"
				:style="{ animationDelay: `${index * 0.05}s` }"
			>
				<span>{{ item.name }}</span>
				<span class="ladder-arrow">→</span>
				<strong>{{ item.outcome }}</strong>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import WidgetHeader from '../WidgetHeader.vue'
import { useLadder } from '../../composables/useLadder'

const {
	namesInput,
	prizesInput,
	players,
	prizes,
	rungs,
	results,
	error,
	activeIndex,
	rows,
	generate,
	pathFor,
	highlight,
} = useLadder()

const COL_GAP = 40
const ROW_GAP = 16
const PADDING = 10

const xFor = (col) => PADDING + col * COL_GAP
const yFor = (row) => PADDING + row * ROW_GAP

const viewBox = computed(
	() =>
		`0 0 ${PADDING * 2 + (players.value.length - 1) * COL_GAP} ${
			PADDING * 2 + (rows + 1) * ROW_GAP
		}`,
)

const endColFor = (index) => {
	const path = pathFor(index)
	return path[path.length - 1][0]
}

const activePoints = computed(() => {
	if (activeIndex.value === null) return ''
	return pathFor(activeIndex.value)
		.map(([col, row]) => `${xFor(col)},${yFor(row)}`)
		.join(' ')
})
</script>

<style scoped>
.ladder-inputs {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-8);
	margin-bottom: var(--spacing-12);
}

.ladder-input {
	width: 100%;
	padding: var(--spacing-8) var(--spacing-12);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-control);
	background: var(--color-surface-alt);
	font-family: var(--font-sans);
	font-size: var(--text-body);
	color: var(--color-ink);
	resize: vertical;
	min-height: 84px;
	line-height: 1.5;
	transition:
		border-color 0.2s ease,
		background 0.2s ease;
}

.ladder-input:focus {
	outline: none;
	border-color: var(--color-accent);
	background: var(--color-paper);
}

.ladder-error {
	font-size: var(--text-caption);
	color: var(--color-ember);
	margin-top: var(--spacing-8);
}

.ladder-board {
	margin-top: var(--spacing-16);
}

.ladder-labels {
	display: flex;
	justify-content: space-between;
	gap: var(--spacing-4);
}

.ladder-chip,
.ladder-prize {
	flex: 1;
	text-align: center;
	font-size: var(--text-caption);
	font-weight: 500;
	padding: var(--spacing-4) 0;
	border-radius: var(--radius-small);
	background: var(--color-surface-alt);
	color: var(--color-mid-gray);
	border: 1px solid transparent;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	transition:
		background 0.2s ease,
		color 0.2s ease,
		transform 0.2s ease;
}

.ladder-chip {
	cursor: pointer;
	font-family: var(--font-sans);
}

.ladder-chip:hover {
	background: var(--color-accent-soft);
	color: var(--color-accent);
}

.ladder-chip.active,
.ladder-prize.active {
	background: var(--color-accent);
	color: #ffffff;
	transform: translateY(-1px);
}

.ladder-svg {
	display: block;
	width: 100%;
	height: 176px;
	margin: var(--spacing-4) 0;
}

.ladder-rail {
	stroke: var(--color-hairline);
	stroke-width: 2;
	stroke-linecap: round;
}

.ladder-rung {
	stroke: var(--color-hairline);
	stroke-width: 2;
	stroke-linecap: round;
}

.ladder-trace {
	fill: none;
	stroke: var(--color-accent);
	stroke-width: 3;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-dasharray: 1200;
	stroke-dashoffset: 1200;
	animation: traceDraw 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes traceDraw {
	to {
		stroke-dashoffset: 0;
	}
}

.ladder-results {
	list-style: none;
	margin-top: var(--spacing-16);
	display: flex;
	flex-direction: column;
	gap: var(--spacing-4);
}

.ladder-results li {
	display: flex;
	align-items: center;
	gap: var(--spacing-8);
	font-size: var(--text-body);
	color: var(--color-ink);
	animation: resultIn 0.35s ease-out backwards;
}

@keyframes resultIn {
	from {
		opacity: 0;
		transform: translateX(-6px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.ladder-arrow {
	color: var(--color-mid-gray);
}
</style>
