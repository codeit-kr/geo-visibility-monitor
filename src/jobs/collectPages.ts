// 페이지 메타 수집 — 서비스 감사셋(auditUrls 고정 + auditUrlSource sitemap resolve)을 fetch 해
// head/구조 신호를 pages.json 원본으로 만든다.
// LLM 미사용·무의존(정규식 파서). geo-audit 이 점수화하는 같은 신호의 결정적(deterministic) 원본 역할.
import { createHash } from 'node:crypto'
import type { PageMeta, PagesSnapshot } from '../../types/snapshot'
import type { ServiceConfig } from '../config/types'
import type { SnapshotContext } from '../context'
import { fetchWithRetry } from '../util/fetchWithRetry'
import { mapLimit } from '../util/concurrency'
import { resolveAuditUrls } from '../util/resolveAuditUrls'
import { SCHEMA_VERSION } from '../../types/snapshot'

const USER_AGENT = 'codeit-geo-monitor/1.0 (weekly page-meta snapshot)'
const CONCURRENCY = 4

// ── HTML 파싱(무의존) ──────────────────────────────────────────────
// 고정 자사 페이지(SSR·정형 head) 대상이라 정규식으로 충분. 범용 HTML 파서 아님.

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

const decodeEntities = (s: string): string =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&(\w+);/g, (m, name: string) => ENTITIES[name.toLowerCase()] ?? m)

const stripTags = (s: string): string => decodeEntities(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()

// 태그 문자열에서 속성 맵 추출(속성 순서·따옴표 종류 무관)
const attrsOf = (tag: string): Record<string, string> => {
  const attrs: Record<string, string> = {}
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? '')
  }
  return attrs
}

// JSON-LD 값에서 @type 수집(@graph·배열·중첩 노드 순회)
const collectTypes = (node: unknown, into: Set<string>): void => {
  if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, into))
  if (node == null || typeof node !== 'object') return
  const obj = node as Record<string, unknown>
  const t = obj['@type']
  if (typeof t === 'string') into.add(t)
  else if (Array.isArray(t)) t.forEach((v) => typeof v === 'string' && into.add(v))
  if (obj['@graph']) collectTypes(obj['@graph'], into)
}

const hashOf = (body: string): string => createHash('sha256').update(body).digest('hex').slice(0, 16)

export const parsePageMeta = (url: string, status: number, contentType: string, body: string): PageMeta => {
  const path = new URL(url).pathname
  const base = {
    url,
    path,
    status,
    contentHash: hashOf(body),
    title: null,
    description: null,
    canonical: null,
    robots: null,
    htmlLang: null,
    og: {},
    twitter: {},
    h1: [],
    jsonLd: [],
  }
  if (!contentType.includes('text/html')) return { ...base, kind: 'text' }

  const og: Record<string, string> = {}
  const twitter: Record<string, string> = {}
  let description: string | null = null
  let robots: string | null = null
  for (const m of body.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrsOf(m[0])
    const key = a.property ?? a.name
    if (!key || a.content == null) continue
    if (key.startsWith('og:')) og[key] = a.content
    else if (key.startsWith('twitter:')) twitter[key] = a.content
    else if (key === 'description') description = a.content
    else if (key === 'robots') robots = a.content
  }

  let canonical: string | null = null
  for (const m of body.matchAll(/<link\b[^>]*>/gi)) {
    const a = attrsOf(m[0])
    if (a.rel?.toLowerCase() === 'canonical' && a.href) canonical = a.href
  }

  const jsonLd: PageMeta['jsonLd'] = []
  for (const m of body.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = m[1].trim()
    try {
      const types = new Set<string>()
      collectTypes(JSON.parse(raw), types)
      jsonLd.push({ types: [...types].sort(), valid: true, raw })
    } catch {
      jsonLd.push({ types: [], valid: false, raw })
    }
  }

  return {
    ...base,
    kind: 'html',
    title: body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim() ?? null,
    description,
    canonical,
    robots,
    htmlLang: body.match(/<html\b[^>]*\blang\s*=\s*["']?([\w-]+)/i)?.[1] ?? null,
    og,
    twitter,
    h1: [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1])).filter(Boolean),
    jsonLd,
  }
}

// ── 수집 ──────────────────────────────────────────────────────────

const fetchPage = async (url: string): Promise<PageMeta> => {
  try {
    const res = await fetchWithRetry(url, { headers: { 'user-agent': USER_AGENT } })
    const body = await res.text()
    return parsePageMeta(url, res.status, res.headers.get('content-type') ?? '', body)
  } catch (error) {
    console.warn(`[pages] fetch 실패 ${url}:`, error)
    return parsePageMeta(url, 0, '', '')
  }
}

export const collectPages = async (ctx: SnapshotContext, service: ServiceConfig): Promise<PagesSnapshot> => {
  // auditUrlSource(sitemap 동적 소싱)가 있으면 resolve — 결과 URL 이 pages.json 에 그대로 남아 감사셋 diff 추적 가능.
  const urls = await resolveAuditUrls(service)
  const pages = await mapLimit(urls, CONCURRENCY, fetchPage)
  const failed = pages.filter((p) => p.status !== 200)
  console.info(`[pages] ${ctx.app} — ${pages.length}개 수집${failed.length ? ` / 실패 ${failed.length}(${failed.map((p) => p.path).join(', ')})` : ''}`)
  return {
    schemaVersion: SCHEMA_VERSION,
    capturedAt: ctx.capturedAt,
    isoWeek: ctx.isoWeek,
    app: ctx.app,
    pages,
  }
}
