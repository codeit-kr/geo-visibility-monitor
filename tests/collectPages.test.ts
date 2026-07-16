import { describe, expect, it } from 'vitest'
import { parsePageMeta } from '../src/jobs/collectPages'

const HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<title> 풀스택 부트캠프 | 코드잇 스프린트 </title>
<meta name="description" content="압도적인 결과로 증명하는 &quot;풀스택&quot; 부트캠프">
<meta content="풀스택 부트캠프" property="og:title">
<meta property="og:image" content='https://example.com/og.png'>
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="noindex, nofollow">
<link href="https://sprint.codeit.kr/track/fullstack" rel="canonical">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Course","name":"풀스택"},{"@type":["WebSite","Thing"]}]}</script>
<script type="application/ld+json">{broken</script>
</head>
<body>
<h1>취업에 강한 <b>웹 개발</b> 부트캠프</h1>
<h1>취업에 강한 웹 개발 부트캠프</h1>
</body>
</html>`

describe('parsePageMeta', () => {
  const page = parsePageMeta('https://sprint.codeit.kr/track/fullstack', 200, 'text/html; charset=utf-8', HTML)

  it('head 신호를 속성 순서·따옴표 종류와 무관하게 추출한다', () => {
    expect(page.kind).toBe('html')
    expect(page.path).toBe('/track/fullstack')
    expect(page.title).toBe('풀스택 부트캠프 | 코드잇 스프린트')
    expect(page.description).toBe('압도적인 결과로 증명하는 "풀스택" 부트캠프')
    expect(page.canonical).toBe('https://sprint.codeit.kr/track/fullstack')
    expect(page.robots).toBe('noindex, nofollow')
    expect(page.htmlLang).toBe('ko')
    expect(page.og).toEqual({ 'og:title': '풀스택 부트캠프', 'og:image': 'https://example.com/og.png' })
    expect(page.twitter).toEqual({ 'twitter:card': 'summary_large_image' })
  })

  it('h1 은 태그 제거 텍스트를 문서 순서로 모은다', () => {
    expect(page.h1).toEqual(['취업에 강한 웹 개발 부트캠프', '취업에 강한 웹 개발 부트캠프'])
  })

  it('JSON-LD 는 블록 단위로 @graph·배열 @type 을 수집하고 파싱 실패를 표시한다', () => {
    expect(page.jsonLd).toHaveLength(2)
    expect(page.jsonLd[0]).toMatchObject({ valid: true, types: ['Course', 'Thing', 'WebSite'] })
    expect(page.jsonLd[1]).toMatchObject({ valid: false, types: [] })
    expect(page.jsonLd[1].raw).toBe('{broken')
  })

  it('비HTML(llms.txt 등)은 kind:text 로 본문 해시만 남긴다', () => {
    const txt = parsePageMeta('https://sprint.codeit.kr/llms.txt', 200, 'text/plain', '# 코드잇 스프린트\n')
    expect(txt.kind).toBe('text')
    expect(txt.title).toBeNull()
    expect(txt.contentHash).toHaveLength(16)
    expect(txt.contentHash).not.toBe(page.contentHash)
  })

  it('fetch 실패 행(status 0)도 계약을 지킨다', () => {
    const failed = parsePageMeta('https://sprint.codeit.kr/career', 0, '', '')
    expect(failed).toMatchObject({ status: 0, kind: 'text', path: '/career', h1: [], jsonLd: [] })
  })
})
