import { ref } from 'vue'

export function useLotto() {
	const numbers = ref([])

	const generate = () => {
		const pool = Array.from({ length: 45 }, (_, i) => i + 1)
		const picked = []

		while (picked.length < 6) {
			const randomBuffer = new Uint32Array(1)
			crypto.getRandomValues(randomBuffer)
			const index = randomBuffer[0] % pool.length
			picked.push(pool[index])
			pool.splice(index, 1)
		}

		numbers.value = picked.sort((a, b) => a - b)
	}

	return {
		numbers,
		generate,
	}
}
