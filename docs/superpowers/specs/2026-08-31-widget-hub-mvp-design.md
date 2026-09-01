# 위젯 허브 MVP — 설계

- 날짜: 2026-08-31
- 브랜치: `feature/widget-hub-mvp` (base: `redesign/mono-ui` — 새 위젯들이 그 브랜치의 무채색 디자인 토큰을 그대로 소비하므로, 아직 `master`에 병합되지 않은 `redesign/mono-ui` 위에서 분기)
- 근거 문서: [wiki/pages/widget-hub-brainstorm.md](../../../wiki/pages/widget-hub-brainstorm.md) (기획/디자인/개발 3자 브레인스토밍 + 사용자 스코프 결정)
- 상태: 사용자 검토 대기

## 배경

`work-time-calculator`(퇴근시간 계산기)를 앵커로 두고, 직장인이 업무 중 잠깐 들르는 캐주얼 위젯 여러 개를 한 페이지에 동시에 보여주는 "위젯 허브"로 확장한다. 최종 배포는 Cloudflare Pages 무료 티어. 구글 애널리틱스 연동은 이번 스코프에서 TODO만 남기고 구현하지 않는다.

## 목표

- 기존 퇴근시간 계산기를 페이지 최상단에 유지한 채, 아래에 카드 그리드로 신규 위젯들을 배치
- 확정된 MVP 5개 위젯 구현: 로또 번호 생성기, 오늘의 운세/명언, 점심 메뉴 룰렛, 사다리타기, 연봉 실수령액 계산기
- 기존 무채색 디자인 토큰(`redesign/mono-ui`)을 그대로 확장, 새 색상 토큰 추가 없음
- Cloudflare Pages에 배포 가능한 정적 빌드 구조 유지 (백엔드/서버리스 함수 불필요 — MVP 5개 전부 클라이언트 로직만으로 동작)

## 비목표 (이번 스코프 아님)

- 날씨/온도, 환율 계산기 (2차 — 외부 API 필요, 별도 스코프)
- 만 나이 계산기, 뽀모도로 타이머, 회의 카운트다운 타이머 (사용자 결정으로 제외)
- 구글 애널리틱스 실제 연동 (TODO 목록만 남김, 코드 구현 안 함)
- `vue-router`, Pinia 등 신규 상태관리/라우팅 라이브러리 도입 (위젯 간 공유 상태 없음, 한 페이지 동시 노출이라 라우팅 불필요)
- Cloudflare Pages Functions(서버리스 프록시) — MVP 5개 위젯 모두 외부 API를 쓰지 않으므로 불필요

## 아키텍처

```
src/
├── App.vue                       # 위젯 그리드 컨테이너로 확장 (기존: TimeCalculator만 렌더)
├── components/
│   ├── TimeCalculator.vue        # 기존 유지, 무변경
│   ├── WidgetHeader.vue          # 신규 — 아이콘+제목+보조 액션(새로고침 등) 공통 헤더
│   └── widgets/                  # 신규
│       ├── LottoWidget.vue
│       ├── QuoteWidget.vue
│       ├── LunchRouletteWidget.vue
│       ├── LadderWidget.vue
│       └── SalaryCalculatorWidget.vue
├── composables/
│   ├── useLotto.js                # 신규
│   ├── useQuote.js                 # 신규
│   ├── useLunchRoulette.js         # 신규
│   ├── useLadder.js                # 신규
│   └── useSalaryCalculator.js      # 신규
└── data/
    ├── quotes.json                 # 신규 — 명언/운세 정적 데이터 (최소 30개)
    └── lunchMenus.json              # 신규 — 점심 메뉴 정적 데이터 (최소 15개)
```

기존 컴포넌트(`AppHeader.vue`, `TimeInput.vue`, `TimeInfoCards.vue`, `CountdownDisplay.vue`)와 `useTimeCalculation.js`/`useNotification.js`/`useSEO.js`는 무변경.

## 레이아웃 & 디자인 규칙

`redesign/mono-ui`에서 확립된 토큰([src/assets/base.css](../../../src/assets/base.css))을 그대로 재사용한다. 새 색상 토큰은 추가하지 않는다.

- **페이지 구조 전환**: `App.vue`가 `<TimeCalculator />` 하나만 렌더하던 것에서, `TimeCalculator`(히어로, 최상단) + 아래 `.widget-grid`(신규 위젯 5개 카드)로 확장. 현재 `TimeCalculator.vue`의 `.time-calculator`는 `height: 100vh; overflow: hidden`로 뷰포트에 고정돼 있는데, 위젯 그리드가 그 아래 붙으려면 페이지 전체가 자연 스크롤되도록 이 컴포넌트의 높이 트랩을 풀어야 한다 (이번 스코프에 포함 — `TimeCalculator.vue` 레이아웃 CSS만 조정, 내부 로직/자식 컴포넌트는 무변경).
- **그리드**: `.widget-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--spacing-16); max-width: 1280px; margin: 0 auto; padding: var(--spacing-24) var(--spacing-16); }`. 768px 이하에서 1fr 단일 컬럼으로 스택.
- **위젯 카드 껍데기**: `--color-paper` bg, `1px solid var(--color-hairline)`, `border-radius: var(--radius-card)`(24px), `box-shadow: var(--shadow-card)`, padding `--spacing-20`. `.time-calculator`의 `.container`와 동일한 카드 레시피를 재사용.
- **위젯 span**: 로또/사다리타기/연봉계산기 = `.widget--md`(grid-column: span 6, 768px 이하에서 span 12), 명언/점심룰렛 = `.widget--sm`(grid-column: span 4, 768px 이하에서 span 12).
- **WidgetHeader.vue**: props `icon`(슬롯 또는 컴포넌트), `title`(string). 레이아웃: 아이콘(24px, `--color-ink`, 배경 박스 없음 — `AppHeader.vue` 아이콘 처리 원칙과 동일) + 제목(`--text-subheading` 18px/600 `--color-ink`) 좌측 정렬, 기본 슬롯으로 우측 보조 액션(버튼 등) 배치 가능.
- **타이포 라벨/값 조합**: 라벨은 항상 `--text-caption`(12px)+uppercase+letter-spacing 0.05em+`--color-mid-gray`. 값은 `--text-heading-sm`(24px)~`--text-heading`(30px) 중 위젯 성격에 맞게 선택. 새 폰트 크기/letter-spacing 값을 임의로 만들지 않는다.
- **버튼**: 각 위젯의 주요 액션(번호 생성, 룰렛 돌리기, 결과 만들기, 계산하기)은 신규 **Solid 필드 버튼** 사용 — `background: var(--color-ink-soft); color: var(--color-paper); border: none; border-radius: var(--radius-control)`(18px). 기존엔 outline 버튼(`CountdownDisplay.vue`의 `.copy-btn`)만 있었으므로 이번에 filled variant를 처음 도입.
- **다크 인버전은 위젯당 최대 1곳** — 이번 5개 위젯은 결과를 강조하고 싶을 때(예: 로또 보너스 번호, 연봉계산기 최종 실수령액)만 `--color-ink-soft` bg + `--color-paper` 텍스트 사용, 위젯 전체를 인버전하지 않는다.
- **모션**: `transform`/`opacity`만 사용 (컴포지터 친화적). 색상이 바뀌는 애니메이션 금지.

## 위젯별 요구사항

### 1. 로또 번호 생성기 (`LottoWidget.vue` / `useLotto.js`)
- "번호 생성" Solid 버튼 클릭 시 1~45 중 서로 다른 6개 숫자를 `crypto.getRandomValues` 기반으로 비복원 추출, 오름차순 정렬해서 표시
- 각 번호는 40×40px 원형(`1px solid var(--color-hairline)`, bg `--color-surface-alt`, `--text-subheading` 18px/600 tabular-nums)로 표시
- 위젯 하단(또는 헤더 하위)에 상시 노출 문구: "당첨을 예측하지 않는 재미용 랜덤 생성기입니다" (caption, mid-gray) — 적중률/당첨확률 관련 표현 금지
- 세션 내 재생성 횟수 카운트를 표시할지는 구현 시 선택(필수 아님, YAGNI)
- 외부 API 없음, localStorage 저장 불필요(세션 로컬 상태로 충분)

### 2. 오늘의 운세/명언 (`QuoteWidget.vue` / `useQuote.js`)
- `src/data/quotes.json`(최소 30개, `{ text: string, author?: string }[]` 형태)에서 하나를 표시
- 초기 표시는 오늘 날짜 시드 기반 선택(같은 날 새로고침해도 같은 문구) — 예: `dayjs().dayOfYear() % quotes.length`
- "다른 명언 보기" outline 버튼으로 랜덤 재선택 가능
- 상시 노출 문구: "재미로 보는 콘텐츠이며 실제 운세와 무관합니다" (caption, mid-gray)
- 콘텐츠(명언 텍스트)는 직접 작성하거나 저작권 문제 없는 소스만 사용 — 구현 시 데이터 작성자가 출처 확인

### 3. 점심 메뉴 룰렛 (`LunchRouletteWidget.vue` / `useLunchRoulette.js`)
- `src/data/lunchMenus.json`(최소 15개 문자열 배열)에서 "룰렛 돌리기" Solid 버튼 클릭 시 랜덤 선택
- 결과 표시 전 짧은 순차 전환 애니메이션(여러 메뉴가 빠르게 스쳐가다 멈추는 느낌, `opacity`/`transform`만 사용, 색상 변화 없음) — 과하지 않게, 1초 내외
- 최종 선택된 메뉴는 `--text-heading-sm`(24px/600) 강조 표시

### 4. 사다리타기 (`LadderWidget.vue` / `useLadder.js`)
- 참가자 이름을 줄바꿈 또는 쉼표로 구분해 입력(textarea 또는 여러 개의 text input, 구현 시 선택) — 최소 2명, 최대 인원 제한은 구현 시 합리적으로 정함(예: 10명)
- "결과 만들기" Solid 버튼 클릭 시 참가자 순서를 무작위로 섞어 1:1 매칭 결과 표시(전통적인 사다리 시각화는 MVP 범위 아님 — 단순 랜덤 매칭 리스트로 충분, YAGNI)
- 결과는 "참가자 → 결과" 형태의 리스트로 표시

### 5. 연봉 실수령액 계산기 (`SalaryCalculatorWidget.vue` / `useSalaryCalculator.js`)
- 연봉(세전, 만원 단위) 입력 → 4대보험(국민연금/건강보험/장기요양보험/고용보험) 공제 + 근로소득세(+지방소득세 10%) 공제 후 월 실수령액 추정치 표시
- **중요 — 구현 착수 전 재확인 필요**: 4대보험 요율과 소득세 계산 로직(간이세액표 또는 근사 누진세율)에 쓰일 정확한 수치는 이 설계 문서에 하드코딩하지 않는다. 구현 담당(개발자 서브에이전트)이 최신 공식 자료(국민연금공단/국세청 등)를 기준으로 상수를 채우고, 어떤 방식(정식 간이세액표 vs 근사 누진세율)을 쓸지 결정해서 보고할 것.
- 상시 노출 문구: "참고용이며 실제 급여와 다를 수 있습니다" + 계산 기준 연도 명시 (caption, mid-gray)
- 결과 중 "월 실수령액"만 다크 인버전(`--color-ink-soft`)으로 강조, 공제 내역(국민연금/건강보험/소득세 등)은 일반 리스트로 표시

## Cloudflare 배포 계획

- Cloudflare Pages, GitHub 리포 연결, Build command `npm run build`, Output directory `dist`
- Pages Functions 불필요 (외부 API 미사용)
- 커스텀 도메인 연결 여부는 사용자 결정 사항 — 이번 스코프는 배포 파이프라인 구성까지만
- 기존 `wiki/pages/overview.md`가 "GitHub Pages/Actions 자동배포"로 기술돼 있으나 실제 워크플로 파일은 비어 있음(사전 확인됨) — Cloudflare Pages 연결은 기존 배포를 대체하는 신규 세팅이며, 이 설계 문서 범위에 배포 후 wiki 갱신을 포함한다

## 구글 애널리틱스 TODO (구현 안 함)

- [ ] `index.html`에 GA4 `gtag.js` 삽입 위치 주석 표시
- [ ] `src/composables/useAnalytics.js` — `trackEvent(name, params)` 시그니처만 정의, no-op 구현
- [ ] 이벤트 후보: `lotto_generate`, `quote_view`, `quote_refresh`, `lunch_roulette_spin`, `ladder_generate`, `salary_calculate`
- [ ] GA Measurement ID는 Cloudflare Pages 환경변수(`VITE_GA_MEASUREMENT_ID`)로 관리 예정

## 후속 확인이 필요한 리스크

- 연봉 실수령액 계산기의 세율/보험료율 정확성 — 위 "위젯별 요구사항 5번" 참고, 구현 시점에 재확인
- 명언 콘텐츠 저작권/출처
- 사다리타기 참가자 최대 인원수 — 구현 시 합리적 상한 결정
