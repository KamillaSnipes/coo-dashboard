import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import * as OTPAuth from 'otpauth'
import { prisma } from './prisma'

// TOTP helper functions
const verifyTOTP = (token: string, secret: string): boolean => {
  const totp = new OTPAuth.TOTP({
    issuer: 'COO Dashboard',
    label: 'Headcorn',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  })
  return totp.validate({ token, window: 1 }) !== null
}

// Default admin credentials
const DEFAULT_ADMIN = {
  login: 'admin',
  email: 'snipeskamilla1@gmail.com',
  // Password: admin123 (hashed with bcrypt)
  passwordHash: '$2b$10$s9ZtD4lb9KnEZY4viAQVD.ETIm94eLQDTEJIs3tYxiIpoIxO1ExXa',
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
        totpCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error('Введите логин и пароль')
        }

        // Get user settings
        let userSettings = await prisma.settings.findUnique({
          where: { id: 'auth-user' }
        })

        let user = userSettings?.data as any

        // If no user in DB, use default
        if (!user) {
          user = {
            login: DEFAULT_ADMIN.login,
            email: DEFAULT_ADMIN.email,
            passwordHash: DEFAULT_ADMIN.passwordHash,
            totpEnabled: false,
            totpSecret: null,
          }
        }

        // Check login (can be login or email)
        const inputLogin = credentials.login.toLowerCase()
        const isValidLogin = inputLogin === (user.login || DEFAULT_ADMIN.login).toLowerCase() || 
                            inputLogin === (user.email || DEFAULT_ADMIN.email).toLowerCase()
        
        if (!isValidLogin) {
          throw new Error('Неверный логин или пароль')
        }

        // Check password
        const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash || DEFAULT_ADMIN.passwordHash)
        if (!isValidPassword) {
          throw new Error('Неверный логин или пароль')
        }

        // Check 2FA if enabled
        if (user.totpEnabled && user.totpSecret) {
          if (!credentials.totpCode) {
            throw new Error('2FA_REQUIRED')
          }
          
          const isValidTotp = verifyTOTP(credentials.totpCode, user.totpSecret)
          
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

