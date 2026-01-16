'use client'

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/Card'
import { TrendingUp, DollarSign, Percent, BarChart3, Plus, Trash2, Save, RefreshCw, Calculator, Edit2 } from 'lucide-react'

interface FinancialPeriod {
  id: string
  period: string
  type: 'month' | 'quarter' | 'year'
  revenueStarted: number
  revenueClosed: number
  marginClosed: number
  projectsSum: number
  fot: number
}

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

function formatPeriod(period: string, type: string): string {
  if (type === 'month') {
    const [year, month] = period.split('-')
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }
  if (type === 'quarter') {
    return period.replace('-', ' ')
  }
  return period
}

function formatMoney(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)} млрд ₽`
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)} млн ₽`
  if (value >= 1000) return `${(value / 1000).toFixed(0)} тыс ₽`
  return `${value} ₽`
}

export default function FinancialsPage() {
  const [data, setData] = useState<FinancialPeriod[]>([])
  const [viewMode, setViewMode] = useState<'month' | 'quarter' | 'year'>('month')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPeriod, setNewPeriod] = useState({
    period: '2026-01',
    type: 'month' as const,
    revenueStarted: 0,
    revenueClosed: 0,
    marginClosed: 0,
    projectsSum: 0,
    fot: 0,
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/org')
        if (response.ok) {
          const result = await response.json()
          if (result.financials?.length > 0) {
            setData(result.financials)
          }
        }
      } catch (error) {
        console.error('Error loading:', error)
      }
    }
    loadData()
  }, [])

  // Save data
  const saveData = useCallback(async (newData: FinancialPeriod[]) => {
    setSaving(true)
    try {
      await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financials: newData })
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }, [])

  // Add period
  const addPeriod = () => {
    const period: FinancialPeriod = {
      id: Date.now().toString(),
      ...newPeriod
    }
    const updated = [...data, period].sort((a, b) => b.period.localeCompare(a.period))
    setData(updated)
    saveData(updated)
    setShowAddForm(false)
    setNewPeriod({
      period: '2026-01',
      type: 'month',
      revenueStarted: 0,
      revenueClosed: 0,
      marginClosed: 0,
      projectsSum: 0,
      fot: 0,
    })
  }

  // Update period
  const updatePeriod = (id: string, updates: Partial<FinancialPeriod>) => {
    const updated = data.map(p => p.id === id ? { ...p, ...updates } : p)
    setData(updated)
    saveData(updated)
  }

  // Delete period
  const deletePeriod = (id: string) => {
    if (!confirm('Удалить период?')) return
    const updated = data.filter(p => p.id !== id)
    setData(updated)
    saveData(updated)
  }

  // Calculate productivity
  const getProductivity = (p: FinancialPeriod): number => {
    if (p.fot === 0) return 0
    return p.projectsSum / p.fot
  }

  // Filter by view mode
  const filteredData = data.filter(p => p.type === viewMode)

  // Aggregates
  const totals = filteredData.reduce((acc, p) => ({
    revenueStarted: acc.revenueStarted + p.revenueStarted,
    revenueClosed: acc.revenueClosed + p.revenueClosed,
    projectsSum: acc.projectsSum + p.projectsSum,
    fot: acc.fot + p.fot,
    marginSum: acc.marginSum + p.marginClosed,
    count: acc.count + 1,
  }), { revenueStarted: 0, revenueClosed: 0, projectsSum: 0, fot: 0, marginSum: 0, count: 0 })

  const avgMargin = totals.count > 0 ? totals.marginSum / totals.count : 0
  const avgProductivity = totals.fot > 0 ? totals.projectsSum / totals.fot : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📊 Финансовые метрики COO</h1>
          <p className="text-dark-400 mt-2">Выручка, маржинальность, производительность</p>
        </div>
        <div className="flex gap-2">
          {saving && (
            <div className="flex items-center gap-2 text-primary-400">
              <RefreshCw size={16} className="animate-spin" />
            </div>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
          >
            <Plus size={18} />
            Добавить период
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        {(['month', 'quarter', 'year'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === mode 
                ? 'bg-primary-600 text-white' 
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            {mode === 'month' ? '📅 Помесячно' : mode === 'quarter' ? '📊 Поквартально' : '📈 Годовой'}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-400" size={24} />
            <span className="text-dark-300 text-sm">Выручка (запущ.)</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{formatMoney(totals.revenueStarted)}</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-400" size={24} />
            <span className="text-dark-300 text-sm">Выручка (закрыт.)</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{formatMoney(totals.revenueClosed)}</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Percent className="text-purple-400" size={24} />
            <span className="text-dark-300 text-sm">Ср. маржинальность</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{avgMargin.toFixed(1)}%</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-orange-400" size={24} />
            <span className="text-dark-300 text-sm">Производительность</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{avgProductivity.toFixed(2)}x</div>
          <div className="text-xs text-dark-400 mt-1">Проекты / ФОТ</div>
        </div>
      </div>

      {/* Formula explanation */}
      <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
        <div className="flex items-center gap-2 text-dark-300 text-sm">
          <Calculator size={16} />
          <span className="font-medium">Формула производительности:</span>
          <code className="bg-dark-700 px-2 py-1 rounded">Сумма запущенных проектов / ФОТ (ЗП + ДМС + расходы отделов)</code>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card title="➕ Добавить период">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-dark-400 mb-1 block">Период</label>
              <input
                type="text"
                value={newPeriod.period}
                onChange={e => setNewPeriod({ ...newPeriod, period: e.target.value })}
                placeholder="2026-01"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-dark-400 mb-1 block">Тип</label>
              <select
                value={newPeriod.type}
                onChange={e => setNewPeriod({ ...newPeriod, type: e.target.value as 'month' | 'quarter' | 'year' })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2"
              >
                <option value="month">Месяц</option>
                <option value="quarter">Квартал</option>
                <option value="year">Год</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-dark-400 mb-1 block">Выручка (запущ.)</label>
              <input
                type="number"
                value={newPeriod.revenueStarted}
                onChange={e => setNewPeriod({ ...newPeriod, revenueStarted: Number(e.target.value) })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-dark-400 mb-1 block">Выручка (закрыт.)</label>
              <input
                type="number"
                value={newPeriod.revenueClosed}
                onChange={e => setNewPeriod({ ...newPeriod, revenueClosed: Number(e.target.value) })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-dark-400 mb-1 block">Маржа, %</label>
              <input
                type="number"
                value={newPeriod.marginClosed}
                onChange={e => setNewPeriod({ ...newPeriod, marginClosed: Number(e.target.value) })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-dark-400 mb-1 block">Сумма проектов</label>
              <input
                type="number"
                value={newPeriod.projectsSum}
                onChange={e => setNewPeriod({ ...newPeriod, projectsSum: Number(e.target.value) })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-dark-400 mb-1 block">ФОТ</label>
              <input
                type="number"
                value={newPeriod.fot}
                onChange={e => setNewPeriod({ ...newPeriod, fot: Number(e.target.value) })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={addPeriod}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
              >
                <Save size={18} />
                Добавить
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Data Table */}
      <Card title={`📋 Данные по периодам (${filteredData.length})`}>
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-dark-500">
            <div className="text-4xl mb-4">📭</div>
            <div>Нет данных за выбранный период</div>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white"
            >
              Добавить первый период
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-dark-400 text-sm border-b border-dark-700">
                  <th className="pb-4 font-medium">Период</th>
                  <th className="pb-4 font-medium text-right">Выручка (запущ.)</th>
                  <th className="pb-4 font-medium text-right">Выручка (закрыт.)</th>
                  <th className="pb-4 font-medium text-right">Маржа</th>
                  <th className="pb-4 font-medium text-right">Сумма проектов</th>
                  <th className="pb-4 font-medium text-right">ФОТ</th>
                  <th className="pb-4 font-medium text-right">Производительность</th>
                  <th className="pb-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredData.map(period => (
                  <tr key={period.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="py-4 font-medium">{formatPeriod(period.period, period.type)}</td>
                    <td className="py-4 text-right">
                      {editingId === period.id ? (
                        <input
                          type="number"
                          value={period.revenueStarted}
                          onChange={e => updatePeriod(period.id, { revenueStarted: Number(e.target.value) })}
                          className="w-24 bg-dark-600 border border-dark-500 rounded px-2 py-1 text-right"
                        />
                      ) : (
                        <span className="text-green-400">{formatMoney(period.revenueStarted)}</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {editingId === period.id ? (
                        <input
                          type="number"
                          value={period.revenueClosed}
                          onChange={e => updatePeriod(period.id, { revenueClosed: Number(e.target.value) })}
                          className="w-24 bg-dark-600 border border-dark-500 rounded px-2 py-1 text-right"
                        />
                      ) : (
                        <span className="text-blue-400">{formatMoney(period.revenueClosed)}</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {editingId === period.id ? (
                        <input
                          type="number"
                          value={period.marginClosed}
                          onChange={e => updatePeriod(period.id, { marginClosed: Number(e.target.value) })}
                          className="w-16 bg-dark-600 border border-dark-500 rounded px-2 py-1 text-right"
                        />
                      ) : (
                        <span className={period.marginClosed >= 30 ? 'text-green-400' : 'text-yellow-400'}>
                          {period.marginClosed}%
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {editingId === period.id ? (
                        <input
                          type="number"
                          value={period.projectsSum}
                          onChange={e => updatePeriod(period.id, { projectsSum: Number(e.target.value) })}
                          className="w-24 bg-dark-600 border border-dark-500 rounded px-2 py-1 text-right"
                        />
                      ) : (
                        formatMoney(period.projectsSum)
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {editingId === period.id ? (
                        <input
                          type="number"
                          value={period.fot}
                          onChange={e => updatePeriod(period.id, { fot: Number(e.target.value) })}
                          className="w-24 bg-dark-600 border border-dark-500 rounded px-2 py-1 text-right"
                        />
                      ) : (
                        formatMoney(period.fot)
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`font-bold ${getProductivity(period) >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                        {getProductivity(period).toFixed(2)}x
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => setEditingId(editingId === period.id ? null : period.id)}
                          className={`p-1.5 rounded ${editingId === period.id ? 'bg-primary-600' : 'hover:bg-dark-600'}`}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deletePeriod(period.id)}
                          className="p-1.5 hover:bg-dark-600 rounded text-dark-400 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Instructions */}
      <div className="text-center text-dark-500 text-sm">
        ✏️ Нажмите на карандаш для редактирования данных • Данные сохраняются автоматически
      </div>
    </div>
  )
}

