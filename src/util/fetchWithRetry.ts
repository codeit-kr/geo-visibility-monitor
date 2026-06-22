// 429/5xx transient 재시도(지수 백오프 + Retry-After). 모든 엔진 어댑터 공용.
// 영구 오류(4xx 대부분)는 즉시 반환 → 호출측의 !res.ok throw 로 처리.
const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))

export interface RetryOptions {
  retries?: number // 추가 시도 횟수(기본 3)
  baseDelayMs?: number // 백오프 기준(기본 500ms → 500/1000/2000…)
}

export const fetchWithRetry = async (
  url: string,
  init?: RequestInit,
  opts: RetryOptions = {},
): Promise<Response> => {
  const { retries = 3, baseDelayMs = 500 } = opts
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, init)
    // 성공이거나, 재시도 가치 없는 상태(429·5xx 외)면 그대로 반환.
    const transient = res.status === 429 || res.status >= 500
    if (res.ok || !transient || attempt >= retries) return res
    const retryAfter = Number(res.headers.get('retry-after'))
    const delay =
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : baseDelayMs * 2 ** attempt
    console.warn(`[fetchWithRetry] ${res.status} ${url} — ${delay}ms 후 재시도(${attempt + 1}/${retries})`)
    await sleep(delay)
  }
}
