/**
 * Google Analytics 4 (gtag.js) 초기화.
 *
 * Measurement ID는 클라이언트 번들에 그대로 노출되는 공개 값이라 코드에 직접 둠.
 * https://analytics.google.com 에서 발급받은 ID(`G-`로 시작)를 아래에 넣으면 활성화됨.
 */
const GA_MEASUREMENT_ID = 'G-83N77DL2BH'

export function initAnalytics() {
	// ID 미설정이거나 개발 서버면 아무것도 로드하지 않음 (로컬 트래픽 오염 방지)
	if (!GA_MEASUREMENT_ID || !import.meta.env.PROD) return

	const script = document.createElement('script')
	script.async = true
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
	document.head.appendChild(script)

	window.dataLayer = window.dataLayer || []
	window.gtag = function gtag() {
		window.dataLayer.push(arguments)
	}
	window.gtag('js', new Date())
	window.gtag('config', GA_MEASUREMENT_ID)
}
