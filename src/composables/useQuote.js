import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import quotesByLocale from '../data/quotes.json'
import { locale } from '../i18n'

export function useQuote() {
	const list = computed(() => quotesByLocale[locale.value] ?? quotesByLocale.en)

	const seed = Number(dayjs().format('YYYYMMDD'))
	const index = ref(seed % quotesByLocale.ko.length)

	// 로케일별 배열은 같은 순서·같은 의미라 인덱스를 유지하면 언어만 바뀜
	const quote = computed(() => list.value[index.value % list.value.length])

	const next = () => {
		const size = list.value.length
		let nextIndex = Math.floor(Math.random() * size)
		if (size > 1 && nextIndex === index.value) {
			nextIndex = (nextIndex + 1) % size
		}
		index.value = nextIndex
	}

	return {
		quote,
		next,
	}
}
