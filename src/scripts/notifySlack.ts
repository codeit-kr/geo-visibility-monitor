// 주간 측정 완료 후 서비스별 Slack 채널 알림. weekly-geo-audit 의 aggregate 잡 끝(visibility+GEO 반영 후)에서 호출.
//   인증: SLACK_BOT_TOKEN (Slack 봇, chat:write 스코프). 채널: ServiceConfig.slackChannelId (봇을 채널에 초대해둘 것).
//   알림 실패는 파이프라인을 깨지 않게 비치명적으로 처리(로그만).
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { RollupIndex, WeekSummary } from '../../types/snapshot'
import { getActiveServices } from '../config/services'
import { SNAPSHOTS_DIR } from '../store/writeSnapshot'

const SLACK_API = 'https://slack.com/api/chat.postMessage'
const DASHBOARD_URL = process.env.DASHBOARD_URL ?? 'https://codeit-geo-visibility-monitor.vercel.app'

const pct = (v: number | null | undefined) => (v == null ? '—' : (v * 100).toFixed(1))

const buildBlocks = (app: string, displayName: string, w: WeekSummary) => {
  const geo =
    w.geoScore == null
      ? '측정 중'
      : `${w.geoScore}${w.geoScoreRange ? ` (3회 ${w.geoScoreRange[0]}–${w.geoScoreRange[1]})` : ''}`
  const cost = w.costUsd == null ? '—' : `$${w.costUsd.toFixed(2)}`
  return [
    { type: 'section', text: { type: 'mrkdwn', text: `:bar_chart: *${displayName}* — AI 가시성 주간 \`${w.isoWeek}\`` } },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*인용률*\n${pct(w.mentionRate)}%` },
        { type: 'mrkdwn', text: `*SoV*\n${pct(w.sov)}%` },
        { type: 'mrkdwn', text: `*GEO Score*\n${geo}` },
        { type: 'mrkdwn', text: `*표본 · 비용*\n${w.sampleSize}콜 · ${cost}` },
      ],
    },
    {
      type: 'actions',
      elements: [
        { type: 'button', text: { type: 'plain_text', text: '대시보드 보기' }, url: `${DASHBOARD_URL}/${app}/${w.isoWeek}` },
      ],
    },
  ]
}

const postSlack = async (token: string, channel: string, text: string, blocks: unknown[]) => {
  const res = await fetch(SLACK_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8', authorization: `Bearer ${token}` },
    body: JSON.stringify({ channel, text, blocks }),
  })
  const json = (await res.json()) as { ok: boolean; error?: string }
  if (!json.ok) throw new Error(`slack API: ${json.error}`)
}

const main = async () => {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) {
    console.warn('[notify] SLACK_BOT_TOKEN 미설정 — 알림 스킵')
    return
  }
  // 테스트용: 설정 시 모든 서비스 알림을 이 채널로 보냄(코드의 slackChannelId 무시).
  const override = process.env.SLACK_CHANNEL_OVERRIDE?.trim()

  for (const svc of getActiveServices()) {
    const channel = override || svc.slackChannelId
    if (!channel) {
      console.warn(`[notify] ${svc.app}: slackChannelId 없음 — 스킵`)
      continue
    }
    let rollup: RollupIndex
    try {
      rollup = JSON.parse(await readFile(join(SNAPSHOTS_DIR, svc.app, 'index.json'), 'utf8')) as RollupIndex
    } catch {
      console.warn(`[notify] ${svc.app}: index.json 없음 — 스킵`)
      continue
    }
    const w = rollup.weeks[rollup.weeks.length - 1]
    if (!w) {
      console.warn(`[notify] ${svc.app}: 주차 데이터 없음 — 스킵`)
      continue
    }
    try {
      await postSlack(token, channel, `${svc.displayName} — AI 가시성 주간 (${w.isoWeek})`, buildBlocks(svc.app, svc.displayName, w))
      console.info(`[notify] ${svc.app} → ${channel}${override ? ' (override)' : ''} ✓ (${w.isoWeek})`)
    } catch (error) {
      console.error(`[notify] ${svc.app} 전송 실패:`, error instanceof Error ? error.message : error)
    }
  }
}

main().catch((error) => {
  // 알림 실패가 데이터 파이프라인을 깨지 않게 — 로그만 남기고 정상 종료.
  console.error('[notify] 예기치 못한 오류:', error)
})
