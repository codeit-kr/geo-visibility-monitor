// LLM 판정기(analyze/llmJudge) 골든셋 평가 — tests/fixtures/judgeGolden.json 의 기대 라벨과 실제 판정을 대조.
//   용도: 판정기 모델 교체(CLASSIFIER_MODEL)·프롬프트 수정 시 회귀 검증. 감성·오정보 지표의 신뢰도 근거.
//   실행: pnpm judge:eval — OPENAI_API_KEY 필요(실 API 콜, 저가 모델 ~40콜). CI 미포함(opt-in).
//   비교 규칙: sentiment 는 정확 일치(null 포함). accuracyFlags 는 유무만 비교(플래그 문자열은
//   자유 서술이라 정확 일치가 무의미) — 기대/실제 문자열은 리포트에 그대로 출력해 눈으로 대조.
//   종료 코드: verified:true 케이스 불일치가 있으면 1(회귀). provisional(verified:false)은 경고만.
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { judge } from '../analyze/llmJudge'
import { mapLimit } from '../util/concurrency'
import { SNAPSHOTS_DIR } from '../store/writeSnapshot'
import type { Brand } from '../config/types'
import type { ResponseRecord, Sentiment } from '../../types/snapshot'

interface GoldenCase {
  id: string
  source?: { app: string; isoWeek: string; engine: string; paraphraseId: string; rep: number }
  answer?: string // 합성 케이스만 인라인. source 케이스는 responses.json 에서 로드
  query: string
  brand: Brand
  groundTruth?: Record<string, unknown> | null
  expected: { sentiment: Sentiment | null; accuracyFlags: string[] }
  verified: boolean
  note?: string
}

const GOLDEN_PATH = join(process.cwd(), 'tests/fixtures/judgeGolden.json')
const CONCURRENCY = 4

const loadAnswers = async (cases: GoldenCase[]): Promise<Map<string, string>> => {
  const answers = new Map<string, string>()
  const files = new Set(cases.filter((c) => c.source).map((c) => `${c.source!.app}/${c.source!.isoWeek}`))
  for (const rel of files) {
    const records = JSON.parse(
      await readFile(join(SNAPSHOTS_DIR, rel, 'responses.json'), 'utf8'),
    ) as ResponseRecord[]
    for (const r of records) answers.set(`${rel}|${r.paraphraseId}|${r.engine}|${r.rep}`, r.answer)
  }
  return answers
}

const main = async () => {
  const { cases } = JSON.parse(await readFile(GOLDEN_PATH, 'utf8')) as { cases: GoldenCase[] }
  const answers = await loadAnswers(cases)

  const results = await mapLimit(cases, CONCURRENCY, async (c) => {
    const answer = c.answer ?? answers.get(`${c.source!.app}/${c.source!.isoWeek}|${c.source!.paraphraseId}|${c.source!.engine}|${c.source!.rep}`)
    if (!answer) return { c, error: 'answer 없음(스냅샷 조인 실패)' as string }
    try {
      const r = await judge({ answer, query: c.query, brand: c.brand, groundTruth: c.groundTruth ?? undefined })
      return { c, actual: { sentiment: r.sentiment, accuracyFlags: r.accuracyFlags } }
    } catch (error) {
      return { c, error: error instanceof Error ? error.message : String(error) }
    }
  })

  let verifiedFail = 0
  let provisionalFail = 0
  let errors = 0
  for (const { c, actual, error } of results) {
    if (error || !actual) {
      errors++
      console.error(`✗ [ERROR] ${c.id}: ${error}`)
      continue
    }
    const sentimentOk = actual.sentiment === c.expected.sentiment
    const flagsOk = actual.accuracyFlags.length > 0 === c.expected.accuracyFlags.length > 0
    if (sentimentOk && flagsOk) {
      console.info(`✓ ${c.id}`)
      continue
    }
    if (c.verified) verifiedFail++
    else provisionalFail++
    const tag = c.verified ? 'FAIL' : 'DIFF(잠정 라벨)'
    console.warn(
      `✗ [${tag}] ${c.id}` +
        (sentimentOk ? '' : ` sentiment: 기대 ${c.expected.sentiment} ← 실제 ${actual.sentiment}`) +
        (flagsOk ? '' : ` flags: 기대 [${c.expected.accuracyFlags}] ← 실제 [${actual.accuracyFlags}]`) +
        (c.note ? `  (${c.note})` : ''),
    )
  }

  const total = results.length
  console.info(
    `\n[judge:eval] ${total}건 — 일치 ${total - verifiedFail - provisionalFail - errors}` +
      ` · verified 불일치 ${verifiedFail} · 잠정 불일치 ${provisionalFail} · 오류 ${errors}`,
  )
  if (verifiedFail > 0 || errors > 0) {
    console.error('[judge:eval] 검수된(verified) 케이스 불일치 또는 오류 — 회귀로 간주')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('[judge:eval] 예기치 못한 오류:', error)
  process.exit(1)
})
