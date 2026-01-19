import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simple admin credentials
const ADMIN_LOGIN = 'admin'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_EMAIL = 'snipeskamilla1@gmail.com'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const login = credentials?.login?.toLowerCase().trim()
        const password = credentials?.password

        if (!login || !password) {
          return null
        }

        // Check credentials
        const isValidLogin = login === ADMIN_LOGIN || login === ADMIN_EMAIL.toLowerCase()
        const isValidPassword = password === ADMIN_PASSWORD

        if (isValidLogin && isValidPassword) {
          return {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'Камилла Каюмова',
            role: 'admin',
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
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role
        (session.user as any).id = (token as any).id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'headcorn-coo-dashboard-secret-2026-very-long-string',
}

