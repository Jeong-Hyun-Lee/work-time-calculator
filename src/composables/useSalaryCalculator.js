import { ref } from 'vue'

// 2026년 기준 4대보험 근로자 부담 요율 (참고용, 매년 변경될 수 있음)
const NATIONAL_PENSION_RATE = 0.0475
const NATIONAL_PENSION_MIN_BASE = 400000
const NATIONAL_PENSION_MAX_BASE = 6370000
const HEALTH_INSURANCE_RATE = 0.03595
const LONG_TERM_CARE_RATE = 0.1295 // 건강보험료 대비 비율
const EMPLOYMENT_INSURANCE_RATE = 0.009

const BASIC_DEDUCTION = 1500000 // 본인 기본공제만 반영 (부양가족 미반영)
const LOCAL_TAX_RATE = 0.1 // 지방소득세 = 소득세의 10%

function calcEarnedIncomeDeduction(annualSalary) {
	if (annualSalary <= 5000000) {
		return annualSalary * 0.7
	}
	if (annualSalary <= 15000000) {
		return 3500000 + (annualSalary - 5000000) * 0.4
	}
	if (annualSalary <= 45000000) {
		return 7500000 + (annualSalary - 15000000) * 0.15
	}
	if (annualSalary <= 100000000) {
		return 12000000 + (annualSalary - 45000000) * 0.05
	}
	return 14750000 + (annualSalary - 100000000) * 0.02
}

const TAX_BRACKETS = [
	{ limit: 14000000, rate: 0.06, deduction: 0 },
	{ limit: 50000000, rate: 0.15, deduction: 1260000 },
	{ limit: 88000000, rate: 0.24, deduction: 5760000 },
	{ limit: 150000000, rate: 0.35, deduction: 15440000 },
	{ limit: 300000000, rate: 0.38, deduction: 19940000 },
	{ limit: 500000000, rate: 0.4, deduction: 25940000 },
	{ limit: 1000000000, rate: 0.42, deduction: 35940000 },
	{ limit: Infinity, rate: 0.45, deduction: 65940000 },
]

function calcIncomeTax(taxBase) {
	if (taxBase <= 0) return 0
	const bracket = TAX_BRACKETS.find((b) => taxBase <= b.limit)
	return Math.max(0, taxBase * bracket.rate - bracket.deduction)
}

export function useSalaryCalculator() {
	const annualSalaryInput = ref('')
	const result = ref(null)

	const calculate = () => {
		const annualSalaryManwon = Number(annualSalaryInput.value)
		if (!annualSalaryManwon || annualSalaryManwon <= 0) {
			result.value = null
			return
		}

		const annualSalary = annualSalaryManwon * 10000
		const monthlySalary = annualSalary / 12

		const pensionBase = Math.min(
			Math.max(monthlySalary, NATIONAL_PENSION_MIN_BASE),
			NATIONAL_PENSION_MAX_BASE,
		)
		const monthlyNationalPension = Math.floor(pensionBase * NATIONAL_PENSION_RATE)
		const monthlyHealthInsurance = Math.floor(monthlySalary * HEALTH_INSURANCE_RATE)
		const monthlyLongTermCare = Math.floor(monthlyHealthInsurance * LONG_TERM_CARE_RATE)
		const monthlyEmploymentInsurance = Math.floor(monthlySalary * EMPLOYMENT_INSURANCE_RATE)

		const earnedIncomeDeduction = calcEarnedIncomeDeduction(annualSalary)
		const taxBase = Math.max(0, annualSalary - earnedIncomeDeduction - BASIC_DEDUCTION)
		const annualIncomeTax = calcIncomeTax(taxBase)
		const monthlyIncomeTax = Math.floor(annualIncomeTax / 12)
		const monthlyLocalTax = Math.floor(monthlyIncomeTax * LOCAL_TAX_RATE)

		const totalDeduction =
			monthlyNationalPension +
			monthlyHealthInsurance +
			monthlyLongTermCare +
			monthlyEmploymentInsurance +
			monthlyIncomeTax +
			monthlyLocalTax

		result.value = {
			monthlyGross: Math.floor(monthlySalary),
			nationalPension: monthlyNationalPension,
			healthInsurance: monthlyHealthInsurance,
			longTermCare: monthlyLongTermCare,
			employmentInsurance: monthlyEmploymentInsurance,
			incomeTax: monthlyIncomeTax,
			localTax: monthlyLocalTax,
			totalDeduction,
			netPay: Math.floor(monthlySalary) - totalDeduction,
		}
	}

	return {
		annualSalaryInput,
		result,
		calculate,
	}
}
