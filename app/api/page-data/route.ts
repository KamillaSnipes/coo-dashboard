import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Universal API for page-specific data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    
    if (!page) {
      return NextResponse.json({ error: 'Page parameter required' }, { status: 400 })
    }

    const settings = await prisma.settings.findUnique({
      where: { id: `page-${page}` }
    })
    
    if (settings) {
      return NextResponse.json(settings.data)
    }
    
    return NextResponse.json({})
  } catch (error) {
    console.error('Error fetching page data:', error)
    return NextResponse.json({})
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    
    if (!page) {
      return NextResponse.json({ error: 'Page parameter required' }, { status: 400 })
    }

    const data = await request.json()
    
    await prisma.settings.upsert({
      where: { id: `page-${page}` },
      update: { data },
      create: { id: `page-${page}`, data }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving page data:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
