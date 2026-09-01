---
type: overview
updated: 2026-08-31
---

# 퇴근시간 계산기 (work-time-calculator)

Free web app: enter clock-in time, it calculates clock-out time automatically.

- Live site: https://jeong-hyun-lee.github.io/
- Stack: Vue 3, Vite, VueUse, Day.js, Service Worker (offline + notifications)
- Package name: `time-calc`, version `0.0.0`, private
- Node: `^20.19.0 || >=22.12.0`

## Features
- Clock-in time input
- Automatic clock-out time calculation
- Half-day option (4h / 8h)
- Real-time countdown to clock-out
- 7 themes: default, dark, ocean, forest, sunset, vegeta, broly
- On-time notification
- Responsive (mobile/tablet/desktop)
- LocalStorage persistence for clock-in time and settings
- Widget hub: 로또 번호 생성기, 오늘의 한마디, 점심 메뉴 룰렛, 사다리타기, 연봉 실수령액 계산기

## Deployment
Cloudflare Pages, auto-deploy on push to `main` 브랜치.

See [[architecture]] for the current component/composable map.

Source: README.md, package.json (read 2026-08-31).
