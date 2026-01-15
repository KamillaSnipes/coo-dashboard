'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import { AlertTriangle, CheckCircle, Clock, Plus, ChevronDown, ChevronUp } from 'lucide-react'

interface Problem {
  id: string
  title: string
  description: string
  discoveredDate: string
  impact: 'high' | 'medium' | 'low'
  rootCause: string[]
  status: 'open' | 'in_progress' | 'resolved'
  plan: { task: string; done: boolean }[]
  owner: string
  resolvedDate?: string
  solution?: string
  lessons?: string
}

const initialProblems: Problem[] = [
  {
    id: '1',
    title: '70% времени продажников на операционку',
    description: 'Менеджеры по продажам тратят 70% рабочего времени на операционную работу вместо продаж',
    discoveredDate: '',
    impact: 'high',
    rootCause: [
      'Отсутствие разделения ролей (но разделение невозможно в отрасли)',
      'Долгий цикл просчета (5 дней)',
      'Ручное формирование договоров',
      'Отсутствие автоматизации уведомлений',
    ],
    status: 'in_progress',
    plan: [
      { task: 'Ускорить просчеты (5→3 дня)', done: false },
      { task: 'Автоматизировать договоры', done: false },
      { task: 'Настроить умные уведомления', done: false },
      { task: 'Внедрить подробные чек-листы', done: false },
    ],
    owner: 'COO',
  },
  {
    id: '2',
    title: '5 дней на просчет от отдела Китая',
    description: 'Среднее время подготовки просчета — 5 дней, цель — 3 дня',
    discoveredDate: '',
    impact: 'high',
    rootCause: [
      'Разница во времени Москва-Китай',
      'Нет типизации запросов',
      'Нет SLA',
      'Производство под ключ (нет стандартных товаров)',
    ],
    status: 'in_progress',
    plan: [
      { task: 'Типизация просчетов (Экспресс/Стандарт/Кастом/Примерный)', done: false },
      { task: 'Настройка SLA в ПланФиксе', done: false },
      { task: 'Оптимизация графика с учетом часовых поясов', done: false },
    ],
    owner: 'COO + Руководители отдела Китая',
  },
  {
    id: '3',
    title: 'Отсутствие культуры проактивных продаж',
    description: 'Менеджеры работают реактивно, не генерируют идеи, не используют Генератор концепций эффективно',
    discoveredDate: '',
    impact: 'high',
    rootCause: [
      'Отсутствие системы компетенций',
      'Отсутствие культуры внутри компании',
      'Менеджеры не умеют работать с ИИ-инструментами',
      'База ИИ ограничена (1/3 рынка)',
    ],
    status: 'open',
    plan: [
      { task: 'Диагностика компетенций', done: false },
      { task: 'Создание системы компетенций', done: false },
      { task: 'Обучение работе с Генератором концепций', done: false },
      { task: 'Построение культуры', done: false },
    ],
    owner: 'COO + будущий РОП',
  },
  {
    id: '4',
    title: 'Нет руководителя отдела продаж',
    description: 'Отдел продаж без РОПа, менеджеры работают без системы',
    discoveredDate: '',
    impact: 'high',
    rootCause: ['Вакансия открыта'],
    status: 'in_progress',
    plan: [
      { task: 'Найти РОПа', done: false },
    ],
    owner: 'COO + Рекрутер',
  },
]

const resolvedProblems: Problem[] = [
  {
    id: 'resolved-1',
    title: 'Долгое формирование КП',
    description: 'КП формировались вручную, занимало много времени',
    discoveredDate: '',
    impact: 'high',
    rootCause: ['Ручной процесс'],
    status: 'resolved',
    plan: [],
    owner: 'COO + IT',
    resolvedDate: '~2 месяца назад',
    solution: 'Автоматизация КП через калькулятор просчетов',
    lessons: '',
  },
]

const impactColors = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const impactLabels = {
  high: 'Высокое',
  medium: 'Среднее',
  low: 'Низкое',
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState(initialProblems)
  const [resolved, setResolved] = useState(resolvedProblems)
  const [expandedProblem, setExpandedProblem] = useState<string | null>('1')

  const toggleProblem = (id: string) => {
    setExpandedProblem(expandedProblem === id ? null : id)
  }

  const togglePlanItem = (problemId: string, itemIndex: number) => {
    setProblems(problems.map(p => {
      if (p.id !== problemId) return p
      const newPlan = [...p.plan]
      newPlan[itemIndex].done = !newPlan[itemIndex].done
      return { ...p, plan: newPlan }
    }))
  }

  const updateProblem = (id: string, field: keyof Problem, value: any) => {
    setProblems(problems.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Проблемы и решения</h1>
        <p className="text-dark-400 mt-2">Реестр проблем, принятых решений и их результатов</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <p className="text-red-400 text-sm">Открытые проблемы</p>
          <p className="text-3xl font-bold text-red-300 mt-2">
            {problems.filter(p => p.status === 'open').length}
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <p className="text-yellow-400 text-sm">В работе</p>
          <p className="text-3xl font-bold text-yellow-300 mt-2">
            {problems.filter(p => p.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
          <p className="text-green-400 text-sm">Решённые</p>
          <p className="text-3xl font-bold text-green-300 mt-2">
            {resolved.length}
          </p>
        </div>
      </div>

      {/* Open Problems */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle size={24} className="text-red-400" />
          Открытые проблемы
        </h2>
        <div className="space-y-4">
          {problems.map((problem) => (
            <Card key={problem.id} className="overflow-hidden">
              {/* Header */}
              <div 
                className="flex items-start justify-between p-6 cursor-pointer hover:bg-dark-700/50 transition-colors -m-6 mb-0"
                onClick={() => toggleProblem(problem.id)}
              >
                <div className="flex items-start gap-4">
                  {problem.status === 'in_progress' ? (
                    <Clock size={24} className="text-yellow-400 mt-1" />
                  ) : (
                    <AlertTriangle size={24} className="text-red-400 mt-1" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{problem.title}</h3>
                    <p className="text-dark-400 text-sm mt-1">{problem.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full border ${impactColors[problem.impact]}`}>
                    Влияние: {impactLabels[problem.impact]}
                  </span>
                  {expandedProblem === problem.id ? (
                    <ChevronUp size={20} className="text-dark-400" />
                  ) : (
                    <ChevronDown size={20} className="text-dark-400" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedProblem === problem.id && (
                <div className="mt-6 pt-6 border-t border-dark-700 space-y-6">
                  {/* Root Cause */}
                  <div>
                    <h4 className="font-medium text-dark-300 mb-3">Корневая причина</h4>
                    <ul className="space-y-2">
                      {problem.rootCause.map((cause, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary-400">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Plan */}
                  <div>
                    <h4 className="font-medium text-dark-300 mb-3">План решения</h4>
                    <div className="space-y-2">
                      {problem.plan.map((item, i) => (
                        <div 
                          key={i} 
                          className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg cursor-pointer hover:bg-dark-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePlanItem(problem.id, i)
                          }}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            item.done 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-dark-500'
                          }`}>
                            {item.done && <CheckCircle size={12} className="text-white" />}
                          </div>
                          <span className={item.done ? 'line-through text-dark-500' : ''}>
                            {item.task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Owner */}
                  <div>
                    <p className="text-dark-400 text-sm">
                      Ответственный: <span className="text-white">{problem.owner}</span>
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Resolved Problems */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle size={24} className="text-green-400" />
          Решённые проблемы
        </h2>
        <div className="space-y-4">
          {resolved.map((problem) => (
            <Card key={problem.id}>
              <div className="flex items-start gap-4">
                <CheckCircle size={24} className="text-green-400 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold">{problem.title}</h3>
                  <p className="text-dark-400 text-sm mt-1">{problem.description}</p>
                  <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-300 text-sm">
                      <span className="font-medium">Решение:</span> {problem.solution}
                    </p>
                    <p className="text-dark-400 text-xs mt-2">
                      Решено: {problem.resolvedDate}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

