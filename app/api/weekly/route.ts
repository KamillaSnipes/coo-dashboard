import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET weekly reviews
export async function GET() {
  try {
    const reviews = await prisma.weeklyReview.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching weekly reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch weekly reviews' }, { status: 500 })
  }
}

// POST create/update weekly review
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    
    if (id) {
      const review = await prisma.weeklyReview.update({
        where: { id },
        data
      })
      return NextResponse.json(review)
    } else {
      const review = await prisma.weeklyReview.create({
        data
      })
      return NextResponse.json(review)
    }
  } catch (error) {
    console.error('Error saving weekly review:', error)
    return NextResponse.json({ error: 'Failed to save weekly review' }, { status: 500 })
  }
}

