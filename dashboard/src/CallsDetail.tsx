'use client'

import classnames from 'classnames/bind'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { memo, useDeferredValue, useEffect, useMemo, useState } from 'react'
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

// 카테고리 = intentId 의 점 앞 접두사(rec.kdt2026 → rec). 표시명·정렬 순서는 여기서.
// 미정의 접두사는 접두사 원문을 라벨로 쓰고 맨 뒤로(order 99) 보낸다.
const CATEGORY_META: Record<string, { label: string; order: number }> = {
  core: { label: '종합·라운드업', order: 0 },
  rec: { label: '추천', order: 1 },
  role: { label: '대상별', order: 2 },
  brand: { label: '브랜드', order: 3 },
  cmp: { label: '경쟁사 비교', order: 4 },
  fact: { label: '사실 확인', order: 5 },
  cond: { label: '조건별', order: 6 },
}
const categoryOf = (intentId: string) => intentId.split('.')[0]
const catLabel = (key: string) => CATEGORY_META[key]?.label ?? key
const catOrder = (key: string) => CATEGORY_META[key]?.order ?? 99

// 주차 이동은 페이지를 리마운트(동적 세그먼트 변경) → 컴포넌트 state 초기화.
// 그래서 필터는 세션 저장소에 앱 단위로 보관해 주차 간 유지한다.
// 엔진/카테고리는 "제외 집합(off)"으로 저장 → 다음 주차에 새로 등장한 항목은 자동 노출, 사라진 항목은 무시.
const storeKey = (app: App) => `calls-filters:${app}`
type StoredFilters = { engOff?: string[]; catOff?: string[]; mention?: string; q?: string }
const readStored = (app: App): StoredFilters | null => {
  try {
    const raw = sessionStorage.getItem(storeKey(app))
    return raw ? (JSON.parse(raw) as StoredFilters) : null
  } catch {
    return null
  }
}

type MentionMode = 'all' | 'mentioned' | 'unmentioned'
const MENTION_MODES: { key: MentionMode; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'mentioned', label: '언급' },
  { key: 'unmentioned', label: '미언급' },
]

const FLAG_LABEL: Record<string, string> = {
  'wrong-price': '수강료 오정보',
  'wrong-employment-rate': '취업률 오정보',
}

// 답변 원문에서 강조할 브랜드 표기(서비스별). 경쟁사명은 행 데이터에서 가져온다.
const BRAND_ALIASES: Partial<Record<App, string[]>> = {
  sprint: ['코드잇 스프린트', '코드잇', 'Codeit', 'codeit'],
  codeit: ['코드잇', 'Codeit', 'codeit'],
  '10x': ['코드잇 10x', '코드잇 텐엑스', '텐엑스', 'Codeit 10x', '10x'],
  ascent: ['어센트', 'Ascent', 'ascent'],
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
  available?: string[] // 데이터 있는 서비스(탭 활성 여부)
  latestWeekOf?: Record<string, string | null> // 서비스 탭 직링크용
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

// 응답 레코드 1행 — memo + 펼칠 때만 마크다운 렌더. 검색/필터로 부모가 재렌더돼도
// props(row·resp·brandTerms 모두 안정 참조)가 같으면 재렌더 건너뜀 → 마크다운 재계산 없음.
type RecordProps = { row: VisibilitySnapshot; resp?: ResponseRecord; brandTerms: Term[] }
const Record = memo(({ row, resp, brandTerms }: RecordProps) => {
  const [open, setOpen] = useState(false)
  const answer = resp?.answer ?? row.rawSnippet ?? ''
  const preview = stripMd(answer).slice(0, 150)
  const meta = ENGINE_META[row.engine]
  const terms: Term[] = [...brandTerms, ...row.competitorsMentioned.map((term) => ({ term, kind: 'comp' as const }))]
  return (
    <details className={cx('rec')} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
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
          <span className={cx('ment', { on: row.mentioned })}>{row.mentioned ? '✓ 언급' : '미언급'}</span>
          {row.sentiment && (
            <span className={cx('senti', SENTI_META[row.sentiment].cls)}>{SENTI_META[row.sentiment].label}</span>
          )}
          <span className={cx('cite')}>인용 {row.citedUrls.length}</span>
        </span>
      </summary>

      <div className={cx('rec-body')}>
        {open && (
          <>
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
          </>
        )}
      </div>
    </details>
  )
})
Record.displayName = 'Record'

export const CallsDetail = ({ app, displayName, isoWeek, visibility, responses, weeks, available, latestWeekOf }: Props) => {
  const responsesByKey = useMemo(() => {
    const m = new Map<string, ResponseRecord>()
    for (const r of responses) m.set(joinKey(r.paraphraseId, r.engine, r.rep), r)
    return m
  }, [responses])

  const enginesPresent = useMemo(
    () => ENGINE_ORDER.filter((e) => visibility.some((v) => v.engine === e)),
    [visibility],
  )

  // 데이터에 존재하는 카테고리 — 정의된 순서 → 미정의는 접두사 알파벳순.
  const categoriesPresent = useMemo(() => {
    const present = [...new Set(visibility.map((v) => categoryOf(v.intentId)))]
    return present.sort((a, b) => catOrder(a) - catOrder(b) || a.localeCompare(b))
  }, [visibility])

  // 대시보드 클릭 필터(?engine=·?flag=·?sentiment=) — useSearchParams 로 첫 렌더부터 반영(클라 내비에서도 정확).
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // 필터 초기값을 세션 저장소에서 동기 복원 → 첫 페인트부터 복원 상태로 그려져 주차 전환 시 깜빡임 없음.
  // 주차 전환은 소프트 내비(hydration 없음)라 lazy init 의 storage 읽기가 클라에서만 돌아 mismatch 없음.
  // 서버 prerender(window 없음)에서는 기본값 → 최초 하드 로드 1회만 복원 차이가 있을 수 있음(불가피).
  // 엔진/카테고리는 "제외 집합(off)"으로 저장 → 새 주차에 등장한 항목은 자동 노출, 사라진 항목은 무시.
  const [active, setActive] = useState<Set<Engine>>(() => {
    const e = searchParams.get('engine')
    if (e && (ENGINE_ORDER as string[]).includes(e)) return new Set([e as Engine]) // 딥링크는 저장값보다 우선
    const off = typeof window !== 'undefined' ? readStored(app)?.engOff : undefined
    if (Array.isArray(off)) {
      const next = enginesPresent.filter((x) => !off.includes(x))
      if (next.length) return new Set(next)
    }
    return new Set(enginesPresent)
  })
  const [activeCats, setActiveCats] = useState<Set<string>>(() => {
    const off = typeof window !== 'undefined' ? readStored(app)?.catOff : undefined
    if (Array.isArray(off)) {
      const next = categoriesPresent.filter((c) => !off.includes(c))
      if (next.length) return new Set(next)
    }
    return new Set(categoriesPresent)
  })
  const [mentionMode, setMentionMode] = useState<MentionMode>(() => {
    const m = typeof window !== 'undefined' ? readStored(app)?.mention : undefined
    return m === 'mentioned' || m === 'unmentioned' || m === 'all' ? m : 'all'
  })
  const [q, setQ] = useState(() => {
    const sq = typeof window !== 'undefined' ? readStored(app)?.q : undefined
    return typeof sq === 'string' ? sq : ''
  })
  // 입력은 즉시, 필터는 비긴급(deferred). 행은 memo + 펼칠 때만 마크다운 렌더 → 키 입력 시 재계산 거의 없음.
  const deferredQ = useDeferredValue(q)

  // 변경 시 세션 저장소에 보존(제외 집합으로 저장 → 새 주차의 신규 항목 자동 노출).
  useEffect(() => {
    try {
      const payload: StoredFilters = {
        engOff: enginesPresent.filter((e) => !active.has(e)),
        catOff: categoriesPresent.filter((c) => !activeCats.has(c)),
        mention: mentionMode,
        q,
      }
      sessionStorage.setItem(storeKey(app), JSON.stringify(payload))
    } catch {
      /* 저장 실패는 무시(프라이빗 모드 등) */
    }
  }, [app, active, activeCats, mentionMode, q, enginesPresent, categoriesPresent])

  // flag·sentiment 는 URL 에서 파생(반응형) — 해제는 router.replace 로 파라미터 제거.
  const flag = searchParams.get('flag')
  const sp = searchParams.get('sentiment')
  const sentiment: Sentiment | null = sp === 'positive' || sp === 'neutral' || sp === 'negative' ? sp : null
  const clearFilter = (key: 'flag' | 'sentiment') => {
    const p = new URLSearchParams(searchParams.toString())
    p.delete(key)
    const qs = p.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }

  // 검색 대상 텍스트(질의+답변)를 행마다 1회만 이어붙여 캐시 — 키 입력마다 재연결 방지.
  // 한글 검색이 기본이라 소문자화는 하지 않음(무의미 + 비용).
  const searchIndex = useMemo(() => {
    const m = new Map<VisibilitySnapshot, string>()
    for (const v of visibility) {
      const ans = responsesByKey.get(joinKey(v.paraphraseId, v.engine, v.rep))?.answer ?? v.rawSnippet ?? ''
      m.set(v, `${v.query} ${ans}`)
    }
    return m
  }, [visibility, responsesByKey])

  // 안정 참조(memo 된 Record 의 props) — app 바뀔 때만 재생성.
  const brandTerms = useMemo<Term[]>(() => (BRAND_ALIASES[app] ?? []).map((term) => ({ term, kind: 'brand' })), [app])

  // 질의(paraphraseId)별 그룹 → 엔진별 레코드를 만든 뒤, 다시 카테고리(intentId 접두사)로 묶는다.
  // 디폴트가 "카테고리별로 모아 보기"이므로 카테고리 정렬·클러스터링이 항상 적용된다.
  const categories = useMemo(() => {
    const needle = deferredQ.trim()
    const byParaphrase = new Map<string, { query: string; intentId: string; rows: VisibilitySnapshot[] }>()
    for (const v of visibility) {
      if (!active.has(v.engine)) continue
      if (!activeCats.has(categoryOf(v.intentId))) continue
      if (mentionMode === 'mentioned' && !v.mentioned) continue
      if (mentionMode === 'unmentioned' && v.mentioned) continue
      if (flag && !v.accuracyFlags.includes(flag)) continue
      if (sentiment && v.sentiment !== sentiment) continue
      if (needle && !(searchIndex.get(v) ?? '').includes(needle)) continue
      const g = byParaphrase.get(v.paraphraseId) ?? { query: v.query, intentId: v.intentId, rows: [] }
      g.rows.push(v)
      byParaphrase.set(v.paraphraseId, g)
    }
    const order = (e: Engine) => ENGINE_ORDER.indexOf(e)
    const groups = [...byParaphrase.values()].map((g) => ({
      ...g,
      rows: g.rows.sort((a, b) => order(a.engine) - order(b.engine)),
    }))

    const byCat = new Map<string, typeof groups>()
    for (const g of groups) {
      const key = categoryOf(g.intentId)
      const arr = byCat.get(key) ?? []
      arr.push(g)
      byCat.set(key, arr)
    }
    return [...byCat.entries()]
      .map(([key, gs]) => {
        const sorted = gs.sort((a, b) => {
          const am = a.rows.filter((r) => r.mentioned).length
          const bm = b.rows.filter((r) => r.mentioned).length
          return bm - am || a.query.localeCompare(b.query)
        })
        const total = sorted.reduce((s, g) => s + g.rows.length, 0)
        const mentioned = sorted.reduce((s, g) => s + g.rows.filter((r) => r.mentioned).length, 0)
        return { key, label: catLabel(key), groups: sorted, total, mentioned }
      })
      .sort((a, b) => catOrder(a.key) - catOrder(b.key) || a.key.localeCompare(b.key))
  }, [visibility, searchIndex, active, activeCats, mentionMode, flag, sentiment, deferredQ])

  const totalShown = categories.reduce((s, c) => s + c.total, 0)
  const mentionedCount = visibility.filter((v) => v.mentioned).length

  const toggleEngine = (e: Engine) =>
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(e)) next.delete(e)
      else next.add(e)
      return next.size === 0 ? new Set(enginesPresent) : next // 전부 끄면 전체로 리셋
    })

  const toggleCat = (c: string) =>
    setActiveCats((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next.size === 0 ? new Set(categoriesPresent) : next // 전부 끄면 전체로 리셋
    })

  // 하나라도 기본값에서 벗어났으면 "필터 초기화" 노출.
  const filtersDirty =
    active.size !== enginesPresent.length ||
    activeCats.size !== categoriesPresent.length ||
    mentionMode !== 'all' ||
    q.trim() !== '' ||
    Boolean(flag) ||
    Boolean(sentiment)

  const resetFilters = () => {
    setActive(new Set(enginesPresent))
    setActiveCats(new Set(categoriesPresent))
    setMentionMode('all')
    setQ('')
    // 대시보드에서 넘어온 URL 필터(engine·flag·sentiment)도 함께 제거.
    const p = new URLSearchParams(searchParams.toString())
    p.delete('engine')
    p.delete('flag')
    p.delete('sentiment')
    const qs = p.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className={cx('page')}>
      <DashboardHeader
        app={app}
        available={available}
        latestWeekOf={latestWeekOf}
        kicker="AI 응답 기록 · query → answer"
        title={`${displayName} — AI 응답 상세`}
        measured={isoWeek ? `측정 ${isoWeek}${measureRange(isoWeek) ? ` (${measureRange(isoWeek)})` : ''}` : '측정 전'}
        weekNav={weeks.length && isoWeek ? { weeks, current: isoWeek, hrefBase: `/${app}/calls` } : undefined}
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
            <div className={cx('tb-row')}>
              <div className={cx('chip-grp')}>
                <span className={cx('grp-l')}>엔진</span>
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
                </div>
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

            <div className={cx('tb-row')}>
              <div className={cx('chip-grp')}>
                <span className={cx('grp-l')}>카테고리</span>
                <div className={cx('chips')}>
                  {categoriesPresent.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={cx('chip', { on: activeCats.has(c) })}
                      onClick={() => toggleCat(c)}
                      aria-pressed={activeCats.has(c)}
                    >
                      {catLabel(c)}
                    </button>
                  ))}
                </div>
              </div>
              <div className={cx('tb-right')}>
                <div className={cx('seg')} role="group" aria-label="언급 여부 필터">
                  {MENTION_MODES.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      className={cx('seg-btn', { on: mentionMode === m.key })}
                      onClick={() => setMentionMode(m.key)}
                      aria-pressed={mentionMode === m.key}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={cx('reset')}
                  onClick={resetFilters}
                  disabled={!filtersDirty}
                >
                  필터 초기화 <span className={cx('reset-x')}>✕</span>
                </button>
              </div>
            </div>
          </div>

          {(flag || sentiment) && (
            <div className={cx('filters')}>
              <span className={cx('filters-l')}>필터</span>
              {flag && (
                <button type="button" className={cx('filter-chip')} onClick={() => clearFilter('flag')}>
                  오정보 · {FLAG_LABEL[flag] ?? flag} <span className={cx('filter-x')}>✕</span>
                </button>
              )}
              {sentiment && (
                <button type="button" className={cx('filter-chip')} onClick={() => clearFilter('sentiment')}>
                  감성 · {SENTI_META[sentiment].label} <span className={cx('filter-x')}>✕</span>
                </button>
              )}
            </div>
          )}

          <div className={cx('cats')}>
            {categories.length === 0 && (
              <div className={cx('noresult')}>조건에 맞는 응답이 없습니다. 필터를 넓혀 보세요.</div>
            )}

            {categories.map((cat) => (
              <section className={cx('cat')} key={cat.key}>
                <header className={cx('cat-hd')}>
                  <h2 className={cx('cat-name')}>{cat.label}</h2>
                  <span className={cx('cat-stat')}>
                    질의 {cat.groups.length} ·{' '}
                    <span className={cx('cat-ment', { hit: cat.mentioned > 0 })}>
                      언급 {cat.mentioned}/{cat.total}
                    </span>
                  </span>
                </header>

                <div className={cx('groups')}>
                  {cat.groups.map((g) => {
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

                        {g.rows.map((row) => (
                          <Record
                            key={row.engine + row.rep}
                            row={row}
                            resp={responsesByKey.get(joinKey(row.paraphraseId, row.engine, row.rep))}
                            brandTerms={brandTerms}
                          />
                        ))}
                      </section>
                    )
                  })}
                </div>
              </section>
            ))}
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
