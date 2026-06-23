/** @type {import('next').NextConfig} */
const nextConfig = {
  // 멀티 서비스(/[app]) 전환 전 옛 경로 호환 — 과거 Slack 링크·북마크를 기본 서비스(sprint)로 보존.
  // `/[week]` 는 루트에서 `/[app]` 과 충돌해 파일 라우트로 못 두므로 여기서 리다이렉트로 처리.
  redirects: async () => [
    { source: '/:week(\\d{4}-W\\d{2})', destination: '/sprint/:week', permanent: false },
    { source: '/calls', destination: '/sprint/calls', permanent: false },
    { source: '/calls/:week(\\d{4}-W\\d{2})', destination: '/sprint/calls/:week', permanent: false },
    { source: '/geo', destination: '/sprint/geo', permanent: false },
    { source: '/geo/:week(\\d{4}-W\\d{2})', destination: '/sprint/geo/:week', permanent: false },
    { source: '/methodology', destination: '/sprint/methodology', permanent: false },
  ],
}

module.exports = nextConfig
