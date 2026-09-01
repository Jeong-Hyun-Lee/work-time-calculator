import { ref } from 'vue'
import dayjs from 'dayjs'
import quotes from '../data/quotes.json'

export function useQuote() {
	const seed = Number(dayjs().format('YYYYMMDD'))
	const index = ref(seed % quotes.length)
	const quote = ref(quotes[index.value])

	const next = () => {
		let nextIndex = Math.floor(Math.random() * quotes.length)
		if (quotes.length > 1 && nextIndex === index.value) {
			nextIndex = (nextIndex + 1) % quotes.length
		}
		index.value = nextIndex
		quote.value = quotes[nextIndex]
	}

	return {
		quote,
		next,
	}
}
