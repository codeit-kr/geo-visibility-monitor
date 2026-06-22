import { describe, it, expect } from 'vitest'
import { checkAccuracy } from '../src/analyze/checkAccuracy'

describe('checkAccuracy', () => {
  it('자부담금: 본문 금액이 정답집합과 안 맞으면 wrong-price', async () => {
    const gt = { feIntensive: 300000, others: 600000 }
    expect(await checkAccuracy('수강료는 500,000원입니다', gt)).toContain('wrong-price') // 5자리 원
    expect(await checkAccuracy('수강료는 30만원', gt)).toEqual([]) // 30만원=300000 일치
    expect(await checkAccuracy('가격 정보는 없습니다', gt)).toEqual([]) // 금액 없음 → 무플래그
  })

  it('취업률: groundTruth 와 ±3%p 초과 시 wrong-employment-rate', async () => {
    const gt = { employmentRatePct: 80 }
    expect(await checkAccuracy('취업률 60%', gt)).toContain('wrong-employment-rate')
    expect(await checkAccuracy('취업률 82%', gt)).toEqual([]) // 오차 2%p
  })
})
