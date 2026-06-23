import NextAuth from 'next-auth'
import { authOptions } from '../../../../auth'

// next-auth v4 App Router 핸들러
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
