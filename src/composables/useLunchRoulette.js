import { ref, computed } from 'vue'
import menusByLocale from '../data/lunchMenus.json'
import { locale } from '../i18n'

const FLICKER_INTERVAL_MS = 80
const SPIN_DURATION_MS = 600

export function useLunchRoulette() {
	const menus = computed(() => menusByLocale[locale.value] ?? menusByLocale.en)

	// 문자열 대신 인덱스를 들고 있어야 언어를 바꿔도 결과가 같이 번역됨
	const resultIndex = ref(null)
	const isSpinning = ref(false)

	const result = computed(() =>
		resultIndex.value === null ? null : menus.value[resultIndex.value % menus.value.length],
	)

	const pick = () => Math.floor(Math.random() * menus.value.length)

	const spin = () => {
		if (isSpinning.value) return
		isSpinning.value = true

		const flickerId = setInterval(() => {
			resultIndex.value = pick()
		}, FLICKER_INTERVAL_MS)

		setTimeout(() => {
			clearInterval(flickerId)
			resultIndex.value = pick()
			isSpinning.value = false
		}, SPIN_DURATION_MS)
	}

	return {
		result,
		isSpinning,
		spin,
	}
}
