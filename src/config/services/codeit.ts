// 코드잇(www.codeit.kr) — passive check 전용(geo-audit + 페이지 메타). 챗봇/SERP 질의셋 없음.
// 온라인 코딩 교육 구독 플랫폼(B2C 멤버십 + KDC 국비 + Teams B2B). 능동 측정(질의셋)은
// 마케팅 확정 스코프가 생기면 별도로 붙인다(passive → full 전환 시 intents/competitors 채우고 passive 제거).
import type { ServiceConfig } from '../types'

export const codeit: ServiceConfig = {
  app: 'codeit',
  displayName: '코드잇',
  slackChannelId: 'C092YND4S80', // 10x 와 공용 알림 채널 — passive 포맷(GEO Score·페이지 메타)으로 발송
  siteUrl: 'https://www.codeit.kr',
  passive: true, // 챗봇/SERP 측정 없음 — pages.json + geoScore.json 만 쌓임
  promptsVersion: 1,

  locale: 'ko-KR',
  userCountry: 'KR',

  // 고정 코어 — llms.txt 는 sitemap 에 없어 고정으로 포함(감사 대상 + AI 노출 선언 확인).
  auditUrls: ['https://www.codeit.kr/llms.txt'],

  // sitemap 동적 소싱(정적 + server-sitemap). server-sitemap 은 tutorials 647·articles 70 등
  // 대형 템플릿 섹션이라 대표 1개씩만(메타·JSON-LD 이슈는 템플릿 단위로 발생 → 실질 커버리지 동일).
  // exclude 는 담당자 확정(2026-07-20): 인증·UGC 목록·B2B 블로그(inblog)·roadmap 제외.
  auditUrlSource: {
    sitemaps: ['https://www.codeit.kr/sitemap.xml', 'https://www.codeit.kr/server-sitemap.xml'],
    exclude: [
      '/signin',
      '/signup',
      '/community/general', // UGC 목록 페이지
      '/explore/roadmap',
      '/teams', // /teams 인덱스만 제외(cases·services 하위는 포함)
      '/teams/blog/*', // inblog(외부 블로그) 리라이트 경로 — 스코프 외
    ],
    sections: [
      { prefix: '/tutorials', pick: 1 }, // 647개 — 템플릿 대표
      { prefix: '/articles', pick: 1 }, // 70개 — 템플릿 대표
      // /paths(10)·/kdc(3)·정적 페이지는 미매칭 → 전체 포함
    ],
  },

  // 점수 대상 엔티티-그라운딩 체크리스트(KR). 코드잇은 sprint 와 달리 본체 엔티티라 (모회사) 표기 없음.
  brandSources: [
    'https://namu.wiki/w/코드잇',
    'https://ko.wikipedia.org/wiki/코드잇',
    'Wikidata: 코드잇 / Codeit 엔티티',
    'https://blog.naver.com/codeitofficial',
    'https://www.youtube.com/@codeit',
    'Instagram: @codeit.kr',
    'https://www.linkedin.com/company/codeit-official',
    '잡플래닛: 코드잇 기업 페이지',
  ],
  brandSourcesVersion: 1,

  brand: {
    canonical: '코드잇',
    aliases: ['코드잇', 'Codeit', 'codeit'],
    domains: ['codeit.kr', 'www.codeit.kr'],
  },

  // passive — 능동 측정 전환 시 마케팅 확정 리스트로 채운다(임의 생성 금지).
  competitors: [],
  priorityCompetitors: [],
  jobRoles: [],
  intents: [],
}
