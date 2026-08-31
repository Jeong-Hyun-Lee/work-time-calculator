import { ref } from 'vue'
import menus from '../data/lunchMenus.json'

export function useLunchRoulette() {
	const result = ref(null)
	const isSpinning = ref(false)

	const spin = () => {
		if (isSpinning.value) return
		isSpinning.value = true
		result.value = null

		setTimeout(() => {
			const index = Math.floor(Math.random() * menus.length)
			result.value = menus[index]
			isSpinning.value = false
		}, 600)
	}

	return {
		result,
		isSpinning,
		spin,
	}
}
