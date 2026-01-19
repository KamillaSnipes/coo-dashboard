import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// This endpoint initializes the admin user
// It will only create the user if it doesn't exist
export async function GET() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'kamilla@megamind.ru' }
    })

    if (existingUser) {
      return NextResponse.json({ 
        message: 'Пользователь уже существует',
        email: existingUser.email 
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('HeadcornCOO2026!', 12)
    
    const user = await prisma.user.create({
      data: {
        email: 'kamilla@megamind.ru',
        name: 'Камилла Каюмова',
        password: hashedPassword,
        role: 'admin',
        totpEnabled: false,
      }
    })

    return NextResponse.json({ 
      message: 'Пользователь создан успешно',
      email: user.email 
    })
  } catch (error) {
    console.error('Error initializing user:', error)
    return NextResponse.json({ error: 'Ошибка при создании пользователя' }, { status: 500 })
  }
}

