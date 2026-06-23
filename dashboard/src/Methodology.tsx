import classnames from 'classnames/bind'
import type { ModelPricing } from '../../src/config/pricing'
import type { IntentPreset, MetricRole, ServiceConfig } from '../../src/config/types'
import { DashboardHeader } from './DashboardHeader'
import styles from './Methodology.module.scss'

const cx = classnames.bind(styles)

const ROLE_META: Record<MetricRole, { label: string; desc: string }> = {
  visibility: {
    label: 'visibility',
    desc: '무브랜드 질의. 안 시켜도 코드잇이 떠야 진짜 가시성. 헤드라인 인용률·SoV는 이것만 집계.',
  },
  reputation: {
    label: 'reputation',
    desc: '브랜드를 준 질의. 평판·감성·포지셔닝 측정. 언급은 자명하므로 가시성 집계에서 제외.',
  },
  accuracy: {
    label: 'accuracy',
    desc: '브랜드 팩트 질의. groundTruth와 대조해 AI 오정보를 탐지.',
  },
}
const ROLE_ORDER: MetricRole[] = ['visibility', 'reputation', 'accuracy']

// 측정 엔진 로스터(engines/* 어댑터 미러 + 소비자 기본 모델). 활성 여부는 ACTIVE_ENGINES로 제어.
const ENGINES = [
  { label: 'ChatGPT', surface: '챗봇 · OpenAI', model: 'gpt-5.5', active: true },
  { label: 'AI Overview', surface: 'SERP · SerpApi(google)', model: '검색 표면', active: true },
  { label: 'Naver AI', surface: 'SERP · SerpApi(naver)', model: '검색 표면', active: true },
  { label: 'Gemini', surface: '챗봇 · Google', model: 'gemini-3.5-flash', active: false },
  { label: 'Claude', surface: '챗봇 · Anthropic', model: 'claude-sonnet-4-6', active: false },
  { label: 'Perplexity', surface: '챗봇 · Perplexity', model: 'sonar', active: false },
]

const PRINCIPLES = [
  '헤드라인 인용률·SoV는 무브랜드(visibility) 질의만 집계 — 브랜드를 직접 물은 답변은 제외.',
  'SoV = 코드잇 언급 ÷ (코드잇 + 경쟁사 언급). 무브랜드 풀의 per-call 평균.',
  'SERP(검색) 표면은 키워드로, 챗봇은 문장으로 질의 — 실제 사용자 행동에 맞춤.',
  '의도마다 패러프레이즈로 표현을 분산하고 rep로 반복해 LLM 변동을 흡수.',
  '단일 주 델타는 노이즈 → 추세(4주)로 판단. 챗봇=proxy(API), AI Overview·Naver=실 렌더(고충실도).',
]

type Props = {
  service: ServiceConfig
  pricing: [string, ModelPricing][]
  serpCredit: number
  paraphraseCount: number
  visibilityCount: number
  available?: string[]
}

export const Methodology = ({ service, pricing, serpCredit, paraphraseCount, visibilityCount, available }: Props) => {
  const byRole = ROLE_ORDER.map((role) => ({
    role,
    intents: service.intents.filter((i) => i.metricRole === role),
  })).filter((g) => g.intents.length > 0)

  return (
    <div className={cx('page')}>
      <DashboardHeader
        app={service.app}
        available={available}
        kicker="측정 설정 · methodology"
        title={`${service.displayName} — 측정 기준`}
        measured={`프롬프트 v${service.promptsVersion} · 감사소스 v${service.brandSourcesVersion}`}
        sub={`${service.locale} · ${service.userCountry}`}
      />

      <div className={cx('wrap')}>
        {/* 방법론 정의 */}
        <Section title="방법론" sub="무엇을 어떻게 재는가">
          <div className={cx('defs')}>
            {ROLE_ORDER.map((r) => (
              <div className={cx('def')} key={r}>
                <div className={cx('def-t')}>{ROLE_META[r].label}</div>
                <div className={cx('def-d')}>{ROLE_META[r].desc}</div>
              </div>
            ))}
          </div>
          <ul className={cx('rules')}>
            {PRINCIPLES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Section>

        {/* 질의셋 */}
        <Section
          title="질의셋"
          sub={`의도 ${service.intents.length} · 전개 후 ~${paraphraseCount}개 · visibility ${visibilityCount}`}
        >
          {byRole.map((g) => (
            <div className={cx('role-group')} key={g.role}>
              <div className={cx('role-h')}>
                <span className={cx('role-name', g.role)}>{ROLE_META[g.role].label}</span>
                <span className={cx('role-cnt')}>{g.intents.length}개 의도</span>
              </div>
              {g.intents.map((it) => (
                <IntentCard key={it.id} intent={it} />
              ))}
            </div>
          ))}
        </Section>

        {/* 엔진 & 모델 & 비용 */}
        <Section title="엔진 · 모델 · 비용단가" sub="측정 표면과 콜당 단가">
          <div className={cx('tbl-wrap')}>
            <table className={cx('tbl')}>
              <thead>
                <tr>
                  <th>엔진</th>
                  <th>표면</th>
                  <th>기본 모델</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {ENGINES.map((e) => (
                  <tr key={e.label}>
                    <td className={cx('strong')}>{e.label}</td>
                    <td>{e.surface}</td>
                    <td className={cx('mono')}>{e.model}</td>
                    <td>
                      <span className={cx('state', { on: e.active })}>{e.active ? '활성' : '예정'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={cx('tbl-wrap')}>
            <table className={cx('tbl')}>
              <thead>
                <tr>
                  <th>모델</th>
                  <th>입력 / 1M</th>
                  <th>출력 / 1M</th>
                  <th>웹검색/콜</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map(([model, p]) => (
                  <tr key={model}>
                    <td className={cx('mono', 'strong')}>{model}</td>
                    <td className={cx('mono')}>${p.inputPerMTok}</td>
                    <td className={cx('mono')}>${p.outputPerMTok}</td>
                    <td className={cx('mono')}>{p.perWebSearch != null ? `$${p.perWebSearch}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={cx('note')}>
            SerpApi 크레딧 단가 ${serpCredit} (요금제 포함분). 감성·정확도 판정기(LLM judge)는 gpt-4.1-mini.
          </p>
        </Section>

        {/* 브랜드 & 경쟁사 & 직무 */}
        <Section title="브랜드 · 경쟁사 · 직무" sub="언급·SoV 매칭 대상">
          <div className={cx('kv')}>
            <span className={cx('k')}>브랜드</span>
            <span className={cx('v')}>
              <b>{service.brand.canonical}</b>
              <span className={cx('chips')}>
                {service.brand.aliases.map((a) => (
                  <span className={cx('chip')} key={a}>
                    {a}
                  </span>
                ))}
              </span>
            </span>
          </div>
          <div className={cx('kv')}>
            <span className={cx('k')}>도메인</span>
            <span className={cx('v')}>
              <span className={cx('chips')}>
                {service.brand.domains.map((d) => (
                  <span className={cx('chip', 'mono')} key={d}>
                    {d}
                  </span>
                ))}
              </span>
            </span>
          </div>

          <div className={cx('tbl-wrap')}>
            <table className={cx('tbl')}>
              <thead>
                <tr>
                  <th>경쟁사</th>
                  <th>표기 변형(alias)</th>
                  <th>엄격매칭</th>
                  <th>vs 전개</th>
                </tr>
              </thead>
              <tbody>
                {service.competitors.map((c) => {
                  const priority = service.priorityCompetitors.includes(c.canonical)
                  return (
                    <tr key={c.canonical}>
                      <td className={cx('strong')}>{c.canonical}</td>
                      <td className={cx('mono', 'soft')}>{c.aliases.join(', ')}</td>
                      <td>{c.strictContext ? '✓' : '—'}</td>
                      <td>{priority ? '우선' : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className={cx('kv')}>
            <span className={cx('k')}>직무 축 {'{role}'}</span>
            <span className={cx('v')}>
              <span className={cx('chips')}>
                {service.jobRoles.map((r) => (
                  <span className={cx('chip')} key={r.token}>
                    {r.token}
                  </span>
                ))}
              </span>
            </span>
          </div>
        </Section>

        {/* GEO 감사 기준 */}
        <Section title="GEO 감사 기준" sub="grp C · 재현성 고정 입력">
          <div className={cx('cols')}>
            <div>
              <div className={cx('col-h')}>감사 페이지 (auditUrls)</div>
              <ul className={cx('url-list')}>
                {service.auditUrls.map((u) => (
                  <li key={u}>{u.replace(/^https?:\/\//, '')}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className={cx('col-h')}>엔티티 그라운딩 소스 (v{service.brandSourcesVersion})</div>
              <ul className={cx('url-list')}>
                {service.brandSources.map((s) => (
                  <li key={s}>{s.replace(/^https?:\/\//, '')}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className={cx('note')}>
            재현성 설계: 동일 감사를 3회 실행 → 평균 + 변동폭으로 LLM 채점 변동 흡수 · 입력 고정(위 페이지/소스만,
            외 발견은 디스커버리·점수 제외) · KR 현지화 · 모델 claude-opus-4-8 고정.
          </p>
        </Section>

        <p className={cx('foot')}>
          이 페이지는 측정 엔진의 실제 설정(ServiceConfig · pricing)을 그대로 읽어 렌더합니다 — 코드가 곧 기준.
        </p>
      </div>
    </div>
  )
}

// ── 서브 컴포넌트 ──
const Section = ({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) => (
  <section className={cx('section')}>
    <div className={cx('sec-h')}>
      <span className={cx('sec-t')}>{title}</span>
      <span className={cx('sec-s')}>{sub}</span>
    </div>
    {children}
  </section>
)

const IntentCard = ({ intent }: { intent: IntentPreset }) => (
  <div className={cx('intent')}>
    <div className={cx('intent-h')}>
      <span className={cx('intent-id')}>{intent.id}</span>
      <span className={cx('badge')}>{intent.group}</span>
      {intent.expand?.roles && <span className={cx('badge', 'exp')}>×직무</span>}
      {intent.expand?.competitors && <span className={cx('badge', 'exp')}>×경쟁사</span>}
      <span className={cx('reps')}>rep {intent.reps ?? 2}</span>
    </div>
    <ol className={cx('plist')}>
      {intent.paraphrases.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ol>
    {intent.serpQuery && (
      <div className={cx('serp')}>
        <span className={cx('serp-l')}>SERP 키워드</span>
        <span className={cx('serp-q')}>{intent.serpQuery}</span>
      </div>
    )}
    {intent.groundTruth && (
      <div className={cx('serp')}>
        <span className={cx('serp-l')}>groundTruth</span>
        <span className={cx('serp-q', 'mono')}>{JSON.stringify(intent.groundTruth)}</span>
      </div>
    )}
  </div>
)
