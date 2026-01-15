import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all initiatives
export async function GET() {
  try {
    const initiatives = await prisma.initiative.findMany({
      orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json(initiatives)
  } catch (error) {
    console.error('Error fetching initiatives:', error)
    return NextResponse.json({ error: 'Failed to fetch initiatives' }, { status: 500 })
  }
}

// POST create/update initiative
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    
    if (id) {
      const initiative = await prisma.initiative.update({
        where: { id },
        data
      })
      return NextResponse.json(initiative)
    } else {
      const initiative = await prisma.initiative.create({
        data
      })
      return NextResponse.json(initiative)
    }
  } catch (error) {
    console.error('Error saving initiative:', error)
    return NextResponse.json({ error: 'Failed to save initiative' }, { status: 500 })
  }
}

