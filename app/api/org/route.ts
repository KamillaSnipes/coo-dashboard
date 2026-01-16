import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET organization data
export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'main' }
    })
    
    if (!settings) {
      // Return default data
      return NextResponse.json({
        alerts: [],
        focus: {
          quarter: 'Q1 2026',
          priorities: []
        },
        departments: []
      })
    }
    
    return NextResponse.json(settings.data)
  } catch (error) {
    console.error('Error fetching org data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// POST update organization data
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const settings = await prisma.settings.upsert({
      where: { id: 'main' },
      update: { data },
      create: { id: 'main', data }
    })
    
    return NextResponse.json(settings.data)
  } catch (error) {
    console.error('Error saving org data:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}

