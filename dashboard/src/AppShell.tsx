'use client'

import { usePathname } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { Sidebar } from './Sidebar'

// 기존 중앙정렬 레이아웃은 그대로 두고, 좌측 여백에 떠 있는 메뉴를 오버레이로 얹는다.
// 로그인 페이지는 메뉴 없이 단독 렌더.
export const AppShell = ({ children }: PropsWithChildren) => {
  const path = usePathname()
  if (path === '/sign-in') return <>{children}</>
  return (
    <>
      {children}
      <Sidebar />
    </>
  )
}
