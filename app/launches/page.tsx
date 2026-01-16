'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Ship, Plane, AlertTriangle, ExternalLink, Target, Users, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '@/components/Card'

interface MonthPlan {
  month: string
  monthNum: number
  events: string
  targetSegments: string
  goals: string
  tier1?: string
  tier2?: string
  tier3?: string
  isCritical?: boolean
  logistics: 'sea' | 'air' | 'both'
}

// План запусков 2026
const yearPlan: MonthPlan[] = [
  { month: 'Январь', monthNum: 1, events: 'Просыпание рынка после НГ', targetSegments: 'HR-директора, Закупки', goals: 'Запуск производства к 9 Мая. Фиксация заказов на весенние конференции.', tier1: 'IT и Финтех', tier2: 'Нефтегаз', tier3: 'EdTech', logistics: 'sea' },
  { month: 'Февраль', monthNum: 2, events: '23 Февраля, подготовка к ПМЭФ', targetSegments: 'Промышленные гиганты, IT, Финтех', goals: 'Дедлайн заказов к летним праздникам (День Металлурга, Строителя). Поиск лидов на форумах.', tier1: 'Фармацевтика', tier2: 'Девелопмент', tier3: 'HoReCa', logistics: 'sea' },
  { month: 'Март', monthNum: 3, events: '8 Марта, TransRussia', targetSegments: 'Логистика, Ритейл', goals: 'Старт подготовки к ПМЭФ (июнь). Заказ сложных VIP-подарков с кастомными пресс-формами.', tier1: 'E-Com и ритейл', tier2: 'Автопром', tier3: 'Агро', logistics: 'sea' },
  { month: 'Апрель', monthNum: 4, events: 'Нефтегаз, подготовка к лету', targetSegments: 'Oil & Gas, Энергетика', goals: 'Закрытие заказов на летний мерч. Презентация концепций «Зима 2027».', tier1: 'Банки и Страхование', tier2: 'Логистика', logistics: 'both' },
  { month: 'Май', monthNum: 5, events: '9 Мая, подготовка к ПМЭФ', targetSegments: 'Госкорпорации, Банки, Девелоперы', goals: 'Контроль отгрузок к форумам. Расчеты на «День Нефтяника».', logistics: 'both' },
  { month: 'Июнь', monthNum: 6, events: 'ПМЭФ, День России', targetSegments: 'Tier 1: Яндекс, Сбер, Газпром', goals: '🚨 ГЛАВНАЯ ЦЕЛЬ: Запуск НОВОГОДНИХ ТИРАЖЕЙ морем!', isCritical: true, logistics: 'sea' },
  { month: 'Июль', monthNum: 7, events: 'Low season, День Металлурга', targetSegments: 'Промышленность, Агросектор', goals: '⚠️ ФИНАЛЬНЫЙ ДЕДЛАЙН для морских поставок на НГ!', isCritical: true, logistics: 'sea' },
  { month: 'Август', monthNum: 8, events: 'День Строителя', targetSegments: 'Девелоперы, Tech компании', goals: 'Мерч для «Back to office» и конференций октября. Согласование образцов.', logistics: 'air' },
  { month: 'Сентябрь', monthNum: 9, events: 'День Нефтяника, WorldFood', targetSegments: 'FMCG, Food ритейл, Нефтегаз', goals: '🚨 ПОСЛЕДНИЙ ШАНС для авиа-заказов на НГ!', isCritical: true, logistics: 'air' },
  { month: 'Октябрь', monthNum: 10, events: 'Россия — спортивная держава', targetSegments: 'Спорт-бренды, IT, Госсектор', goals: 'Закрытие контрактов на Q1 2027. Подготовка «выручалочек».', logistics: 'air' },
  { month: 'Ноябрь', monthNum: 11, events: 'День народного единства', targetSegments: 'HR-департаменты, Маркетинг', goals: 'Получение НГ тиражей из Китая. Контроль таможни. Старт презентаций к 23 февраля.', logistics: 'air' },
  { month: 'Декабрь', monthNum: 12, events: 'Новый Год, День Энергетика', targetSegments: 'Энергетика, Все ТОПы', goals: '⚠️ Доставка НГ. Фиксация заказов на 8 Марта (Китай на каникулах!)', isCritical: true, logistics: 'air' },
]

export default function LaunchesPage() {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(1)
  const currentMonth = new Date().getMonth() + 1

  const getMonthColor = (monthNum: number, isCritical?: boolean) => {
    if (isCritical) return 'bg-red-500/30 border-red-500'
    if (monthNum === currentMonth) return 'bg-green-500/30 border-green-500'
    if (monthNum < currentMonth) return 'bg-dark-700 border-dark-600 opacity-60'
    return 'bg-dark-700 border-dark-600'
  }

  const getLogisticsInfo = (logistics: string) => {
    switch (logistics) {
      case 'sea': return { icon: <Ship size={14} />, label: 'Море', color: 'text-blue-400' }
      case 'air': return { icon: <Plane size={14} />, label: 'Авиа', color: 'text-orange-400' }
      case 'both': return { icon: <><Ship size={14} /><Plane size={14} /></>, label: 'Море+Авиа', color: 'text-purple-400' }
      default: return { icon: null, label: '', color: '' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/departments" className="p-2 hover:bg-dark-700 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">План запусков 2026</h1>
            <p className="text-dark-400 mt-1">Годовой план с учётом логистики из Китая</p>
          </div>
        </div>
        <a
          href="https://docs.google.com/spreadsheets/d/1hqHE41YvtW2UHA3nTxh8_tJ2a1glO1BzCi592WKpRpg/edit?gid=2027589098#gid=2027589098"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
        >
          <ExternalLink size={16} />
          Таблица
        </a>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Ship className="text-blue-400" size={18} />
          <span className="text-dark-300">Море (45-60 дней)</span>
        </div>
        <div className="flex items-center gap-2">
          <Plane className="text-orange-400" size={18} />
          <span className="text-dark-300">Авиа (7-14 дней)</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-400" size={18} />
          <span className="text-dark-300">Критичный дедлайн</span>
        </div>
      </div>

      {/* Critical Alert */}
      <Card className="bg-red-500/10 border border-red-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-400 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-red-300">Ключевые дедлайны НГ 2027:</h3>
            <div className="grid md:grid-cols-4 gap-2 mt-2 text-sm">
              <div className="flex items-center gap-2 text-red-200">
                <Ship size={14} className="text-blue-400" />
                <span><strong>Июнь</strong> — старт морем</span>
              </div>
              <div className="flex items-center gap-2 text-red-200">
                <Ship size={14} className="text-blue-400" />
                <span><strong>Июль</strong> — дедлайн море</span>
              </div>
              <div className="flex items-center gap-2 text-red-200">
                <Plane size={14} className="text-orange-400" />
                <span><strong>Сентябрь</strong> — дедлайн авиа</span>
              </div>
              <div className="flex items-center gap-2 text-red-200">
                <AlertTriangle size={14} />
                <span><strong>Декабрь</strong> — заказы на 8 Марта</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {yearPlan.map((plan) => {
          const isExpanded = expandedMonth === plan.monthNum
          const logistics = getLogisticsInfo(plan.logistics)
          
          return (
            <div
              key={plan.monthNum}
              className={`rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${getMonthColor(plan.monthNum, plan.isCritical)}`}
              onClick={() => setExpandedMonth(isExpanded ? null : plan.monthNum)}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{plan.month.slice(0, 3)}</span>
                  <div className={`flex items-center gap-1 ${logistics.color}`}>
                    {logistics.icon}
                  </div>
                </div>
                
                {plan.isCritical && (
                  <div className="flex items-center gap-1 text-red-400 text-xs mb-1">
                    <AlertTriangle size={12} />
                    <span>Критично</span>
                  </div>
                )}
                
                <div className="text-xs text-dark-400 line-clamp-2">
                  {plan.events}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expanded Month Detail */}
      {expandedMonth && (
        <Card className="border-2 border-primary-500/30">
          {(() => {
            const plan = yearPlan.find(p => p.monthNum === expandedMonth)
            if (!plan) return null
            const logistics = getLogisticsInfo(plan.logistics)

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                      plan.isCritical ? 'bg-red-500/20 text-red-300' :
                      plan.monthNum === currentMonth ? 'bg-green-500/20 text-green-300' :
                      'bg-dark-700 text-dark-300'
                    }`}>
                      {plan.monthNum}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{plan.month} 2026</h3>
                      <p className="text-dark-400">{plan.events}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-700 ${logistics.color}`}>
                    {logistics.icon}
                    <span className="text-sm">{logistics.label}</span>
                  </div>
                </div>

                {/* Goals */}
                <div className={`p-4 rounded-xl ${plan.isCritical ? 'bg-red-500/10 border border-red-500/30' : 'bg-primary-500/10 border border-primary-500/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={18} className={plan.isCritical ? 'text-red-400' : 'text-primary-400'} />
                    <span className="font-medium">Цели месяца</span>
                  </div>
                  <p className={plan.isCritical ? 'text-red-200' : ''}>{plan.goals}</p>
                </div>

                {/* Target Segments */}
                <div className="p-4 rounded-xl bg-dark-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={18} className="text-blue-400" />
                    <span className="font-medium">Кому писать</span>
                  </div>
                  <p className="text-dark-300">{plan.targetSegments}</p>
                </div>

                {/* Tiers */}
                {(plan.tier1 || plan.tier2 || plan.tier3) && (
                  <div className="grid md:grid-cols-3 gap-3">
                    {plan.tier1 && (
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="text-xs text-purple-300 mb-1">Tier 1 — Стратегический</div>
                        <div className="font-medium">{plan.tier1}</div>
                      </div>
                    )}
                    {plan.tier2 && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="text-xs text-blue-300 mb-1">Tier 2 — Индустриальный</div>
                        <div className="font-medium">{plan.tier2}</div>
                      </div>
                    )}
                    {plan.tier3 && (
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="text-xs text-green-300 mb-1">Tier 3 — Нишевой</div>
                        <div className="font-medium">{plan.tier3}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })()}
        </Card>
      )}
    </div>
  )
}
