'use client'

import { useState } from 'react'
import { TrendingUp, Clock, Users, Target, AlertTriangle, Calendar } from 'lucide-react'
import Card from '@/components/Card'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'

// Начальные данные (потом можно подключить к БД)
const initialData = {
  focus: {
    q: 'Q1 2026',
    priorities: [
      'Рост выручки в 2 раза → 1,5 млрд руб.',
      'Маржинальность 30%',
      'КП за 3 дня (сейчас 5 дней)',
      'NPS 75+, Брак ≤1%',
    ]
  },
  departments: [
    { name: 'Продажи (Москва)', lead: 'Ищем РОПа', status: 'yellow' as const, focus: '' },
    { name: 'Продажи (Дубай)', lead: '', status: 'green' as const, focus: '' },
    { name: 'Отдел Китая', lead: '', status: 'green' as const, focus: '' },
    { name: 'ВЭД/Логистика', lead: '', status: 'green' as const, focus: '' },
    { name: 'Маркетинг', lead: '', status: 'green' as const, focus: '' },
    { name: 'IT', lead: '', status: 'green' as const, focus: '' },
  ],
  alerts: [
    { text: '70% времени продажников на операционку', priority: 'high' },
    { text: '5 дней на просчет (цель: 3 дня)', priority: 'high' },
  ],
  events: [] as string[],
}

export default function Dashboard() {
  const [data, setData] = useState(initialData)

  const updateDepartmentFocus = (index: number, value: string) => {
    const newDepts = [...data.departments]
    newDepts[index].focus = value
    setData({ ...data, departments: newDepts })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Главный дашборд</h1>
        <p className="text-dark-400 mt-2">Центр управления для операционного директора</p>
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
        <Card title="🎯 Стратегический фокус" subtitle={data.focus.q}>
          <ul className="space-y-3">
            {data.focus.priorities.map((priority, i) => (
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
            {data.alerts.map((alert, i) => (
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
              {data.departments.map((dept, i) => (
                <tr key={i} className="hover:bg-dark-700/50 transition-colors">
                  <td className="py-4 font-medium">{dept.name}</td>
                  <td className="py-4 text-dark-300">{dept.lead || '—'}</td>
                  <td className="py-4">
                    <EditableText
                      value={dept.focus}
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
      </Card>

      {/* Upcoming Events */}
      <Card 
        title="📅 Ближайшие события"
        action={
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            + Добавить
          </button>
        }
      >
        <div className="space-y-3">
          {data.events.length === 0 ? (
            <p className="text-dark-500 text-center py-8">
              Нет запланированных событий
            </p>
          ) : (
            data.events.map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
                <Calendar size={18} className="text-primary-400" />
                <span>{event}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

