// 코드잇이 언급된 문맥의 감성(긍/중/부정).
// 스텁: 가벼운 키워드 휴리스틱. TODO — 저가 LLM 분류기로 교체(스니펫만 전달).
import type { Sentiment } from '../../types/snapshot'

const POSITIVE = ['추천', '좋', '강점', '우수', '만족', '인기', '탄탄', '체계적', '높은 취업']
const NEGATIVE = ['비추', '단점', '아쉽', '비싸', '별로', '실망', '논란', '낮은 취업']

export const classifySentiment = async (snippet: string): Promise<Sentiment | null> => {
  if (!snippet) return null
  const pos = POSITIVE.filter((w) => snippet.includes(w)).length
  const neg = NEGATIVE.filter((w) => snippet.includes(w)).length
  if (pos === 0 && neg === 0) return 'neutral'
  return pos >= neg ? 'positive' : 'negative'
  // TODO: 휴리스틱은 오탐 많음. "코드잇 등장 문장" 주변만 잘라 LLM 으로 분류 권장.
}
