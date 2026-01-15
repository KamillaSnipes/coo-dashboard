import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 })
  }
}

// POST create/update department
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    
    if (id) {
      // Update existing
      const department = await prisma.department.update({
        where: { id },
        data
      })
      return NextResponse.json(department)
    } else {
      // Create new
      const department = await prisma.department.create({
        data
      })
      return NextResponse.json(department)
    }
  } catch (error) {
    console.error('Error saving department:', error)
    return NextResponse.json({ error: 'Failed to save department' }, { status: 500 })
  }
}

