'use client'

import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, Clock, Users, Target, AlertTriangle, Calendar, RefreshCw } from 'lucide-react'
import Card from '@/components/Card'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'

interface Department {
  id: string
  name: string
  lead: string | null
  status: 'green' | 'yellow' | 'red'
  focus: string | null
}

const defaultDepartments: Department[] = [
  { id: '1', name: 'Продажи (Москва)', lead: 'Ищем РОПа', status: 'yellow', focus: '' },
  { id: '2', name: 'Продажи (Дубай)', lead: '', status: 'green', focus: '' },
  { id: '3', name: 'Отдел Китая', lead: '', status: 'green', focus: '' },
  { id: '4', name: 'ВЭД/Логистика', lead: '', status: 'green', focus: '' },
  { id: '5', name: 'Маркетинг', lead: '', status: 'green', focus: '' },
  { id: '6', name: 'IT', lead: '', status: 'green', focus: '' },
]

export default function Dashboard() {
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/departments')
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setDepartments(data)
          }
        }
      } catch (error) {
        console.error('Error loading departments:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Save department
  const saveDepartment = useCallback(async (dept: Department) => {
    setSaving(true)
    try {
      await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dept)
      })
    } catch (error) {
      console.error('Error saving department:', error)
    } finally {
      setSaving(false)
    }
  }, [])

  const updateDepartmentFocus = (index: number, value: string) => {
    const newDepts = [...departments]
    newDepts[index] = { ...newDepts[index], focus: value }
    setDepartments(newDepts)
    saveDepartment(newDepts[index])
  }

  const focus = {
    q: 'Q1 2026',
    priorities: [
      'Рост выручки в 2 раза → 1,5 млрд руб.',
      'Маржинальность 30%',
      'КП за 3 дня (сейчас 5 дней)',
      'NPS 75+, Брак ≤1%',
    ]
  }

  const alerts = [
    { text: '70% времени продажников на операционку', priority: 'high' },
    { text: '5 дней на просчет (цель: 3 дня)', priority: 'high' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Главный дашборд</h1>
          <p className="text-dark-400 mt-2">Центр управления для операционного директора</p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-primary-400">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">Сохранение...</span>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Выручка MTD"
          value="—"
          subtitle="/ план —"
          icon={<TrendingUp size={24} />}
        />
        <MetricCard
          title="Время КП"
          value="5 дней"
          subtitle="цель: 3 дня"
          icon={<Clock size={24} />}
          trend="down"
          trendValue="нужно ускорить"
        />
        <MetricCard
          title="Сделок в работе"
          value="—"
          subtitle="на сумму —"
          icon={<Target size={24} />}
        />
        <MetricCard
          title="Сотрудников"
          value="~35"
          subtitle="3 офиса"
          icon={<Users size={24} />}
        />
      </div>

      {/* Focus & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategic Focus */}
        <Card title="🎯 Стратегический фокус" subtitle={focus.q}>
          <ul className="space-y-3">
            {focus.priorities.map((priority, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-primary-400 mt-1">•</span>
                <span>{priority}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Alerts */}
        <Card 
          title="🚨 Алерты и риски" 
          action={<StatusBadge status="red" size="sm" />}
        >
          <ul className="space-y-4">
            {alerts.map((alert, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-red-200">{alert.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Departments Status */}
      <Card title="📊 Статус по отделам">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw size={24} className="animate-spin text-primary-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-dark-400 text-sm border-b border-dark-700">
                  <th className="pb-4 font-medium">Отдел</th>
                  <th className="pb-4 font-medium">Руководитель</th>
                  <th className="pb-4 font-medium">Фокус недели</th>
                  <th className="pb-4 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {departments.map((dept, i) => (
                  <tr key={dept.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="py-4 font-medium">{dept.name}</td>
                    <td className="py-4 text-dark-300">{dept.lead || '—'}</td>
                    <td className="py-4">
                      <EditableText
                        value={dept.focus || ''}
                        onSave={(value) => updateDepartmentFocus(i, value)}
                        placeholder="Добавить фокус..."
                        className="text-sm"
                      />
                    </td>
                    <td className="py-4">
                      <StatusBadge status={dept.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Info */}
      <div className="text-center text-dark-500 text-sm">
        Данные сохраняются автоматически в базу данных
      </div>
    </div>
  )
}
