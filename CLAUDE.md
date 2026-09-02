# CLAUDE.md

work-time-calculator 프로젝트 지침. 공통 개발 지침(코딩 원칙, 커밋 규칙, 도구 사용 취향)은 별도 파일에서 import.

@.claude/common-guidelines.md

## 프로젝트 요약 (Quick Start)

**스택:** Vue 3 (Composition API) + Vite + Cloudflare Pages. `@vueuse/core`, `dayjs` 사용.

```bash
npm install
npm run dev              # 개발 서버 (Vite)
npm run build             # dist/ 로 프로덕션 빌드
npm run preview           # 빌드 결과 로컬 미리보기
npm run deploy             # 빌드 + Cloudflare Pages 배포 (wrangler, project=work-time-calculator, branch=main)
npm run deploy:preview     # 빌드 + 프리뷰 배포
npm run cf:login           # wrangler 로그인
npm run cf:whoami          # wrangler 계정 확인
```

테스트 프레임워크 미구성 상태 (`*.test.*`/`*.spec.*` 파일 없음, package.json에 test 스크립트 없음). 요청 없이 테스트 인프라 새로 만들지 않음.

아키텍처/현황 파악은 코드 직접 훑기보다 `wiki/pages/index.md`부터 시작 (아래 위키 사서 역할 참고).

## 위키 사서 역할

`wiki/`는 이 프로젝트(work-time-calculator 자체 — 기능, 아키텍처, 결정, 개발 노트)에 대한 지속적이고 스스로 갱신되는 지식 베이스. 매 질의마다 재구성되는 RAG 인덱스가 아니라, 세션을 거쳐 누적되는 산출물.

**레이어**

- `wiki/raw/` — 불변 원본 소스 모음(회의록, 기능 스펙, 이슈 스레드, 사용자가 넣는 외부 리서치). 한 번 추가된 파일은 절대 수정 안 함.
- `wiki/pages/` — 직접 소유하는 마크다운 페이지: `overview.md`, `architecture.md`, 그 외 신규 엔티티/개념/결정 페이지. 이 페이지들은 직접 만들고 갱신함; 사용자가 손으로 작성하지 않음.
- `wiki/pages/index.md` — 모든 페이지의 한 줄 요약 카탈로그. 질의 답변 시 먼저 읽음.
- `wiki/pages/log.md` — 추가 전용 시간순 기록. 항목 형식: `## [YYYY-MM-DD] ingest|query|lint | <제목>`.

**작업**

- **Ingest(수집)**: `wiki/raw/`에 새 파일이 들어오거나 저장소에 실제 변경이 발생하면 → 읽고, 핵심 요점을 사용자와 논의하고, 관련 `wiki/pages/*.md` 갱신/생성하고, `index.md` 갱신하고, `log.md`에 항목 추가.
- **Query(질의)**: `index.md`를 읽어 관련 페이지를 찾고, 파고들어, 페이지 이름을 인용하며 답변. 사소하지 않은 답변(비교, 분석)은 대화에만 남기지 않고 `wiki/pages/`에 새 페이지로 저장.
- **Lint(점검)**: 요청 시 페이지 간 모순, 코드가 이미 바뀌어 낡아진 주장, 고아 페이지, 누락된 상호 참조(`[[page-name]]` 링크)를 확인 — 고칠 수 있는 건 고치고 점검 이력 기록.

**컨벤션**

- 페이지끼리는 `[[page-name]]`(파일명에서 `.md` 뺀 것과 일치)으로 링크.
- 위키 페이지는 README.md 같은 오래된 문서가 주장하는 내용이 아니라 실제 프로젝트 현황(`src/` 대조 검증)을 기술 — 발견 시 괴리 표시. `architecture.md`에 이미 예시 있음.

## 알아둘 점 (Gotchas)

- **GA4 측정 ID 하드코딩은 의도적:** `src/analytics.js`의 `GA_MEASUREMENT_ID`는 클라이언트 번들에 어차피 노출되는 공개 값이라 코드에 직접 박아둠. 시크릿 노출로 오판해 환경변수로 옮기지 말 것.
- **테스트 스위트 없음:** 유닛/E2E 테스트 프레임워크 미구성. "테스트 통과 확인" 같은 검증 기준 못 씀 — 수동 확인 또는 `npm run dev`로 직접 동작 확인.
