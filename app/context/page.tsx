'use client'

import { useState, useEffect } from 'react'
import { Search, FileText, ChevronRight, X, Building2, Rocket, Brain, ClipboardList, Users, Settings, BookOpen } from 'lucide-react'
import Card from '@/components/Card'

interface ContextDoc {
  id: string
  slug: string
  title: string
  category: string
  content?: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

interface CategoryCount {
  category: string
  _count: { category: number }
}

const categoryIcons: Record<string, React.ReactNode> = {
  company: <Building2 size={16} />,
  strategy: <Rocket size={16} />,
  operations: <ClipboardList size={16} />,
  'ai-ecosystem': <Brain size={16} />,
  clients: <Users size={16} />,
  processes: <Settings size={16} />,
  plans: <FileText size={16} />,
  instructions: <BookOpen size={16} />,
  hr: <Users size={16} />,
}

const categoryNames: Record<string, string> = {
  company: 'Компания',
  strategy: 'Стратегия',
  operations: 'Операции',
  'ai-ecosystem': 'AI-экосистема',
  clients: 'Клиенты',
  processes: 'Процессы',
  plans: 'Планы',
  instructions: 'Инструкции',
  hr: 'HR',
}

const categoryColors: Record<string, string> = {
  company: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  strategy: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  operations: 'bg-green-500/20 text-green-300 border-green-500/30',
  'ai-ecosystem': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  clients: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  processes: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  plans: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  instructions: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  hr: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
}

export default function ContextPage() {
  const [docs, setDocs] = useState<ContextDoc[]>([])
  const [categories, setCategories] = useState<CategoryCount[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<ContextDoc | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocs()
  }, [selectedCategory])

  const loadDocs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.set('category', selectedCategory)
      const response = await fetch(`/api/context?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDocs(data.docs || [])
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error loading context docs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFullDoc = async (slug: string) => {
    try {
      const response = await fetch(`/api/context?slug=${slug}`)
      if (response.ok) {
        const doc = await response.json()
        setSelectedDoc(doc)
      }
    } catch (error) {
      console.error('Error loading document:', error)
    }
  }

  const filteredDocs = docs.filter(doc =>
    !searchQuery ||
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalDocs = categories.reduce((sum, c) => sum + c._count.category, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">База знаний</h1>
        <p className="text-dark-400 mt-2">
          Все контекстные документы компании — {totalDocs} документов
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по документам..."
          className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary-600 text-white'
              : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
          }`}
        >
          Все ({totalDocs})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setSelectedCategory(cat.category === selectedCategory ? null : cat.category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              cat.category === selectedCategory
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
            }`}
          >
            {categoryIcons[cat.category]}
            {categoryNames[cat.category] || cat.category} ({cat._count.category})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents List */}
        <div className={`${selectedDoc ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-3`}>
          {loading ? (
            <div className="text-center text-dark-400 py-12">Загрузка...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center text-dark-400 py-12">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Документы не найдены</p>
              <p className="text-sm mt-2">Запустите /api/seed-full для загрузки данных</p>
            </div>
          ) : (
            <div className={`grid ${selectedDoc ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-3`}>
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => loadFullDoc(doc.slug)}
                  className={`text-left p-4 rounded-xl border transition-all hover:border-primary-500/50 ${
                    selectedDoc?.slug === doc.slug
                      ? 'bg-primary-600/20 border-primary-500'
                      : 'bg-dark-800 border-dark-700 hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${categoryColors[doc.category] || 'bg-dark-700 text-dark-300'}`}>
                      {categoryIcons[doc.category] || <FileText size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm leading-tight truncate">{doc.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[doc.category] || 'bg-dark-700 text-dark-400'}`}>
                          {categoryNames[doc.category] || doc.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-dark-500 shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Document Viewer */}
        {selectedDoc && (
          <div className="lg:col-span-2">
            <Card
              title={selectedDoc.title}
              action={
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-dark-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              }
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[selectedDoc.category] || 'bg-dark-700 text-dark-400'}`}>
                  {categoryNames[selectedDoc.category] || selectedDoc.category}
                </span>
                <span className="text-xs text-dark-500">
                  Обновлено: {new Date(selectedDoc.updatedAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-dark-200 font-sans leading-relaxed bg-dark-900/50 rounded-lg p-4 overflow-auto max-h-[70vh]">
                  {selectedDoc.content || 'Загрузка содержимого...'}
                </pre>
              </div>
              {selectedDoc.metadata && Object.keys(selectedDoc.metadata as object).length > 0 && (
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <h4 className="text-xs font-medium text-dark-400 mb-2">Метаданные:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedDoc.metadata as Record<string, unknown>).map(([key, value]) => (
                      <span key={key} className="text-xs bg-dark-700 text-dark-300 px-2 py-1 rounded">
                        {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
