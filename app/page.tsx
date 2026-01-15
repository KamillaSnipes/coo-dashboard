'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { TrendingUp, Clock, Users, Target, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react'
import Card from '@/components/Card'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import { departments, companyStats, quarterFocus, keyProblems, getDepartmentEmployeeCount, getDepartmentHead } from '@/lib/data'

export default function Dashboard() {
  const [loading, setLoading] = useState(false)

  // Подсчёт общего числа сотрудников
  const totalEmployees = departments.reduce((sum, dept) => sum + getDepartmentEmployeeCount(dept), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Главный дашборд</h1>
          <p className="text-dark-400 mt-2">Центр управления для операционного директора</p>
        </div>
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
          value={`${companyStats.total}`}
          subtitle={`${departments.length} отделов, 3 офиса`}
          icon={<Users size={24} />}
        />
      </div>

      {/* Focus & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategic Focus */}
        <Card title="🎯 Стратегический фокус" subtitle={quarterFocus.quarter}>
          <ul className="space-y-3">
            {quarterFocus.priorities.map((priority, i) => (
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
          <ul className="space-y-3">
            {keyProblems.filter(p => p.impact === 'high').slice(0, 3).map((problem, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-red-200">{problem.title}</span>
                  <div className="text-xs text-dark-500 mt-1">{problem.owner}</div>
                </div>
              </li>
            ))}
          </ul>
          <Link 
            href="/problems" 
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm mt-4"
          >
            <span>Все проблемы</span>
            <ArrowRight size={16} />
          </Link>
        </Card>
      </div>

      {/* Departments Status */}
      <Card 
        title="📊 Статус по отделам"
        action={
          <Link href="/org-structure" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
            Оргструктура <ArrowRight size={14} />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-dark-400 text-sm border-b border-dark-700">
                <th className="pb-4 font-medium">Отдел</th>
                <th className="pb-4 font-medium">Руководитель</th>
                <th className="pb-4 font-medium">Человек</th>
                <th className="pb-4 font-medium">Фокус</th>
                <th className="pb-4 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-dark-700/50 transition-colors">
                  <td className="py-4 font-medium">{dept.shortName}</td>
                  <td className="py-4 text-dark-300 text-sm">{getDepartmentHead(dept)}</td>
                  <td className="py-4 text-dark-300">{getDepartmentEmployeeCount(dept)}</td>
                  <td className="py-4 text-dark-400 text-sm max-w-[200px] truncate">
                    {dept.focus || '—'}
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

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/departments" className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">📋</div>
          <div className="font-medium">Отделы</div>
        </Link>
        <Link href="/one-on-one" className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">👥</div>
          <div className="font-medium">1:1 Встречи</div>
        </Link>
        <Link href="/initiatives" className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">🚀</div>
          <div className="font-medium">Стратегия</div>
        </Link>
        <Link href="/weekly" className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">📅</div>
          <div className="font-medium">Неделя</div>
        </Link>
      </div>

      {/* Info */}
      <div className="text-center text-dark-500 text-sm">
        Данные синхронизированы • {companyStats.total} сотрудников • {departments.length} отделов
      </div>
    </div>
  )
}
