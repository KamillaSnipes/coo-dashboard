import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET sales weekly data
export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'sales-weekly' }
    })
    
    if (!settings) {
      return NextResponse.json({ weeklyData: [] })
    }
    
    return NextResponse.json(settings.data)
  } catch (error) {
    console.error('Error fetching sales weekly data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// POST update sales weekly data
export async function POST(request: Request) {
  try {
    const newData = await request.json()
    
    const settings = await prisma.settings.upsert({
      where: { id: 'sales-weekly' },
      update: { data: newData },
      create: { id: 'sales-weekly', data: newData }
    })
    
    return NextResponse.json(settings.data)
  } catch (error) {
    console.error('Error saving sales weekly data:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}

