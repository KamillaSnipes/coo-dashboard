'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Target, Users, Rocket, Ship, Plane, AlertTriangle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '@/components/Card'

interface LaunchPlan {
  month: string
  monthNum: number
  events: string
  targetSegments: string
  goals: string
  tier1?: string
  tier2?: string
  tier3?: string
  isCurrentMonth?: boolean
  isCritical?: boolean
  logistics?: 'sea' | 'air' | 'both'
}

// План запусков 2026 (с учетом логистики из Китая)
const launchPlans: LaunchPlan[] = [
  {
    month: 'Январь',
    monthNum: 1,
    events: 'Просыпание рынка после НГ',
    targetSegments: 'HR-директора (Tier 1-3), Закупки',
    goals: 'Запуск производства к 9 Мая. Фиксация заказов на мерч для весенних конференций.',
    tier1: 'IT и Финтех',
    tier2: 'Нефтегаз и энергетика',
    tier3: 'Образование (EdTech)',
    isCurrentMonth: true,
    logistics: 'sea'
  },
  {
    month: 'Февраль',
    monthNum: 2,
    events: '23 Февраля, подготовка к ПМЭФ',
    targetSegments: 'Промышленные гиганты, IT, Финтех',
    goals: 'Дедлайн заказов к профессиональным праздникам лета (День Металлурга, День Строителя). Поиск лидов на форумах.',
    tier1: 'Фармацевтика',
    tier2: 'Девелопмент (стройка)',
    tier3: 'HoReCa (отели/рестораны)',
    logistics: 'sea'
  },
  {
    month: 'Март',
    monthNum: 3,
    events: '8 Марта, выставка TransRussia',
    targetSegments: 'Логистические компании, Ритейл',
    goals: 'Старт подготовки к ПМЭФ (июнь). Заказ сложных VIP-подарков, которые требуют кастомных пресс-форм в Китае.',
    tier1: 'E-Com и ритейл',
    tier2: 'Автопром и дилеры',
    tier3: 'Агропромышленность',
    logistics: 'sea'
  },
  {
    month: 'Апрель',
    monthNum: 4,
    events: 'Выставка «Нефтегаз», подготовка к лету',
    targetSegments: 'Oil & Gas (Tier 2), Энергетика',
    goals: 'Закрытие заказов на летний корпоративный мерч. Презентация концепций «Зима 2027» (да, уже сейчас).',
    tier1: 'Банки и Страхование',
    tier2: 'Логистика',
    logistics: 'both'
  },
  {
    month: 'Май',
    monthNum: 5,
    events: '9 Мая, подготовка к ПМЭФ',
    targetSegments: 'Госкорпорации, Банки, Девелоперы',
    goals: 'Контроль отгрузок к форумам. Предварительные расчеты на «День Нефтяника» (сентябрь).',
    logistics: 'both'
  },
  {
    month: 'Июнь',
    monthNum: 6,
    events: 'ПМЭФ (Петербургский форум), День России',
    targetSegments: 'Tier 1 (Яндекс, Сбер, Газпром и т.д.)',
    goals: '🚨 Сбор лидов на ПМЭФ. ГЛАВНАЯ ЦЕЛЬ: Запуск производства НОВОГОДНИХ ТИРАЖЕЙ морем, чтобы успеть до заторов.',
    isCritical: true,
    logistics: 'sea'
  },
  {
    month: 'Июль',
    monthNum: 7,
    events: 'Low season (отпуска), День Металлурга',
    targetSegments: 'Промышленные холдинги, Агросектор',
    goals: '⚠️ ФИНАЛЬНЫЙ ДЕДЛАЙН для «морских» поставок на Новый Год. Показ National-style коллекций (РФ тематика).',
    isCritical: true,
    logistics: 'sea'
  },
  {
    month: 'Август',
    monthNum: 8,
    events: 'День Строителя, подготовка к осени',
    targetSegments: 'Девелоперы (Tier 1-2), Tech компании',
    goals: 'Продажа мерча для «Back to office» и конференций октября. Согласование образцов (Samples) для зимних проектов.',
    logistics: 'air'
  },
  {
    month: 'Сентябрь',
    monthNum: 9,
    events: 'День Нефтяника, выставка WorldFood',
    targetSegments: 'FMCG, Food ритейл, Нефтегаз',
    goals: '🚨 Фиксация «авиа-заказов» на Новый Год (ПОСЛЕДНИЙ ШАНС УСПЕТЬ). Запуск мерча для выставки ИТ-технологий.',
    isCritical: true,
    logistics: 'air'
  },
  {
    month: 'Октябрь',
    monthNum: 10,
    events: 'Форум «Россия — спортивная держава»',
    targetSegments: 'Спорт-бренды, IT-сектор, Госсектор',
    goals: 'Закрытие контрактов на Q1 2027 (февраль/март). Подготовка «подарков-выручалочек», которые всегда нужны.',
    logistics: 'air'
  },
  {
    month: 'Ноябрь',
    monthNum: 11,
    events: 'День народного единства (4 нояб.)',
    targetSegments: 'HR-департаменты, Маркетинг',
    goals: 'Получение и распределение НГ тиражей из Китая. Контроль таможни. Старт презентаций к 23 февраля.',
    logistics: 'air'
  },
  {
    month: 'Декабрь',
    monthNum: 12,
    events: 'Новый Год, День Энергетика',
    targetSegments: 'Энергетические компании, Все ТОПы',
    goals: '⚠️ Доставка НГ подарков. Фиксация заказов на 8 Марта (Китай уходит на каникулы в январе/феврале — это КРИТИЧНО!).',
    isCritical: true,
    logistics: 'air'
  },
]

export default function LaunchesPage() {
  const [expandedMonth, setExpandedMonth] = useState<string | null>('Январь')
  
  const currentMonth = new Date().getMonth() + 1 // 1-12

  const getMonthStatus = (monthNum: number) => {
    if (monthNum < currentMonth) return 'past'
    if (monthNum === currentMonth) return 'current'
    return 'future'
  }

  const getStatusColor = (status: string, isCritical?: boolean) => {
    if (isCritical) return 'border-l-red-500 bg-red-500/5'
    switch (status) {
      case 'past': return 'border-l-gray-500 opacity-60'
      case 'current': return 'border-l-green-500 bg-green-500/5'
      case 'future': return 'border-l-blue-500'
      default: return 'border-l-dark-600'
    }
  }

  const getLogisticsIcon = (logistics?: string) => {
    switch (logistics) {
      case 'sea': return <Ship className="text-blue-400" size={16} />
      case 'air': return <Plane className="text-orange-400" size={16} />
      case 'both': return (
        <div className="flex gap-1">
          <Ship className="text-blue-400" size={16} />
          <Plane className="text-orange-400" size={16} />
        </div>
      )
      default: return null
    }
  }

  const getLogisticsLabel = (logistics?: string) => {
    switch (logistics) {
      case 'sea': return 'Морская доставка (~45-60 дней)'
      case 'air': return 'Авиа доставка (~7-14 дней)'
      case 'both': return 'Море + Авиа'
      default: return ''
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
            <p className="text-dark-400 mt-1">Годовой план продаж с учётом логистики из Китая</p>
          </div>
        </div>
        <a
          href="https://docs.google.com/spreadsheets/d/1hqHE41YvtW2UHA3nTxh8_tJ2a1glO1BzCi592WKpRpg/edit?gid=2027589098#gid=2027589098"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
        >
          <ExternalLink size={16} />
          Открыть таблицу
        </a>
      </div>

      {/* Legend */}
      <Card className="bg-dark-800/50">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Ship className="text-blue-400" size={18} />
            <span className="text-dark-300">Морская доставка (45-60 дней)</span>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="text-orange-400" size={18} />
            <span className="text-dark-300">Авиа доставка (7-14 дней)</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-400" size={18} />
            <span className="text-dark-300">Критичный дедлайн</span>
          </div>
        </div>
      </Card>

      {/* Critical Deadlines Alert */}
      <Card className="bg-red-500/10 border border-red-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-400 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-red-300">Ключевые дедлайны для Нового Года 2027:</h3>
            <ul className="mt-2 space-y-1 text-sm text-red-200">
              <li>🚢 <strong>Июнь</strong> — запуск производства НГ тиражей (морем)</li>
              <li>🚢 <strong>Июль</strong> — финальный дедлайн для морских поставок</li>
              <li>✈️ <strong>Сентябрь</strong> — последний шанс для авиа-заказов на НГ</li>
              <li>⚠️ <strong>Декабрь</strong> — фиксация заказов на 8 Марта (Китай на каникулах!)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Monthly Plans */}
      <div className="space-y-3">
        {launchPlans.map((plan) => {
          const status = getMonthStatus(plan.monthNum)
          const isExpanded = expandedMonth === plan.month

          return (
            <Card 
              key={plan.month}
              className={`border-l-4 ${getStatusColor(status, plan.isCritical)} overflow-hidden transition-all`}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedMonth(isExpanded ? null : plan.month)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    status === 'current' ? 'bg-green-500/20 text-green-300' :
                    plan.isCritical ? 'bg-red-500/20 text-red-300' :
                    'bg-dark-700 text-dark-300'
                  }`}>
                    {plan.monthNum}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{plan.month}</span>
                      {status === 'current' && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded">
                          Текущий
                        </span>
                      )}
                      {plan.isCritical && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Критично
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-dark-400">{plan.events}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getLogisticsIcon(plan.logistics)}
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-dark-700 space-y-4">
                  {/* Goals */}
                  <div className={`p-4 rounded-xl ${plan.isCritical ? 'bg-red-500/10 border border-red-500/20' : 'bg-primary-500/10 border border-primary-500/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className={plan.isCritical ? 'text-red-400' : 'text-primary-400'} />
                      <span className="font-medium">Цели месяца</span>
                    </div>
                    <p className="text-sm">{plan.goals}</p>
                  </div>

                  {/* Target Segments */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-blue-400" />
                      <span className="font-medium text-sm">Кому писать</span>
                    </div>
                    <p className="text-sm text-dark-300">{plan.targetSegments}</p>
                  </div>

                  {/* Logistics */}
                  {plan.logistics && (
                    <div className="flex items-center gap-2 text-sm">
                      {getLogisticsIcon(plan.logistics)}
                      <span className="text-dark-400">{getLogisticsLabel(plan.logistics)}</span>
                    </div>
                  )}

                  {/* Tiers */}
                  {(plan.tier1 || plan.tier2 || plan.tier3) && (
                    <div className="grid md:grid-cols-3 gap-3">
                      {plan.tier1 && (
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                          <div className="text-xs text-purple-300 mb-1">Tier 1 — Стратегический</div>
                          <div className="text-sm font-medium">{plan.tier1}</div>
                        </div>
                      )}
                      {plan.tier2 && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="text-xs text-blue-300 mb-1">Tier 2 — Индустриальный</div>
                          <div className="text-sm font-medium">{plan.tier2}</div>
                        </div>
                      )}
                      {plan.tier3 && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="text-xs text-green-300 mb-1">Tier 3 — Нишевой</div>
                          <div className="text-sm font-medium">{plan.tier3}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

