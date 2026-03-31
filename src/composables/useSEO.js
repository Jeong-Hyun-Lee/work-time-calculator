import { onMounted, watch } from 'vue'

/**
 * SEO 메타 태그를 동적으로 관리하는 composable
 */
export function useSEO(options = {}) {
	const defaultOptions = {
		title: '퇴근시간 계산기 - 출근 시간 입력으로 퇴근 시간 자동 계산',
		description:
			'출근 시간을 입력하면 퇴근 시간을 자동으로 계산해주는 무료 웹 앱입니다. 하프데이 옵션, 실시간 카운트다운, 다양한 테마를 지원합니다.',
		keywords:
			'퇴근시간 계산기, 출근시간, 퇴근시간, 근무시간 계산, 하프데이, 카운트다운, 직장인, 워크타임 계산기',
		image: '/og-image.png',
		url: 'https://your-domain.com/',
		...options,
	}

	// @vueuse/head가 설치되어 있지 않을 수 있으므로 직접 DOM 조작
	const updateMetaTag = (name, content, attribute = 'name') => {
		let element = document.querySelector(`meta[${attribute}="${name}"]`)
		if (!element) {
			element = document.createElement('meta')
			element.setAttribute(attribute, name)
			document.head.appendChild(element)
		}
		element.setAttribute('content', content)
	}

	const updateTitle = (title) => {
		document.title = title
		updateMetaTag('og:title', title, 'property')
		updateMetaTag('twitter:title', title, 'property')
	}

	const updateDescription = (description) => {
		updateMetaTag('description', description)
		updateMetaTag('og:description', description, 'property')
		updateMetaTag('twitter:description', description, 'property')
	}

	const updateImage = (image) => {
		updateMetaTag('og:image', image, 'property')
		updateMetaTag('twitter:image', image, 'property')
	}

	const updateSEO = (seoOptions) => {
		const options = { ...defaultOptions, ...seoOptions }
		if (options.title) updateTitle(options.title)
		if (options.description) updateDescription(options.description)
		if (options.image) updateImage(options.image)
		if (options.keywords) updateMetaTag('keywords', options.keywords)
	}

	// 초기 SEO 설정
	onMounted(() => {
		updateSEO(defaultOptions)
	})

	return {
		updateSEO,
		updateTitle,
		updateDescription,
		updateImage,
	}
}
