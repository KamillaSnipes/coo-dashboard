import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — получить все контекстные документы (с опциональной фильтрацией по категории)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const slug = searchParams.get('slug')
    const search = searchParams.get('search')

    if (slug) {
      const doc = await prisma.contextDocument.findUnique({ where: { slug } })
      if (!doc) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }
      return NextResponse.json(doc)
    }

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const docs = await prisma.contextDocument.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        content: !slug ? false : true,
      },
    })

    const categories = await prisma.contextDocument.groupBy({
      by: ['category'],
      _count: { category: true },
    })

    return NextResponse.json({ docs, categories })
  } catch (error) {
    console.error('Error fetching context documents:', error)
    return NextResponse.json({ error: 'Failed to fetch context documents' }, { status: 500 })
  }
}
