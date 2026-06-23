import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

// 미로그인 시 /sign-in 으로. (codeit-resources 와 동일한 getToken 게이트)
export const middleware = async (request: NextRequest) => {
  // 임시: 로컬(dev)에선 로그인 게이트 생략 → `pnpm dev` 로 무로그인 확인. 프로덕션은 인증 유지.
  if (process.env.NODE_ENV !== 'production') return NextResponse.next()
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  })
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  return NextResponse.next()
}

// /sign-in · /api/auth(OAuth 콜백) · 정적 자원은 게이트 제외
export const config = {
  matcher: ['/((?!sign-in|api/auth|_next/static|_next/image|favicon.ico).*)'],
}
