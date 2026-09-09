# Log

## [2026-08-31] ingest | Wiki initialized
Seeded `wiki/` from repo state: README.md, package.json, `src/**` listing.
Created: overview.md, architecture.md, index.md.
Noted: README's project-structure section is stale vs actual `src/` tree.

## [2026-08-31] query | 위젯 허브 확장 브레인스토밍
ecc:team-builder로 기획자/디자이너/개발자 시니어 페르소나 3개 병렬 브레인스토밍 진행 (직장인 킬링타임 멀티위젯 페이지, Cloudflare 무료 배포 목표).
Created: widget-hub-brainstorm.md. Updated: index.md.
Noted: overview.md의 "GitHub Pages/Actions 자동배포" 서술이 실제 `.github/workflows/` 빈 상태와 드리프트 — 다음 lint 때 반영 필요.

## [2026-08-31] query | 위젯 허브 MVP 범위 확정
열린 질문 3건 사용자 답변 반영: 연봉 실수령액 계산기 포함, 만나이/뽀모도로/회의타이머 제외. 로또 번호 생성기는 이미 1차 MVP에 포함돼 있었음(재확인).
Updated: widget-hub-brainstorm.md.

## [2026-08-31] ingest | 위젯 허브 MVP 구현 및 Cloudflare 배포 문서화
로또/오늘의 한마디/점심 메뉴 룰렛/사다리타기/연봉 실수령액 계산기 5개 위젯 구현 완료.
overview.md의 GitHub Pages/Actions 배포 서술을 Cloudflare Pages로 갱신 (드리프트 해소).
Updated: overview.md, README.md, architecture.md.

## [2026-09-01] lint | architecture.md 잔여 드리프트 정리
architecture.md에 위젯 허브 섹션을 추가하던 중, `redesign/mono-ui`에서 삭제된 `ElectricEffects.vue`/`GokuSilhouette.vue`/`ThemeSelector.vue`/`useTheme.js`가 그대로 남아있던 것을 발견 — 해당 브랜치 작업 때 architecture.md가 갱신 대상에서 빠졌던 게 원인. 목록에서 제거하고 Note를 현재 상태로 재작성.
README.md의 "프로젝트 구조" 섹션은 여전히 테마 시스템(ThemeSelector.vue/useTheme.js/7종 테마)을 문서화하고 있고 위젯 허브 파일도 누락돼 있음 — 이번 범위 밖이라 후속 작업으로 남김.
Updated: architecture.md.

## [2026-09-09] ingest | vite-plugin-pwa로 PWA 전환
`vite-plugin-pwa@1.3.0`(generateSW + autoUpdate) 도입. manifest·SW 생성·등록을 전부 플러그인에 넘기고 수동 `public/manifest.webmanifest`와 `public/service-worker.js`를 제거.
알림 액션 버튼은 SW에서만 처리 가능하므로 `notificationclick` 로직을 `public/notification-sw.js`로 옮겨 `workbox.importScripts`로 합침. `useNotification.js`는 수동 SW 등록 대신 `navigator.serviceWorker.ready`를 쓰고, 매 알림마다 blob URL로 시계 SVG를 그리던 `createNotificationIcon()`(revoke 없이 누적되던 누수)을 지우고 앱 아이콘 `/icon-512.png`로 통일.
아이콘 PNG(512, apple-touch 180)를 새로 생성하고, `index.html`이 참조하던 404 상태의 `/favicon.png`·`/apple-touch-icon.png` 드리프트도 해소.
동기: Windows 토스트 헤더를 origin(`localhost:5173`)이 아니라 앱 이름·아이콘으로 띄우려면 설치형 PWA 신분이 필요하다는 점을 확인한 데서 출발.
Updated: architecture.md.

## [2026-09-01] ingest | Google Analytics 4 연동
`src/analytics.js` 추가 — gtag.js를 런타임에 동적 삽입, `src/main.js`에서 mount 전에 `initAnalytics()` 호출. Measurement ID는 클라이언트 번들에 노출되는 공개 값이라 env가 아닌 코드 상수(`GA_MEASUREMENT_ID`)로 둠. 상수가 비어있거나 개발 서버(`import.meta.env.PROD === false`)면 스크립트를 아예 로드하지 않아 로컬 트래픽이 통계에 섞이지 않음. 기본 page_view만 수집하고 커스텀 이벤트는 미구현.
architecture.md의 잔여 드리프트도 함께 정리: 삭제된 `TimeCalculator.vue`/`TimeInfoCards.vue` 제거, 누락됐던 `StatTile.vue` 추가, 미사용 `useSEO.js` 표시.
Updated: architecture.md.
