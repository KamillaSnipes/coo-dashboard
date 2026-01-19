import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Admin credentials
const ADMIN_LOGIN = 'admin'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_EMAIL = 'snipeskamilla1@gmail.com'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
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
        } catch (error) {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'headcorn-super-secret-key-2026-dashboard-coo',
}

