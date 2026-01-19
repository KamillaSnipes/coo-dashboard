'use client'

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/Card'
import { TrendingUp, DollarSign, Percent, BarChart3, Save, RefreshCw, Calculator, Edit2, Users } from 'lucide-react'

// Нестандартные кварталы Headcorn
// Q1: март-май
// Q2: июнь-август  
// Q3: сентябрь-ноябрь
// Q4: декабрь-февраль

interface MonthData {
  month: string
  monthNum: number
  year: number
  revenueCompleted: number  // Сумма завершений
  revenueLaunched: number   // Сумма запусков
  expenses: number          // Расходы
  marginCoef: number        // Маржинальность (коэффициент)
}

interface QuarterData {
  quarter: string
  months: string[]
  revenueCompleted: number
  revenueLaunched: number
  expenses: number
  avgMargin: number
  // Редактируемые поля ФОТ
  salary: number      // ЗП
  bonuses: number     // Бонусы
  deptExpenses: number // Расходы отдела
}

// Исходные данные из таблицы
const rawMonthlyData: MonthData[] = [
  { month: 'Март', monthNum: 3, year: 2025, revenueCompleted: 48868118.16, revenueLaunched: 12381031.46, expenses: 6487383.75, marginCoef: 1.53 },
  { month: 'Апрель', monthNum: 4, year: 2025, revenueCompleted: 24950087.91, revenueLaunched: 38969370.55, expenses: 19318921.66, marginCoef: 1.66 },
  { month: 'Май', monthNum: 5, year: 2025, revenueCompleted: 15297689.10, revenueLaunched: 33204614.72, expenses: 20969412.39, marginCoef: 1.60 },
  { month: 'Июнь', monthNum: 6, year: 2025, revenueCompleted: 16599974.34, revenueLaunched: 9031102.36, expenses: 5365570.78, marginCoef: 1.88 },
  { month: 'Июль', monthNum: 7, year: 2025, revenueCompleted: 49972590.00, revenueLaunched: 70742050.53, expenses: 17314978.27, marginCoef: 1.36 },
  { month: 'Август', monthNum: 8, year: 2025, revenueCompleted: 28788934.07, revenueLaunched: 91157055.83, expenses: 49177169.52, marginCoef: 1.76 },
  { month: 'Сентябрь', monthNum: 9, year: 2025, revenueCompleted: 29027379.15, revenueLaunched: 69247846.88, expenses: 28090838.09, marginCoef: 1.57 },
  { month: 'Октябрь', monthNum: 10, year: 2025, revenueCompleted: 11446461.01, revenueLaunched: 80336471.37, expenses: 37731125.06, marginCoef: 1.85 },
  { month: 'Ноябрь', monthNum: 11, year: 2025, revenueCompleted: 7626154.86, revenueLaunched: 30618624.79, expenses: 6485473.26, marginCoef: 2.00 },
  { month: 'Декабрь', monthNum: 12, year: 2025, revenueCompleted: 58132096.79, revenueLaunched: 15385294.00, expenses: 726098.56, marginCoef: 1.82 },
  { month: 'Январь', monthNum: 1, year: 2026, revenueCompleted: 0, revenueLaunched: 5102831.24, expenses: 0, marginCoef: 0 },
  { month: 'Февраль', monthNum: 2, year: 2026, revenueCompleted: 0, revenueLaunched: 0, expenses: 0, marginCoef: 0 },
]

// Начальные данные по кварталам
const initialQuarters: QuarterData[] = [
  {
    quarter: 'Q1 FY2025 (март-май)',
    months: ['Март 2025', 'Апрель 2025', 'Май 2025'],
    revenueCompleted: 89115895.17,
    revenueLaunched: 84555016.73,
    expenses: 46775717.80,
    avgMargin: 1.60,
    salary: 0,
    bonuses: 0,
    deptExpenses: 0,
  },
  {
    quarter: 'Q2 FY2025 (июнь-август)',
    months: ['Июнь 2025', 'Июль 2025', 'Август 2025'],
    revenueCompleted: 95361498.41,
    revenueLaunched: 170930208.72,
    expenses: 71857718.57,
    avgMargin: 1.67,
    salary: 0,
    bonuses: 0,
    deptExpenses: 0,
  },
  {
    quarter: 'Q3 FY2025 (сент-нояб)',
    months: ['Сентябрь 2025', 'Октябрь 2025', 'Ноябрь 2025'],
    revenueCompleted: 48099995.02,
    revenueLaunched: 180202943.04,
    expenses: 72307436.41,
    avgMargin: 1.81,
    salary: 0,
    bonuses: 0,
    deptExpenses: 0,
  },
  {
    quarter: 'Q4 FY2026 (дек-фев)',
    months: ['Декабрь 2025', 'Январь 2026', 'Февраль 2026'],
    revenueCompleted: 58132096.79,
    revenueLaunched: 20488125.24,
    expenses: 726098.56,
    avgMargin: 1.82,
    salary: 0,
    bonuses: 0,
    deptExpenses: 0,
  },
]

function formatMoney(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)} млрд ₽`
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)} млн ₽`
  if (value >= 1000) return `${Math.round(value / 1000)} тыс ₽`
  return `${value.toFixed(0)} ₽`
}

function formatMoneyFull(value: number): string {
  return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
}

export default function FinancialsPage() {
  const [quarters, setQuarters] = useState<QuarterData[]>(initialQuarters)
  const [viewMode, setViewMode] = useState<'quarters' | 'months'>('quarters')
  const [saving, setSaving] = useState(false)
  const [editingQuarter, setEditingQuarter] = useState<number | null>(null)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/org')
        if (response.ok) {
          const result = await response.json()
          if (result.financialQuarters?.length > 0) {
            setQuarters(result.financialQuarters)
          }
        }
      } catch (error) {
        console.error('Error loading:', error)
      }
    }
    loadData()
  }, [])

  // Save data
  const saveData = useCallback(async (newData: QuarterData[]) => {
    setSaving(true)
    try {
      await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financialQuarters: newData })
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }, [])

  // Update quarter FOT fields
  const updateQuarterFOT = (index: number, field: 'salary' | 'bonuses' | 'deptExpenses', value: number) => {
    const updated = [...quarters]
    updated[index] = { ...updated[index], [field]: value }
    setQuarters(updated)
  }

  // Save quarter
  const saveQuarter = (index: number) => {
    saveData(quarters)
    setEditingQuarter(null)
  }

  // Calculate FOT (auto)
  const getFOT = (q: QuarterData): number => {
    return q.salary + q.bonuses + q.deptExpenses
  }

  // Calculate Productivity (auto)
  const getProductivity = (q: QuarterData): number => {
    const fot = getFOT(q)
    if (fot === 0) return 0
    return q.revenueLaunched / fot
  }

  // Totals
  const totals = quarters.reduce((acc, q) => ({
    revenueCompleted: acc.revenueCompleted + q.revenueCompleted,
    revenueLaunched: acc.revenueLaunched + q.revenueLaunched,
    expenses: acc.expenses + q.expenses,
    salary: acc.salary + q.salary,
    bonuses: acc.bonuses + q.bonuses,
    deptExpenses: acc.deptExpenses + q.deptExpenses,
  }), { revenueCompleted: 0, revenueLaunched: 0, expenses: 0, salary: 0, bonuses: 0, deptExpenses: 0 })

  const totalFOT = totals.salary + totals.bonuses + totals.deptExpenses
  const totalProductivity = totalFOT > 0 ? totals.revenueLaunched / totalFOT : 0
  const avgMargin = quarters.length > 0 ? quarters.reduce((sum, q) => sum + q.avgMargin, 0) / quarters.length : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📊 Финансовые метрики COO</h1>
          <p className="text-dark-400 mt-2">Кварталы: Q1 (март-май) • Q2 (июнь-авг) • Q3 (сент-нояб) • Q4 (дек-фев)</p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-primary-400">
            <RefreshCw size={16} className="animate-spin" />
            <span>Сохранение...</span>
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('quarters')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'quarters' 
              ? 'bg-primary-600 text-white' 
              : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
          }`}
        >
          📊 По кварталам
        </button>
        <button
          onClick={() => setViewMode('months')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'months' 
              ? 'bg-primary-600 text-white' 
              : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
          }`}
        >
          📅 По месяцам
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-400" size={24} />
            <span className="text-dark-300 text-sm">Сумма завершений</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{formatMoney(totals.revenueCompleted)}</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-400" size={24} />
            <span className="text-dark-300 text-sm">Сумма запусков</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{formatMoney(totals.revenueLaunched)}</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Percent className="text-purple-400" size={24} />
            <span className="text-dark-300 text-sm">Ср. маржинальность</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{avgMargin.toFixed(2)}x</div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-orange-400" size={24} />
            <span className="text-dark-300 text-sm">Производительность</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">
            {totalProductivity > 0 ? `${totalProductivity.toFixed(2)}x` : '—'}
          </div>
          <div className="text-xs text-dark-400 mt-1">Запуски / ФОТ</div>
        </div>
      </div>

      {/* ФОТ Summary */}
      <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
        <div className="flex items-center gap-2 mb-3">
          <Users className="text-primary-400" size={20} />
          <span className="font-medium">ФОТ (автосумма)</span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-dark-400">ЗП</div>
            <div className="font-medium">{formatMoney(totals.salary)}</div>
          </div>
          <div>
            <div className="text-dark-400">Бонусы</div>
            <div className="font-medium">{formatMoney(totals.bonuses)}</div>
          </div>
          <div>
            <div className="text-dark-400">Расходы отдела</div>
            <div className="font-medium">{formatMoney(totals.deptExpenses)}</div>
          </div>
          <div>
            <div className="text-dark-400">ИТОГО ФОТ</div>
            <div className="font-bold text-primary-400">{formatMoney(totalFOT)}</div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700">
        <div className="flex items-center gap-2 text-dark-300 text-sm">
          <Calculator size={16} />
          <span className="font-medium">Формулы:</span>
          <code className="bg-dark-700 px-2 py-1 rounded ml-2">ФОТ = ЗП + Бонусы + Расходы отдела</code>
          <code className="bg-dark-700 px-2 py-1 rounded ml-2">Производительность = Сумма запусков / ФОТ</code>
        </div>
      </div>

      {viewMode === 'quarters' ? (
        /* Quarters View */
        <div className="space-y-4">
          {quarters.map((q, idx) => (
            <Card key={idx} title={`📈 ${q.quarter}`}>
              <div className="space-y-4">
                {/* Financial metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-dark-400 mb-1">Сумма завершений</div>
                    <div className="text-lg font-bold text-green-400">{formatMoney(q.revenueCompleted)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-400 mb-1">Сумма запусков</div>
                    <div className="text-lg font-bold text-blue-400">{formatMoney(q.revenueLaunched)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-400 mb-1">Расходы</div>
                    <div className="text-lg font-bold text-red-400">{formatMoney(q.expenses)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-400 mb-1">Маржинальность</div>
                    <div className="text-lg font-bold text-purple-400">{q.avgMargin.toFixed(2)}x</div>
                  </div>
                </div>

                {/* FOT editable fields */}
                <div className="pt-4 border-t border-dark-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary-400" />
                      <span className="font-medium">ФОТ квартала</span>
                    </div>
                    {editingQuarter === idx ? (
                      <button
                        onClick={() => saveQuarter(idx)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm"
                      >
                        <Save size={14} />
                        Сохранить
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingQuarter(idx)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-dark-600 hover:bg-dark-500 rounded-lg text-sm"
                      >
                        <Edit2 size={14} />
                        Редактировать
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-xs text-dark-400 mb-1 block">ЗП</label>
                      {editingQuarter === idx ? (
                        <input
                          type="number"
                          value={q.salary}
                          onChange={e => updateQuarterFOT(idx, 'salary', Number(e.target.value))}
                          className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                          placeholder="0"
                        />
                      ) : (
                        <div className="font-medium">{formatMoney(q.salary)}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-dark-400 mb-1 block">Бонусы</label>
                      {editingQuarter === idx ? (
                        <input
                          type="number"
                          value={q.bonuses}
                          onChange={e => updateQuarterFOT(idx, 'bonuses', Number(e.target.value))}
                          className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                          placeholder="0"
                        />
                      ) : (
                        <div className="font-medium">{formatMoney(q.bonuses)}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-dark-400 mb-1 block">Расходы отдела</label>
                      {editingQuarter === idx ? (
                        <input
                          type="number"
                          value={q.deptExpenses}
                          onChange={e => updateQuarterFOT(idx, 'deptExpenses', Number(e.target.value))}
                          className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                          placeholder="0"
                        />
                      ) : (
                        <div className="font-medium">{formatMoney(q.deptExpenses)}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-dark-400 mb-1 block">ФОТ (авто)</label>
                      <div className="font-bold text-primary-400">{formatMoney(getFOT(q))}</div>
                    </div>
                    <div>
                      <label className="text-xs text-dark-400 mb-1 block">Производительность</label>
                      <div className={`font-bold ${getProductivity(q) >= 1 ? 'text-green-400' : getProductivity(q) > 0 ? 'text-yellow-400' : 'text-dark-500'}`}>
                        {getProductivity(q) > 0 ? `${getProductivity(q).toFixed(2)}x` : '—'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Months included */}
                <div className="pt-3 text-xs text-dark-500">
                  Месяцы: {q.months.join(', ')}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Monthly View */
        <Card title="📅 Данные по месяцам">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-dark-400 border-b border-dark-700">
                  <th className="pb-3 font-medium">Месяц</th>
                  <th className="pb-3 font-medium text-right">Сумма завершений</th>
                  <th className="pb-3 font-medium text-right">Сумма запусков</th>
                  <th className="pb-3 font-medium text-right">Расходы</th>
                  <th className="pb-3 font-medium text-right">Маржинальность</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {rawMonthlyData.map((m, idx) => (
                  <tr key={idx} className="hover:bg-dark-700/50">
                    <td className="py-3 font-medium">{m.month} {m.year}</td>
                    <td className="py-3 text-right text-green-400">{formatMoneyFull(m.revenueCompleted)}</td>
                    <td className="py-3 text-right text-blue-400">{formatMoneyFull(m.revenueLaunched)}</td>
                    <td className="py-3 text-right text-red-400">{formatMoneyFull(m.expenses)}</td>
                    <td className="py-3 text-right">
                      <span className={m.marginCoef >= 1.7 ? 'text-green-400' : m.marginCoef >= 1.5 ? 'text-yellow-400' : 'text-dark-400'}>
                        {m.marginCoef.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-dark-700/50 font-bold">
                  <td className="py-3">ИТОГО</td>
                  <td className="py-3 text-right text-green-400">{formatMoneyFull(290709485.39)}</td>
                  <td className="py-3 text-right text-blue-400">{formatMoneyFull(456176293.73)}</td>
                  <td className="py-3 text-right text-red-400">{formatMoneyFull(191666971.34)}</td>
                  <td className="py-3 text-right text-purple-400">1.62</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <div className="text-center text-dark-500 text-sm">
        ✏️ Нажмите "Редактировать" для ввода ЗП/Бонусов/Расходов • ФОТ и Производительность считаются автоматически
      </div>
    </div>
  )
}
