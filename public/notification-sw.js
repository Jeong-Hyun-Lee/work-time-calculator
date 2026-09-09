// Workbox가 생성한 Service Worker에 importScripts로 합쳐지는 알림 처리부.
// 알림 액션 버튼(actions)은 Service Worker 알림에서만 지원되므로 여기서 클릭을 받는다.
// install/activate(skipWaiting·clientsClaim)는 Workbox가 처리하므로 두지 않는다.
self.addEventListener('notificationclick', (event) => {
	event.notification.close()

	// 닫기 액션은 위에서 닫은 것으로 끝
	if (event.action === 'close') return

	event.waitUntil(
		(async () => {
			const scope = new URL(self.registration.scope)
			const windows = await self.clients.matchAll({
				type: 'window',
				includeUncontrolled: true,
			})

			// 이미 열린 창이 있으면 포커스. client.url은 절대 URL이므로 pathname으로 비교한다
			for (const client of windows) {
				if (new URL(client.url).pathname === scope.pathname && 'focus' in client) {
					return client.focus()
				}
			}

			return self.clients.openWindow(scope.pathname)
		})(),
	)
})
