'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import { ChevronDown, ChevronUp, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

interface Task {
  id: number
  name: string
  deadline: string
  status: 'pending' | 'done'
  alignedWithFocus: boolean
}

interface Department {
  id: string
  name: string
  lead: string
  employees: number
  lastOneOnOne: string
  status: 'green' | 'yellow' | 'red'
  tasks: Task[]
  metrics: { name: string; value: string; target: string }[]
  problems: string[]
  needsHelp: string[]
  notes: string
}

const initialDepartments: Department[] = [
  {
    id: 'sales-moscow',
    name: 'Отдел продаж (Москва)',
    lead: 'Ищем РОПа',
    employees: 8,
    lastOneOnOne: '',
    status: 'yellow',
    tasks: [
      { id: 1, name: 'Ускорение просчетов', deadline: '', status: 'pending', alignedWithFocus: true },
    ],
    metrics: [
      { name: 'Выручка', value: '—', target: '—' },
      { name: 'Время КП', value: '5 дней', target: '3 дня' },
    ],
    problems: ['70% времени на операционку', 'Нет РОПа'],
    needsHelp: [],
    notes: '',
  },
  {
    id: 'sales-dubai',
    name: 'Отдел продаж (Дубай)',
    lead: '',
    employees: 2,
    lastOneOnOne: '',
    status: 'green',
    tasks: [],
    metrics: [
      { name: 'Выручка', value: '—', target: '—' },
      { name: 'Доля международного оборота', value: '—', target: '10%' },
    ],
    problems: [],
    needsHelp: [],
    notes: '',
  },
  {
    id: 'china',
    name: 'Отдел Китая (Закупки)',
    lead: '',
    employees: 20,
    lastOneOnOne: '',
    status: 'green',
    tasks: [
      { id: 1, name: 'Ускорение просчетов (5→3 дня)', deadline: '', status: 'pending', alignedWithFocus: true },
    ],
    metrics: [
      { name: 'Время просчета', value: '5 дней', target: '3 дня' },
      { name: 'Брак', value: '—', target: '≤1%' },
    ],
    problems: ['Долгие просчеты', 'Разница во времени'],
    needsHelp: [],
    notes: '',
  },
  {
    id: 'ved',
    name: 'ВЭД (Логистика)',
    lead: '',
    employees: 2,
    lastOneOnOne: '',
    status: 'green',
    tasks: [],
    metrics: [
      { name: 'Время доставки', value: '—', target: '—' },
    ],
    problems: [],
    needsHelp: [],
    notes: '',
  },
  {
    id: 'marketing',
    name: 'Маркетинг',
    lead: '',
    employees: 0,
    lastOneOnOne: '',
    status: 'green',
    tasks: [],
    metrics: [
      { name: 'Лиды', value: '—', target: '—' },
      { name: 'Стоимость лида', value: '—', target: '—' },
    ],
    problems: [],
    needsHelp: [],
    notes: '',
  },
  {
    id: 'it',
    name: 'IT',
    lead: '',
    employees: 1,
    lastOneOnOne: '',
    status: 'green',
    tasks: [
      { id: 1, name: 'Поддержка Генератора концепций', deadline: '', status: 'pending', alignedWithFocus: true },
      { id: 2, name: 'Поддержка Калькулятора', deadline: '', status: 'pending', alignedWithFocus: true },
    ],
    metrics: [],
    problems: [],
    needsHelp: [],
    notes: '',
  },
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(initialDepartments)
  const [expandedDept, setExpandedDept] = useState<string | null>('sales-moscow')

  const toggleDept = (id: string) => {
    setExpandedDept(expandedDept === id ? null : id)
  }

  const updateDepartment = (id: string, field: keyof Department, value: any) => {
    setDepartments(departments.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Трекер по отделам</h1>
        <p className="text-dark-400 mt-2">Детальный статус каждого отдела и синхронизация с общим фокусом</p>
      </div>

      {/* Focus Reminder */}
      <div className="bg-primary-600/10 border border-primary-600/30 rounded-xl p-4">
        <p className="text-primary-300 font-medium">
          🎯 Общий фокус Q1 2026: Рост выручки в 2 раза, КП за 3 дня, NPS 75+
        </p>
      </div>

      {/* Departments */}
      <div className="space-y-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="overflow-hidden">
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-dark-700/50 transition-colors -m-6 mb-0"
              onClick={() => toggleDept(dept.id)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{dept.name}</h3>
                  <p className="text-dark-400 text-sm">
                    {dept.lead || 'Руководитель не указан'} • {dept.employees} чел.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={dept.status} />
                {expandedDept === dept.id ? (
                  <ChevronUp size={20} className="text-dark-400" />
                ) : (
                  <ChevronDown size={20} className="text-dark-400" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedDept === dept.id && (
              <div className="mt-6 pt-6 border-t border-dark-700 space-y-6">
                {/* Tasks */}
                <div>
                  <h4 className="font-medium text-dark-300 mb-3">Задачи/Инициативы</h4>
                  <div className="space-y-2">
                    {dept.tasks.length === 0 ? (
                      <p className="text-dark-500 text-sm">Нет задач</p>
                    ) : (
                      dept.tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {task.status === 'done' ? (
                              <CheckCircle size={18} className="text-green-400" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-dark-500" />
                            )}
                            <span className={task.status === 'done' ? 'line-through text-dark-500' : ''}>
                              {task.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.alignedWithFocus ? (
                              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">✓ В фокусе</span>
                            ) : (
                              <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">✗ Вне фокуса</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Metrics */}
                {dept.metrics.length > 0 && (
                  <div>
                    <h4 className="font-medium text-dark-300 mb-3">Метрики</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {dept.metrics.map((metric, i) => (
                        <div key={i} className="p-4 bg-dark-700/50 rounded-lg">
                          <p className="text-dark-400 text-sm">{metric.name}</p>
                          <p className="text-xl font-bold mt-1">{metric.value}</p>
                          <p className="text-dark-500 text-xs mt-1">цель: {metric.target}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Problems */}
                {dept.problems.length > 0 && (
                  <div>
                    <h4 className="font-medium text-dark-300 mb-3">Проблемы/Блокеры</h4>
                    <ul className="space-y-2">
                      {dept.problems.map((problem, i) => (
                        <li key={i} className="flex items-start gap-2 text-red-300">
                          <XCircle size={16} className="mt-1 flex-shrink-0" />
                          {problem}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h4 className="font-medium text-dark-300 mb-3">Заметки</h4>
                  <EditableText
                    value={dept.notes}
                    onSave={(value) => updateDepartment(dept.id, 'notes', value)}
                    placeholder="Добавить заметки после 1:1 или наблюдений..."
                    multiline
                    className="bg-dark-700/50 rounded-lg"
                  />
                </div>

                {/* Detail Link for China */}
                {dept.id === 'china' && (
                  <Link 
                    href="/departments/china"
                    className="flex items-center justify-center gap-2 p-4 bg-primary-600/20 hover:bg-primary-600/30 border border-primary-600/30 rounded-xl transition-colors text-primary-300"
                  >
                    <span className="font-medium">Открыть подробную страницу Отдела Китая</span>
                    <ArrowRight size={20} />
                  </Link>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

