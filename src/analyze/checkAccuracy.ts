// AI가 말한 코드잇 사실(가격·취업률 등)이 groundTruth 와 맞는지 → 오정보 플래그.
// ※ 이건 LLM 판정기(analyze/classify) 실패 시 폴백용 휴리스틱이다. 정밀 판정(브랜드 근접
//   스코핑, 경쟁사 가격 제외, 문맥)은 LLM 경로가 담당. 여기선 거친 1차 신호만.

const KRW_DIGITS = /([0-9][0-9,]{4,})\s*원?/g // 5자리+ 원 단위 금액(예: 300,000원)
const KRW_MAN = /([0-9]+)\s*만\s*원/g // 만원 표기(예: 30만원) — 한국어 답변의 지배적 형식
const PERCENT = /([0-9]{1,3}(?:\.[0-9]+)?)\s*%/g

export const checkAccuracy = async (
  answer: string,
  groundTruth: Record<string, unknown>,
): Promise<string[]> => {
  const flags: string[] = []

  // 가격: 본문 금액이 알려진 자부담금 집합과 하나도 안 맞으면 의심(폴백 휴리스틱)
  if ('feIntensive' in groundTruth || 'others' in groundTruth) {
    const valid = new Set(
      [groundTruth.feIntensive, groundTruth.others].filter((v): v is number => typeof v === 'number'),
    )
    const digitPrices = [...answer.matchAll(KRW_DIGITS)].map((m) => Number(m[1].replace(/,/g, '')))
    const manPrices = [...answer.matchAll(KRW_MAN)].map((m) => Number(m[1]) * 10_000) // 30만원 → 300000
    const priceLike = [...digitPrices, ...manPrices].filter((n) => n >= 100_000 && n <= 5_000_000)
    if (priceLike.length > 0 && !priceLike.some((n) => valid.has(n))) {
      flags.push('wrong-price')
    }
  }

  // 취업률: groundTruth 수치가 있을 때만 ±3%p 허용 대조
  if (typeof groundTruth.employmentRatePct === 'number') {
    const truth = groundTruth.employmentRatePct
    const pcts = [...answer.matchAll(PERCENT)].map((m) => Number(m[1]))
    const employmentCtx = /취업률|취업 성공|고용/.test(answer)
    if (employmentCtx && pcts.length > 0 && !pcts.some((p) => Math.abs(p - truth) <= 3)) {
      flags.push('wrong-employment-rate')
    }
  }

  return flags
}
