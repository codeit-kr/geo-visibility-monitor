import { describe, expect, it } from 'vitest'
import { selectAuditUrls } from '../src/util/resolveAuditUrls'
import type { AuditUrlSource } from '../src/config/types'

const BASE = 'https://www.example.kr'

describe('selectAuditUrls', () => {
  it('exclude — 정확 일치는 그 경로만, /* 는 하위 전체를 제외한다', () => {
    const source: AuditUrlSource = { sitemaps: [], exclude: ['/teams', '/teams/blog/*', '/signin'] }
    const urls = [
      `${BASE}/teams`, // 정확 일치 → 제외
      `${BASE}/teams/cases`, // 하위지만 /teams 는 정확 일치 규칙 → 포함
      `${BASE}/teams/blog`, // /* 규칙의 루트 → 제외
      `${BASE}/teams/blog/post-1`, // /* 하위 → 제외
      `${BASE}/teams-admin`, // 세그먼트 경계 밖 → 포함
      `${BASE}/signin`,
    ]
    expect(selectAuditUrls([], urls, source)).toEqual([`${BASE}/teams-admin`, `${BASE}/teams/cases`])
  })

  it('sections — pick N 은 URL 오름차순 앞에서 결정적으로 뽑고, 미매칭 섹션은 전체 포함한다', () => {
    const source: AuditUrlSource = {
      sitemaps: [],
      sections: [{ prefix: '/tutorials', pick: 1 }, { prefix: '/paths', pick: 'all' }],
    }
    const urls = [
      `${BASE}/tutorials/9/z`,
      `${BASE}/tutorials/0/a`,
      `${BASE}/paths/b`,
      `${BASE}/paths/a`,
      `${BASE}/reviews`, // 섹션 미매칭 → 전체 포함
    ]
    expect(selectAuditUrls([], urls, source)).toEqual([
      `${BASE}/paths/a`,
      `${BASE}/paths/b`,
      `${BASE}/reviews`,
      `${BASE}/tutorials/0/a`,
    ])
  })

  it('고정 auditUrls 는 원래 순서로 앞에 오고, 동적분과 후행 슬래시 무시로 dedupe 된다', () => {
    const source: AuditUrlSource = { sitemaps: [] }
    const fixed = [`${BASE}/llms.txt`, `${BASE}/`]
    const urls = [BASE, `${BASE}/reviews`] // BASE == `${BASE}/` (후행 슬래시 무시)
    expect(selectAuditUrls(fixed, urls, source)).toEqual([
      `${BASE}/llms.txt`,
      `${BASE}/`,
      `${BASE}/reviews`,
    ])
  })

  it('겹치는 섹션은 가장 긴 prefix 가 이긴다', () => {
    const source: AuditUrlSource = {
      sitemaps: [],
      sections: [
        { prefix: '/docs', pick: 'all' },
        { prefix: '/docs/legacy', pick: 1 },
      ],
    }
    const urls = [`${BASE}/docs/a`, `${BASE}/docs/legacy/b`, `${BASE}/docs/legacy/a`]
    expect(selectAuditUrls([], urls, source)).toEqual([`${BASE}/docs/a`, `${BASE}/docs/legacy/a`])
  })

  it('exclude 는 섹션 pick 이전에 적용된다(제외분이 대표 자리를 차지하지 않음)', () => {
    const source: AuditUrlSource = {
      sitemaps: [],
      exclude: ['/articles/0-draft'],
      sections: [{ prefix: '/articles', pick: 1 }],
    }
    const urls = [`${BASE}/articles/0-draft`, `${BASE}/articles/1-live`]
    expect(selectAuditUrls([], urls, source)).toEqual([`${BASE}/articles/1-live`])
  })
})
