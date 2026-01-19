import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// Generate random secret
const generateSecret = (): string => {
  const secret = new OTPAuth.Secret({ size: 20 })
  return secret.base32
}

// Generate TOTP URI for QR code
const generateTOTPUri = (email: string, secret: string): string => {
  const totp = new OTPAuth.TOTP({
    issuer: 'COO Dashboard (Headcorn)',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  })
  return totp.toString()
}

// Verify TOTP code
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

// GET - Get 2FA status and generate secret if needed
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let userSettings = await prisma.settings.findUnique({
      where: { id: 'auth-user' }
    })

    const user = userSettings?.data as any

    if (user?.totpEnabled) {
      return NextResponse.json({ 
        enabled: true,
        message: '2FA уже включена'
      })
    }

    // Generate new secret for setup
    const secret = generateSecret()
    const otpauth = generateTOTPUri(session.user?.email || 'user', secret)

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauth)

    return NextResponse.json({
      enabled: false,
      secret,
      qrCode,
    })
  } catch (error) {
    console.error('2FA GET error:', error)
    return NextResponse.json({ error: 'Failed to get 2FA status' }, { status: 500 })
  }
}

// POST - Enable/verify 2FA
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { secret, code } = await request.json()

    // Verify the code
    const isValid = verifyTOTP(code, secret)
    if (!isValid) {
      return NextResponse.json({ error: 'Неверный код. Попробуйте снова.' }, { status: 400 })
    }

    // Get current user data
    let userSettings = await prisma.settings.findUnique({
      where: { id: 'auth-user' }
    })

    const currentUser = (userSettings?.data as any) || {
      email: session.user?.email,
      passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.SLZ3E7TdVDjK9O',
    }

    // Update user with 2FA enabled
    await prisma.settings.upsert({
      where: { id: 'auth-user' },
      update: {
        data: {
          ...currentUser,
          totpEnabled: true,
          totpSecret: secret,
        }
      },
      create: {
        id: 'auth-user',
        data: {
          ...currentUser,
          totpEnabled: true,
          totpSecret: secret,
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      message: '2FA успешно включена!'
    })
  } catch (error) {
    console.error('2FA POST error:', error)
    return NextResponse.json({ error: 'Failed to enable 2FA' }, { status: 500 })
  }
}

// DELETE - Disable 2FA
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { password } = await request.json()

    // Get current user data
    let userSettings = await prisma.settings.findUnique({
      where: { id: 'auth-user' }
    })

    const currentUser = userSettings?.data as any
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, currentUser.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 400 })
    }

    // Disable 2FA
    await prisma.settings.update({
      where: { id: 'auth-user' },
      data: {
        data: {
          ...currentUser,
          totpEnabled: false,
          totpSecret: null,
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      message: '2FA отключена'
    })
  } catch (error) {
    console.error('2FA DELETE error:', error)
    return NextResponse.json({ error: 'Failed to disable 2FA' }, { status: 500 })
  }
}

