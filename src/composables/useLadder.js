import { ref } from 'vue'

function shuffleIndices(length) {
	const indices = Array.from({ length }, (_, i) => i)
	for (let i = indices.length - 1; i > 0; i--) {
		const randomBuffer = new Uint32Array(1)
		crypto.getRandomValues(randomBuffer)
		const j = randomBuffer[0] % (i + 1)
		;[indices[i], indices[j]] = [indices[j], indices[i]]
	}
	return indices
}

export function useLadder() {
	const namesInput = ref('')
	const results = ref([])
	const error = ref('')

	const generate = () => {
		error.value = ''
		const participants = namesInput.value
			.split(/[\n,]/)
			.map((name) => name.trim())
			.filter((name) => name.length > 0)

		if (participants.length < 2) {
			error.value = '참가자를 2명 이상 입력해주세요'
			results.value = []
			return
		}

		if (participants.length > 10) {
			error.value = '참가자는 최대 10명까지 입력할 수 있어요'
			results.value = []
			return
		}

		let indices
		do {
			indices = shuffleIndices(participants.length)
		} while (indices.some((value, i) => value === i))

		results.value = participants.map((name, i) => ({
			name,
			outcome: participants[indices[i]],
		}))
	}

	return {
		namesInput,
		results,
		error,
		generate,
	}
}
