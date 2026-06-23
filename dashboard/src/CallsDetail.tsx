'use client'

import classnames from 'classnames/bind'
import { useMemo, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { App, Engine, ResponseRecord, Sentiment, VisibilitySnapshot } from '../../types/snapshot'
import { measureRange } from './isoWeek'
import { DashboardHeader } from './DashboardHeader'
import styles from './CallsDetail.module.scss'

const cx = classnames.bind(styles)

// 대시보드와 동일한 엔진 표시명·색
const ENGINE_META: Record<Engine, { label: string; color: string }> = {
  'google-aio': { label: 'AI Overview', color: '#119da4' },
  chatgpt: { label: 'ChatGPT', color: '#2d43e0' },
  'naver-briefing': { label: 'Naver AI', color: '#2aa745' },
  gemini: { label: 'Gemini', color: '#7c5cff' },
  claude: { label: 'Claude', color: '#e0902b' },
  perplexity: { label: 'Perplexity', color: '#c23a52' },
}
const ENGINE_ORDER: Engine[] = ['google-aio', 'chatgpt', 'naver-briefing', 'gemini', 'claude', 'perplexity']

const FLAG_LABEL: Record<string, string> = {
  'wrong-price': '수강료 오정보',
  'wrong-employment-rate': '취업률 오정보',
}

// 답변 원문에서 강조할 브랜드 표기(서비스별). 경쟁사명은 행 데이터에서 가져온다.
const BRAND_ALIASES: Partial<Record<App, string[]>> = {
  sprint: ['코드잇 스프린트', '코드잇', 'Codeit', 'codeit'],
}

const SENTI_META: Record<Sentiment, { label: string; cls: string }> = {
  positive: { label: '긍정', cls: 'pos' },
  neutral: { label: '중립', cls: 'neu' },
  negative: { label: '부정', cls: 'neg' },
}

type Props = {
  app: App
  displayName: string
  isoWeek: string | null
  visibility: VisibilitySnapshot[]
  responses: ResponseRecord[]
  weeks: string[] // 선택 가능한 전체 주차(헤더 주차 선택기)
}

type Term = { term: string; kind: 'brand' | 'comp' }

const joinKey = (paraphraseId: string, engine: Engine, rep: number) => `${paraphraseId}|${engine}|${rep}`
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// 접힌 요약줄 미리보기용 — 마크다운 기호를 벗긴 평문 한 줄.
const stripMd = (s: string) =>
  s
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// 렌더된 마크다운(hast) 위를 걸으며 브랜드/경쟁사 표기를 <mark> 로 감싸는 rehype 플러그인.
// 코드 블록 안은 건드리지 않고, 긴 표기를 우선 매칭한다. className 은 CSS Module 해시명을 주입.
const makeHighlightPlugin = (terms: Term[], brandCls: string, compCls: string) => {
  const uniq = Array.from(new Map(terms.map((t) => [t.term.toLowerCase(), t])).values()).filter((t) => t.term)
  return () => (tree: any) => {
    if (uniq.length === 0) return
    const ordered = [...uniq].sort((a, b) => b.term.length - a.term.length)
    const re = new RegExp(`(${ordered.map((t) => escapeRe(t.term)).join('|')})`, 'gi')
    const walk = (node: any) => {
      if (!Array.isArray(node.children)) return
      const out: any[] = []
      for (const child of node.children) {
        if (child.type === 'text' && node.tagName !== 'code' && node.tagName !== 'pre') {
          const parts = child.value.split(re)
          if (parts.length === 1) {
            out.push(child)
            continue
          }
          for (const part of parts) {
            if (!part) continue
            const hit = uniq.find((t) => t.term.toLowerCase() === part.toLowerCase())
            if (hit) {
              out.push({
                type: 'element',
                tagName: 'mark',
                properties: { className: [hit.kind === 'brand' ? brandCls : compCls] },
                children: [{ type: 'text', value: part }],
              })
            } else {
              out.push({ type: 'text', value: part })
            }
          }
        } else {
          walk(child)
          out.push(child)
        }
      }
      node.children = out
    }
    walk(tree)
  }
}

export const CallsDetail = ({ app, displayName, isoWeek, visibility, responses, weeks }: Props) => {
  const responsesByKey = useMemo(() => {
    const m = new Map<string, ResponseRecord>()
    for (const r of responses) m.set(joinKey(r.paraphraseId, r.engine, r.rep), r)
    return m
  }, [responses])

  const enginesPresent = useMemo(
    () => ENGINE_ORDER.filter((e) => visibility.some((v) => v.engine === e)),
    [visibility],
  )

  const [active, setActive] = useState<Set<Engine>>(() => new Set(enginesPresent))
  const [mentionedOnly, setMentionedOnly] = useState(false)
  const [q, setQ] = useState('')

  const brandTerms: Term[] = (BRAND_ALIASES[app] ?? []).map((term) => ({ term, kind: 'brand' }))

  // 질의(paraphraseId)별 그룹 → 엔진별 레코드. 사람은 "한 질문에 엔진들이 뭐라 답했나"로 본다.
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const byParaphrase = new Map<string, { query: string; intentId: string; rows: VisibilitySnapshot[] }>()
    for (const v of visibility) {
      if (!active.has(v.engine)) continue
      if (mentionedOnly && !v.mentioned) continue
      if (needle) {
        const ans = responsesByKey.get(joinKey(v.paraphraseId, v.engine, v.rep))?.answer ?? v.rawSnippet
        const hay = `${v.query} ${ans}`.toLowerCase()
        if (!hay.includes(needle)) continue
      }
      const g = byParaphrase.get(v.paraphraseId) ?? { query: v.query, intentId: v.intentId, rows: [] }
      g.rows.push(v)
      byParaphrase.set(v.paraphraseId, g)
    }
    const order = (e: Engine) => ENGINE_ORDER.indexOf(e)
    return [...byParaphrase.values()]
      .map((g) => ({ ...g, rows: g.rows.sort((a, b) => order(a.engine) - order(b.engine)) }))
      .sort((a, b) => {
        const am = a.rows.filter((r) => r.mentioned).length
        const bm = b.rows.filter((r) => r.mentioned).length
        return bm - am || a.query.localeCompare(b.query)
      })
  }, [visibility, responsesByKey, active, mentionedOnly, q])

  const totalShown = groups.reduce((s, g) => s + g.rows.length, 0)
  const mentionedCount = visibility.filter((v) => v.mentioned).length

  const toggleEngine = (e: Engine) =>
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(e)) next.delete(e)
      else next.add(e)
      return next.size === 0 ? new Set(enginesPresent) : next // 전부 끄면 전체로 리셋
    })

  return (
    <div className={cx('page')}>
      <DashboardHeader
        app={app}
        kicker="AI 응답 기록 · query → answer"
        title={`${displayName} — AI 응답 상세`}
        measured={isoWeek ? `측정 ${isoWeek}${measureRange(isoWeek) ? ` (${measureRange(isoWeek)})` : ''}` : '측정 전'}
        weekNav={weeks.length && isoWeek ? { weeks, current: isoWeek, hrefBase: '/calls' } : undefined}
        sub={`${visibility.length}개 응답 · 언급 ${mentionedCount}`}
      />

      {visibility.length === 0 ? (
        <div className={cx('empty')}>
          <div className={cx('empty-mark')}>◵</div>
          <div className={cx('empty-t')}>이 주차의 응답 원문이 없습니다</div>
          <div className={cx('empty-d')}>주간 스냅샷이 쌓이면 질의별 AI 답변이 여기에 나타납니다.</div>
        </div>
      ) : (
        <>
          <div className={cx('toolbar')}>
            <div className={cx('chips')}>
              {enginesPresent.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={cx('chip', { on: active.has(e) })}
                  onClick={() => toggleEngine(e)}
                  aria-pressed={active.has(e)}
                >
                  <span className={cx('sw')} style={{ background: ENGINE_META[e].color }} />
                  {ENGINE_META[e].label}
                </button>
              ))}
              <button
                type="button"
                className={cx('chip', 'pill', { on: mentionedOnly })}
                onClick={() => setMentionedOnly((v) => !v)}
                aria-pressed={mentionedOnly}
              >
                언급된 답변만
              </button>
            </div>
            <input
              className={cx('search')}
              type="search"
              placeholder="질의·답변 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="질의·답변 검색"
            />
          </div>

          <div className={cx('groups')}>
            {groups.length === 0 && (
              <div className={cx('noresult')}>조건에 맞는 응답이 없습니다. 필터를 넓혀 보세요.</div>
            )}

            {groups.map((g) => {
              const mentions = g.rows.filter((r) => r.mentioned).length
              return (
                <section className={cx('group')} key={g.intentId + g.query}>
                  <div className={cx('g-hd')}>
                    <div className={cx('g-q')}>{g.query}</div>
                    <div className={cx('g-meta')}>
                      <span className={cx('g-intent')}>{g.intentId}</span>
                      <span className={cx('g-tally', { hit: mentions > 0 })}>
                        {mentions}/{g.rows.length} 언급
                      </span>
                    </div>
                  </div>

                  {g.rows.map((row) => {
                    const resp = responsesByKey.get(joinKey(row.paraphraseId, row.engine, row.rep))
                    const answer = resp?.answer ?? row.rawSnippet ?? ''
                    const preview = stripMd(answer).slice(0, 150)
                    const terms: Term[] = [
                      ...brandTerms,
                      ...row.competitorsMentioned.map((term) => ({ term, kind: 'comp' as const })),
                    ]
                    const meta = ENGINE_META[row.engine]
                    return (
                      <details className={cx('rec')} key={row.engine + row.rep}>
                        <summary className={cx('rec-sum')}>
                          <span className={cx('chev')} aria-hidden>
                            ▸
                          </span>
                          <span className={cx('rec-eng')}>
                            <span className={cx('sw')} style={{ background: meta.color }} />
                            {meta.label}
                          </span>
                          <span className={cx('rec-prev')}>{preview || '—'}</span>
                          <span className={cx('rec-sig')}>
                            <span className={cx('ment', { on: row.mentioned })}>
                              {row.mentioned ? '✓ 언급' : '미언급'}
                            </span>
                            {row.sentiment && (
                              <span className={cx('senti', SENTI_META[row.sentiment].cls)}>
                                {SENTI_META[row.sentiment].label}
                              </span>
                            )}
                            <span className={cx('cite')}>인용 {row.citedUrls.length}</span>
                          </span>
                        </summary>

                        <div className={cx('rec-body')}>
                          <div className={cx('ans')}>
                            <Markdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[makeHighlightPlugin(terms, cx('hl-brand'), cx('hl-comp'))]}
                            >
                              {answer}
                            </Markdown>
                          </div>

                          {row.accuracyFlags.length > 0 && (
                            <div className={cx('flags')}>
                              {row.accuracyFlags.map((f) => (
                                <span className={cx('flag')} key={f}>
                                  ⚠ {FLAG_LABEL[f] ?? f}
                                </span>
                              ))}
                            </div>
                          )}

                          {row.competitorsMentioned.length > 0 && (
                            <div className={cx('comps')}>
                              <span className={cx('comps-l')}>경쟁사</span>
                              {row.competitorsMentioned.map((c) => (
                                <span className={cx('comp')} key={c}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}

                          {row.citedUrls.length > 0 && (
                            <ul className={cx('cites')}>
                              {row.citedUrls.map((u, i) => (
                                <li key={u + i}>
                                  <a href={u} target="_blank" rel="noreferrer noopener">
                                    <b>{hostOf(u)}</b>
                                    <span className={cx('cite-path')}>{u.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className={cx('rmeta')}>
                            {resp?.model && <span>{resp.model}</span>}
                            {resp?.inputTokens != null && <span>in {resp.inputTokens.toLocaleString()}</span>}
                            {resp?.outputTokens != null && <span>out {resp.outputTokens.toLocaleString()}</span>}
                            {resp?.webSearches ? <span>web {resp.webSearches}</span> : null}
                            {resp?.serpCredits ? <span>serp {resp.serpCredits}</span> : null}
                            {resp?.costUsd != null && <span className={cx('cost')}>${resp.costUsd.toFixed(4)}</span>}
                            <span className={cx('rmeta-key')}>
                              {row.paraphraseId} · rep{row.rep}
                            </span>
                          </div>
                        </div>
                      </details>
                    )
                  })}
                </section>
              )
            })}
          </div>

          <p className={cx('foot')}>
            answer = 엔진 응답 전문 · 강조는 브랜드/경쟁사 호명 위치 · 인용 URL은 AI가 실제로 출처로 단 링크.
            {' '}{totalShown}개 표시 중.
          </p>
        </>
      )}
    </div>
  )
}
