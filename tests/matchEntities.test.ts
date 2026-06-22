import { describe, it, expect } from 'vitest'
import { mentionsBrand, matchedCompetitors, shareOfVoice } from '../src/analyze/matchEntities'
import type { Brand, Competitor } from '../src/config/types'

const brand: Brand = { canonical: 'Codeit', aliases: ['코드잇', 'Codeit'], domains: [] }
const comps: Competitor[] = [
  { canonical: '항해99', aliases: ['항해'], strictContext: true },
  { canonical: '패스트캠퍼스', aliases: ['FastCampus'] },
]

describe('matchEntities', () => {
  it('영문 별칭은 단어경계, 한글 별칭은 포함 매칭', () => {
    expect(mentionsBrand('나는 코드잇 좋아', brand)).toBe(true) // 한글 substring
    expect(mentionsBrand('Codeit is great', brand)).toBe(true) // 영문 단어경계
    expect(mentionsBrand('the decoded message', brand)).toBe(false) // 'Codeit' 단어경계 → 오탐 안 함
  })

  it('strictContext 경쟁사는 브랜드 맥락어가 있어야 인정', () => {
    expect(matchedCompetitors('항해 중인 배', comps)).toEqual([]) // 맥락 없음
    expect(matchedCompetitors('항해 부트캠프 추천', comps)).toContain('항해99') // 부트캠프 맥락
  })

  it('shareOfVoice = 브랜드 / (브랜드 + 경쟁사), 둘 다 없으면 null', () => {
    expect(shareOfVoice('코드잇이랑 FastCampus 비교', brand, comps)).toBeCloseTo(0.5)
    expect(shareOfVoice('관련 없는 텍스트', brand, comps)).toBeNull()
  })
})
