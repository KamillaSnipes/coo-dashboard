'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Ship, Plane, AlertTriangle } from 'lucide-react'
import CalendarView from '@/components/CalendarView'
import Card from '@/components/Card'

// Китайские праздники 2026
const chinaHolidays = [
  { id: 'cn-ny', title: '🇨🇳 Новый год (元旦)', start: [2026, 0, 1], end: [2026, 0, 3], category: 'china', description: 'Короткие каникулы — 3 дня', color: '#f59e0b' },
  { id: 'cn-spring', title: '🇨🇳 Китайский Новый год (春节)', start: [2026, 1, 9], end: [2026, 1, 23], category: 'china-critical', description: '🚨 КРИТИЧНО: 2 недели простоя фабрик! Заказы до 25 января!', color: '#ef4444', priority: 'high' as const },
  { id: 'cn-qingming', title: '🇨🇳 Цинмин (清明节)', start: [2026, 3, 4], end: [2026, 3, 6], category: 'china', description: 'День поминовения — 3 дня', color: '#f59e0b' },
  { id: 'cn-labor', title: '🇨🇳 Праздник Труда (劳动节)', start: [2026, 4, 1], end: [2026, 4, 5], category: 'china', description: 'Каникулы 5 дней', color: '#f59e0b' },
  { id: 'cn-dragon', title: '🇨🇳 Драконьи лодки (端午节)', start: [2026, 4, 19], end: [2026, 4, 21], category: 'china', description: 'Короткие каникулы — 3 дня', color: '#f59e0b' },
  { id: 'cn-autumn', title: '🇨🇳 Середина осени (中秋节)', start: [2026, 8, 25], end: [2026, 8, 27], category: 'china', description: 'Праздник луны — 3 дня', color: '#f59e0b' },
  { id: 'cn-national', title: '🇨🇳 День КНР — Золотая неделя (国庆节)', start: [2026, 9, 1], end: [2026, 9, 7], category: 'china-critical', description: '🚨 Золотая неделя! 7 дней простоя', color: '#ef4444', priority: 'high' as const },
]

// Ключевые дедлайны и события
const launchEvents = [
  // Январь
  { id: 'jan-wake', title: '📢 Просыпание рынка после НГ', start: [2026, 0, 10], end: [2026, 0, 10], category: 'sales', description: 'HR-директора (Tier 1-3), Закупки. Tier 1: IT и Финтех', color: '#22c55e' },
  { id: 'jan-deadline', title: '⚠️ Дедлайн заказов перед CNY!', start: [2026, 0, 25], end: [2026, 0, 25], category: 'deadline', description: 'Последний день для размещения заказов перед 2-недельным простоем Китая', color: '#ef4444', priority: 'high' as const },
  
  // Февраль
  { id: 'feb-23', title: '🎖️ 23 Февраля', start: [2026, 1, 23], end: [2026, 1, 23], category: 'holiday-ru', description: 'День защитника Отечества', color: '#6366f1' },
  
  // Март
  { id: 'mar-8', title: '💐 8 Марта', start: [2026, 2, 8], end: [2026, 2, 8], category: 'holiday-ru', description: 'Международный женский день', color: '#ec4899' },
  { id: 'mar-prep', title: '🚀 Старт подготовки к ПМЭФ', start: [2026, 2, 15], end: [2026, 2, 15], category: 'sales', description: 'Заказ сложных VIP-подарков с кастомными пресс-формами', color: '#22c55e' },
  
  // Май
  { id: 'may-9', title: '🎖️ 9 Мая — День Победы', start: [2026, 4, 9], end: [2026, 4, 9], category: 'holiday-ru', description: 'День Победы', color: '#ef4444' },
  
  // Июнь
  { id: 'jun-russia', title: '🇷🇺 12 Июня — День России', start: [2026, 5, 12], end: [2026, 5, 12], category: 'holiday-ru', description: 'День России', color: '#6366f1' },
  { id: 'jun-pmef', title: '🌟 ПМЭФ', start: [2026, 5, 2], end: [2026, 5, 5], category: 'sales', description: 'Петербургский международный экономический форум. Tier 1: Яндекс, Сбер, Газпром', color: '#22c55e', priority: 'high' as const },
  { id: 'jun-ng-start', title: '🚢 СТАРТ производства НГ тиражей (море)', start: [2026, 5, 15], end: [2026, 5, 15], category: 'deadline', description: '🚨 Главный дедлайн года! Запуск новогодних тиражей морем', color: '#ef4444', priority: 'high' as const },
  
  // Июль
  { id: 'jul-metallurg', title: '⚒️ День Металлурга', start: [2026, 6, 19], end: [2026, 6, 19], category: 'holiday-ru', description: 'Профессиональный праздник', color: '#6366f1' },
  { id: 'jul-deadline', title: '🚢 ФИНАЛЬНЫЙ дедлайн море → НГ', start: [2026, 6, 15], end: [2026, 6, 15], category: 'deadline', description: '⚠️ Последняя возможность отправить морем для получения до НГ!', color: '#ef4444', priority: 'high' as const },
  
  // Август
  { id: 'aug-builder', title: '🏗️ День Строителя', start: [2026, 7, 9], end: [2026, 7, 9], category: 'holiday-ru', description: 'Профессиональный праздник', color: '#6366f1' },
  
  // Сентябрь
  { id: 'sep-oil', title: '🛢️ День Нефтяника', start: [2026, 8, 6], end: [2026, 8, 6], category: 'holiday-ru', description: 'Профессиональный праздник', color: '#6366f1' },
  { id: 'sep-deadline', title: '✈️ ПОСЛЕДНИЙ дедлайн авиа → НГ', start: [2026, 8, 15], end: [2026, 8, 15], category: 'deadline', description: '🚨 Финальная возможность авиадоставки для НГ!', color: '#ef4444', priority: 'high' as const },
  
  // Ноябрь
  { id: 'nov-unity', title: '🇷🇺 4 Ноября — День народного единства', start: [2026, 10, 4], end: [2026, 10, 4], category: 'holiday-ru', description: 'Государственный праздник', color: '#6366f1' },
  { id: 'nov-receive', title: '📦 Получение НГ тиражей', start: [2026, 10, 15], end: [2026, 10, 30], category: 'logistics', description: 'Контроль таможни, получение тиражей, подготовка к отгрузке', color: '#3b82f6' },
  
  // Декабрь  
  { id: 'dec-energy', title: '⚡ День Энергетика', start: [2026, 11, 22], end: [2026, 11, 22], category: 'holiday-ru', description: 'Профессиональный праздник', color: '#6366f1' },
  { id: 'dec-8march', title: '⚠️ Дедлайн заказов на 8 Марта!', start: [2026, 11, 20], end: [2026, 11, 20], category: 'deadline', description: 'Последний день — Китай уходит на каникулы в феврале!', color: '#ef4444', priority: 'high' as const },
  { id: 'dec-ny', title: '🎄 Новый Год', start: [2026, 11, 31], end: [2026, 11, 31], category: 'holiday-ru', description: 'Новый Год', color: '#ef4444' },
]

const allEvents = [...chinaHolidays, ...launchEvents]

const categories = [
  { id: 'china-critical', name: '🇨🇳 Китай КРИТИЧНО', color: '#ef4444' },
  { id: 'china', name: '🇨🇳 Китай праздники', color: '#f59e0b' },
  { id: 'deadline', name: '⚠️ Дедлайны', color: '#ef4444' },
  { id: 'sales', name: '📈 Продажи', color: '#22c55e' },
  { id: 'holiday-ru', name: '🇷🇺 Праздники РФ', color: '#6366f1' },
  { id: 'logistics', name: '📦 Логистика', color: '#3b82f6' },
]

export default function LaunchesPage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const calendarEvents = allEvents.map(e => ({
    id: e.id,
    title: e.title,
    startDate: new Date(e.start[0], e.start[1], e.start[2]),
    endDate: e.end ? new Date(e.end[0], e.end[1], e.end[2]) : undefined,
    color: e.color,
    category: e.category,
    description: e.description,
    priority: e.priority,
  }))

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
          href="https://docs.google.com/spreadsheets/d/1hqHE41YvtW2UHA3nTxh8_tJ2a1glO1BzCi592WKpRpg/edit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
        >
          <ExternalLink size={16} />
          Таблица
        </a>
      </div>

      {/* Logistics Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-lg">
          <Ship className="text-blue-400" size={16} />
          <span className="text-blue-300">Море: 45-60 дней</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-lg">
          <Plane className="text-orange-400" size={16} />
          <span className="text-orange-300">Авиа: 7-14 дней</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-lg">
          <AlertTriangle className="text-red-400" size={16} />
          <span className="text-red-300">Критичные дедлайны</span>
        </div>
      </div>

      {/* Critical Deadlines Summary */}
      <Card className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-500/30">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🏮</span>
          <div>
            <h3 className="font-bold text-red-300">Ключевые дедлайны 2026:</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-sm">
              <div className="flex items-center gap-2 p-2 bg-dark-800/50 rounded-lg">
                <span className="text-yellow-400">25 янв</span>
                <span className="text-dark-300">→ До CNY</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-dark-800/50 rounded-lg">
                <Ship size={14} className="text-blue-400" />
                <span className="text-yellow-400">15 июн</span>
                <span className="text-dark-300">→ Старт НГ</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-dark-800/50 rounded-lg">
                <Ship size={14} className="text-blue-400" />
                <span className="text-yellow-400">15 июл</span>
                <span className="text-dark-300">→ Дедлайн море</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-dark-800/50 rounded-lg">
                <Plane size={14} className="text-orange-400" />
                <span className="text-yellow-400">15 сен</span>
                <span className="text-dark-300">→ Дедлайн авиа</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar */}
      <CalendarView 
        events={calendarEvents}
        title="План запусков 2026"
        categories={categories}
        onEventClick={(e) => setSelectedEvent(e)}
      />

      {/* Event Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-dark-800 rounded-2xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-2 h-16 rounded-full flex-shrink-0" 
                style={{ backgroundColor: selectedEvent.color }}
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
                <p className="text-dark-400 mt-1">
                  📅 {selectedEvent.startDate.getDate()} 
                  {selectedEvent.endDate && selectedEvent.endDate.getDate() !== selectedEvent.startDate.getDate() && 
                    ` — ${selectedEvent.endDate.getDate()}`
                  }
                  {' '}{['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][selectedEvent.startDate.getMonth()]} {selectedEvent.startDate.getFullYear()}
                </p>
                {selectedEvent.description && (
                  <p className="text-dark-300 mt-3">{selectedEvent.description}</p>
                )}
                {selectedEvent.priority === 'high' && (
                  <div className="mt-3 inline-block px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-lg">
                    ⚠️ Критичный дедлайн
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => setSelectedEvent(null)}
              className="mt-6 w-full py-2 bg-dark-700 hover:bg-dark-600 rounded-lg"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
