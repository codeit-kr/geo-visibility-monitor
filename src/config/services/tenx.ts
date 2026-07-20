// 코드잇 10x(10x.codeit.kr) — passive check 전용(geo-audit + 페이지 메타). 챗봇/SERP 질의셋 없음.
// AI 실무 교육 프로그램(주별 미션 + 1:1 코칭, 직장인·1인 창업가 대상). 능동 측정은 마케팅 확정
// 스코프가 생기면 별도로 붙인다(passive → full 전환 시 intents/competitors 채우고 passive 제거).
import type { ServiceConfig } from '../types'

// app 키 '10x' 는 숫자 시작이라 모듈/변수명은 tenx 사용.
export const tenx: ServiceConfig = {
  app: '10x',
  displayName: '코드잇 10x',
  slackChannelId: 'C092YND4S80', // codeit 과 공용 알림 채널 — passive 포맷(GEO Score·페이지 메타)으로 발송
  siteUrl: 'https://10x.codeit.kr',
  passive: true, // 챗봇/SERP 측정 없음 — pages.json + geoScore.json 만 쌓임
  promptsVersion: 1,

  locale: 'ko-KR',
  userCountry: 'KR',

  // 고정 코어 — llms.txt 는 sitemap 에 없어 고정으로 포함.
  auditUrls: ['https://10x.codeit.kr/llms.txt'],

  // sitemap 전체가 홈 + 강의 7개(총 8개)라 섹션 정책 없이 전량 감사.
  auditUrlSource: {
    sitemaps: ['https://10x.codeit.kr/sitemap.xml'],
  },

  // 10x 자체 엔티티·채널이 아직 없어 모회사(코드잇) 소스로 그라운딩 — geo-audit 이
  // parentOrganization 연결 확인 시 부분 가점(완전 가점은 10x 전용 엔티티 생길 때).
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
    canonical: '코드잇 10x',
    aliases: ['코드잇 10x', '코드잇 텐엑스', '텐엑스', 'Codeit 10x', '10x'],
    domains: ['10x.codeit.kr'],
  },

  // passive — 능동 측정 전환 시 마케팅 확정 리스트로 채운다(임의 생성 금지).
  competitors: [],
  priorityCompetitors: [],
  jobRoles: [],
  intents: [],
}
