// 어센트(www.ascent.me) — passive check 전용(geo-audit + 페이지 메타). 챗봇/SERP 질의셋 없음.
// 코드잇이 운영하는 AI 모의면접 서비스(기업·직무별 모의면접 + 답변 분석 리포트). 능동 측정은
// 마케팅 확정 스코프가 생기면 별도로 붙인다(passive → full 전환 시 intents/competitors 채우고 passive 제거).
import type { ServiceConfig } from '../types'

export const ascent: ServiceConfig = {
  app: 'ascent',
  displayName: '어센트',
  siteUrl: 'https://www.ascent.me',
  passive: true, // 챗봇/SERP 측정 없음 — pages.json + geoScore.json 만 쌓임
  promptsVersion: 1,

  locale: 'ko-KR',
  userCountry: 'KR',

  // 고정 코어 — llms.txt 는 sitemap 에 없어 고정으로 포함.
  auditUrls: ['https://www.ascent.me/llms.txt'],

  // 메인 sitemap(홈 + /interviews 79) + blog sitemap(15). interviews·blog 포스트는 템플릿 페이지라
  // 대표만: pick 은 URL 오름차순이라 /interviews(목록)·/blog(목록)가 각 섹션의 첫 슬롯을 차지하고
  // 나머지가 상세 대표가 된다(목록 + 상세 커버).
  auditUrlSource: {
    sitemaps: ['https://www.ascent.me/sitemap.xml', 'https://www.ascent.me/blog/sitemap.xml'],
    exclude: ['/blog/category/*'], // 카테고리 목록 페이지 — 콘텐츠 아님
    sections: [
      { prefix: '/interviews', pick: 3 }, // 목록 + 상세 대표 2
      { prefix: '/blog', pick: 3 }, // 블로그 홈 + 포스트 대표 2
    ],
  },

  // 어센트 자체 엔티티·채널이 아직 없어 모회사(코드잇) 소스로 그라운딩 — geo-audit 이
  // parentOrganization 연결 확인 시 부분 가점(완전 가점은 어센트 전용 엔티티 생길 때).
  brandSources: [
    'https://namu.wiki/w/코드잇 (모회사)',
    'https://ko.wikipedia.org/wiki/코드잇 (모회사)',
    'Wikidata: 코드잇 / Codeit 엔티티 (모회사)',
    'https://blog.naver.com/codeitofficial (모회사)',
    'https://www.youtube.com/@codeit (모회사)',
    'https://www.linkedin.com/company/codeit-official (모회사)',
  ],
  brandSourcesVersion: 1,

  brand: {
    canonical: '어센트',
    aliases: ['어센트', 'Ascent', 'ascent'],
    domains: ['ascent.me', 'www.ascent.me'],
  },

  // passive — 능동 측정 전환 시 마케팅 확정 리스트로 채운다(임의 생성 금지).
  competitors: [],
  priorityCompetitors: [],
  jobRoles: [],
  intents: [],
}
