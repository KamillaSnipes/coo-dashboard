import { NextResponse } from 'next/server'

// Test endpoint to verify auth logic
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { login, password } = body

    const ADMIN_LOGIN = 'admin'
    const ADMIN_PASSWORD = 'admin123'
    const ADMIN_EMAIL = 'snipeskamilla1@gmail.com'

    const inputLogin = login?.toLowerCase().trim()
    
    const isValidLogin = inputLogin === ADMIN_LOGIN || inputLogin === ADMIN_EMAIL.toLowerCase()
    const isValidPassword = password === ADMIN_PASSWORD

    return NextResponse.json({
      received: { login: inputLogin, passwordLength: password?.length },
      expected: { login: ADMIN_LOGIN, email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      checks: { isValidLogin, isValidPassword },
      result: isValidLogin && isValidPassword ? 'SUCCESS' : 'FAILED'
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test auth endpoint',
    credentials: {
      login: 'admin',
      password: 'admin123'
    }
  })
}

