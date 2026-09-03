<template>
	<div class="widget-card">
		<WidgetHeader icon="💰" :title="$t('salary.title')" />
		<div class="salary-input-row">
			<input
				v-model="annualSalaryInput"
				type="number"
				min="0"
				:placeholder="$t('salary.placeholder')"
				class="salary-input"
				:aria-label="$t('salary.placeholder')"
				@keyup.enter="calculate"
			/>
			<button type="button" class="btn-solid" @click="calculate">
				{{ $t('salary.calculate') }}
			</button>
		</div>
		<div v-if="result" class="salary-result">
			<div class="salary-net">
				<span class="salary-net-label">{{ $t('salary.netLabel') }}</span>
				<span class="salary-net-value">{{ formatWon(result.netPay) }}{{ $t('salary.currency') }}</span>
			</div>
			<ul class="salary-breakdown">
				<li v-for="row in breakdown" :key="row.key">
					<span>{{ $t('salary.' + row.key) }}</span>
					<span>{{ formatWon(row.value) }}{{ $t('salary.currency') }}</span>
				</li>
			</ul>
		</div>
		<p class="salary-disclaimer">{{ $t('salary.disclaimer') }}</p>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import WidgetHeader from '../WidgetHeader.vue'
import { useSalaryCalculator } from '../../composables/useSalaryCalculator'

const { annualSalaryInput, result, calculate } = useSalaryCalculator()

// 공제 항목 라벨은 salary.* 키와 1:1로 대응
const breakdown = computed(() =>
	result.value
		? [
				{ key: 'pension', value: result.value.nationalPension },
				{ key: 'health', value: result.value.healthInsurance },
				{ key: 'longTermCare', value: result.value.longTermCare },
				{ key: 'employment', value: result.value.employmentInsurance },
				{ key: 'incomeTax', value: result.value.incomeTax },
				{ key: 'localTax', value: result.value.localTax },
			]
		: [],
)

function formatWon(value) {
	return value.toLocaleString('ko-KR')
}
</script>

<style scoped>
.salary-input-row {
	display: flex;
	gap: var(--spacing-8);
	margin-bottom: var(--spacing-16);
}

.salary-input {
	flex: 1;
	padding: var(--spacing-8) var(--spacing-12);
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-control);
	background: var(--color-canvas);
	font-size: var(--text-body);
	color: var(--color-ink);
}

.salary-result {
	margin-bottom: var(--spacing-12);
}

.salary-net {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: var(--color-ink-soft);
	color: var(--color-paper);
	border-radius: var(--radius-nested);
	padding: var(--spacing-12) var(--spacing-16);
	margin-bottom: var(--spacing-12);
}

.salary-net-label {
	font-size: var(--text-caption);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.salary-net-value {
	font-size: var(--text-heading-sm);
	font-weight: 600;
	font-variant-numeric: tabular-nums;
}

.salary-breakdown {
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: var(--spacing-4);
}

.salary-breakdown li {
	display: flex;
	justify-content: space-between;
	font-size: var(--text-body);
	color: var(--color-mid-gray);
}

.salary-disclaimer {
	font-size: var(--text-caption);
	color: var(--color-mid-gray);
	margin-top: var(--spacing-12);
}
</style>
