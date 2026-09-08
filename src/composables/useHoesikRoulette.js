import { ref, computed } from 'vue'
import menus from '../data/hoesikMenus.json'

const FLICKER_INTERVAL_MS = 80
const SPIN_DURATION_MS = 600

// 한국 회식 문화 전용 위젯이라 로케일 분기 없이 단일 목록 사용
export function useHoesikRoulette() {
	const resultIndex = ref(null)
	const isSpinning = ref(false)

	const result = computed(() => (resultIndex.value === null ? null : menus[resultIndex.value]))

	const pick = () => Math.floor(Math.random() * menus.length)

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
