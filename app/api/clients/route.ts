import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET clients data
export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'clients' }
    })
    
    if (!settings) {
      return NextResponse.json({ clients: [] })
    }
    
    return NextResponse.json(settings.data)
  } catch (error) {
    console.error('Error fetching clients data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// POST update clients data
export async function POST(request: Request) {
  try {
    const newData = await request.json()
    
    const settings = await prisma.settings.upsert({
      where: { id: 'clients' },
      update: { data: newData },
      create: { id: 'clients', data: newData }
    })
    
    return NextResponse.json(settings.data)
  } catch (error) {
    console.error('Error saving clients data:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}

