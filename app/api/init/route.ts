import { NextResponse } from 'next/server'

// This endpoint just confirms the system is ready
// Auth uses default credentials from lib/auth.ts
export async function GET() {
  return NextResponse.json({ 
    message: 'Система готова к работе',
    login: 'admin',
    hint: 'Используйте логин: admin, пароль: admin123'
  })
}

