'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import { Rocket, Target, CheckCircle, Clock, Pause } from 'lucide-react'

interface Stage {
  id: number
  name: string
  deadline: string
  status: 'pending' | 'in_progress' | 'done' | 'paused'
}

interface Initiative {
  id: string
  name: string
  goal: string
  status: 'green' | 'yellow' | 'red'
  owner: string
  stages: Stage[]
  blockers: string[]
  nextStep: string
}

const initialInitiatives: Initiative[] = [
  {
    id: '1',
    name: 'Оптимизация операционных процессов',
    goal: 'Снизить операционную нагрузку продажников с 70% до 40-50%',
    status: 'yellow',
    owner: 'COO',
    stages: [
      { id: 1, name: 'Ускорение просчетов (5→3 дня)', deadline: '', status: 'in_progress' },
      { id: 2, name: 'Автоматизация договоров', deadline: '', status: 'pending' },
      { id: 3, name: 'Умные уведомления', deadline: '', status: 'pending' },
      { id: 4, name: 'Подробные чек-листы', deadline: '', status: 'pending' },
    ],
    blockers: [],
    nextStep: '',
  },
  {
    id: '2',
    name: 'Трансформация культуры и компетенций',
    goal: 'Перейти от реактивных продаж к проактивным',
    status: 'red',
    owner: 'COO + HR',
    stages: [
      { id: 1, name: 'Диагностика компетенций', deadline: '', status: 'paused' },
      { id: 2, name: 'Создание системы компетенций', deadline: '', status: 'paused' },
      { id: 3, name: 'Обучение работе с Генератором концепций', deadline: '', status: 'paused' },
      { id: 4, name: 'Построение культуры', deadline: '', status: 'paused' },
    ],
    blockers: ['Нужен РОП', 'Отложено до решения операционных проблем'],
    nextStep: 'Вернуться после решения операционных проблем',
  },
  {
    id: '3',
    name: 'Найм руководителя отдела продаж (РОП)',
    goal: 'Найти РОПа, который построит систему продаж',
    status: 'yellow',
    owner: 'COO + Рекрутер',
    stages: [
      { id: 1, name: 'Профиль кандидата', deadline: '', status: 'pending' },
      { id: 2, name: 'Поиск', deadline: '', status: 'pending' },
      { id: 3, name: 'Собеседования', deadline: '', status: 'pending' },
      { id: 4, name: 'Оффер', deadline: '', status: 'pending' },
      { id: 5, name: 'Онбординг', deadline: '', status: 'pending' },
    ],
    blockers: [],
    nextStep: '',
  },
  {
    id: '4',
    name: 'Расширение IT команды',
    goal: '2 разработчика + 1 аналитик данных',
    status: 'yellow',
    owner: 'COO + IT + Рекрутер',
    stages: [
      { id: 1, name: 'Профили кандидатов', deadline: '', status: 'pending' },
      { id: 2, name: 'Поиск', deadline: '', status: 'pending' },
      { id: 3, name: 'Найм', deadline: '', status: 'pending' },
    ],
    blockers: [],
    nextStep: '',
  },
  {
    id: '5',
    name: 'Финансовое планирование 2026',
    goal: 'Подготовить финплан на 2026 год',
    status: 'yellow',
    owner: 'COO + Бухгалтер + CEO',
    stages: [
      { id: 1, name: 'Сбор данных', deadline: '', status: 'pending' },
      { id: 2, name: 'Анализ', deadline: '', status: 'pending' },
      { id: 3, name: 'Планирование', deadline: '', status: 'pending' },
      { id: 4, name: 'Согласование с CEO', deadline: '', status: 'pending' },
    ],
    blockers: [],
    nextStep: '',
  },
]

const statusIcons = {
  pending: <Clock size={16} className="text-dark-400" />,
  in_progress: <Clock size={16} className="text-blue-400" />,
  done: <CheckCircle size={16} className="text-green-400" />,
  paused: <Pause size={16} className="text-yellow-400" />,
}

const statusLabels = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  done: 'Готово',
  paused: 'Приостановлено',
}

export default function InitiativesPage() {
  const [initiatives, setInitiatives] = useState(initialInitiatives)

  const updateInitiative = (id: string, field: keyof Initiative, value: any) => {
    setInitiatives(initiatives.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ))
  }

  const toggleStageStatus = (initiativeId: string, stageId: number) => {
    setInitiatives(initiatives.map(i => {
      if (i.id !== initiativeId) return i
      const newStages = i.stages.map(s => {
        if (s.id !== stageId) return s
        const statuses: Stage['status'][] = ['pending', 'in_progress', 'done', 'paused']
        const currentIndex = statuses.indexOf(s.status)
        const nextStatus = statuses[(currentIndex + 1) % statuses.length]
        return { ...s, status: nextStatus }
      })
      return { ...i, stages: newStages }
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Стратегические инициативы</h1>
        <p className="text-dark-400 mt-2">Долгосрочные проекты и их статус</p>
      </div>

      {/* Strategic Goals */}
      <Card title="🎯 Стратегические цели 2025-2026">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Выручка', current: '~750 млн?', target: '1,5 млрд', status: 'yellow' },
            { name: 'Маржа', current: '?', target: '30%', status: 'yellow' },
            { name: 'Время КП', current: '5 дней', target: '3 дня', status: 'red' },
            { name: 'NPS', current: '?', target: '75+', status: 'yellow' },
          ].map((goal, i) => (
            <div key={i} className="p-4 bg-dark-700/50 rounded-lg">
              <p className="text-dark-400 text-sm">{goal.name}</p>
              <p className="text-2xl font-bold mt-1">{goal.current}</p>
              <p className="text-dark-500 text-xs mt-1">→ {goal.target}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Initiatives */}
      <div className="space-y-6">
        {initiatives.map((initiative) => (
          <Card key={initiative.id}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-600/20 rounded-lg">
                  <Rocket size={24} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{initiative.name}</h3>
                  <p className="text-dark-400 text-sm mt-1">{initiative.goal}</p>
                  <p className="text-dark-500 text-xs mt-2">Ответственный: {initiative.owner}</p>
                </div>
              </div>
              <StatusBadge status={initiative.status} />
            </div>

            {/* Stages */}
            <div className="mb-6">
              <h4 className="font-medium text-dark-300 mb-3">Этапы</h4>
              <div className="space-y-2">
                {initiative.stages.map((stage) => (
                  <div 
                    key={stage.id} 
                    className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg cursor-pointer hover:bg-dark-700 transition-colors"
                    onClick={() => toggleStageStatus(initiative.id, stage.id)}
                  >
                    <div className="flex items-center gap-3">
                      {statusIcons[stage.status]}
                      <span className={stage.status === 'done' ? 'line-through text-dark-500' : ''}>
                        {stage.name}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      stage.status === 'done' ? 'bg-green-400/10 text-green-400' :
                      stage.status === 'in_progress' ? 'bg-blue-400/10 text-blue-400' :
                      stage.status === 'paused' ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-dark-600 text-dark-400'
                    }`}>
                      {statusLabels[stage.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers */}
            {initiative.blockers.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-dark-300 mb-3">Блокеры</h4>
                <ul className="space-y-2">
                  {initiative.blockers.map((blocker, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-300 text-sm">
                      <span className="text-red-400">•</span>
                      {blocker}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Step */}
            <div>
              <h4 className="font-medium text-dark-300 mb-3">Следующий шаг</h4>
              <EditableText
                value={initiative.nextStep}
                onSave={(value) => updateInitiative(initiative.id, 'nextStep', value)}
                placeholder="Добавить следующий шаг..."
                className="bg-dark-700/50 rounded-lg text-sm"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

