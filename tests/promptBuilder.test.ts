import { describe, it, expect } from 'vitest'
import { buildCalls } from '../src/promptBuilder'
import type { ServiceConfig } from '../src/config/types'

const svc: ServiceConfig = {
  app: 'sprint',
  displayName: 'X',
  siteUrl: 'https://x.example',
  auditUrls: ['https://x.example/'],
  brandSources: ['https://x.example/about'],
  brandSourcesVersion: 1,
  promptsVersion: 1,
  locale: 'ko-KR',
  userCountry: 'KR',
  brand: { canonical: 'B', aliases: ['B'], domains: [] },
  competitors: [
    { canonical: 'C1', aliases: ['C1'] },
    { canonical: 'C2', aliases: ['C2'] },
  ],
  priorityCompetitors: ['C1'],
  jobRoles: [
    { token: '개발자', codeitServes: true },
    { token: '디자이너', codeitServes: true },
  ],
  intents: [
    {
      id: 'r',
      group: 'role',
      metricRole: 'visibility',
      app: 'sprint',
      competitorAware: true,
      expand: { roles: true },
      paraphrases: ['{role} 추천'],
    },
    {
      id: 'c',
      group: 'comparison',
      metricRole: 'reputation',
      app: 'sprint',
      competitorAware: true,
      expand: { competitors: true },
      reps: 1,
      paraphrases: ['vs {competitor}'],
    },
  ],
}

describe('buildCalls', () => {
  it('{role} 전개 × reps 곱(기본 2) + placeholder 완전 치환', () => {
    const calls = buildCalls(svc).filter((c) => c.intentId === 'r')
    expect(calls.length).toBe(4) // 1 paraphrase × 2 roles × 2 reps
    expect(calls.map((c) => c.query)).toContain('개발자 추천')
    expect(calls.every((c) => !c.query.includes('{'))).toBe(true)
  })

  it('paraphraseId 는 rep 제외 안정 ID(2 rep 공유)', () => {
    const calls = buildCalls(svc).filter((c) => c.intentId === 'r' && c.role === '개발자')
    const ids = new Set(calls.map((c) => c.paraphraseId))
    expect(ids.size).toBe(1)
    expect([...ids][0]).toContain('role=개발자')
  })

  it('competitorScope=priority 면 상위 경쟁사만 전개', () => {
    expect(buildCalls(svc).filter((c) => c.intentId === 'c').length).toBe(2) // C1·C2
    expect(buildCalls(svc, { competitorScope: 'priority' }).filter((c) => c.intentId === 'c').length).toBe(1) // C1만
  })
})
