import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simple admin credentials - no encryption for reliability
const ADMIN_LOGIN = 'admin'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_EMAIL = 'snipeskamilla1@gmail.com'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Simple direct check
        const login = credentials?.login?.toLowerCase().trim()
        const password = credentials?.password

        console.log('Auth attempt:', { login, password: password ? '***' : 'empty' })

        if (!login || !password) {
          throw new Error('Введите логин и пароль')
        }

        // Check credentials
        const isValidLogin = login === ADMIN_LOGIN || login === ADMIN_EMAIL.toLowerCase()
        const isValidPassword = password === ADMIN_PASSWORD

        if (!isValidLogin || !isValidPassword) {
          console.log('Auth failed:', { isValidLogin, isValidPassword })
          throw new Error('Неверный логин или пароль')
        }

        console.log('Auth success!')
        return {
          id: '1',
          email: ADMIN_EMAIL,
          name: 'Камилла Каюмова',
          role: 'admin',
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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'headcorn-coo-dashboard-secret-key-2026',
}

