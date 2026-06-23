import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// codeit.com Google 계정만 허용. 하드 잠금은 ① GCP 동의화면 Internal + ② hd 힌트 +
// ③ 아래 signIn 콜백의 email 도메인·verified 체크 3중. (codeit-resources-2.0 패턴)
const ALLOWED_DOMAIN = 'codeit.com'

type GoogleProfile = { email?: string; email_verified?: boolean }

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30일
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: { hd: ALLOWED_DOMAIN, prompt: 'select_account', scope: 'openid email profile' },
      },
    }),
  ],
  callbacks: {
    signIn({ profile }) {
      const { email, email_verified: verified } = (profile ?? {}) as GoogleProfile
      return Boolean(verified && email?.endsWith(`@${ALLOWED_DOMAIN}`))
    },
  },
  pages: { signIn: '/sign-in' },
}
