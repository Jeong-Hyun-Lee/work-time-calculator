<template>
	<div class="widget-card">
		<WidgetHeader icon="💰" title="연봉 실수령액 계산기" />
		<div class="salary-input-row">
			<input
				v-model="annualSalaryInput"
				type="number"
				min="0"
				placeholder="세전 연봉 (만원)"
				class="salary-input"
				aria-label="세전 연봉 (만원)"
				@keyup.enter="calculate"
			/>
			<button type="button" class="btn-solid" @click="calculate">계산하기</button>
		</div>
		<div v-if="result" class="salary-result">
			<div class="salary-net">
				<span class="salary-net-label">월 실수령액</span>
				<span class="salary-net-value">{{ formatWon(result.netPay) }}원</span>
			</div>
			<ul class="salary-breakdown">
				<li><span>국민연금</span><span>{{ formatWon(result.nationalPension) }}원</span></li>
				<li><span>건강보험</span><span>{{ formatWon(result.healthInsurance) }}원</span></li>
				<li><span>장기요양보험</span><span>{{ formatWon(result.longTermCare) }}원</span></li>
				<li><span>고용보험</span><span>{{ formatWon(result.employmentInsurance) }}원</span></li>
				<li><span>소득세</span><span>{{ formatWon(result.incomeTax) }}원</span></li>
				<li><span>지방소득세</span><span>{{ formatWon(result.localTax) }}원</span></li>
			</ul>
		</div>
		<p class="salary-disclaimer">
			2026년 요율 기준 참고용 계산이며(부양가족·비과세액·근로소득세액공제 미반영, 간이세액표 아닌 누진세율 근사), 실제 급여와 다를 수 있습니다.
		</p>
	</div>
</template>

<script setup>
import WidgetHeader from '../WidgetHeader.vue'
import { useSalaryCalculator } from '../../composables/useSalaryCalculator'

const { annualSalaryInput, result, calculate } = useSalaryCalculator()

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
