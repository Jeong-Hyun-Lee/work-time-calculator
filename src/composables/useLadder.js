import { ref } from 'vue'

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

		const outcomes = [...participants]
		for (let i = outcomes.length - 1; i > 0; i--) {
			const randomBuffer = new Uint32Array(1)
			crypto.getRandomValues(randomBuffer)
			const j = randomBuffer[0] % (i + 1)
			;[outcomes[i], outcomes[j]] = [outcomes[j], outcomes[i]]
		}

		results.value = participants.map((name, i) => ({
			name,
			outcome: outcomes[i],
		}))
	}

	return {
		namesInput,
		results,
		error,
		generate,
	}
}
