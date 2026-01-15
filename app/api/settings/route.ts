import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET settings
export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'main' }
    })
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 'main', data: {} }
      })
    }
    
    return NextResponse.json(settings.data)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST update settings
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
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

