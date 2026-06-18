// 응답 텍스트에서 브랜드/경쟁사 언급을 추출 (Mention Rate·SoV 1차 패스).
//
// 멀티 서비스: 브랜드·경쟁사를 모듈 전역이 아니라 인자로 받는다(서비스별 호출).
// 주의: 정규식 휴리스틱은 빠른 1차 필터일 뿐. 최종 판정(추천 인용 vs 단순 나열,
// 감성, 정확도)은 LLM 분류기(analyze/classify)로 보강한다.
// 한글엔 단어경계(\b)가 안 먹어 오탐 위험이 있으므로, 일반 단어와 겹치는
// 경쟁사명(구름/항해/엘리스/그렙/내일배움캠프)은 strictContext + 맥락어로 거른다.

import type { Brand, Competitor } from '../config/types'

// 부트캠프/교육 맥락 신호어 — strictContext 엔티티는 이게 같이 있을 때만 인정
const CONTEXT_TERMS = ['부트캠프', '코딩', '개발', '교육', '강의', '수강', '취업', '과정', '캠프', 'IT']

export const mentionsBrand = (text: string, brand: Brand): boolean =>
  brand.aliases.some((alias) => containsToken(text, alias))

/** 응답에 등장한 경쟁사 canonical 목록 (SoV 분모용). */
export const matchedCompetitors = (text: string, competitors: Competitor[]): string[] => {
  const hasContext = CONTEXT_TERMS.some((term) => text.includes(term))
  return competitors.filter((c) => competitorHit(text, c, hasContext)).map((c) => c.canonical)
}

/** 같은 응답 기준 SoV = 브랜드 / (브랜드 + 경쟁사). 둘 다 없으면 null(분모 0). */
export const shareOfVoice = (text: string, brand: Brand, competitors: Competitor[]): number | null => {
  const b = mentionsBrand(text, brand) ? 1 : 0
  const c = matchedCompetitors(text, competitors).length
  const denom = b + c
  return denom === 0 ? null : b / denom
}

const competitorHit = (text: string, c: Competitor, hasContext: boolean): boolean => {
  const hit = c.aliases.some((alias) => containsToken(text, alias))
  if (!hit) return false
  // 일반 단어와 겹치는 이름은 브랜드 맥락이 있을 때만 인정(오탐 차단)
  if (c.strictContext && !hasContext) return false
  return true
}

// 영문 별칭은 단어경계 검사, 한글 별칭은 포함 검사(strictContext 가 1차 오탐을 거른다).
const containsToken = (text: string, token: string): boolean => {
  const isAscii = /^[\x00-\x7F]+$/.test(token)
  if (isAscii) {
    return new RegExp(`\\b${escapeRegExp(token)}\\b`, 'i').test(text)
  }
  return text.includes(token)
}

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
