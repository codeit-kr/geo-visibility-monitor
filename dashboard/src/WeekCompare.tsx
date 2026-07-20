import classnames from 'classnames/bind'
import Link from 'next/link'
import type {
  App,
  Engine,
  GeoScoreRunRow,
  GeoScoreSnapshot,
  RollupIndex,
  ServicesManifest,
  WeekDigest,
  WeekSummary,
} from '../../types/snapshot'
import type { ChangeStatus, CompareResult } from './compare'
import { measureRange } from './isoWeek'
import { DashboardHeader } from './DashboardHeader'
import styles from './WeekCompare.module.scss'

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

const GEO_CATS: { key: keyof GeoScoreSnapshot; label: string }[] = [
  { key: 'citability', label: '인용 가능성' },
  { key: 'brand', label: '브랜드' },
  { key: 'eeat', label: 'E-E-A-T' },
  { key: 'technical', label: '기술' },
  { key: 'schema', label: '스키마' },
  { key: 'platform', label: '플랫폼' },
]

const STATUS_META: Record<ChangeStatus, { label: string; cls: string }> = {
  lost: { label: '언급 상실', cls: 'lost' },
  new: { label: '신규 언급', cls: 'new' },
  kept: { label: '유지', cls: 'kept' },
  none: { label: '계속 미언급', cls: 'none' },
}

const pct1 = (v: number | null | undefined) => (v == null ? '—' : (v * 100).toFixed(1))

// run 회차별 원시 점수에서 카테고리의 [min, max] 변동폭. runs 없거나 값 없으면 null.
const runRange = (runs: GeoScoreRunRow[] | null, key: keyof GeoScoreSnapshot): [number, number] | null => {
  const vals = (runs ?? []).map((r) => r[key as keyof GeoScoreRunRow]).filter((v): v is number => typeof v === 'number')
  return vals.length ? [Math.min(...vals), Math.max(...vals)] : null
}

// 두 변동폭이 겹치면 이번 증감은 측정 노이즈 범위 안일 수 있음.
const rangesOverlap = (a: [number, number] | null, b: [number, number] | null): boolean =>
  a != null && b != null && a[0] <= b[1] && b[0] <= a[1]

// 증감 배지 — 비율(pp)·점수(pt) 공용
const Delta = ({ value, unit, digits = 1 }: { value: number | null; unit: string; digits?: number }) => {
  if (value == null) return null
  if (Math.abs(value) < 10 ** -(digits + 1) / 2) return <span className={cx('delta', 'flat')}>±0{unit}</span>
  return (
    <span className={cx('delta', value > 0 ? 'up' : 'down')}>
      {value > 0 ? '▲' : '▼'} {Math.abs(value).toFixed(digits)}
      {unit}
    </span>
  )
}

type Props = {
  app: App
  rollup: RollupIndex
  services: ServicesManifest
  cur: WeekSummary
  prev: WeekSummary | null
  geoCur: GeoScoreSnapshot | null
  geoPrev: GeoScoreSnapshot | null
  runsCur: GeoScoreRunRow[] | null
  runsPrev: GeoScoreRunRow[] | null
  comparison: CompareResult | null
  digest: WeekDigest | null
  usingFixture?: boolean
}

export const WeekCompare = ({ app, rollup, services, cur, prev, geoCur, geoPrev, runsCur, runsPrev, comparison, digest, usingFixture }: Props) => {
  const header = (
    <DashboardHeader
      app={app}
      available={services.services.map((s) => s.app)}
      latestWeekOf={Object.fromEntries(services.services.map((s) => [s.app, s.latestWeek]))}
      kicker="전 회차 비교 · Before / After"
      title={`${rollup.displayName} — 전 회차 대비 변화`}
      measured={`측정 ${cur.isoWeek}${measureRange(cur.isoWeek) ? ` (${measureRange(cur.isoWeek)})` : ''}`}
      sub={prev ? `기준 ${prev.isoWeek} → ${cur.isoWeek}` : undefined}
      weekNav={{ weeks: rollup.weeks.map((w) => w.isoWeek), current: cur.isoWeek, hrefBase: `/${app}/compare` }}
    />
  )

  if (!prev) {
    return (
      <div className={cx('page')}>
        {header}
        <div className={cx('empty')}>
          <div className={cx('empty-mark')}>◵</div>
          <div className={cx('empty-t')}>비교할 이전 회차가 없습니다</div>
          <div className={cx('empty-d')}>이 주차가 첫 측정입니다 — 다음 회차부터 전/후 비교가 나타납니다.</div>
        </div>
      </div>
    )
  }

  const dMention = cur.mentionRate != null && prev.mentionRate != null ? (cur.mentionRate - prev.mentionRate) * 100 : null
  const dSov = cur.sov != null && prev.sov != null ? (cur.sov - prev.sov) * 100 : null
  const dGeo = cur.geoScore != null && prev.geoScore != null ? cur.geoScore - prev.geoScore : null

  const engines = ENGINE_ORDER.filter((e) => cur.byEngine[e] != null || prev.byEngine[e] != null)
  const visibleChanges = comparison?.changes.filter((c) => c.status !== 'none') ?? []
  const noneChanges = comparison?.changes.filter((c) => c.status === 'none') ?? []

  return (
    <div className={cx('page')}>
      {header}
      <div className={cx('wrap')}>
        {usingFixture && <div className={cx('fixture-note')}>● 샘플(fixture) 데이터 — 스냅샷 없음</div>}

        {/* 헤드라인 전/후 */}
        <div className={cx('stats')}>
          <Stat label="Mention Rate" prev={`${pct1(prev.mentionRate)}%`} cur={`${pct1(cur.mentionRate)}%`} delta={<Delta value={dMention} unit="pp" />} />
          <Stat label="Share of Voice" prev={`${pct1(prev.sov)}%`} cur={`${pct1(cur.sov)}%`} delta={<Delta value={dSov} unit="pp" />} />
          <Stat
            label="GEO Score"
            prev={prev.geoScore == null ? '—' : String(prev.geoScore)}
            cur={cur.geoScore == null ? '—' : String(cur.geoScore)}
            delta={<Delta value={dGeo} unit="pt" digits={0} />}
          />
        </div>

        <div className={cx('grid2')}>
          {/* GEO 카테고리 전/후 */}
          <section className={cx('panel')}>
            <div className={cx('p-hd')}>
              <span className={cx('p-t')}>GEO Score 카테고리</span>
              <span className={cx('p-s')}>{prev.isoWeek} → {cur.isoWeek}</span>
            </div>
            {geoCur && geoPrev ? (
              <>
                {GEO_CATS.map((c) => {
                  const pv = Number(geoPrev[c.key])
                  const cv = Number(geoCur[c.key])
                  const pr = runRange(runsPrev, c.key)
                  const crr = runRange(runsCur, c.key)
                  const noise = cv !== pv && rangesOverlap(pr, crr) // 변동폭이 겹치면 노이즈일 수 있음
                  return (
                    <div className={cx('cat')} key={String(c.key)}>
                      <div className={cx('cat-h')}>
                        <span className={cx('cat-name')}>{c.label}</span>
                        <span className={cx('cat-vals')}>
                          <span className={cx('val-prev')}>{pv}{pr && pr[0] !== pr[1] && <span className={cx('range')}> {pr[0]}–{pr[1]}</span>}</span>
                          <span className={cx('arrow')}>→</span>
                          <span className={cx('val-cur')}>{cv}{crr && crr[0] !== crr[1] && <span className={cx('range')}> {crr[0]}–{crr[1]}</span>}</span>
                          {noise ? (
                            <span className={cx('delta', 'flat')} title="측정 run 간 변동폭이 겹쳐 실제 변화가 아닐 수 있습니다">
                              {cv > pv ? '▲' : '▼'} {Math.abs(cv - pv)} · 변동폭 내
                            </span>
                          ) : (
                            <Delta value={cv - pv} unit="" digits={0} />
                          )}
                        </span>
                      </div>
                      <div className={cx('dualbar')}>
                        <div className={cx('bar', 'prev')}><i style={{ width: `${pv}%` }} /></div>
                        <div className={cx('bar', 'cur')}><i style={{ width: `${cv}%` }} /></div>
                      </div>
                    </div>
                  )
                })}
                <p className={cx('note')}>
                  위 = 전 회차, 아래 = 이번 회차 · 점수 옆 작은 숫자는 run 간 변동폭 · 상세 근거:{' '}
                  <Link className={cx('inline-link')} href={`/${app}/geo/${prev.isoWeek}`}>전 회차 감사</Link>
                  {' · '}
                  <Link className={cx('inline-link')} href={`/${app}/geo/${cur.isoWeek}`}>이번 회차 감사</Link>
                </p>
              </>
            ) : (
              <p className={cx('p-sub')}>{geoCur ? '전 회차' : '이번 회차'}의 GEO 감사 점수가 없어 카테고리 비교를 표시할 수 없습니다.</p>
            )}
          </section>

          {/* 엔진별 언급률 전/후 */}
          <section className={cx('panel')}>
            <div className={cx('p-hd')}>
              <span className={cx('p-t')}>엔진별 언급률</span>
              <span className={cx('p-s')}>visibility</span>
            </div>
            {engines.map((e) => {
              const pv = prev.byEngine[e]
              const cv = cur.byEngine[e]
              return (
                <div className={cx('erow')} key={e}>
                  <div className={cx('ename')}>
                    <span className={cx('sw')} style={{ background: ENGINE_META[e].color }} />
                    {ENGINE_META[e].label}
                    {pv == null && <span className={cx('etag')}>신규 측정</span>}
                    {cv == null && <span className={cx('etag')}>미측정</span>}
                  </div>
                  <div className={cx('evals')}>
                    <span className={cx('val-prev')}>{pct1(pv)}%</span>
                    <span className={cx('arrow')}>→</span>
                    <span className={cx('val-cur')}>{pct1(cv)}%</span>
                    <Delta value={pv != null && cv != null ? (cv - pv) * 100 : null} unit="pp" />
                  </div>
                </div>
              )
            })}
            {(cur.accuracyFlags && (Object.keys(cur.accuracyFlags).length > 0 || Object.keys(prev.accuracyFlags).length > 0)) && (
              <p className={cx('note')}>
                정확도 플래그: {Object.keys(prev.accuracyFlags).length === 0 ? '없음' : Object.entries(prev.accuracyFlags).map(([f, n]) => `${f} ${n}건`).join(' · ')}
                {' → '}
                {Object.keys(cur.accuracyFlags).length === 0 ? '없음' : Object.entries(cur.accuracyFlags).map(([f, n]) => `${f} ${n}건`).join(' · ')}
              </p>
            )}
          </section>
        </div>

        {/* 감사 이슈 변화 — digest 의 LLM 리포트 diff(규칙 기반 다이제스트에는 없음) */}
        <section className={cx('panel')}>
          <div className={cx('p-hd')}>
            <span className={cx('p-t')}>감사 이슈 변화</span>
            <span className={cx('p-s')}>{prev.isoWeek} 리포트 → {cur.isoWeek} 리포트</span>
          </div>
          {digest?.geoAuditChanges ? (
            <div className={cx('audit-cols')}>
              <AuditList title="해소·개선" cls="improved" items={digest.geoAuditChanges.improved} />
              <AuditList title="악화·신규" cls="regressed" items={digest.geoAuditChanges.regressed} />
              <AuditList title="여전히 남음" cls="open" items={digest.geoAuditChanges.stillOpen} />
            </div>
          ) : (
            <p className={cx('p-sub')}>
              리포트가 자유 서술이라 이슈 변화는 LLM 다이제스트에서 요약됩니다 — OPENAI_API_KEY 와 함께 digest 를 생성하면 여기에 채워집니다.
            </p>
          )}
        </section>

        {/* 질의별 응답 전이 */}
        <section className={cx('panel')}>
          <div className={cx('p-hd')}>
            <span className={cx('p-t')}>AI 응답 변화 (질의 단위)</span>
            <span className={cx('p-s')}>무브랜드 · 언급률 = rep 평균</span>
          </div>
          {comparison ? (
            <>
              <div className={cx('chips')}>
                {(['lost', 'new', 'kept', 'none'] as const).map((s) => (
                  <span key={s} className={cx('chip', STATUS_META[s].cls)}>
                    {STATUS_META[s].label} <b>{comparison.counts[s]}</b>
                  </span>
                ))}
                {comparison.newEngines.length > 0 && (
                  <span className={cx('chip', 'info')}>
                    비교 제외(이번 회차 신규 엔진): {comparison.newEngines.map((e) => ENGINE_META[e].label).join(', ')}
                  </span>
                )}
              </div>
              {visibleChanges.length === 0 && <p className={cx('p-sub')}>언급 전이가 없습니다.</p>}
              {visibleChanges.map((c) => (
                <Link
                  className={cx('qrow')}
                  key={`${c.engine}|${c.paraphraseId}`}
                  href={`/${app}/calls/${cur.isoWeek}?engine=${c.engine}`}
                >
                  <span className={cx('badge', STATUS_META[c.status].cls)}>{STATUS_META[c.status].label}</span>
                  <span className={cx('q-engine')}>
                    <span className={cx('sw')} style={{ background: ENGINE_META[c.engine].color }} />
                    {ENGINE_META[c.engine].label}
                  </span>
                  <span className={cx('q-text')}>{c.query}</span>
                  <span className={cx('q-rates')}>
                    <span className={cx('val-prev')}>{pct1(c.prevRate)}%</span>
                    <span className={cx('arrow')}>→</span>
                    <span className={cx('val-cur')}>{pct1(c.curRate)}%</span>
                  </span>
                </Link>
              ))}
              {noneChanges.length > 0 && (
                <details className={cx('none-fold')}>
                  <summary>두 회차 모두 미언급 {noneChanges.length}건 — 노출 확보가 필요한 질의</summary>
                  {noneChanges.map((c) => (
                    <Link
                      className={cx('qrow', 'dim')}
                      key={`${c.engine}|${c.paraphraseId}`}
                      href={`/${app}/calls/${cur.isoWeek}?engine=${c.engine}`}
                    >
                      <span className={cx('badge', 'none')}>미언급</span>
                      <span className={cx('q-engine')}>
                        <span className={cx('sw')} style={{ background: ENGINE_META[c.engine].color }} />
                        {ENGINE_META[c.engine].label}
                      </span>
                      <span className={cx('q-text')}>{c.query}</span>
                    </Link>
                  ))}
                </details>
              )}
            </>
          ) : (
            <p className={cx('p-sub')}>per-call 스냅샷(visibility.json)이 없어 질의 단위 비교를 표시할 수 없습니다.</p>
          )}
        </section>

        {/* 팀별 액션 아이템 */}
        <div className={cx('grid2')}>
          <ActionPanel title="🛠 프로덕트 팀 액션" items={digest?.actions.product ?? null} />
          <ActionPanel title="📣 마케팅 팀 액션" items={digest?.actions.marketing ?? null} />
        </div>
        {digest && (
          <p className={cx('foot')}>
            액션 아이템: {digest.actions.source === 'llm' ? 'LLM 요약(주차 지표 + GEO 감사 리포트 기반)' : '규칙 기반(지표 신호)'} · 생성 {digest.capturedAt || '—'}
          </p>
        )}
      </div>
    </div>
  )
}

const Stat = ({ label, prev, cur, delta }: { label: string; prev: string; cur: string; delta: React.ReactNode }) => (
  <div className={cx('stat')}>
    <div className={cx('stat-l')}>{label}</div>
    <div className={cx('stat-v')}>
      <span className={cx('val-prev')}>{prev}</span>
      <span className={cx('arrow')}>→</span>
      <span className={cx('val-cur', 'big')}>{cur}</span>
    </div>
    <div className={cx('stat-f')}>{delta}</div>
  </div>
)

const AuditList = ({ title, cls, items }: { title: string; cls: string; items: string[] }) => (
  <div className={cx('audit-col')}>
    <div className={cx('audit-h', cls)}>{title} <b>{items.length}</b></div>
    {items.length > 0 ? (
      <ul className={cx('audit-list')}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className={cx('audit-none')}>없음</p>
    )}
  </div>
)

const ActionPanel = ({ title, items }: { title: string; items: string[] | null }) => (
  <section className={cx('panel')}>
    <div className={cx('p-hd')}>
      <span className={cx('p-t')}>{title}</span>
    </div>
    {items && items.length > 0 ? (
      <ul className={cx('actions')}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className={cx('p-sub')}>이 주차의 다이제스트(digest.json)가 아직 없습니다 — 다음 주간 측정부터 생성됩니다.</p>
    )}
  </section>
)
