// 코드잇 스프린트 — AI 가시성 측정 설정(브랜드·경쟁사·질의셋).
//
// 질의셋 출처: 마케팅팀이 ZestCompany 의뢰 당시 확정한 질문 리스트(= 측정 스코프 source of truth).
// 방법론 레이어:
//   - metricRole: 헤드라인 "AI 인용률/SoV"는 visibility 만 집계
//       visibility : 무브랜드. 안 시켜도 코드잇이 떠야 = 진짜 가시성/인용률/SoV
//       reputation : 브랜드를 줬을 때 평판·감성·포지셔닝(언급 자명 → 가시성 제외)
//       accuracy   : 브랜드 팩트질의. groundTruth 대조 → 오정보 탐지
//   - 패러프레이즈: 마케팅이 준 1문장을 seed 로, 표현 분산용 변형을 추가(의도당 ~5)
//   - expand: {role}/{competitor} placeholder 는 promptBuilder 가 전개
//
// 버전 고정: 질의셋 변경 시 promptsVersion 올림(추이 비교 깨짐 방지).
import type { ServiceConfig, IntentPreset } from '../types'

export const sprint: ServiceConfig = {
  app: 'sprint',
  displayName: '코드잇 스프린트',
  promptsVersion: 1,
  locale: 'ko-KR',
  userCountry: 'KR',

  brand: {
    canonical: '코드잇 스프린트',
    aliases: ['코드잇 스프린트', '코드잇', 'Codeit', 'codeit', '코드잇 부트캠프'],
    domains: ['codeit.kr', 'sprint.codeit.kr'],
  },

  // SoV·경쟁 매칭용 경쟁사 (출처: 마케팅팀 확정 리스트)
  // aliases: AI 응답 본문에서 경쟁사 언급을 잡기 위한 표기 변형. 많을수록 매칭률↑.
  // strictContext: 일반 단어와 겹쳐 단순 substring 매칭 시 오탐 위험 → 단어경계/브랜드 맥락으로만 매칭.
  competitors: [
    { canonical: '패스트캠퍼스', aliases: ['패스트캠퍼스', '패캠', 'FastCampus', 'Fast Campus'] },
    // bare 'Kernel'/'커널'은 일반어(OS 커널)와 겹쳐 제외 + 맥락 필수
    { canonical: '커널 아카데미', aliases: ['커널 아카데미', '커널아카데미', 'Kernel Academy'], strictContext: true },
    {
      // 팀스파르타의 국비 부트캠프
      canonical: '내일배움캠프',
      aliases: ['내일배움캠프', '내배캠', '스파르타코딩클럽', '스파르타', '팀스파르타'],
      // '내일배움카드'(KDT 정부카드)와 혼동 금지 — '내일배움캠프' 정확 매칭
      strictContext: true,
    },
    { canonical: '항해99', aliases: ['항해99', '항해 99', '항해'], strictContext: true },
    { canonical: '멋쟁이사자처럼', aliases: ['멋쟁이사자처럼', '멋사', 'LikeLion', 'likelion', 'Like Lion'] },
    { canonical: '엘리스', aliases: ['엘리스', 'elice', 'Elice'], strictContext: true },
    { canonical: '제로베이스', aliases: ['제로베이스', '제로 베이스', 'zerobase', 'zero-base', 'ZeroBase'] },
    { canonical: '구름', aliases: ['구름', '구름에듀', '구름EDU', 'goorm', '구름 부트캠프'], strictContext: true },
    { canonical: '코드캠프', aliases: ['코드캠프', 'Code Camp', 'codecamp'] },
    {
      // 그렙(주) 운영. 프로그래머스=플랫폼, 데브코스=부트캠프
      canonical: '프로그래머스 데브코스',
      aliases: ['프로그래머스 데브코스', '데브코스', '프로그래머스', '그렙', 'programmers', 'grepp'],
      strictContext: true,
    },
  ],

  // 비용 주의: cmp.vsCompetitor 가 경쟁사 전체를 전개하면
  //   competitors(10) × paraphrases(4) × reps(1) × 챗봇(4) = 160 콜/주.
  // 전체 SoV(무브랜드)에는 영향 없고 reputation 트랙만 늘어남.
  // 필요 시 priorityCompetitors 로 vs 비교는 상위만, 나머지는 SoV 매칭에만 사용.
  priorityCompetitors: ['패스트캠퍼스', '내일배움캠프', '항해99', '제로베이스'],

  // 직무 축({role} 전개용). 셋 다 실제 Track enum에 매핑됨 → 모두 codeitServes:true.
  //   개발자 = Frontend/Backend/Fullstack/Mobile/Devops 등, 데이터 = Data/Ai, 디자이너 = ProductDesign.
  jobRoles: [
    { token: '개발자', codeitServes: true },
    { token: '데이터 분석가', codeitServes: true },
    { token: '디자이너', codeitServes: true }, // ProductDesign 트랙 있음
  ],

  // 분배: visibility 10(무브랜드, role 전개로 실질 더 많음) / reputation 2 / accuracy 2
  intents: sprintIntents(),
}

function sprintIntents(): IntentPreset[] {
  return [
    // ── [핵심] ────────────────────────────────────────────────
    {
      id: 'core.roundup',
      group: 'core',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      paraphrases: [
        '개발 부트캠프 비교해서 정리해줘', // 마케팅 seed (핵심 질문)
        '국내 개발자 부트캠프 장단점 비교해줘',
        '코딩 부트캠프 종류별로 정리해줘',
        '유명한 개발 부트캠프들 비교표 만들어줘',
        '부트캠프별 커리큘럼이랑 가격 비교해줘',
      ],
    },

    // ── [부트캠프 추천] (무브랜드) ─────────────────────────────
    {
      id: 'rec.nonmajor',
      group: 'recommend',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      paraphrases: [
        '비전공자가 갈만한 개발자 부트캠프 추천해줘', // seed
        '비전공자 개발자 취업 부트캠프 추천 좀',
        '문과 출신인데 어떤 개발 부트캠프 가야 해?',
        '비전공자한테 좋은 코딩 부트캠프 정리해줘',
        '개발자로 전향하려는데 부트캠프 추천해줘',
      ],
    },
    {
      id: 'rec.kdt',
      group: 'recommend',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      paraphrases: [
        '국비지원 받을 수 있는 IT 부트캠프 알려줘', // seed
        '국비지원 코딩 부트캠프 추천해줘',
        '내일배움카드로 들을 수 있는 개발 부트캠프 어디 있어?',
        '무료로 들을 수 있는 국비 IT 부트캠프 정리해줘',
        '국비 지원되는 개발자 부트캠프 어디가 좋아?',
      ],
    },
    {
      id: 'rec.kdt2026',
      group: 'recommend',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      paraphrases: [
        '2026년 KDT 부트캠프 어디가 좋아?', // seed
        '2026 KDT 개발 부트캠프 추천해줘',
        '올해 KDT 부트캠프 괜찮은 곳 정리해줘',
        '2026년 국비 IT 부트캠프 추천',
        '요즘 KDT 부트캠프 어디가 제일 나아?',
      ],
    },
    {
      id: 'rec.online',
      group: 'recommend',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      paraphrases: [
        '온라인 IT 부트캠프 추천해줘', // seed
        '비대면으로 들을 수 있는 개발 부트캠프 어디가 좋아?',
        '온라인 코딩 부트캠프 괜찮은 곳 알려줘',
        '집에서 들을 수 있는 IT 부트캠프 추천',
        '온라인으로 개발자 취업까지 되는 부트캠프 있어?',
      ],
    },
    {
      // IT창업가(ItFounder) 트랙 — 마케팅 role 축이 못 잡는 실재 카테고리. 보강.
      // 단 검색 볼륨 낮을 수 있어 첫 측정 후 헤드라인 포함 여부 재평가.
      id: 'rec.itFounder',
      group: 'recommend',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      paraphrases: [
        'IT 창업 부트캠프 추천해줘',
        '개발 창업 준비하는데 부트캠프 어디가 좋아?',
        '비개발자 창업가를 위한 IT 부트캠프 있어?',
        '스타트업 창업 부트캠프 추천 좀',
        'IT 창업 교육 프로그램 괜찮은 곳 정리해줘',
      ],
    },

    // ── [직무별] {role} 전개 (개발자/데이터/디자이너) ──────────
    {
      id: 'role.recommend',
      group: 'role',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      expand: { roles: true },
      paraphrases: [
        '{role} 부트캠프 추천해줘', // seed
        '{role} 되려면 어떤 부트캠프 가는 게 좋아?',
        '{role} 취업 부트캠프 괜찮은 곳 정리해줘',
        '{role} 양성 부트캠프 어디가 좋을까?',
        '{role} 부트캠프 중에 취업 잘 되는 곳 알려줘',
      ],
    },
    {
      id: 'role.nonmajorPath',
      group: 'role',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      expand: { roles: true },
      paraphrases: [
        '비전공자가 {role} 취업하려면 어떻게 해야 해?', // seed
        '비전공자가 {role}로 취업하는 방법 알려줘',
        '{role} 비전공자 취업 루트 정리해줘',
        '문과인데 {role} 되려면 어떻게 준비해?',
        '비전공자가 {role} 되려면 부트캠프 가야 해?',
      ],
    },

    // ── [조건/상황형] (무브랜드) ───────────────────────────────
    {
      id: 'cond.kdtAgain',
      group: 'condition',
      metricRole: 'visibility', // 단 정책 정보형이라 브랜드 추천 신호 약함(아래 메시지 참고)
      app: 'sprint',
      competitorAware: true,
      paraphrases: [
        'KDT 한 번 들었는데 다른 부트캠프 또 들을 수 있어?', // seed
        '국비 부트캠프 이미 수료했는데 또 들을 수 있나?',
        '내일배움카드 한 번 썼는데 다른 부트캠프 가능해?',
        'KDT 재수강 되는 부트캠프 있어?',
        '국비 부트캠프 중복 수강 가능한지 알려줘',
      ],
    },
    {
      id: 'cond.30sNonmajor',
      group: 'condition',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      paraphrases: [
        '30대 비전공자 개발자 취업 부트캠프 추천', // seed
        '30대 중반 비전공자인데 개발자 부트캠프 어디가 좋아?',
        '직장 다니다 30대에 개발자 전향하려는데 부트캠프 추천',
        '나이 많은 비전공자도 갈 만한 개발 부트캠프 있어?',
        '30대 늦깎이 개발자 부트캠프 추천 좀',
      ],
    },
    {
      id: 'cond.regional',
      group: 'condition',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      paraphrases: [
        '지방에 살아도 참여 가능한 부트캠프 있어?', // seed
        '서울 아니어도 들을 수 있는 개발 부트캠프 추천',
        '지방러도 들을 수 있는 코딩 부트캠프 어디야?',
        '비수도권에서 참여 가능한 IT 부트캠프 정리해줘',
        '온라인이라 지방에서도 되는 개발 부트캠프 있어?',
      ],
    },

    // ── [비교형] {competitor} 전개 — reputation(브랜드 줬으므로 가시성 아님) ──
    {
      id: 'cmp.vsCompetitor',
      group: 'comparison',
      metricRole: 'reputation',
      app: 'sprint',
      competitorAware: true,
      expand: { competitors: true },
      reps: 1, // 경쟁사 수만큼 곱해지므로 reps 최소화(비용 관리)
      paraphrases: [
        '코드잇 스프린트랑 {competitor} 부트캠프 비교해줘', // seed
        '코드잇 스프린트 vs {competitor} 어디가 나아?',
        '{competitor}보다 코드잇 스프린트가 나은 점 뭐야?',
        '코드잇 스프린트랑 {competitor} 차이 정리해줘',
      ],
    },

    // ── [브랜드 직접 질문] ─────────────────────────────────────
    {
      id: 'brand.what',
      group: 'brand',
      metricRole: 'reputation',
      app: 'sprint',
      competitorAware: false,
      paraphrases: [
        '코드잇 스프린트가 뭐야?', // seed
        '코드잇 스프린트 어떤 부트캠프야?',
        '코드잇 스프린트에 대해 설명해줘',
        '코드잇 스프린트 뭐 하는 곳이야?',
        '코드잇 스프린트 소개해줘',
      ],
    },
    {
      id: 'fact.employmentRate',
      group: 'factual',
      metricRole: 'accuracy',
      app: 'sprint',
      competitorAware: false,
      paraphrases: [
        '코드잇 스프린트 취업률 어느 정도야?', // seed
        '코드잇 스프린트 취업률 몇 퍼센트야?',
        '코드잇 스프린트 수료생 취업률 알려줘',
        '코드잇 스프린트 완주율이랑 취업률 어떻게 돼?',
        '코드잇 부트캠프 취업 성공률 수치로 알려줘',
      ],
      // 공개 수치 확정 대기(마케팅). 예시 자리표시자.
      groundTruth: { sampleSize: 2598, source: '2025 고용24 기준', employmentRatePct: null },
    },
    {
      id: 'fact.price',
      group: 'factual',
      metricRole: 'accuracy',
      app: 'sprint',
      competitorAware: false,
      paraphrases: [
        '코드잇 스프린트 수강료 얼마야?', // seed
        '코드잇 스프린트 가격 알려줘',
        '코드잇 스프린트 자부담금 얼마예요?',
        '코드잇 스프린트 환급받으면 실제 비용 얼마야?',
        '코드잇 스프린트 트랙별 가격 정리해줘',
      ],
      // util-seo 스키마 값과 동기화 (변경 시 갱신)
      groundTruth: { feIntensive: 300000, others: 600000, currency: 'KRW' },
    },
  ]
}
