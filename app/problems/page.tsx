'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import { AlertTriangle, CheckCircle, Clock, XCircle, Plus, ArrowRight } from 'lucide-react'
import { keyProblems } from '@/lib/data'

interface Problem {
  id: string
  title: string
  description?: string
  impact: 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'resolved'
  owner: string
  category?: string
  rootCause?: string[]
  plan?: { task: string; done: boolean }[]
  solution?: string
}

interface LeadershipIssue {
  manager: string
  issue: string
  department: string
}

const initialProblems: Problem[] = keyProblems.map(p => ({
  ...p,
  description: '',
  rootCause: [],
  plan: [],
  solution: '',
}))

// Дополнительные проблемы из контекста
const additionalProblems: Problem[] = [
  {
    id: 'ai-usage',
    title: 'ИИ-генератор используется на 50%',
    description: 'Сотрудники не умеют критически мыслить и работать с ИИ-инструментами',
    impact: 'medium',
    status: 'open',
    owner: 'Камилла Каюмова',
    category: 'culture',
    rootCause: ['Нет обучения', 'Нет культуры использования'],
  },
  {
    id: 'base-limited',
    title: 'База ограничена 1/3 рынка',
    description: 'Калькулятор и генератор построены на базе существующих проектов, не охватывают весь рынок',
    impact: 'medium',
    status: 'open',
    owner: 'Камилла Каюмова + IT',
    category: 'operations',
  },
]

const categoryLabels: Record<string, string> = {
  operations: '⚙️ Операции',
  hr: '👥 HR',
  culture: '🎭 Культура',
  hiring: '🎯 Наём',
  leadership: '👔 От руководителей',
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([...initialProblems, ...additionalProblems])
  const [leadershipIssues, setLeadershipIssues] = useState<LeadershipIssue[]>([])
  
  // Load leadership issues
  useEffect(() => {
    const loadLeadershipData = async () => {
      try {
        const response = await fetch('/api/leadership-reports')
        if (response.ok) {
          const data = await response.json()
          if (data.reports && data.reports.length > 0) {
            const currentWeek = '2026-01-19'
            const weekReports = data.reports.filter((r: any) => r.weekStart === currentWeek)
            
            const issues: LeadershipIssue[] = []
            weekReports.forEach((report: any) => {
              if (report.issues && report.issues.length > 0) {
                report.issues.forEach((issue: string) => {
                  issues.push({
                    manager: report.manager,
                    issue: issue,
                    department: report.department
                  })
                })
              }
            })
            setLeadershipIssues(issues)
          }
        }
      } catch (error) {
        console.error('Error loading leadership data:', error)
      }
    }
    loadLeadershipData()
  }, [])
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [notes, setNotes] = useState<Record<string, string>>({})

  const filteredProblems = problems.filter(p => {
    const statusMatch = filter === 'all' ? true : p.status === filter
    const categoryMatch = categoryFilter === 'all' ? true : p.category === categoryFilter
    return statusMatch && categoryMatch
  })

  const hrProblemsCount = problems.filter(p => p.category === 'hr').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle size={20} className="text-green-400" />
      case 'in_progress': return <Clock size={20} className="text-yellow-400" />
      default: return <XCircle size={20} className="text-red-400" />
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">Высокий</span>
      case 'medium': return <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Средний</span>
      default: return <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Низкий</span>
    }
  }

  const updateProblemStatus = (id: string, status: 'open' | 'in_progress' | 'resolved') => {
    setProblems(problems.map(p => p.id === id ? { ...p, status } : p))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Проблемы и решения</h1>
          <p className="text-dark-400 mt-2">Трекинг проблем, корневых причин и планов решения</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Все' },
          { id: 'open', label: 'Открытые' },
          { id: 'in_progress', label: 'В работе' },
          { id: 'resolved', label: 'Решённые' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f.id
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="w-px bg-dark-600 mx-2" />
        {[
          { id: 'all', label: '📋 Все категории' },
          { id: 'operations', label: '⚙️ Операции' },
          { id: 'hr', label: `👥 HR (${hrProblemsCount})` },
          { id: 'culture', label: '🎭 Культура' },
          { id: 'hiring', label: '🎯 Наём' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setCategoryFilter(f.id)}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              categoryFilter === f.id
                ? f.id === 'hr' ? 'bg-rose-500/30 text-rose-300' : 'bg-primary-600 text-white'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <Card key={problem.id} className="overflow-hidden">
            <div className="flex items-start gap-4">
              {getStatusIcon(problem.status)}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="font-semibold text-lg">{problem.title}</h3>
                  {getImpactBadge(problem.impact)}
                  {problem.category && categoryLabels[problem.category] && (
                    <span className="text-xs px-2 py-1 bg-dark-600 text-dark-300 rounded">
                      {categoryLabels[problem.category]}
                    </span>
                  )}
                </div>
                
                {problem.description && (
                  <p className="text-dark-400 text-sm mb-3">{problem.description}</p>
                )}

                <div className="text-sm text-dark-500 mb-4">
                  Ответственный: <span className="text-dark-300">{problem.owner}</span>
                </div>

                {/* Root Causes */}
                {problem.rootCause && problem.rootCause.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-dark-400 mb-2">Корневые причины:</h4>
                    <ul className="space-y-1">
                      {problem.rootCause.map((cause, i) => (
                        <li key={i} className="text-sm text-dark-300 flex items-center gap-2">
                          <span className="text-dark-500">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Plan */}
                {problem.plan && problem.plan.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-dark-400 mb-2">План действий:</h4>
                    <ul className="space-y-1">
                      {problem.plan.map((item, i) => (
                        <li key={i} className={`text-sm flex items-center gap-2 ${item.done ? 'text-dark-500 line-through' : 'text-dark-300'}`}>
                          {item.done ? <CheckCircle size={14} className="text-green-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-dark-500" />}
                          {item.task}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h4 className="text-sm font-medium text-dark-400 mb-2">Заметки:</h4>
                  <EditableText
                    value={notes[problem.id] || ''}
                    onSave={(value) => setNotes({ ...notes, [problem.id]: value })}
                    placeholder="Добавить заметки..."
                    multiline
                    className="bg-dark-700/50 rounded-lg text-sm"
                  />
                </div>

                {/* Status Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-dark-700">
                  <button
                    onClick={() => updateProblemStatus(problem.id, 'open')}
                    className={`px-3 py-1 text-sm rounded ${problem.status === 'open' ? 'bg-red-500/20 text-red-400' : 'bg-dark-700 text-dark-400 hover:bg-dark-600'}`}
                  >
                    Открыта
                  </button>
                  <button
                    onClick={() => updateProblemStatus(problem.id, 'in_progress')}
                    className={`px-3 py-1 text-sm rounded ${problem.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-dark-700 text-dark-400 hover:bg-dark-600'}`}
                  >
                    В работе
                  </button>
                  <button
                    onClick={() => updateProblemStatus(problem.id, 'resolved')}
                    className={`px-3 py-1 text-sm rounded ${problem.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-dark-700 text-dark-400 hover:bg-dark-600'}`}
                  >
                    Решена
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Leadership Issues Section */}
      {leadershipIssues.length > 0 && (
        <Card 
          title="👔 Проблемы от руководителей (План/Факт)"
          action={
            <Link href="/leadership-reports" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
              Все отчёты <ArrowRight size={14} />
            </Link>
          }
          className="border border-orange-500/30"
        >
          <p className="text-dark-400 text-sm mb-4">
            Проблемы выявленные из еженедельных отчётов руководителей
          </p>
          <div className="space-y-3">
            {leadershipIssues.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <AlertTriangle size={18} className="text-orange-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="text-orange-200">{item.issue}</span>
                  <div className="text-xs text-dark-500 mt-1">
                    {item.manager} • {item.department}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-dark-800 rounded-xl text-center">
          <div className="text-2xl font-bold">{problems.length + leadershipIssues.length}</div>
          <div className="text-sm text-dark-400">Всего</div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-red-400">
            {problems.filter(p => p.status === 'open').length}
          </div>
          <div className="text-sm text-dark-400">Открытых</div>
        </div>
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-orange-400">
            {leadershipIssues.length}
          </div>
          <div className="text-sm text-dark-400">От руководителей</div>
        </div>
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-400">
            {problems.filter(p => p.status === 'resolved').length}
          </div>
          <div className="text-sm text-dark-400">Решённых</div>
        </div>
      </div>
    </div>
  )
}
