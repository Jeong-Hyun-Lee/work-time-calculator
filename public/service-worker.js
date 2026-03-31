// Service Worker for notifications with actions
self.addEventListener('install', (event) => {
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim())
})

// 알림 표시
self.addEventListener('notificationclick', (event) => {
	event.notification.close()

	// 액션 버튼 클릭 처리
	if (event.action === 'view') {
		event.waitUntil(
			clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
				// 이미 열린 창이 있으면 포커스
				for (let i = 0; i < clientList.length; i++) {
					const client = clientList[i]
					if (client.url === '/' && 'focus' in client) {
						return client.focus()
					}
				}
				// 없으면 새 창 열기
				if (clients.openWindow) {
					return clients.openWindow('/')
				}
			})
		)
	} else if (event.action === 'close') {
		// 닫기 액션은 이미 notification.close()로 처리됨
		return
	} else {
		// 알림 자체를 클릭한 경우
		event.waitUntil(
			clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
				for (let i = 0; i < clientList.length; i++) {
					const client = clientList[i]
					if (client.url === '/' && 'focus' in client) {
						return client.focus()
					}
				}
				if (clients.openWindow) {
					return clients.openWindow('/')
				}
			})
		)
	}
})

