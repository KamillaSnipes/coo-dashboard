import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { authenticator } from 'otplib'
import { prisma } from './prisma'

// Default admin credentials - CHANGE THESE IN PRODUCTION!
const DEFAULT_ADMIN = {
  email: 'kamilla@headcorn.ru',
  // Password: Headcorn2026! (hashed with bcrypt)
  passwordHash: '$2b$12$KUd6HeX4r4hDSeEKEv7yMekd3Wr5P1IpKZKcgrxs1SreOGirdEGCO',
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        totpCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Введите email и пароль')
        }

        // Get user settings
        let userSettings = await prisma.settings.findUnique({
          where: { id: 'auth-user' }
        })

        let user = userSettings?.data as any

        // If no user in DB, use default
        if (!user) {
          user = {
            email: DEFAULT_ADMIN.email,
            passwordHash: DEFAULT_ADMIN.passwordHash,
            totpEnabled: false,
            totpSecret: null,
          }
        }

        // Check email
        if (credentials.email !== user.email) {
          throw new Error('Неверный email или пароль')
        }

        // Check password
        const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValidPassword) {
          throw new Error('Неверный email или пароль')
        }

        // Check 2FA if enabled
        if (user.totpEnabled && user.totpSecret) {
          if (!credentials.totpCode) {
            throw new Error('2FA_REQUIRED')
          }
          
          const isValidTotp = authenticator.verify({
            token: credentials.totpCode,
            secret: user.totpSecret,
          })
          
          if (!isValidTotp) {
            throw new Error('Неверный код 2FA')
          }
        }

        return {
          id: '1',
          email: user.email,
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

