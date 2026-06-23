import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import { AppShell } from '../src/AppShell'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Codeit GEO', template: '%s · Codeit GEO' },
  description: '코드잇 서비스 AI 검색 가시성 대시보드',
}

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="ko">
    <body>
      <AppShell>{children}</AppShell>
    </body>
  </html>
)

export default RootLayout
