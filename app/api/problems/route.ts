import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all problems
export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json(problems)
  } catch (error) {
    console.error('Error fetching problems:', error)
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 })
  }
}

// POST create/update problem
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    
    if (id) {
      const problem = await prisma.problem.update({
        where: { id },
        data
      })
      return NextResponse.json(problem)
    } else {
      const problem = await prisma.problem.create({
        data
      })
      return NextResponse.json(problem)
    }
  } catch (error) {
    console.error('Error saving problem:', error)
    return NextResponse.json({ error: 'Failed to save problem' }, { status: 500 })
  }
}

