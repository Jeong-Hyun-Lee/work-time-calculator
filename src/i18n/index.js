import { createI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import ko from './locales/ko'
import en from './locales/en'
import ja from './locales/ja'
import zh from './locales/zh'

export const SUPPORTED_LOCALES = ['ko', 'en', 'ja', 'zh']

export const LOCALE_LABELS = {
	ko: '한국어',
	en: 'English',
	ja: '日本語',
	zh: '中文',
}

// 한국 세법·제도에 묶여 있어 다른 로케일에서는 의미가 없는 위젯이 있음
export const isKoreaOnlyLocale = (value) => value === 'ko'

// 브라우저 언어를 지원 로케일로 매핑. 매칭 실패하면 영어
const detectLocale = () => {
	const raw = (navigator.language || 'en').toLowerCase()
	if (raw.startsWith('ko')) return 'ko'
	if (raw.startsWith('ja')) return 'ja'
	if (raw.startsWith('zh')) return 'zh'
	return 'en'
}

// 사용자가 고른 값이 있으면 그것을, 없으면 브라우저 언어를 씀
export const storedLocale = useStorage('locale', detectLocale())

const initialLocale = SUPPORTED_LOCALES.includes(storedLocale.value)
	? storedLocale.value
	: 'en'

const i18n = createI18n({
	legacy: false,
	globalInjection: true,
	locale: initialLocale,
	fallbackLocale: 'en',
	messages: { ko, en, ja, zh },
})

// 컴포넌트 바깥(composable, 모듈 스코프)에서도 쓰는 전역 핸들
export const locale = i18n.global.locale
export const t = (...args) => i18n.global.t(...args)

export const setLocale = (next) => {
	if (!SUPPORTED_LOCALES.includes(next)) return
	i18n.global.locale.value = next
	storedLocale.value = next
	document.documentElement.lang = next
}

document.documentElement.lang = initialLocale

export default i18n
