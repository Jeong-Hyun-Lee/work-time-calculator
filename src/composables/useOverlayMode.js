import { computed, ref } from 'vue'

// 카드(라벨 + 시간) 비율에 가깝게 잡아야 창 안에 여백이 덜 남는다.
// 요청 높이에서 창 제목줄 몫이 빠지므로 실제 표시 영역보다 크게 요청한다
const PIP_WIDTH = 380
const PIP_HEIGHT = 290

// 컨테이너를 꽉 채우되 여백은 조금 남긴다
const FIT_MARGIN = 0.94

// 헤더 버튼과 App.vue 그리드가 같은 상태를 봐야 하므로 모듈 스코프에 둔다
const isFocusMode = ref(false)
const pipWindow = ref(null)

// Document Picture-in-Picture: 크롬·엣지 데스크톱만 지원
const isPipSupported = () =>
	typeof window !== 'undefined' && 'documentPictureInPicture' in window

let overlayCard = null
let fittedElement = null
let fitView = null

// transform: scale은 레이아웃 박스를 그대로 둬서 원본 크기만큼 스크롤이 생긴다.
// zoom은 레이아웃까지 줄이므로 스크롤 없이 컨테이너에 맞는다
const applyScale = () => {
	if (!fittedElement || !fitView) return

	// 배율을 뺀 상태에서 재야 콘텐츠의 자연 크기를 얻는다.
	// 고정 설계 크기를 쓰면 언어마다 다른 문구 길이만큼 여백이 남는다
	fittedElement.style.zoom = '1'
	const natural = fittedElement.getBoundingClientRect()
	if (!natural.width || !natural.height) return

	const scale =
		Math.min(
			fitView.innerWidth / natural.width,
			fitView.innerHeight / natural.height,
		) * FIT_MARGIN
	fittedElement.style.zoom = scale
}

// card = 방해 요소를 숨길 카드, element = 배율을 걸 대상.
// 집중 모드는 카드째로 키우고, PiP는 카드가 창을 꽉 채운 뒤 안쪽 콘텐츠만 키운다
const startFitting = (card, element, view) => {
	overlayCard = card
	fittedElement = element
	fitView = view
	card.classList.add('is-overlay')
	element.classList.add('is-fitted')
	applyScale()
	view.addEventListener('resize', applyScale)
}

const stopFitting = () => {
	if (!fittedElement) return
	fitView?.removeEventListener('resize', applyScale)
	overlayCard?.classList.remove('is-overlay')
	fittedElement.classList.remove('is-fitted')
	fittedElement.style.zoom = ''
	overlayCard = null
	fittedElement = null
	fitView = null
}

// PiP 창은 별도 document라 페이지 스타일이 따라가지 않으므로 직접 옮긴다
const copyStyles = (pip) => {
	for (const sheet of document.styleSheets) {
		try {
			const css = [...sheet.cssRules].map((rule) => rule.cssText).join('\n')
			const style = pip.document.createElement('style')
			style.textContent = css
			pip.document.head.append(style)
		} catch {
			// 다른 오리진(구글 폰트) 시트는 cssRules를 못 읽으므로 link로 넘긴다
			if (!sheet.href) continue
			const link = pip.document.createElement('link')
			link.rel = 'stylesheet'
			link.href = sheet.href
			pip.document.head.append(link)
		}
	}

	// 카드가 창을 꽉 채우게 해야 좌우에 빈 배경이 남지 않는다.
	// Chrome이 정한 최소 창 크기 안에서 시간이 최대한 커지는 지점
	const layout = pip.document.createElement('style')
	layout.textContent = `
		body {
			margin: 0;
			height: 100vh;
			overflow: hidden;
			/* 카드를 붙이기 전 한 프레임 흰 배경이 보이지 않게 */
			background: var(--color-page-gradient);
		}

		.countdown-section.is-overlay {
			width: 100vw;
			height: 100vh;
			padding: 0;
			border-radius: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	`
	pip.document.head.append(layout)
}

const onKeydown = (event) => {
	if (event.key === 'Escape') exitFocusMode()
}

const enterFocusMode = () => {
	const card = document.querySelector('.countdown-section')
	isFocusMode.value = true
	document.body.classList.add('is-overlay-open')
	window.addEventListener('keydown', onKeydown)
	// 화면 전체가 컨테이너라 카드째로 키워도 여백이 남지 않는다
	if (card) startFitting(card, card, window)
}

function exitFocusMode() {
	stopFitting()
	isFocusMode.value = false
	document.body.classList.remove('is-overlay-open')
	window.removeEventListener('keydown', onKeydown)
}

// 카운트다운 DOM을 PiP 창으로 옮긴다. Vue는 같은 노드를 계속 패치하므로
// 창 안에서도 시간이 갱신되고, 닫으면 원래 자리(주석 자리표)로 되돌린다
const openPipWindow = async () => {
	const card = document.querySelector('.countdown-section')
	const content = card?.querySelector('.countdown')
	if (!card || !content) return

	const pip = await window.documentPictureInPicture.requestWindow({
		width: PIP_WIDTH,
		height: PIP_HEIGHT,
	})

	copyStyles(pip)

	const placeholder = document.createComment('countdown-in-pip')
	card.before(placeholder)
	pip.document.body.append(card)
	startFitting(card, content, pip)
	pipWindow.value = pip

	pip.addEventListener('pagehide', () => {
		stopFitting()
		placeholder.replaceWith(card)
		pipWindow.value = null
	})
}

export function useOverlayMode() {
	const isOverlayActive = computed(
		() => isFocusMode.value || pipWindow.value !== null,
	)

	const toggle = async () => {
		if (pipWindow.value) {
			pipWindow.value.close()
			return
		}
		if (isFocusMode.value) {
			exitFocusMode()
			return
		}

		if (isPipSupported()) {
			try {
				await openPipWindow()
				return
			} catch {
				// 사용자가 창 열기를 막았거나 실패하면 페이지 내 모드로 떨어진다
			}
		}

		enterFocusMode()
	}

	return {
		isFocusMode,
		isOverlayActive,
		toggle,
	}
}
