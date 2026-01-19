'use client'

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/Card'
import { Target, TrendingUp, CheckCircle, Clock, AlertTriangle, Plus, Trash2, Edit2, Save, RefreshCw } from 'lucide-react'
import { totals, formatMoney } from '@/lib/financials'

interface KPI {
  id: string
  name: string
  current: string
  target: string
  unit: string
  progress: number // 0-100
  status: 'on_track' | 'at_risk' | 'behind'
}

interface OKR {
  id: string
  objective: string
  keyResults: {
    id: string
    description: string
    current: number
    target: number
    unit: string
  }[]
  quarter: string
}

const defaultKPIs: KPI[] = [
  {
    id: 'revenue-launched',
    name: 'Сумма запусков',
    current: formatMoney(totals.revenueLaunched),
    target: '1,5 млрд ₽',
    unit: '₽',
    progress: Math.round((totals.revenueLaunched / 1500000000) * 100),
    status: totals.revenueLaunched >= 1000000000 ? 'on_track' : 'at_risk',
  },
  {
    id: 'revenue-completed',
    name: 'Сумма завершений',
    current: formatMoney(totals.revenueCompleted),
    target: '1 млрд ₽',
    unit: '₽',
    progress: Math.round((totals.revenueCompleted / 1000000000) * 100),
    status: totals.revenueCompleted >= 500000000 ? 'on_track' : 'at_risk',
  },
  {
    id: 'margin',
    name: 'Маржинальность',
    current: `${totals.avgMargin.toFixed(2)}x`,
    target: '1.7x',
    unit: 'x',
    progress: Math.round((totals.avgMargin / 1.7) * 100),
    status: totals.avgMargin >= 1.7 ? 'on_track' : totals.avgMargin >= 1.5 ? 'at_risk' : 'behind',
  },
  {
    id: 'kp-time',
    name: 'Время КП',
    current: '5 дней',
    target: '3 дня',
    unit: 'дней',
    progress: 40,
    status: 'at_risk',
  },
  {
    id: 'ops-load',
    name: 'Операционная нагрузка продаж',
    current: '70%',
    target: '40-50%',
    unit: '%',
    progress: 30,
    status: 'behind',
  },
  {
    id: 'expenses',
    name: 'Расходы',
    current: formatMoney(totals.expenses),
    target: '< 200 млн ₽',
    unit: '₽',
    progress: totals.expenses < 200000000 ? 100 : 50,
    status: totals.expenses < 200000000 ? 'on_track' : 'at_risk',
  },
]

const defaultOKRs: OKR[] = [
  {
    id: 'okr-q1-1',
    objective: 'Оптимизировать операционные процессы для роста продаж',
    quarter: 'Q1 2026',
    keyResults: [
      { id: 'kr1', description: 'Сократить время КП с 5 до 3 дней', current: 5, target: 3, unit: 'дней' },
      { id: 'kr2', description: 'Снизить операционную нагрузку продажников', current: 70, target: 50, unit: '%' },
      { id: 'kr3', description: 'Автоматизировать генерацию договоров', current: 0, target: 100, unit: '%' },
    ],
  },
  {
    id: 'okr-q1-2',
    objective: 'Построить HR-систему для масштабирования',
    quarter: 'Q1 2026',
    keyResults: [
      { id: 'kr4', description: 'Нанять HRBP', current: 0, target: 1, unit: 'чел' },
      { id: 'kr5', description: 'Внедрить матрицу компетенций', current: 1, target: 10, unit: 'отделов' },
      { id: 'kr6', description: 'Запустить цикл оценки персонала', current: 0, target: 1, unit: '' },
    ],
  },
  {
    id: 'okr-q1-3',
    objective: 'Усилить команду продаж',
    quarter: 'Q1 2026',
    keyResults: [
      { id: 'kr7', description: 'Нанять РОПа', current: 0, target: 1, unit: 'чел' },
      { id: 'kr8', description: 'Нанять менеджеров по продажам', current: 0, target: 4, unit: 'чел' },
    ],
  },
]

export default function MyOKRPage() {
  const [kpis, setKPIs] = useState<KPI[]>(defaultKPIs)
  const [okrs, setOKRs] = useState<OKR[]>(defaultOKRs)
  const [editingKPI, setEditingKPI] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/org')
        if (response.ok) {
          const data = await response.json()
          if (data.myKPIs?.length > 0) setKPIs(data.myKPIs)
          if (data.myOKRs?.length > 0) setOKRs(data.myOKRs)
        }
      } catch (error) {
        console.error('Error loading:', error)
      }
    }
    loadData()
  }, [])

  // Save data
  const saveData = useCallback(async (newKPIs?: KPI[], newOKRs?: OKR[]) => {
    setSaving(true)
    try {
      await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          myKPIs: newKPIs || kpis,
          myOKRs: newOKRs || okrs,
        })
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }, [kpis, okrs])

  const updateKPI = (id: string, updates: Partial<KPI>) => {
    const updated = kpis.map(k => k.id === id ? { ...k, ...updates } : k)
    setKPIs(updated)
    saveData(updated)
    setEditingKPI(null)
  }

  const updateKeyResult = (okrId: string, krId: string, current: number) => {
    const updated = okrs.map(okr => {
      if (okr.id === okrId) {
        return {
          ...okr,
          keyResults: okr.keyResults.map(kr => 
            kr.id === krId ? { ...kr, current } : kr
          )
        }
      }
      return okr
    })
    setOKRs(updated)
    saveData(undefined, updated)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-400 bg-green-500/20'
      case 'at_risk': return 'text-yellow-400 bg-yellow-500/20'
      case 'behind': return 'text-red-400 bg-red-500/20'
      default: return 'text-dark-400 bg-dark-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track': return 'В плане'
      case 'at_risk': return 'Риск'
      case 'behind': return 'Отстаём'
      default: return '—'
    }
  }

  const calculateOKRProgress = (okr: OKR) => {
    const total = okr.keyResults.reduce((sum, kr) => {
      const progress = kr.target > 0 ? Math.min((kr.current / kr.target) * 100, 100) : 0
      return sum + progress
    }, 0)
    return Math.round(total / okr.keyResults.length)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🎯 Мои KPI & OKR</h1>
          <p className="text-dark-400 mt-2">Личные показатели COO — Камилла Каюмова</p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-primary-400">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">Сохранение...</span>
          </div>
        )}
      </div>

      {/* KPIs */}
      <Card title="📊 Ключевые показатели (KPI)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map(kpi => (
            <div 
              key={kpi.id}
              className="p-4 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-dark-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="font-medium">{kpi.name}</div>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(kpi.status)}`}>
                  {getStatusLabel(kpi.status)}
                </span>
              </div>
              
              {editingKPI === kpi.id ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={kpi.current}
                      placeholder="Текущее"
                      className="flex-1 bg-dark-600 border border-dark-500 rounded px-2 py-1 text-sm"
                      onBlur={(e) => updateKPI(kpi.id, { current: e.target.value })}
                    />
                    <select
                      defaultValue={kpi.status}
                      className="bg-dark-600 border border-dark-500 rounded px-2 py-1 text-sm"
                      onChange={(e) => updateKPI(kpi.id, { status: e.target.value as KPI['status'] })}
                    >
                      <option value="on_track">В плане</option>
                      <option value="at_risk">Риск</option>
                      <option value="behind">Отстаём</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold">{kpi.current}</span>
                    <span className="text-dark-400 text-sm mb-1">/ {kpi.target}</span>
                  </div>
                  
                  <div className="w-full bg-dark-600 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        kpi.status === 'on_track' ? 'bg-green-500' :
                        kpi.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${kpi.progress}%` }}
                    />
                  </div>
                  
                  <button
                    onClick={() => setEditingKPI(kpi.id)}
                    className="text-xs text-dark-400 hover:text-primary-400 flex items-center gap-1"
                  >
                    <Edit2 size={12} /> Редактировать
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* OKRs */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">📋 OKR (Q1 2026)</h2>
        
        {okrs.map(okr => {
          const progress = calculateOKRProgress(okr)
          
          return (
            <Card key={okr.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{okr.objective}</h3>
                  <p className="text-sm text-dark-400 mt-1">{okr.quarter}</p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    progress >= 70 ? 'text-green-400' :
                    progress >= 40 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {progress}%
                  </div>
                  <div className="text-xs text-dark-400">выполнено</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {okr.keyResults.map(kr => {
                  const krProgress = kr.target > 0 ? Math.min((kr.current / kr.target) * 100, 100) : 0
                  
                  return (
                    <div key={kr.id} className="p-3 bg-dark-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">{kr.description}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={kr.current}
                            onChange={(e) => updateKeyResult(okr.id, kr.id, Number(e.target.value))}
                            className="w-16 bg-dark-600 border border-dark-500 rounded px-2 py-1 text-sm text-right"
                          />
                          <span className="text-dark-400 text-sm">/ {kr.target} {kr.unit}</span>
                        </div>
                      </div>
                      <div className="w-full bg-dark-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all ${
                            krProgress >= 100 ? 'bg-green-500' :
                            krProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${krProgress}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <div className="p-6 bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/30 rounded-xl">
        <h3 className="font-semibold mb-4">📈 Общий прогресс Q1 2026</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400">
              {Math.round(okrs.reduce((sum, okr) => sum + calculateOKRProgress(okr), 0) / okrs.length)}%
            </div>
            <div className="text-sm text-dark-400">OKR</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {kpis.filter(k => k.status === 'on_track').length}/{kpis.length}
            </div>
            <div className="text-sm text-dark-400">KPI в плане</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {kpis.filter(k => k.status === 'at_risk' || k.status === 'behind').length}
            </div>
            <div className="text-sm text-dark-400">Требуют внимания</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-dark-500 text-sm">
        ✏️ Нажмите на значения для редактирования • Данные сохраняются автоматически
      </div>
    </div>
  )
}

