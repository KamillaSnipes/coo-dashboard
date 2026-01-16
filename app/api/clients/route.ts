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

// DELETE - reset clients data to force reload from initialClients
export async function DELETE() {
  try {
    await prisma.settings.delete({
      where: { id: 'clients' }
    }).catch(() => {}) // Ignore if not found
    
    return NextResponse.json({ success: true, message: 'Clients data reset' })
  } catch (error) {
    console.error('Error resetting clients data:', error)
    return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 })
  }
}

