'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { TrendingUp, Clock, Users, Target, AlertTriangle, ArrowRight, RefreshCw, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import Card from '@/components/Card'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import { departments, companyStats, getDepartmentEmployeeCount, getDepartmentHead } from '@/lib/data'

interface Alert {
  id: string
  text: string
  owner: string
  priority: 'high' | 'medium' | 'low'
}

interface FocusData {
  quarter: string
  priorities: string[]
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', text: '70% времени продажников на операционку', owner: 'Камилла Каюмова', priority: 'high' },
    { id: '2', text: '5 дней на просчёт от отдела Китая', owner: 'Камилла Каюмова + РГ Китая', priority: 'high' },
    { id: '3', text: 'Нет руководителя отдела продаж', owner: 'Камилла Каюмова + HR', priority: 'high' },
    { id: '4', text: 'HR-система отсутствует (нужен HRBP)', owner: 'Камилла Каюмова + Людковский Пётр', priority: 'high' },
    { id: '5', text: 'Нет матрицы компетенций (кроме ОК)', owner: 'Камилла Каюмова', priority: 'medium' },
  ])
  const [focus, setFocus] = useState<FocusData>({
    quarter: 'Q1 2026',
    priorities: [
      'Рост выручки в 2 раза → 1,5 млрд руб.',
      'Маржинальность 30%',
      'КП за 3 дня (сейчас 5 дней)',
      'NPS 75+, Брак ≤1%',
    ]
  })
  
  const [editingAlert, setEditingAlert] = useState<string | null>(null)
  const [editingFocus, setEditingFocus] = useState(false)
  const [newAlert, setNewAlert] = useState({ text: '', owner: '', priority: 'high' as const })
  const [newPriority, setNewPriority] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/org')
        if (response.ok) {
          const data = await response.json()
          if (data.alerts?.length > 0) setAlerts(data.alerts)
          if (data.focus?.quarter) setFocus(data.focus)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Save data
  const saveData = useCallback(async (newAlerts?: Alert[], newFocus?: FocusData) => {
    setSaving(true)
    try {
      await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alerts: newAlerts || alerts,
          focus: newFocus || focus
        })
      })
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }, [alerts, focus])

  // Alert functions
  const addAlert = () => {
    if (!newAlert.text.trim()) return
    const alert: Alert = {
      id: Date.now().toString(),
      text: newAlert.text,
      owner: newAlert.owner || 'Не назначен',
      priority: newAlert.priority
    }
    const updated = [...alerts, alert]
    setAlerts(updated)
    setNewAlert({ text: '', owner: '', priority: 'high' })
    saveData(updated)
  }

  const updateAlert = (id: string, updates: Partial<Alert>) => {
    const updated = alerts.map(a => a.id === id ? { ...a, ...updates } : a)
    setAlerts(updated)
    setEditingAlert(null)
    saveData(updated)
  }

  const deleteAlert = (id: string) => {
    const updated = alerts.filter(a => a.id !== id)
    setAlerts(updated)
    saveData(updated)
  }

  // Focus functions
  const addPriority = () => {
    if (!newPriority.trim()) return
    const updated = { ...focus, priorities: [...focus.priorities, newPriority] }
    setFocus(updated)
    setNewPriority('')
    saveData(undefined, updated)
  }

  const removePriority = (index: number) => {
    const updated = { ...focus, priorities: focus.priorities.filter((_, i) => i !== index) }
    setFocus(updated)
    saveData(undefined, updated)
  }

  const updateQuarter = (quarter: string) => {
    const updated = { ...focus, quarter }
    setFocus(updated)
    saveData(undefined, updated)
  }

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
          value={`${companyStats.total}`}
          subtitle={`${departments.length} отделов, 3 офиса`}
          icon={<Users size={24} />}
        />
      </div>

      {/* My KPI Summary - Link to full page */}
      <Card 
        title="🎯 Мои KPI & OKR" 
        action={
          <Link href="/my-okr" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
            Подробнее <ArrowRight size={14} />
          </Link>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 bg-dark-700/50 rounded-lg text-center">
            <div className="text-xl font-bold">—</div>
            <div className="text-xs text-dark-400">Выручка</div>
            <div className="text-xs text-dark-500">цель: 1,5 млрд</div>
          </div>
          <div className="p-3 bg-dark-700/50 rounded-lg text-center">
            <div className="text-xl font-bold">—</div>
            <div className="text-xs text-dark-400">Маржа</div>
            <div className="text-xs text-dark-500">цель: 30%</div>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-yellow-400">5 дн</div>
            <div className="text-xs text-dark-400">Время КП</div>
            <div className="text-xs text-yellow-500">цель: 3 дня</div>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-red-400">70%</div>
            <div className="text-xs text-dark-400">Опер. нагрузка</div>
            <div className="text-xs text-red-500">цель: 40-50%</div>
          </div>
          <div className="p-3 bg-dark-700/50 rounded-lg text-center">
            <div className="text-xl font-bold">—</div>
            <div className="text-xs text-dark-400">Производ.</div>
            <div className="text-xs text-dark-500">цель: &gt; 1.0x</div>
          </div>
        </div>
      </Card>

      {/* Business Goals & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategic Focus - EDITABLE (Business Goals) */}
        <Card 
          title="🏢 Цели бизнеса" 
          action={
            <button 
              onClick={() => setEditingFocus(!editingFocus)}
              className="text-primary-400 hover:text-primary-300"
            >
              {editingFocus ? <X size={18} /> : <Edit2 size={18} />}
            </button>
          }
        >
          {editingFocus ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-dark-400 mb-1 block">Квартал</label>
                <input
                  type="text"
                  value={focus.quarter}
                  onChange={(e) => updateQuarter(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-dark-400 mb-2 block">Приоритеты</label>
                <ul className="space-y-2">
                  {focus.priorities.map((priority, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="flex-1 text-sm">{priority}</span>
                      <button
                        onClick={() => removePriority(i)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    placeholder="Новый приоритет..."
                    className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && addPriority()}
                  />
                  <button
                    onClick={addPriority}
                    className="px-3 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm text-dark-400 mb-3">{focus.quarter}</div>
              <ul className="space-y-3">
                {focus.priorities.map((priority, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary-400 mt-1">•</span>
                    <span>{priority}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        {/* Alerts - EDITABLE */}
        <Card 
          title="🚨 Алерты и риски" 
          action={<StatusBadge status="red" size="sm" />}
        >
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li key={alert.id} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                {editingAlert === alert.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      defaultValue={alert.text}
                      className="w-full bg-dark-700 border border-dark-600 rounded px-2 py-1 text-sm"
                      onBlur={(e) => updateAlert(alert.id, { text: e.target.value })}
                    />
                    <input
                      type="text"
                      defaultValue={alert.owner}
                      placeholder="Ответственный"
                      className="w-full bg-dark-700 border border-dark-600 rounded px-2 py-1 text-sm"
                      onBlur={(e) => updateAlert(alert.id, { owner: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-red-200">{alert.text}</span>
                      <div className="text-xs text-dark-500 mt-1">{alert.owner}</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingAlert(alert.id)}
                        className="text-dark-400 hover:text-white p-1"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-dark-400 hover:text-red-400 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          {/* Add new alert */}
          <div className="mt-4 pt-4 border-t border-dark-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newAlert.text}
                onChange={(e) => setNewAlert({ ...newAlert, text: e.target.value })}
                placeholder="Новый алерт..."
                className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={addAlert}
                disabled={!newAlert.text.trim()}
                className="px-3 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-lg"
              >
                <Plus size={18} />
              </button>
            </div>
            <input
              type="text"
              value={newAlert.owner}
              onChange={(e) => setNewAlert({ ...newAlert, owner: e.target.value })}
              placeholder="Ответственный..."
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm mt-2"
            />
          </div>
        </Card>
      </div>

      {/* Departments Status */}
      <Card 
        title="📊 Статус по отделам"
        action={
          <Link href="/org-structure" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
            Редактировать оргструктуру <ArrowRight size={14} />
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Link href="/financials" className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 hover:border-green-500/50 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="font-medium">Финансы COO</div>
          <div className="text-xs text-dark-400 mt-1">Ключевые метрики</div>
        </Link>
        <Link href="/org-structure" className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">🏢</div>
          <div className="font-medium">Оргструктура</div>
          <div className="text-xs text-dark-400 mt-1">Редактировать</div>
        </Link>
        <Link href="/hr" className="p-4 bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30 hover:border-rose-500/50 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">👥</div>
          <div className="font-medium">HR</div>
          <div className="text-xs text-red-400 mt-1">Нужен HRBP</div>
        </Link>
        <Link href="/one-on-one" className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">📝</div>
          <div className="font-medium">1:1 Встречи</div>
          <div className="text-xs text-dark-400 mt-1">Архив</div>
        </Link>
        <Link href="/initiatives" className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">🚀</div>
          <div className="font-medium">Стратегия</div>
        </Link>
        <Link href="/problems" className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center">
          <div className="text-2xl mb-2">🚨</div>
          <div className="font-medium">Проблемы</div>
        </Link>
      </div>

      {/* Info */}
      <div className="text-center text-dark-500 text-sm">
        ✏️ Нажмите на карандаш для редактирования • Данные сохраняются автоматически
      </div>
    </div>
  )
}
