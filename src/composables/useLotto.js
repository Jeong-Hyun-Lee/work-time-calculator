import { ref } from 'vue'

const LINE_COUNT = 5
const NUMBERS_PER_LINE = 6
const POOL_SIZE = 45

const pickLine = () => {
	const pool = Array.from({ length: POOL_SIZE }, (_, i) => i + 1)
	const picked = []

	while (picked.length < NUMBERS_PER_LINE) {
		const randomBuffer = new Uint32Array(1)
		crypto.getRandomValues(randomBuffer)
		const index = randomBuffer[0] % pool.length
		picked.push(pool[index])
		pool.splice(index, 1)
	}

	return picked.sort((a, b) => a - b)
}

export function useLotto() {
	const lines = ref([])

	// 실물 로또 용지처럼 한 번에 5줄(A~E) 생성
	const generate = () => {
		lines.value = Array.from({ length: LINE_COUNT }, pickLine)
	}

	return {
		lines,
		generate,
	}
}
