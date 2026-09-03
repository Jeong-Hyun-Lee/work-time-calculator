import { watch } from 'vue'
import { locale, t } from '../i18n'

/**
 * 현재 로케일에 맞춰 문서 제목과 메타 태그를 갱신하는 composable.
 *
 * 주의: 정적 index.html은 한국어 고정이라 JS를 실행하지 않는 크롤러는
 * 여기서 바꾼 값을 보지 못함. 언어별 검색 유입까지 노리려면 프리렌더가 필요.
 */
export function useSEO() {
	const updateMetaTag = (name, content, attribute = 'name') => {
		let element = document.querySelector(`meta[${attribute}="${name}"]`)
		if (!element) {
			element = document.createElement('meta')
			element.setAttribute(attribute, name)
			document.head.appendChild(element)
		}
		element.setAttribute('content', content)
	}

	const applySEO = () => {
		const title = t('seo.title')
		const description = t('seo.description')

		document.title = title
		updateMetaTag('title', title)
		updateMetaTag('og:title', title, 'property')
		updateMetaTag('twitter:title', title, 'property')

		updateMetaTag('description', description)
		updateMetaTag('og:description', description, 'property')
		updateMetaTag('twitter:description', description, 'property')

		updateMetaTag('keywords', t('seo.keywords'))
		updateMetaTag('og:locale', t('seo.ogLocale'), 'property')
	}

	applySEO()
	watch(locale, applySEO)

	return { applySEO }
}
