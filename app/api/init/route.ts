import { NextResponse } from 'next/server'

// This endpoint confirms the system is ready
export async function GET() {
  return NextResponse.json({ 
    message: 'Система готова к работе',
    status: 'ok'
  })
}

