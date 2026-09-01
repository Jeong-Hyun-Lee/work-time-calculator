import { ref } from 'vue'
import menus from '../data/lunchMenus.json'

const FLICKER_INTERVAL_MS = 80
const SPIN_DURATION_MS = 600

export function useLunchRoulette() {
	const result = ref(null)
	const isSpinning = ref(false)

	const spin = () => {
		if (isSpinning.value) return
		isSpinning.value = true

		const flickerId = setInterval(() => {
			result.value = menus[Math.floor(Math.random() * menus.length)]
		}, FLICKER_INTERVAL_MS)

		setTimeout(() => {
			clearInterval(flickerId)
			result.value = menus[Math.floor(Math.random() * menus.length)]
			isSpinning.value = false
		}, SPIN_DURATION_MS)
	}

	return {
		result,
		isSpinning,
		spin,
	}
}
