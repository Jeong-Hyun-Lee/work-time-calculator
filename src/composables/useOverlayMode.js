import { computed, ref } from 'vue'

const PIP_WIDTH = 380
const PIP_HEIGHT = 220

// 카드를 이 설계 크기로 고정하고 transform으로만 늘리거나 줄인다.
// 그래야 컨테이너가 어떤 비율이든 background-size: contain처럼 맞춰진다
const FIT_WIDTH = 640
const FIT_HEIGHT = 300
const FIT_MARGIN = 0.92

// 헤더 버튼과 App.vue 그리드가 같은 상태를 봐야 하므로 모듈 스코프에 둔다
const isFocusMode = ref(false)
const pipWindow = ref(null)

// Document Picture-in-Picture: 크롬·엣지 데스크톱만 지원
const isPipSupported = () =>
	typeof window !== 'undefined' && 'documentPictureInPicture' in window

let fittedElement = null
let fitView = null

// transform: scale은 레이아웃 박스를 그대로 둬서 설계 크기만큼 스크롤이 생긴다.
// zoom은 레이아웃까지 줄이므로 스크롤 없이 컨테이너에 맞는다
const applyScale = () => {
	if (!fittedElement || !fitView) return
	const scale =
		Math.min(fitView.innerWidth / FIT_WIDTH, fitView.innerHeight / FIT_HEIGHT) *
		FIT_MARGIN
	fittedElement.style.zoom = scale
}

const startFitting = (element, view) => {
	fittedElement = element
	fitView = view
	element.classList.add('is-fitted')
	applyScale()
	view.addEventListener('resize', applyScale)
}

const stopFitting = () => {
	if (!fittedElement) return
	fitView?.removeEventListener('resize', applyScale)
	fittedElement.classList.remove('is-fitted')
	fittedElement.style.zoom = ''
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

	const layout = pip.document.createElement('style')
	layout.textContent = `
		body {
			margin: 0;
			height: 100vh;
			overflow: hidden;
			display: grid;
			place-items: center;
			background: var(--color-page-gradient);
		}
	`
	pip.document.head.append(layout)
}

const onKeydown = (event) => {
	if (event.key === 'Escape') exitFocusMode()
}

const enterFocusMode = () => {
	const countdown = document.querySelector('.countdown-section')
	isFocusMode.value = true
	document.body.classList.add('is-overlay-open')
	window.addEventListener('keydown', onKeydown)
	if (countdown) startFitting(countdown, window)
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
	const countdown = document.querySelector('.countdown-section')
	if (!countdown) return

	const pip = await window.documentPictureInPicture.requestWindow({
		width: PIP_WIDTH,
		height: PIP_HEIGHT,
	})

	copyStyles(pip)

	const placeholder = document.createComment('countdown-in-pip')
	countdown.before(placeholder)
	pip.document.body.append(countdown)
	startFitting(countdown, pip)
	pipWindow.value = pip

	pip.addEventListener('pagehide', () => {
		stopFitting()
		placeholder.replaceWith(countdown)
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
