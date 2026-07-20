// JSON-LD 블록 뷰 — 노드별 스키마 인지 요약(핵심 GEO 신호 한 줄) + 구문 강조 raw.
// 요약은 렌더 시 파생(모르는 타입은 name/url 폴백) — 원본은 언제나 raw 가 진실.
import type { ReactNode } from 'react'
import classnames from 'classnames/bind'
import type { PageMeta } from '../../types/snapshot'
import styles from './PagesMonitor.module.scss'

const cx = classnames.bind(styles)

// ── 노드 요약 ──────────────────────────────────────────────────────

type Node = Record<string, unknown>

const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : v == null ? [] : [v])

const asNode = (v: unknown): Node | null => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Node) : null)

const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null)

// 'name' 프로퍼티 또는 문자열 자신
const nameOf = (v: unknown): string | null => str(v) ?? str(asNode(v)?.name)

const typeOf = (node: Node): string => {
  const t = node['@type']
  return str(t) ?? asArray(t).map(str).filter(Boolean).join('/') ?? '(타입 없음)'
}

const truncate = (s: string, n: number): string => (s.length > n ? `${s.slice(0, n)}…` : s)

const price = (offer: Node): string | null => {
  const p = str(offer.price) ?? (typeof offer.price === 'number' ? String(offer.price) : null)
  if (!p) return null
  const num = Number(p)
  const amount = Number.isFinite(num) ? num.toLocaleString('ko-KR') : p
  return `Offer ${amount}${str(offer.priceCurrency) ? ` ${offer.priceCurrency}` : ''}`
}

// 타입별 핵심 신호 — geo-audit 이 실제로 보는 값들(hasCourseInstance·Offer·sameAs·FAQ 규모).
const factsOf = (node: Node): string[] => {
  const type = typeOf(node)
  const facts: string[] = []
  const name = str(node.name)

  if (/Organization$/.test(type)) {
    if (name) facts.push(name)
    const parent = nameOf(node.parentOrganization)
    if (parent) facts.push(`parentOrganization: ${parent}`)
    const sameAs = asArray(node.sameAs).length
    if (sameAs) facts.push(`sameAs ${sameAs}개`)
    return facts
  }
  if (type === 'Course') {
    if (name) facts.push(name)
    const instances = asArray(node.hasCourseInstance).map(asNode).filter((n): n is Node => n != null)
    if (instances.length) {
      const start = instances.map((i) => str(i.startDate)?.slice(0, 10)).find(Boolean)
      facts.push(`CourseInstance ${instances.length}개${start ? ` · ${start} 시작` : ''}`)
    } else {
      facts.push('CourseInstance 없음')
    }
    const offer = asArray(node.offers).map(asNode).find((n) => n && n.price != null)
    const p = offer ? price(offer) : null
    if (p) facts.push(p)
    return facts
  }
  if (type === 'FAQPage') {
    const questions = asArray(node.mainEntity).map(asNode).filter((n): n is Node => n != null)
    const first = questions.map((q) => str(q.name)).find(Boolean)
    facts.push(`질문 ${questions.length}개${first ? ` — "${truncate(first, 32)}" 외` : ''}`)
    return facts
  }
  if (type === 'BreadcrumbList') {
    const trail = asArray(node.itemListElement)
      .map(asNode)
      .map((e) => (e ? str(e.name) ?? nameOf(e.item) : null))
      .filter(Boolean)
    if (trail.length) facts.push(trail.join(' › '))
    return facts
  }
  if (type === 'ItemList') {
    facts.push(`항목 ${asArray(node.itemListElement).length}개`)
    return facts
  }
  // 폴백 — 모르는 타입은 식별자만
  const fallback = name ?? str(node.url)
  facts.push(fallback ?? `${Object.keys(node).filter((k) => !k.startsWith('@')).length} 필드`)
  return facts
}

// 블록 루트에서 노드 나열(@graph·배열 전개, @context 만 있는 루트는 제외)
const nodesOf = (root: unknown): Node[] => {
  const out: Node[] = []
  for (const v of asArray(root)) {
    const node = asNode(v)
    if (!node) continue
    if (node['@graph']) out.push(...nodesOf(node['@graph']))
    else if (node['@type']) out.push(node)
  }
  return out
}

// ── 구문 강조(서버 렌더, innerHTML 미사용) ─────────────────────────

const TOKEN = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

const highlightJson = (json: string): ReactNode[] => {
  const out: ReactNode[] = []
  let last = 0
  for (const m of json.matchAll(TOKEN)) {
    const i = m.index
    if (i > last) out.push(json.slice(last, i))
    const [full, string, colon, literal] = m
    if (string != null) {
      out.push(
        <span key={i} className={cx(colon ? 'j-key' : 'j-str')}>
          {string}
        </span>,
      )
      if (colon) out.push(colon)
    } else {
      out.push(
        <span key={i} className={cx(literal ? 'j-lit' : 'j-num')}>
          {full}
        </span>,
      )
    }
    last = i + full.length
  }
  if (last < json.length) out.push(json.slice(last))
  return out
}

// ── 블록 뷰 ────────────────────────────────────────────────────────

const parseBlock = (block: PageMeta['jsonLd'][number]): unknown => {
  if (!block.valid) return null
  try {
    return JSON.parse(block.raw)
  } catch {
    return null
  }
}

export const JsonLdBlocks = ({ blocks }: { blocks: PageMeta['jsonLd'] }) => (
  <div className={cx('ldblocks')}>
    {blocks.map((block, i) => {
      const parsed = parseBlock(block)
      const nodes = parsed != null ? nodesOf(parsed) : []
      return (
        <div className={cx('ldblock')} key={i}>
          {nodes.map((node, j) => (
            <div className={cx('ldnode')} key={j}>
              <em className={cx('ldchip')}>{typeOf(node)}</em>
              <span className={cx('ldfacts')}>{factsOf(node).join(' · ')}</span>
            </div>
          ))}
          <details className={cx('ldraw')}>
            <summary>{block.valid ? 'raw' : 'raw (파싱 실패)'}</summary>
            <pre>{parsed != null ? highlightJson(JSON.stringify(parsed, null, 2)) : block.raw}</pre>
          </details>
        </div>
      )
    })}
  </div>
)
