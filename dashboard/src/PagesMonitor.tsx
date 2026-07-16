import classnames from 'classnames/bind'
import type { App, PageMeta, PagesSnapshot, RollupIndex, ServicesManifest } from '../../types/snapshot'
import {
  CHECKS,
  buildWeekReport,
  pageTimeline,
  type CellReport,
  type CheckKey,
  type IssueGroup,
  type WeekPages,
} from './pagesDiff'
import { measureRange } from './isoWeek'
import { DashboardHeader } from './DashboardHeader'
import { JsonLdBlocks } from './jsonLdView'
import styles from './PagesMonitor.module.scss'

const cx = classnames.bind(styles)

// 매트릭스 점 셀 대상 — JSON-LD 는 타입 칩 컬럼이 상태까지 담당.
const MATRIX_CHECKS = CHECKS.filter((c) => c.key !== 'jsonLd')

type Props = {
  app: App
  rollup: RollupIndex
  services: ServicesManifest
  week: string
  cur: PagesSnapshot | null
  prev: WeekPages | null // 페이지 메타가 있는 가장 가까운 이전 회차(격주·소급 수집이라 직전 주가 아닐 수 있음)
  history: WeekPages[] // 오름차순 전 주차(미수집 주차는 snap:null)
}

export const PagesMonitor = ({ app, rollup, services, week, cur, prev, history }: Props) => {
  const header = (
    <DashboardHeader
      app={app}
      available={services.services.map((s) => s.app)}
      kicker="페이지 메타 · Head / JSON-LD"
      title={`${rollup.displayName} — 페이지 메타`}
      measured={`측정 ${week}${measureRange(week) ? ` (${measureRange(week)})` : ''}`}
      weekNav={{ weeks: rollup.weeks.map((w) => w.isoWeek), current: week, hrefBase: `/${app}/pages` }}
    />
  )

  if (!cur) {
    return (
      <div className={cx('page')}>
        {header}
        <div className={cx('empty')}>
          <div className={cx('empty-mark')}>◫</div>
          <div className={cx('empty-t')}>이 주차의 페이지 메타 수집이 없습니다</div>
          <div className={cx('empty-d')}>주간 측정 런이 pages.json 을 기록하면 여기에 나타납니다.</div>
        </div>
      </div>
    )
  }

  const report = buildWeekReport(cur, prev?.snap ?? null, history)

  return (
    <div className={cx('page')}>
      {header}
      <div className={cx('wrap')}>
        {/* 변경 · 이슈 피드 — 이 페이지의 1순위 시그널 */}
        <section className={cx('panel')}>
          <div className={cx('p-hd')}>
            <span className={cx('p-t')}>변경 · 이슈</span>
            <span className={cx('p-s')}>{prev ? `${prev.isoWeek} → ${week}` : '첫 수집'}</span>
          </div>
          <Feed report={report} />
        </section>

        {/* 상태 매트릭스 */}
        <section className={cx('panel')}>
          <div className={cx('p-hd')}>
            <span className={cx('p-t')}>상태 매트릭스</span>
            <span className={cx('legend')}>
              <i className={cx('cell', 'ok')} /> 정상 <i className={cx('cell', 'chg')} /> 변경{' '}
              <i className={cx('cell', 'warn')}>!</i> 이슈
            </span>
          </div>
          <div className={cx('tablewrap')}>
            <div className={cx('table')}>
              <div className={cx('rgrid', 'thead')}>
                <span className={cx('th', 'left')}>Route</span>
                {MATRIX_CHECKS.map((c) => (
                  <span key={c.key} className={cx('th')}>
                    {c.label}
                  </span>
                ))}
                <span className={cx('th', 'left')}>JSON-LD</span>
                <span className={cx('th')} />
              </div>
              {report.rows.map(({ page, cells, changed, issueCount }) => (
                <details className={cx('row')} key={page.path}>
                  <summary className={cx('rgrid')}>
                    <span className={cx('route')}>{page.path}</span>
                    {page.status !== 200 ? (
                      <span className={cx('span-msg', 'err')}>HTTP {page.status || '실패'} — 수집 실패</span>
                    ) : page.kind !== 'html' ? (
                      <span className={cx('span-msg')}>
                        텍스트 표면{changed && <em className={cx('chg-word')}> · 내용 변경</em>}
                      </span>
                    ) : (
                      <>
                        {MATRIX_CHECKS.map((c) => (
                          <Cell key={c.key} cell={cells[c.key]} />
                        ))}
                        <JsonLdChips page={page} cell={cells.jsonLd} />
                      </>
                    )}
                    <span className={cx('chev')}>›</span>
                  </summary>
                  <Drawer page={page} cells={cells} issueCount={issueCount} events={pageTimeline(history, page.path, week)} />
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// ── 피드 ──────────────────────────────────────────────────────────

const Feed = ({ report }: { report: ReturnType<typeof buildWeekReport> }) => {
  const quiet =
    report.changes.length === 0 &&
    report.newIssues.length === 0 &&
    report.resolvedIssues.length === 0 &&
    report.openIssues.length === 0 &&
    report.errors.length === 0
  if (quiet) return <p className={cx('p-sub')}>변경·이슈 없음</p>

  return (
    <>
      <div className={cx('chips')}>
        {report.hasPrev && (
          <span className={cx('chip', 'chg')}>
            변경 <b>{report.changes.length}</b>
          </span>
        )}
        {report.hasPrev && (
          <span className={cx('chip', 'new')}>
            신규 이슈 <b>{report.newIssues.length}</b>
          </span>
        )}
        {report.resolvedIssues.length > 0 && (
          <span className={cx('chip', 'resolved')}>
            해소 <b>{report.resolvedIssues.length}</b>
          </span>
        )}
        <span className={cx('chip', 'open')}>
          {report.hasPrev ? '지속 이슈' : '이슈'} <b>{report.openIssues.length}</b>
        </span>
        {report.errors.length > 0 && (
          <span className={cx('chip', 'new')}>
            수집 실패 <b>{report.errors.length}</b>
          </span>
        )}
      </div>

      {report.errors.length > 0 && (
        <div className={cx('frow')}>
          <span className={cx('fbadge', 'err')}>실패</span>
          <span className={cx('ftext')}>
            HTTP 수집 실패 — <code className={cx('fpaths')}>{report.errors.join(' · ')}</code>
          </span>
        </div>
      )}
      {report.changes.map((c) => (
        <div className={cx('frow')} key={`${c.path}|${c.key}`}>
          <span className={cx('fbadge', 'chg')}>변경</span>
          <code className={cx('fpath')}>{c.path}</code>
          <span className={cx('ffield')}>{c.label}</span>
          <span className={cx('fvals')}>
            <span className={cx('fold')} title={c.prev}>
              {c.prev}
            </span>
            <span className={cx('arrow')}>→</span>
            <span className={cx('fnew')} title={c.cur}>
              {c.cur}
            </span>
          </span>
        </div>
      ))}
      <IssueRows groups={report.newIssues} badge="신규" cls="err" />
      <IssueRows groups={report.resolvedIssues} badge="해소" cls="resolved" strike />
      <IssueRows groups={report.openIssues} badge={report.hasPrev ? '지속' : '이슈'} cls="open" />
    </>
  )
}

const IssueRows = ({ groups, badge, cls, strike }: { groups: IssueGroup[]; badge: string; cls: string; strike?: boolean }) => (
  <>
    {groups.map((g) => (
      <div className={cx('frow')} key={g.label}>
        <span className={cx('fbadge', cls)}>{badge}</span>
        <span className={cx('ftext', { strike })}>
          {g.label} — <code className={cx('fpaths')}>{g.paths.length > 3 ? `${g.paths.length}개 페이지` : g.paths.join(' · ')}</code>
        </span>
        {g.sinceWeek && <span className={cx('fsince')}>{g.sinceWeek}부터</span>}
      </div>
    ))}
  </>
)

// ── 매트릭스 셀 ────────────────────────────────────────────────────

const Cell = ({ cell }: { cell: CellReport }) => {
  if (cell.issues.length) {
    return (
      <span className={cx('cellbox')}>
        <i className={cx('cell', 'warn')} title={cell.issues.join('\n')}>
          {cell.issues.length > 1 ? cell.issues.length : '!'}
        </i>
      </span>
    )
  }
  return (
    <span className={cx('cellbox')}>
      <i className={cx('cell', cell.changed ? 'chg' : 'ok')} title={cell.changed ? '이번 주 변경' : undefined} />
    </span>
  )
}

const JsonLdChips = ({ page, cell }: { page: PageMeta; cell: CellReport }) => {
  const types = [...new Set(page.jsonLd.flatMap((b) => b.types))].sort()
  return (
    <span className={cx('ldchips')}>
      {cell.issues.length > 0 && (
        <i className={cx('cell', 'warn')} title={cell.issues.join('\n')}>
          !
        </i>
      )}
      {cell.changed && <i className={cx('cell', 'chg')} title="이번 주 변경" />}
      {types.map((t) => (
        <em className={cx('ldchip')} key={t}>
          {t}
        </em>
      ))}
    </span>
  )
}

// ── 상세 드로어 ────────────────────────────────────────────────────

const Drawer = ({
  page,
  cells,
  issueCount,
  events,
}: {
  page: PageMeta
  cells: Record<CheckKey, CellReport>
  issueCount: number
  events: ReturnType<typeof pageTimeline>
}) => {
  const issues = CHECKS.flatMap(({ key }) => cells[key].issues)
  return (
    <div className={cx('drawer')}>
      <div className={cx('dcol', 'wide')}>
        <div className={cx('dh')}>수집값</div>
        <dl className={cx('kv')}>
          {issueCount > 0 && (
            <>
              <dt>이슈</dt>
              <dd className={cx('warn-v')}>{issues.join(' · ')}</dd>
            </>
          )}
          {page.kind === 'html' ? (
            <>
              <Kv k="Title" v={page.title} count />
              <Kv k="Description" v={page.description} count />
              <Kv k="Canonical" v={page.canonical} mono />
              <Kv k="Robots" v={page.robots ?? '(없음 — 기본 index,follow)'} />
              <Kv k="lang" v={page.htmlLang} mono />
              {Object.entries(page.og).map(([k, v]) => (
                <Kv key={k} k={k} v={v} mono image={k.endsWith(':image')} />
              ))}
              {Object.entries(page.twitter).map(([k, v]) => (
                <Kv key={k} k={k} v={v} mono image={k.endsWith(':image')} />
              ))}
              <dt>H1</dt>
              <dd>{page.h1.length ? page.h1.join(' / ') : '(없음)'}</dd>
            </>
          ) : (
            <>
              <Kv k="Status" v={String(page.status)} mono />
              <Kv k="Hash" v={page.contentHash} mono />
            </>
          )}
        </dl>
        {page.jsonLd.length > 0 && <JsonLdBlocks blocks={page.jsonLd} />}
        <a className={cx('btn')} href={page.url} target="_blank" rel="noreferrer">
          페이지 열기 ↗
        </a>
      </div>
      <div className={cx('dcol')}>
        <div className={cx('dh')}>타임라인</div>
        <ul className={cx('tl')}>
          {events.map((e) => (
            <li className={cx(e.kind)} key={`${e.isoWeek}|${e.kind}`}>
              <span className={cx('tw')}>{e.isoWeek}</span>
              {e.details.join(' · ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Kv = ({ k, v, mono, count, image }: { k: string; v: string | null; mono?: boolean; count?: boolean; image?: boolean }) => (
  <>
    <dt>{k}</dt>
    <dd className={cx({ mono })}>
      {v ?? '(없음)'}
      {count && v && <span className={cx('count')}> ({v.length}자)</span>}
      {image && v && <img className={cx('thumb')} src={v} alt="" loading="lazy" />}
    </dd>
  </>
)
