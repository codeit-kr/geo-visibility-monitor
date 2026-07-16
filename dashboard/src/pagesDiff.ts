// 페이지 메타 판정·diff — pages.json 은 원본만 담으므로 이슈 규칙과 주차 간 변경 감지는
// 렌더 시 여기서 계산한다(규칙이 바뀌어도 재수집 없이 전 주차 재판정).
// 이슈 규칙은 geo-audit 감점 항목(og:locale 부재·H1 중복 등)과 정렬 — 감사 점수의 결정적 근거 데이터 역할.
import type { PageMeta, PagesSnapshot } from '../../types/snapshot'

export type CheckKey =
  | 'title'
  | 'description'
  | 'canonical'
  | 'robots'
  | 'lang'
  | 'og'
  | 'twitter'
  | 'h1'
  | 'jsonLd'

export const CHECKS: { key: CheckKey; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Desc' },
  { key: 'canonical', label: 'Canonical' },
  { key: 'robots', label: 'Robots' },
  { key: 'lang', label: 'lang' },
  { key: 'og', label: 'OG' },
  { key: 'twitter', label: 'Twitter' },
  { key: 'h1', label: 'H1' },
  { key: 'jsonLd', label: 'JSON-LD' },
]

const CHECK_LABEL = Object.fromEntries(CHECKS.map((c) => [c.key, c.label])) as Record<CheckKey, string>

const stripSlash = (u: string): string => u.replace(/\/$/, '')
const OG_REQUIRED = ['og:title', 'og:description', 'og:image']

// 체크별 이슈(빈 배열 = 정상). HTML 페이지만 판정 대상.
export const checkIssues = (p: PageMeta, key: CheckKey): string[] => {
  switch (key) {
    case 'title':
      return p.title ? [] : ['title 누락']
    case 'description':
      return p.description ? [] : ['meta description 누락']
    case 'canonical':
      if (!p.canonical) return ['canonical 누락']
      return stripSlash(p.canonical) === stripSlash(p.url) ? [] : [`canonical 비자기참조 (${p.canonical})`]
    case 'robots':
      return p.robots && /noindex|nofollow/i.test(p.robots) ? [`robots ${p.robots}`] : []
    case 'lang':
      return p.htmlLang ? [] : ['html lang 누락']
    case 'og': {
      // og:locale 부재는 별도 이슈 텍스트 — 피드 집계·지속 판정에서 필수 og 누락과 구분.
      const issues: string[] = []
      const missing = OG_REQUIRED.filter((k) => !p.og[k])
      if (missing.length) issues.push(`${missing.join(' · ')} 누락`)
      if (!p.og['og:locale']) issues.push('og:locale 부재')
      return issues
    }
    case 'twitter':
      return p.twitter['twitter:card'] ? [] : ['twitter:card 누락']
    case 'h1':
      if (p.h1.length === 0) return ['H1 없음']
      return p.h1.length > 1 ? [`H1 중복 ${p.h1.length}개`] : []
    case 'jsonLd':
      if (p.jsonLd.length === 0) return ['JSON-LD 없음']
      return p.jsonLd.some((b) => !b.valid) ? ['JSON-LD 파싱 실패 블록 존재'] : []
  }
}

// 변경 감지용 정규화 값. null = 값 없음.
const fieldValue = (p: PageMeta, key: CheckKey): string | null => {
  const record = (r: Record<string, string>) =>
    Object.entries(r)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n') || null
  switch (key) {
    case 'title':
      return p.title
    case 'description':
      return p.description
    case 'canonical':
      return p.canonical
    case 'robots':
      return p.robots
    case 'lang':
      return p.htmlLang
    case 'og':
      return record(p.og)
    case 'twitter':
      return record(p.twitter)
    case 'h1':
      return p.h1.join(' / ') || null
    case 'jsonLd':
      return p.jsonLd.map((b) => b.raw).join('\n') || null
  }
}

// 표시용 짧은 값 — jsonLd 는 raw 대신 타입 요약(내용만 다르면 "내용 변경" 표기).
const displayValue = (p: PageMeta | undefined, key: CheckKey): string => {
  if (!p) return '(페이지 없음)'
  if (key === 'jsonLd') {
    const types = [...new Set(p.jsonLd.flatMap((b) => b.types))].sort()
    return types.length ? types.join(' · ') : '(없음)'
  }
  return fieldValue(p, key) ?? '(없음)'
}

export interface FieldChange {
  path: string
  key: CheckKey | 'content' // 'content' = 비HTML(llms.txt) 본문 변경
  label: string
  prev: string // 표시용
  cur: string
}

export interface IssueGroup {
  label: string // 'og:locale 부재' 등 동일 이슈 텍스트
  paths: string[]
  sinceWeek?: string // 지속 이슈의 최초 검출 주차(history 있을 때)
}

export interface CellReport {
  issues: string[]
  changed: boolean
}

export interface PageRow {
  page: PageMeta
  cells: Record<CheckKey, CellReport> // kind:text/수집 실패 행은 빈 판정
  changed: boolean // 어느 필드든 변경(비HTML 은 contentHash 비교)
  issueCount: number
}

export interface WeekReport {
  rows: PageRow[]
  changes: FieldChange[]
  newIssues: IssueGroup[]
  resolvedIssues: IssueGroup[]
  openIssues: IssueGroup[]
  errors: string[] // 수집 실패 path
  hasPrev: boolean
}

const issuesOf = (snap: PagesSnapshot): Map<string, string[]> => {
  const map = new Map<string, string[]>() // 이슈 텍스트 → paths
  for (const p of snap.pages) {
    if (p.kind !== 'html' || p.status !== 200) continue
    for (const { key } of CHECKS) {
      for (const issue of checkIssues(p, key)) {
        map.set(issue, [...(map.get(issue) ?? []), p.path])
      }
    }
  }
  return map
}

const groupsOf = (map: Map<string, string[]>): IssueGroup[] =>
  [...map.entries()].map(([label, paths]) => ({ label, paths })).sort((a, b) => b.paths.length - a.paths.length)

// history(오름차순, 해당 주차 미수집이면 snap:null)에서 이슈의 최초 연속 검출 주차를 찾는다.
const sinceWeekOf = (history: WeekPages[], upToWeek: string, issue: string): string | undefined => {
  let since: string | undefined
  for (const h of history) {
    if (!h.snap) continue
    const has = issuesOf(h.snap).has(issue)
    if (has) since ??= h.isoWeek
    else since = undefined
    if (h.isoWeek === upToWeek) break
  }
  return since
}

export interface WeekPages {
  isoWeek: string
  snap: PagesSnapshot | null
}

export const buildWeekReport = (
  cur: PagesSnapshot,
  prev: PagesSnapshot | null,
  history: WeekPages[],
): WeekReport => {
  const prevByPath = new Map((prev?.pages ?? []).map((p) => [p.path, p]))

  const rows: PageRow[] = []
  const changes: FieldChange[] = []
  const errors: string[] = []

  for (const page of cur.pages) {
    const before = prevByPath.get(page.path)
    const cells = {} as Record<CheckKey, CellReport>
    let changed = false
    let issueCount = 0

    if (page.status !== 200) {
      errors.push(page.path)
      for (const { key } of CHECKS) cells[key] = { issues: [], changed: false }
    } else if (page.kind !== 'html') {
      for (const { key } of CHECKS) cells[key] = { issues: [], changed: false }
      changed = before != null && before.contentHash !== page.contentHash
      if (changed && before) {
        changes.push({
          path: page.path,
          key: 'content',
          label: '내용',
          prev: `hash ${before.contentHash}`,
          cur: `hash ${page.contentHash}`,
        })
      }
    } else {
      for (const { key } of CHECKS) {
        const issues = checkIssues(page, key)
        const fieldChanged = before != null && fieldValue(before, key) !== fieldValue(page, key)
        cells[key] = { issues, changed: fieldChanged }
        issueCount += issues.length
        if (fieldChanged) {
          changed = true
          changes.push({
            path: page.path,
            key,
            label: CHECK_LABEL[key],
            prev: displayValue(before, key),
            cur: displayValue(page, key),
          })
        }
      }
    }
    rows.push({ page, cells, changed, issueCount })
  }

  // 이슈 전이 — 동일 이슈 텍스트 기준으로 신규/해소/지속을 가른다.
  const curIssues = issuesOf(cur)
  const prevIssues = prev ? issuesOf(prev) : null
  const newIssues = groupsOf(new Map([...curIssues].filter(([k]) => prevIssues != null && !prevIssues.has(k))))
  const resolvedIssues = prevIssues ? groupsOf(new Map([...prevIssues].filter(([k]) => !curIssues.has(k)))) : []
  const openIssues = groupsOf(
    new Map([...curIssues].filter(([k]) => prevIssues == null || prevIssues.has(k))),
  ).map((g) => ({ ...g, sinceWeek: sinceWeekOf(history, cur.isoWeek, g.label) }))

  return { rows, changes, newIssues, resolvedIssues, openIssues, errors, hasPrev: prev != null }
}

// 페이지 상세 드로어의 주차 타임라인 — 수집된 주차 간 필드 변경 이벤트만 나열.
export interface TimelineEvent {
  isoWeek: string
  kind: 'first' | 'changed'
  details: string[]
}

export const pageTimeline = (history: WeekPages[], path: string, upToWeek: string): TimelineEvent[] => {
  const events: TimelineEvent[] = []
  let before: PageMeta | undefined
  for (const h of history) {
    if (!h.snap) continue
    const page = h.snap.pages.find((p) => p.path === path)
    if (page) {
      if (!before) {
        events.push({ isoWeek: h.isoWeek, kind: 'first', details: ['최초 수집'] })
      } else {
        const details =
          page.kind !== 'html'
            ? before.contentHash !== page.contentHash
              ? ['내용 변경']
              : []
            : CHECKS.filter(({ key }) => fieldValue(before!, key) !== fieldValue(page, key)).map(
                ({ key }) => `${CHECK_LABEL[key]} 변경`,
              )
        if (details.length) events.push({ isoWeek: h.isoWeek, kind: 'changed', details })
      }
      before = page
    }
    if (h.isoWeek === upToWeek) break
  }
  return events.reverse() // 최신이 위
}
