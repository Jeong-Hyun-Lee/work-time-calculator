---
type: brainstorm
updated: 2026-08-31
---

# 위젯 허브 확장 브레인스토밍

`work-time-calculator`(퇴근시간 계산기)를 앵커 기능으로 두고, 직장인이 업무 중 잠깐 들르는 여러 캐주얼 위젯(날씨, 로또번호 생성기 등)을 **한 페이지에 동시에** 표시하는 확장안. 시니어 기획자/디자이너/개발자 3인 페르소나 병렬 브레인스토밍 결과를 종합.

**최종 목표:** Cloudflare 무료 호스팅(Pages) 배포. **추가 목표(TODO만, 미구현):** 구글 애널리틱스 연동.

## 3자 합의 사항

- **앵커 유지**: 퇴근시간 계산기는 페이지 최상단 히어로 위치 유지, 기존 트래픽/SEO 자산 보존 (기획자·디자이너 일치)
- **아키텍처**: 별도 프로젝트 분리 대신 기존 저장소에 통합. `vue-router`/Pinia 등 신규 의존성 불필요 (개발자) — "한 페이지 동시 노출" 요구사항 자체가 라우팅을 요구하지 않음
- **디자인 시스템 재사용**: [[architecture]]에 정리된 무채색 토큰(canvas/paper/surface-alt/ink/ink-soft/hairline, radius 18/24px, `--shadow-card`) 그대로 확장. 새 색상 토큰 추가 없이 기존 7색 팔레트 안에서 처리 (디자이너)
- **다크 인버전은 위젯당 최대 1곳만** — 하이라이트 카드/카운트다운이 지켰던 절제 원칙 계승 (디자이너)
- **MVP는 외부 API 제로 기능부터**: 로또 번호 생성기, 오늘의 운세/명언 한 줄은 3자 모두 1차 우선순위로 지목 (기획자 MVP 리스트, 디자이너 스펙 대상, 개발자 1차 배포 순서)
- **면책 문구 필요**: 로또/운세처럼 오인 소지 있는 콘텐츠는 "재미용" 문구 상시 노출 필요 (기획자 리스크 체크)

## 우선순위 (3자 종합)

| 티어 | 기능 | 근거 |
|---|---|---|
| **1차 (제로 API, MVP 확정)** | 로또 번호 생성기, 오늘의 운세/명언, 점심 메뉴 룰렛, 사다리타기 | 개발자: 클라이언트 로직만으로 구현(`Math.random`/`crypto.getRandomValues`, 정적 JSON). 기획자: 반복방문 신호 검증에 적합. 4개 전부 개발자가 명시적으로 검토 완료 |
| **1.5차 (MVP 확정, 데이터 소스 확인 필요)** | 연봉 실수령액 계산기 | 사용자 결정: 포함. 세율/4대보험료율 데이터 소스(국세청 간이세액표 등) 확보 및 유지보수 방식은 구현 착수 전 개발자가 별도로 재검토해야 함 |
| **2차 (외부 API, 키 불필요)** | 날씨/온도, 환율 계산기 | 개발자: Open-Meteo(날씨)·Frankfurter(환율) 모두 무료·키 불필요·CORS 허용 — Cloudflare Pages Functions 프록시 없이 클라이언트에서 바로 fetch 가능 |
| **제외 (사용자 결정)** | 만 나이 계산기, 뽀모도로 타이머, 회의 카운트다운 타이머 | 스코프에서 제외 — 재검토하지 않음 |
| **3차 (후순위, 여전히 미정)** | D-Day/공휴일 카운터, 카페인 섭취량 계산기, 타자 속도 테스트 | 데이터셋 유지보수 부담 또는 핵심 컨셉과의 연관성 낮음 |
| **제외 (개발자 판단)** | 실시간 주가/코인 시세 | 무료 API 자체가 부족, 키 관리·레이트리밋 이슈로 범위 밖 |

## 열린 질문 — 해결됨 (2026-08-31)

1. **연봉 실수령액 계산기**: 포함 확정. 세율표 데이터 소스는 구현 전 개발자 재검토 필요.
2. **만 나이 계산기 / 뽀모도로 타이머**: 제외 확정.
3. **회의 카운트다운 타이머**: 제외 확정.

## 위젯 구현 시 디자인 규칙 (디자이너 제안)

- 라벨은 항상 caption(12px)+uppercase+letter-spacing 0.05em+`--color-mid-gray`, 값은 heading-sm(24px)~display(48px) 중 선택 — 새 타이포 조합 임의 생성 금지
- 카드 radius는 24px(`--radius-card`) 고정, 위젯 크기 차등은 grid span + padding으로만 표현
- 위젯 크기 차등 예시: Compact(날씨) `--spacing-16`, Mid/인터랙티브(로또) `--spacing-20`
- 신규 컴포넌트 필요: WidgetHeader(아이콘+제목+보조액션), 스켈레톤 로딩 상태(색상 애니메이션 없이 opacity pulse만), Solid ink 필드 버튼(현재 outline 버튼만 존재)
- 상세 비주얼 스펙(날씨/로또/명언 3종)은 이 문서의 기반이 된 디자이너 브레인스토밍 원본에 있음 — 실제 구현 태스크 때 재확인 필요

## 프로젝트 구조 제안 (개발자)

```
src/
├── components/
│   ├── TimeCalculator.vue     # 기존 유지
│   └── widgets/               # 신규
│       ├── LottoWidget.vue
│       ├── WeatherWidget.vue
│       └── QuoteWidget.vue
├── composables/
│   ├── useLotto.js            # 신규, 기존 ref/computed 반환 패턴 그대로
│   ├── useWeather.js
│   └── useExchangeRate.js
└── data/
    └── quotes.json
```

Cloudflare Pages Functions(서버리스 프록시)는 1차 배포에 불필요 — 날씨/환율 모두 키 없는 API라 클라이언트 직접 호출로 충분. 키가 필요한 API(예: 주식 시세)를 나중에 붙일 때만 `functions/api/*.js` 구조를 꺼내면 됨.

## 리스크 / 면책 문구 필요 항목 (기획자)

| 위젯 | 문구 방향 |
|---|---|
| 로또 번호 생성기 | "당첨을 예측하지 않는 재미용 랜덤 생성기" — 적중률/당첨확률 표현 금지 |
| 오늘의 운세 | "재미로 보는 콘텐츠이며 실제 운세와 무관" |
| 연봉 실수령액 계산기 | "참고용, 실제 급여와 다를 수 있음" + 기준 연도 명시 |
| 환율 계산기 | "실시간 환율과 차이 있을 수 있는 참고용" — 금융거래 목적 사용 금지 안내 |
| 날씨/미세먼지 | "공식 기상특보 대체 아님" |

## 구글 애널리틱스 TODO (미구현, 훅 포인트만 미리 고려)

- [ ] `index.html`에 GA4 `gtag.js` 삽입 위치 주석으로만 표시
- [ ] `src/composables/useAnalytics.js` stub — `trackEvent(name, params)` 시그니처만 정의, no-op
- [ ] 위젯별 이벤트 후보: `lotto_generate`, `weather_refresh`, `exchange_convert`, `quote_view` 등
- [ ] GA Measurement ID는 Cloudflare Pages 환경변수(`VITE_GA_MEASUREMENT_ID`)로 관리 예정
- [ ] 위젯별 노출/클릭/반복사용/재방문율/이탈지점 측정 지표 목록은 기획자 브레인스토밍 원본 참고
- [ ] GA 연동 시 쿠키 동의/개인정보처리방침 배너 필요 여부 검토 (보류)

## 참고 (위키 드리프트 발견)

개발자 브레인스토밍 중 발견: [[overview]]는 "GitHub Pages, GitHub Actions 자동배포"라고 기술하지만 실제 `.github/workflows/`는 비어 있음 — Cloudflare Pages로 전환한다면 기존 워크플로 교체가 아니라 신규 세팅. 이번 브레인스토밍 범위 밖이라 [[overview]] 자체는 아직 수정하지 않음, 다음 ingest/lint 때 반영 필요.

## 다음 단계

1. 열린 질문 3건에 대한 사람 결정 (연봉계산기 포함 여부, 만나이/뽀모도로 기술 재검토, 회의타이머 포함 여부)
2. MVP 범위 확정 후 [[architecture]] 갱신 방향으로 `docs/superpowers/specs/` 설계 문서 작성 (brainstorming → writing-plans 플로우)
3. Cloudflare Pages 배포 파이프라인 신규 구성 (GitHub Actions 대체)
