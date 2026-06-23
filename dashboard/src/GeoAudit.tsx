import classnames from 'classnames/bind'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { App, GeoScoreSnapshot } from '../../types/snapshot'
import { DashboardHeader } from './DashboardHeader'
import { measureRange } from './isoWeek'
import styles from './GeoAudit.module.scss'

const cx = classnames.bind(styles)

const CATS: { key: keyof GeoScoreSnapshot; label: string; desc: string }[] = [
  { key: 'citability', label: '인용 가능성', desc: 'AI가 인용하기 쉬운 구조·명확성' },
  { key: 'brand', label: '브랜드', desc: '엔티티 그라운딩·언급' },
  { key: 'eeat', label: 'E-E-A-T', desc: '경험·전문성·권위·신뢰' },
  { key: 'technical', label: '기술', desc: '크롤링·렌더·속도' },
  { key: 'schema', label: '스키마', desc: '구조화 데이터(JSON-LD)' },
  { key: 'platform', label: '플랫폼', desc: 'AI 표면 준비도' },
]

const tone = (v: number) => (v >= 80 ? 'good' : v >= 60 ? 'mid' : 'low')

type Props = {
  app: App
  displayName: string
  isoWeek: string | null
  score: GeoScoreSnapshot | null
  report: string | null
  weeks: string[] // 선택 가능한 전체 주차(헤더 주차 선택기)
}

export const GeoAudit = ({ app, displayName, isoWeek, score, report, weeks }: Props) => {
  const cats = score ? CATS.map((c) => ({ ...c, value: Number(score[c.key]) })) : []
  const weakest = cats.length ? cats.reduce((a, b) => (b.value < a.value ? b : a)) : null
  const range = score?.compositeRange

  return (
    <div className={cx('page')}>
      <DashboardHeader
        app={app}
        kicker="GEO 감사 · 선행지표"
        title={`${displayName} — GEO Audit`}
        measured={isoWeek ? `측정 ${isoWeek}${measureRange(isoWeek) ? ` (${measureRange(isoWeek)})` : ''}` : '측정 전'}
        weekNav={weeks.length && isoWeek ? { weeks, current: isoWeek, hrefBase: '/geo' } : undefined}
        sub={score ? `composite ${score.composite}${score.runs ? ` · ${score.runs}회 평균` : ''}` : undefined}
      />

      {!score ? (
        <div className={cx('empty')}>
          <div className={cx('empty-mark')}>◵</div>
          <div className={cx('empty-t')}>이 주차의 GEO 감사 결과가 없습니다</div>
          <div className={cx('empty-d')}>weekly-geo-audit 워크플로가 실행되면 점수와 리포트가 여기에 나타납니다.</div>
        </div>
      ) : (
        <div className={cx('wrap')}>
          {/* 점수 분해 */}
          <section className={cx('panel', 'score')}>
            <div className={cx('hero')}>
              <div className={cx('hero-l')}>composite</div>
              <div className={cx('hero-v', tone(score.composite))}>{score.composite}</div>
              <div className={cx('hero-foot')}>
                {range ? `3회 ${range[0]}–${range[1]}` : '선행지표 · /100'}
              </div>
            </div>
            <div className={cx('cats')}>
              {cats.map((c) => (
                <div className={cx('cat')} key={String(c.key)}>
                  <div className={cx('cat-h')}>
                    <span className={cx('cat-name')}>{c.label}</span>
                    <span className={cx('cat-val', tone(c.value))}>{c.value}</span>
                  </div>
                  <div className={cx('bar')}>
                    <i className={cx(tone(c.value))} style={{ width: `${c.value}%` }} />
                  </div>
                  <div className={cx('cat-desc')}>{c.desc}</div>
                </div>
              ))}
            </div>
            {weakest && (
              <p className={cx('callout')}>
                개선 우선순위: <b>{weakest.label}</b> ({weakest.value}) — 가장 낮은 축부터 콘텐츠·구조를 보강하세요.
              </p>
            )}
          </section>

          {/* 리포트 본문 */}
          <section className={cx('panel')}>
            <div className={cx('p-hd')}>
              <span className={cx('p-t')}>감사 리포트</span>
              <span className={cx('p-s')}>카테고리별 근거 · 체크리스트</span>
            </div>
            {report ? (
              <div className={cx('report')}>
                <Markdown remarkPlugins={[remarkGfm]}>{report}</Markdown>
              </div>
            ) : (
              <p className={cx('p-sub')}>리포트 본문(geo-audit-report.md)이 없습니다.</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
