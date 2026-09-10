import { computed, ref } from 'vue'
import { t } from '../i18n'

// 앱 아이콘과 같은 것을 써서 토스트·설치 앱·파비콘의 브랜딩을 일치시킴
const NOTIFICATION_ICON = '/icon-512.png'
const NOTIFICATION_TAG = 'time-calculator'

const isSupported = typeof Notification !== 'undefined'
const permission = ref(isSupported ? Notification.permission : 'denied')

// 주소창이나 사이트 설정에서 사용자가 직접 바꿀 수도 있으니 그때도 상태를 맞춘다
if (isSupported && navigator.permissions?.query) {
	navigator.permissions
		.query({ name: 'notifications' })
		.then((status) => {
			status.onchange = () => {
				permission.value = Notification.permission
			}
		})
		.catch(() => {})
}

// 브라우저는 사용자 제스처 없이 온 권한 요청을 조용히 무시하거나 거부한다.
// 그래서 요청은 반드시 클릭 같은 상호작용에서만 한다
export function useNotificationPermission() {
	const request = async () => {
		if (!isSupported) return
		permission.value = await Notification.requestPermission()
	}

	return {
		canRequest: computed(() => permission.value === 'default'),
		isGranted: computed(() => permission.value === 'granted'),
		request,
	}
}

// 알림 전송. 액션 버튼은 Service Worker 알림에서만 지원되므로 SW 경로를 우선한다
export const sendNotification = async (message, options = {}) => {
	// 권한 요청은 사용자가 "알림 켜기"를 누를 때만 한다. 정시 타이머에서 요청하면
	// 사용자 제스처가 없어 브라우저가 무시하거나 아예 차단해 버린다
	if (!isSupported || Notification.permission !== 'granted') return false

	const payload = {
		body: message,
		icon: NOTIFICATION_ICON,
		badge: NOTIFICATION_ICON,
		tag: NOTIFICATION_TAG,
		renotify: true,
		requireInteraction: options.requireInteraction ?? false,
		...(options.actions && { actions: options.actions }),
	}

	if ('serviceWorker' in navigator) {
		// vite-plugin-pwa가 등록한 SW. ready는 활성화될 때까지 기다린다
		const registration = await navigator.serviceWorker.ready
		await registration.showNotification(t('notification.title'), payload)
		return true
	}

	// SW를 못 쓰는 브라우저 폴백. 이 경로에서는 actions가 무시된다
	const notification = new Notification(t('notification.title'), payload)
	notification.onclick = () => {
		window.focus()
		notification.close()
	}
	return true
}

// 정시 알림 체크
export const useHourlyNotification = (hours, minutes, remainingSeconds, diffInSeconds) => {
	const notifiedHours = ref(new Set())

	const checkHourlyNotification = async () => {
		if (diffInSeconds.value <= 0) return

		const currentHours = hours.value
		const currentMinutes = minutes.value
		const currentSeconds = remainingSeconds.value

		// 정시(분과 초가 모두 0)이고, 아직 알림을 보내지 않은 경우
		if (
			currentMinutes === 0 &&
			currentSeconds === 0 &&
			currentHours > 0 &&
			!notifiedHours.value.has(currentHours)
		) {
			notifiedHours.value.add(currentHours)

			const emoji = currentHours === 1 ? '⏰' : currentHours <= 3 ? '⏳' : '🕐'
			const message = t('notification.hoursLeft', {
				emoji,
				hours: currentHours,
			})

			await sendNotification(message, {
				requireInteraction: currentHours <= 2, // 2시간 이하일 때는 상호작용 필요
				actions: [{ action: 'view', title: t('notification.confirm') }],
			})
		}
	}

	const resetNotifiedHours = () => {
		notifiedHours.value.clear()
	}

	return {
		checkHourlyNotification,
		resetNotifiedHours,
	}
}
