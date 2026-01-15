import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all people with meetings
export async function GET() {
  try {
    const people = await prisma.person.findMany({
      include: { meetings: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json(people)
  } catch (error) {
    console.error('Error fetching people:', error)
    return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 })
  }
}

// POST create/update person
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, meetings, ...data } = body
    
    if (id) {
      const person = await prisma.person.update({
        where: { id },
        data,
        include: { meetings: true }
      })
      return NextResponse.json(person)
    } else {
      const person = await prisma.person.create({
        data,
        include: { meetings: true }
      })
      return NextResponse.json(person)
    }
  } catch (error) {
    console.error('Error saving person:', error)
    return NextResponse.json({ error: 'Failed to save person' }, { status: 500 })
  }
}

