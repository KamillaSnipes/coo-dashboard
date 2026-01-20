import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'leadership-reports' }
    })
    
    if (!settings) {
      return NextResponse.json({ reports: [] })
    }
    
    return NextResponse.json(settings.data)
  } catch (error) {
    console.error('Error fetching leadership reports:', error)
    return NextResponse.json({ reports: [] })
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json()
    
    const settings = await prisma.settings.upsert({
      where: { id: 'leadership-reports' },
      update: { data: newData },
      create: { id: 'leadership-reports', data: newData }
    })
    
    return NextResponse.json(settings.data)
  } catch (error) {
    console.error('Error saving leadership reports:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
