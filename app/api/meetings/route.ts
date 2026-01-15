import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST create/update meeting
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, personId, ...data } = body
    
    if (id) {
      const meeting = await prisma.meeting.update({
        where: { id },
        data
      })
      return NextResponse.json(meeting)
    } else {
      const meeting = await prisma.meeting.create({
        data: { ...data, personId }
      })
      return NextResponse.json(meeting)
    }
  } catch (error) {
    console.error('Error saving meeting:', error)
    return NextResponse.json({ error: 'Failed to save meeting' }, { status: 500 })
  }
}

