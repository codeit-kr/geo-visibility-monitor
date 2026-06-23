'use client'

import classnames from 'classnames/bind'
import type { Engine, RollupIndex, ServicesManifest } from '../../types/snapshot'
import { isoWeekRange } from './isoWeek'
import { DashboardHeader } from './DashboardHeader'
import styles from './AiVisibilityDashboard.module.scss'

const cx = classnames.bind(styles)

// 엔진 표시명·색(차트 전용 카테고리)
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
// 미등록 경쟁사 폴백 팔레트(순환)
const COMP_COLORS = ['#119da4', '#7c5cff', '#e0902b', '#c23a52', '#2aa745', '#5b6675', '#b05fd1', '#97a0b0']
// SoV 차트 — 각 기업 대표색. 설정상 경쟁사 전체를 구분색으로 매핑(색 충돌 방지).
const BRAND_COLOR = '#6c4df6' // 코드잇 스프린트 (보라)
const COMP_COLOR: Record<string, string> = {
  내일배움캠프: '#e23744', // 빨강
  멋쟁이사자처럼: '#ff7710', // 주황
  '프로그래머스 데브코스': '#1b3a7a', // 남색
  프로그래머스: '#1b3a7a',
  패스트캠퍼스: '#119da4', // teal
  항해99: '#7c5cff', // violet
  제로베이스: '#e0902b', // amber
  '커널 아카데미': '#5b6675', // slate
  엘리스: '#2aa745', // green
  구름: '#2d43e0', // blue
  코드캠프: '#c23a52', // rose
}
const compColor = (name: string, i: number) => COMP_COLOR[name] ?? COMP_COLORS[i % COMP_COLORS.length]

// 주차 라벨 뒤 날짜범위 괄호. 파싱 실패 시 빈 문자열.
const rangeSuffix = (isoWeek: string) => {
  const r = isoWeekRange(isoWeek)
  return r ? ` (${r})` : ''
}

const pct1 = (v: number | null | undefined) => (v == null ? '—' : (v * 100).toFixed(1))
const signed = (v: number | null, scale = 100, unit = 'pp', digits = 1) =>
  v == null ? null : `${v >= 0 ? '▲' : '▼'} ${Math.abs(v * scale).toFixed(digits)}${unit}`

type Props = { rollup: RollupIndex; services: ServicesManifest; usingFixture?: boolean; selectedWeek: string }

export const AiVisibilityDashboard = ({ rollup, services, usingFixture, selectedWeek }: Props) => {
  const weeks = rollup.weeks
  // 선택 주차는 URL 슬러그(/[week])로 결정 — 매칭 실패 시 최신.
  const selIdx = weeks.length
    ? (() => {
        const i = weeks.findIndex((w) => w.isoWeek === selectedWeek)
        return i >= 0 ? i : weeks.length - 1
      })()
    : -1
  const latest = selIdx >= 0 ? weeks[selIdx] : undefined

  if (!latest) {
    return (
      <div className={cx('dashboard')}>
        <Header rollup={rollup} services={services} latestWeek={null} />
        <div className={cx('empty')}>
          <div className={cx('empty-mark')}>◵</div>
          <div className={cx('empty-t')}>아직 측정 데이터가 없습니다</div>
          <div className={cx('empty-d')}>엔진의 첫 주간 스냅샷이 쌓이면 여기에 추이가 나타납니다.</div>
        </div>
      </div>
    )
  }

  const baseline = weeks[Math.max(0, selIdx - 4)] // 선택 주차 기준 ~4주 전
  const dMention =
    latest.mentionRate != null && baseline.mentionRate != null ? latest.mentionRate - baseline.mentionRate : null
  const dSov = latest.sov != null && baseline.sov != null ? latest.sov - baseline.sov : null
  const dGeo =
    latest.geoScore != null && baseline.geoScore != null ? latest.geoScore - baseline.geoScore : null
  // geo-audit 3회 측정 변동폭(있으면 band 로 표기 — 측정 불확실성 노출)
  const geoFoot = latest.geoScoreRange
    ? `선행지표 · 3회 ${latest.geoScoreRange[0]}–${latest.geoScoreRange[1]}`
    : '선행지표 (geo-audit)'

  // 추이 라인(SVG) — 선택 주차 기준 최근 N주만(무한 누적 방지)
  const MAX_TREND_WEEKS = 8
  const trendWeeks = weeks.slice(Math.max(0, selIdx - (MAX_TREND_WEEKS - 1)), selIdx + 1)
  const n = trendWeeks.length
  const W = 640
  const H = 150
  const point = (i: number, v: number | null) => `${(i / Math.max(1, n - 1)) * W},${(H - (v ?? 0) * H).toFixed(1)}`
  const mentionLine = trendWeeks.map((w, i) => point(i, w.mentionRate)).join(' ')
  const sovLine = trendWeeks.map((w, i) => point(i, w.sov)).join(' ')

  const measured = ENGINE_ORDER.filter((e) => latest.byEngine[e] != null)
  const planned = ENGINE_ORDER.filter((e) => latest.byEngine[e] == null)

  const compEntries = Object.entries(latest.competitorSov).sort((a, b) => b[1] - a[1])
  const compSum = compEntries.reduce((s, [, v]) => s + v, 0)
  const brandShare = Math.max(0, 1 - compSum)

  const flags = Object.entries(latest.accuracyFlags).sort((a, b) => b[1] - a[1])
  const { positive, neutral, negative } = latest.sentiment
  const sTotal = positive + neutral + negative || 1

  return (
    <div className={cx('dashboard')}>
      <Header
        rollup={rollup}
        services={services}
        latestWeek={latest.isoWeek}
        weekNav={{ weeks: weeks.map((w) => w.isoWeek), current: latest.isoWeek, hrefBase: '' }}
      />

      {usingFixture && <div className={cx('fixture-note')}>● 샘플(fixture) 데이터 — 스냅샷 없음</div>}

      {/* KPI */}
      <div className={cx('kpis')}>
        <Kpi label="Mention Rate" value={pct1(latest.mentionRate)} unit="%" meter={latest.mentionRate}
          foot="무브랜드 질의 풀" delta={signed(dMention)} />
        <Kpi label="Share of Voice" value={pct1(latest.sov)} unit="%" meter={latest.sov}
          foot="코드잇 / (코드잇+경쟁사)" delta={signed(dSov)} />
        <Kpi label="Sample" value={String(latest.sampleSize)} meter={Math.min(1, latest.sampleSize / 880)} muted
          foot={`${measured.length}엔진 · 콜`} delta={latest.costUsd == null ? null : `$${latest.costUsd.toFixed(2)}`} deltaNeutral />
        <Kpi label="GEO Score" value={latest.geoScore == null ? '—' : String(latest.geoScore)} meter={latest.geoScore == null ? 0 : latest.geoScore / 100}
          good foot={geoFoot} delta={dGeo == null ? null : `${dGeo >= 0 ? '▲' : '▼'} ${Math.abs(dGeo)}`} />
      </div>

      {/* 추이 + 엔진별 */}
      <div className={cx('grid2')}>
        <section className={cx('panel')}>
          <PanelHead title="인용률 · SoV 추이" sub={`최근 ${n}주`} />
          <p className={cx('p-sub')}>무브랜드 인용률·SoV의 주차별 추이 — 단일 주 변동보다 방향을 봅니다.</p>
          <div className={cx('chart-area')}>
            <div className={cx('y-axis')}>
              {[100, 75, 50, 25, 0].map((v) => (
                <span key={v}>{v}%</span>
              ))}
            </div>
            <div className={cx('plot-col')}>
              <div className={cx('plot')}>
                <svg className={cx('chart')} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="인용률·SoV 추이">
                  {[0, 0.25, 0.5, 0.75, 1].map((g) => (
                    <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke="#e7ebf2" strokeWidth="1" />
                  ))}
                  <polyline fill="none" stroke="#2d43e0" strokeWidth="2.5" strokeLinejoin="round" points={mentionLine} />
                  <polyline fill="none" stroke="#119da4" strokeWidth="2.5" strokeLinejoin="round" points={sovLine} />
                </svg>
                {/* 데이터 포인트(HTML 오버레이 — stretched SVG 왜곡 회피) + hover 정확값 */}
                {(['mention', 'sov'] as const).map((series) =>
                  trendWeeks.map((w, i) => {
                    const v = series === 'mention' ? w.mentionRate : w.sov
                    if (v == null) return null
                    const left = n === 1 ? 50 : (i / (n - 1)) * 100
                    return (
                      <span
                        key={`${series}-${w.isoWeek}`}
                        className={cx('pt', series)}
                        style={{ left: `${left}%`, top: `${(1 - v) * 100}%` }}
                      >
                        <span className={cx('pt-tip')}>
                          {w.isoWeek.slice(5)} · {(v * 100).toFixed(1)}%
                        </span>
                      </span>
                    )
                  }),
                )}
              </div>
              <div className={cx('x-axis')}>
                {trendWeeks.map((w, i) => {
                  const step = Math.max(1, Math.ceil(n / 8))
                  if (!(i % step === 0 || i === n - 1)) return null
                  // 단일 포인트는 점과 동일하게 중앙 정렬
                  const left = n === 1 ? 50 : (i / (n - 1)) * 100
                  const transform =
                    n === 1
                      ? 'translateX(-50%)'
                      : i === 0
                        ? 'none'
                        : i === n - 1
                          ? 'translateX(-100%)'
                          : 'translateX(-50%)'
                  return (
                    <span key={w.isoWeek} style={{ left: `${left}%`, transform }}>
                      {w.isoWeek.slice(5)}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
          <div className={cx('legend')}>
            <span><i style={{ background: '#2d43e0' }} /> Mention Rate</span>
            <span><i style={{ background: '#119da4' }} /> Share of Voice</span>
          </div>
        </section>

        <section className={cx('panel')}>
          <PanelHead title="엔진별 언급률" sub="visibility" />
          <p className={cx('p-sub')}>활성 {measured.length}종 측정 · 나머지 확장 예정.</p>
          {measured.map((e) => {
            const v = latest.byEngine[e] ?? 0
            return (
              <div className={cx('erow')} key={e}>
                <div className={cx('ename')}><span className={cx('sw')} style={{ background: ENGINE_META[e].color }} />{ENGINE_META[e].label}</div>
                <div className={cx('ebar')}><i style={{ width: `${(v ?? 0) * 100}%`, background: ENGINE_META[e].color }} /></div>
                <div className={cx('eval')}>{pct1(v)}%</div>
              </div>
            )
          })}
          {planned.map((e) => (
            <div className={cx('erow', 'off')} key={e}>
              <div className={cx('ename')}><span className={cx('sw')} style={{ background: ENGINE_META[e].color }} />{ENGINE_META[e].label}<span className={cx('etag')}>예정</span></div>
              <div className={cx('ebar')} />
              <div className={cx('eval')}>—</div>
            </div>
          ))}
        </section>
      </div>

      {/* SoV + 정확도 */}
      <div className={cx('grid2')}>
        <section className={cx('panel')}>
          <PanelHead title="경쟁 점유 (SoV)" sub="무브랜드" />
          <p className={cx('p-sub')}>AI가 함께 호명한 비중.</p>
          <div className={cx('sov-bar')}>
            <i style={{ width: `${brandShare * 100}%`, background: BRAND_COLOR }}>{brandShare >= 0.1 ? `${Math.round(brandShare * 100)}%` : ''}</i>
            {compEntries.map(([name, v], i) => (
              <i key={name} style={{ width: `${v * 100}%`, background: compColor(name, i) }} />
            ))}
          </div>
          <div className={cx('sov-leg')}>
            <div className={cx('me')}><span className={cx('sw')} style={{ background: BRAND_COLOR }} />{rollup.displayName}<b>{Math.round(brandShare * 100)}%</b></div>
            {compEntries.map(([name, v], i) => (
              <div key={name}><span className={cx('sw')} style={{ background: compColor(name, i) }} />{name}<b>{Math.round(v * 100)}%</b></div>
            ))}
          </div>
        </section>

        <section className={cx('panel')}>
          <PanelHead title="정확도 · 감성" sub="fact · 전 행" />
          <p className={cx('p-sub')}>AI가 사실을 틀리게 말한 건 → 콘텐츠 수정 트리거.</p>
          {flags.length === 0 && <div className={cx('alert')}><div className={cx('ic', 'ok')}>✓</div><div className={cx('a-t')}>오정보 플래그 없음</div></div>}
          {flags.map(([flag, count]) => (
            <div className={cx('alert')} key={flag}>
              <div className={cx('ic')}>⚠</div>
              <div><div className={cx('a-t')}>{FLAG_LABEL[flag] ?? flag}</div><div className={cx('a-d')}>{flag}</div></div>
              <span className={cx('a-flag')}>{count}건</span>
            </div>
          ))}
          <div className={cx('senti')}>
            <span className={cx('senti-l')}>감성</span>
            <div className={cx('senti-bar')}>
              {positive + neutral + negative > 0 && (
                <>
                  <i style={{ width: `${(positive / sTotal) * 100}%`, background: '#138a63' }} />
                  <i style={{ width: `${(neutral / sTotal) * 100}%`, background: '#c9cfdb' }} />
                  <i style={{ width: `${(negative / sTotal) * 100}%`, background: '#c23a52' }} />
                </>
              )}
            </div>
            <span className={cx('senti-n')}>
              {positive + neutral + negative > 0 ? `긍 ${positive} · 중 ${neutral} · 부 ${negative}` : '언급 없음'}
            </span>
          </div>
        </section>
      </div>

      <p className={cx('foot')}>
        무브랜드만 헤드라인 집계 · 단일 주 델타는 노이즈 → 4주 추이로 판단. 챗봇=proxy(API), AI Overview·Naver=실 렌더(고충실도).
      </p>
    </div>
  )
}

// ── 서브 컴포넌트 ──
type KpiProps = {
  label: string
  value: string
  unit?: string
  meter: number | null
  foot: string
  delta: string | null
  muted?: boolean
  good?: boolean
  deltaNeutral?: boolean
}
const Kpi = ({ label, value, unit, meter, foot, delta, muted, good, deltaNeutral }: KpiProps) => {
  const tone = good ? 'good' : muted ? 'muted' : 'accent'
  const up = delta?.startsWith('▲')
  return (
    <div className={cx('kpi')}>
      <div className={cx('kpi-l')}><span className={cx('dot', tone)} />{label}</div>
      <div className={cx('kpi-v')}>{value}{unit && <span className={cx('u')}>{unit}</span>}</div>
      <div className={cx('meter')}><i className={cx(tone)} style={{ width: `${Math.round((meter ?? 0) * 100)}%` }} /></div>
      <div className={cx('kpi-f')}>
        <span>{foot}</span>
        {delta && <span className={cx('delta', { up: up && !deltaNeutral, down: !up && !deltaNeutral })}>{delta}</span>}
      </div>
    </div>
  )
}

const PanelHead = ({ title, sub }: { title: string; sub: string }) => (
  <div className={cx('p-hd')}><span className={cx('p-t')}>{title}</span><span className={cx('p-s')}>{sub}</span></div>
)

const Header = ({
  rollup,
  services,
  latestWeek,
  weekNav,
}: {
  rollup: RollupIndex
  services: ServicesManifest
  latestWeek: string | null
  weekNav?: { weeks: string[]; current: string; onSelect?: (week: string) => void; hrefBase?: string }
}) => (
  <DashboardHeader
    app={rollup.app}
    available={services.services.map((s) => s.app)}
    kicker="GEO · AI Visibility Monitor"
    title={`${rollup.displayName} — AI 검색 인용 현황`}
    dot
    measured={latestWeek ? `측정 ${latestWeek}${rangeSuffix(latestWeek)}` : '측정 전'}
    weekNav={weekNav}
  />
)
