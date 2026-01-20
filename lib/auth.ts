import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Credentials
const ADMIN_LOGIN = 'admin'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_EMAIL = 'snipeskamilla1@gmail.com'

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const login = credentials?.login?.toLowerCase().trim()
        const password = credentials?.password

        if (!login || !password) {
          return null
        }

        const isValidLogin = login === ADMIN_LOGIN || login === ADMIN_EMAIL.toLowerCase()
        const isValidPassword = password === ADMIN_PASSWORD

        if (isValidLogin && isValidPassword) {
          return {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'Камилла Каюмова',
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      return session
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to base URL after sign in
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'headcorn-super-secret-key-2026-dashboard-coo',
}
