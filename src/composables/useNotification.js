import { ref } from 'vue'
import { useWebNotification } from '@vueuse/core'
import { t } from '../i18n'

let serviceWorkerRegistration = null

// Service Worker 등록 (useWebWorker는 Service Worker와 다르므로 기존 방식 유지)
export const registerServiceWorker = async () => {
	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register(
				'/service-worker.js',
				{
					scope: '/',
				}
			)
			serviceWorkerRegistration = registration
			console.log('Service Worker 등록 성공:', registration.scope)
			return registration
		} catch (error) {
			console.error('Service Worker 등록 실패:', error)
			return null
		}
	}
	return null
}

// SVG 아이콘을 Data URL로 변환하여 사용
export const createNotificationIcon = () => {
	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
			<defs>
				<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
					<stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
				</linearGradient>
			</defs>
			<circle cx="64" cy="64" r="60" fill="url(#grad)" stroke="#fff" stroke-width="4"/>
			<circle cx="64" cy="64" r="4" fill="#fff"/>
			<line x1="64" y1="64" x2="64" y2="40" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
			<line x1="64" y1="64" x2="84" y2="64" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
		</svg>
	`
	const blob = new Blob([svg], { type: 'image/svg+xml' })
	return URL.createObjectURL(blob)
}

// 노티피케이션 전송
export const sendNotification = async (message, options = {}) => {
	const notificationIcon = options.icon || createNotificationIcon()
	
	// Service Worker를 통한 persistent notification 사용 (actions 지원)
	if (
		serviceWorkerRegistration &&
		'showNotification' in serviceWorkerRegistration &&
		options.actions &&
		Array.isArray(options.actions)
	) {
		try {
			await serviceWorkerRegistration.showNotification(t('notification.title'), {
				body: message,
				icon: notificationIcon,
				badge: options.badge || notificationIcon,
				tag: 'time-calculator',
				requireInteraction: options.requireInteraction || false,
				silent: false,
				actions: options.actions,
				...(options.image && { image: options.image }),
				...(navigator.vibrate && { vibrate: [200, 100, 200] }),
			})
			return true
		} catch (error) {
			console.error('Service Worker Notification 실패:', error)
			// Service Worker 실패 시 useWebNotification으로 폴백
		}
	}

	// useWebNotification을 사용하여 알림 표시
	const notification = useWebNotification({
		title: t('notification.title'),
		body: message,
		icon: notificationIcon,
		badge: options.badge || notificationIcon,
		tag: 'time-calculator',
		renotify: true,
		requireInteraction: options.requireInteraction || false,
		silent: false,
		...(options.image && { image: options.image }),
		...(navigator.vibrate && { vibrate: [200, 100, 200] }),
	})

	// 알림 클릭 이벤트
	notification.onClick((event) => {
		window.focus()
		notification.close()
	})

	// 알림 표시
	if (notification.isSupported.value && notification.permissionGranted.value) {
		notification.show()
		return notification
	} else if (notification.isSupported.value) {
		// 권한이 없으면 요청
		if ('Notification' in window && Notification.permission === 'default') {
			const permission = await Notification.requestPermission()
			if (permission === 'granted' && notification.permissionGranted.value) {
				notification.show()
				return notification
			}
		}
	}

	return null
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

			// 더 풍부한 알림 옵션
			const emoji = currentHours === 1 ? '⏰' : currentHours <= 3 ? '⏳' : '🕐'
			const message = t('notification.hoursLeft', {
				emoji,
				hours: currentHours,
			})

			await sendNotification(message, {
				requireInteraction: currentHours <= 2, // 2시간 이하일 때는 상호작용 필요
				actions: [
					{
						action: 'view',
						title: t('notification.confirm'),
						icon: createNotificationIcon(),
					},
				],
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

