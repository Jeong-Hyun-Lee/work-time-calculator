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
