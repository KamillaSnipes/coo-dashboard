'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '@/components/Card'

interface Event {
  id: string
  day: number
  name: string
  city: string
  topic: string
  venue: string
  isMarketingRelated: boolean
  priority: 'high' | 'medium' | 'low'
  endDay?: number
}

interface MonthData {
  month: string
  monthNum: number
  year: number
  events: Event[]
}

// Календарь выставок 2026
const calendarData: MonthData[] = [
  {
    month: 'Январь', monthNum: 1, year: 2026,
    events: [
      { id: 'efea', day: 21, endDay: 23, name: 'EFEA 2026', city: 'СПб', topic: 'Ивент, Маркетинг, HR', venue: 'ПетроКонгресс', isMarketingRelated: true, priority: 'high' },
    ]
  },
  {
    month: 'Февраль', monthNum: 2, year: 2026,
    events: [
      { id: 'prodexpo', day: 9, endDay: 12, name: 'ПРОДЭКСПО', city: 'Мск', topic: 'Продукты питания', venue: 'Крокус Экспо', isMarketingRelated: false, priority: 'medium' },
      { id: 'b2b-pr', day: 11, name: 'B2B PR+ Forum', city: 'Мск', topic: 'PR B2B', venue: 'Холидей Инн Лесная', isMarketingRelated: true, priority: 'high' },
      { id: 'pr-forum', day: 11, endDay: 13, name: 'PR+ Forum', city: 'Мск', topic: 'PR', venue: 'Лесная Сафмар', isMarketingRelated: true, priority: 'high' },
      { id: 'hospitality', day: 12, endDay: 15, name: 'Hospitality Sales', city: 'СПб', topic: 'HoReCa', venue: 'СПб', isMarketingRelated: false, priority: 'medium' },
      { id: 'reklam-hub', day: 17, endDay: 18, name: 'Рекламный хаб', city: 'СПб', topic: 'B2B Реклама', venue: 'Экспофорум', isMarketingRelated: true, priority: 'high' },
      { id: 'cjf', day: 17, endDay: 19, name: 'CJF Детская мода', city: 'Мск', topic: 'Мода', venue: 'Тимирязев Центр', isMarketingRelated: false, priority: 'low' },
      { id: 'kadry', day: 19, endDay: 20, name: 'Кадровый резерв', city: 'Мск', topic: 'HR', venue: 'Radisson Blu', isMarketingRelated: false, priority: 'medium' },
      { id: 'lakokraska', day: 24, endDay: 27, name: 'ИНТЕРЛАКОКРАСКА', city: 'Мск', topic: 'Промышленность', venue: 'Тимирязев Центр', isMarketingRelated: false, priority: 'low' },
      { id: 'pr-force', day: 26, name: 'PR FORCE', city: 'Мск', topic: 'PR-директора', venue: 'Красносельская', isMarketingRelated: true, priority: 'high' },
      { id: 'new-media', day: 27, name: 'NEW MEDIA FORCE', city: 'Мск', topic: 'PR', venue: 'Красносельская', isMarketingRelated: true, priority: 'high' },
    ]
  },
  {
    month: 'Март', monthNum: 3, year: 2026,
    events: [
      { id: 'neftegaz', day: 2, endDay: 5, name: 'НЕФТЕГАЗ', city: 'Мск', topic: 'Нефтегаз', venue: 'Крокус Экспо', isMarketingRelated: false, priority: 'medium' },
      { id: 'shiny', day: 2, endDay: 5, name: 'ШИНЫ, РТИ', city: 'Мск', topic: 'Промышленность', venue: 'Москва', isMarketingRelated: false, priority: 'low' },
      { id: 'steklo', day: 4, endDay: 6, name: 'МИР СТЕКЛА', city: 'Мск', topic: 'Промышленность', venue: 'Москва', isMarketingRelated: false, priority: 'low' },
      { id: 'spring-mkt', day: 5, name: 'Spring Marketing Forum', city: 'СПб', topic: 'Маркетинг', venue: 'Коринтия', isMarketingRelated: true, priority: 'high' },
      { id: 'business-force', day: 12, name: 'BUSINESS FORCE', city: 'Мск', topic: 'Маркетинг, Продажи', venue: 'IRRI-LOFT', isMarketingRelated: true, priority: 'high' },
      { id: 'textile', day: 16, endDay: 19, name: 'Текстильная неделя', city: 'Мск', topic: 'Текстиль', venue: 'Тимирязев Центр', isMarketingRelated: false, priority: 'medium' },
      { id: 'consumer', day: 18, name: 'Consumer Brand', city: 'Мск', topic: 'FMCG бренды', venue: 'Сущевский Сафмар', isMarketingRelated: true, priority: 'high' },
      { id: 'fmcg', day: 20, name: 'FMCG & Retail Forum', city: 'Мск', topic: 'Торговый маркетинг', venue: 'Сущевский Сафмар', isMarketingRelated: true, priority: 'high' },
      { id: 'soldout', day: 23, endDay: 24, name: 'SOLD OUT', city: 'СПб', topic: 'Форум', venue: 'Cosmos Hotel', isMarketingRelated: false, priority: 'medium' },
    ]
  },
]

const getDaysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate()
const getFirstDayOfMonth = (month: number, year: number) => {
  const day = new Date(year, month - 1, 1).getDay()
  return day === 0 ? 6 : day - 1 // Понедельник = 0
}

export default function EventsPage() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0)
  
  const currentData = calendarData[currentMonthIdx] || calendarData[0]
  const daysInMonth = getDaysInMonth(currentData.monthNum, currentData.year)
  const firstDay = getFirstDayOfMonth(currentData.monthNum, currentData.year)

  const getEventsForDay = (day: number) => {
    return currentData.events.filter(e => {
      if (e.endDay) {
        return day >= e.day && day <= e.endDay
      }
      return e.day === day
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/departments" className="p-2 hover:bg-dark-700 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Календарь выставок 2026</h1>
            <p className="text-dark-400 mt-1">План посещения выставок и форумов</p>
          </div>
        </div>
        <a
          href="https://docs.google.com/spreadsheets/d/1JLZNhgD0aod1weiMqynKmY_oAhnP3bJTiCi1xuiwq_w/edit?gid=1741008272#gid=1741008272"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
        >
          <ExternalLink size={16} />
          Таблица
        </a>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-dark-300">Высокий приоритет (Маркетинг)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-dark-300">Средний</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-dark-300">Низкий</span>
        </div>
      </div>

      {/* Month Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentMonthIdx(Math.max(0, currentMonthIdx - 1))}
            disabled={currentMonthIdx === 0}
            className="p-2 hover:bg-dark-700 rounded-lg disabled:opacity-30"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold">{currentData.month} {currentData.year}</h2>
          <button
            onClick={() => setCurrentMonthIdx(Math.min(calendarData.length - 1, currentMonthIdx + 1))}
            disabled={currentMonthIdx === calendarData.length - 1}
            className="p-2 hover:bg-dark-700 rounded-lg disabled:opacity-30"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        {/* Days header */}
        <div className="grid grid-cols-7 border-b border-dark-700">
          {days.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-dark-400 border-r border-dark-700 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-2 border-r border-b border-dark-700 bg-dark-900/50"></div>
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayEvents = getEventsForDay(day)
            const isWeekend = (firstDay + i) % 7 >= 5

            return (
              <div 
                key={day} 
                className={`min-h-[100px] p-2 border-r border-b border-dark-700 last:border-r-0 ${isWeekend ? 'bg-dark-900/30' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${isWeekend ? 'text-dark-500' : 'text-dark-300'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={`${event.id}-${day}`}
                      className={`text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                        event.isMarketingRelated ? 'bg-red-500/20 text-red-200 border border-red-500/30' :
                        event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30' :
                        'bg-dark-600 text-dark-300'
                      }`}
                      title={`${event.name}\n${event.topic}\n${event.city} • ${event.venue}`}
                    >
                      <div className="flex items-center gap-1">
                        {event.isMarketingRelated && <Star size={10} className="text-yellow-400 fill-yellow-400" />}
                        <span className="truncate font-medium">{event.name}</span>
                      </div>
                      <div className="text-[10px] opacity-70 flex items-center gap-1 mt-0.5">
                        <MapPin size={8} />
                        {event.city}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Events List for current month */}
      <Card>
        <h3 className="font-bold mb-4">Все мероприятия {currentData.month}а</h3>
        <div className="space-y-2">
          {currentData.events.length === 0 ? (
            <p className="text-dark-400 text-sm">Нет мероприятий в этом месяце</p>
          ) : (
            currentData.events
              .sort((a, b) => a.day - b.day)
              .map(event => (
                <div 
                  key={event.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    event.isMarketingRelated ? 'border-l-red-500 bg-red-500/5' :
                    event.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-500/5' :
                    'border-l-gray-500 bg-dark-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {event.isMarketingRelated && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                        <span className="font-medium">{event.name}</span>
                      </div>
                      <div className="text-sm text-dark-400 mt-1">
                        {event.topic} • {event.venue}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {event.day}{event.endDay ? `–${event.endDay}` : ''} {currentData.month.slice(0, 3)}
                      </div>
                      <div className="text-sm text-dark-400 flex items-center gap-1 justify-end">
                        <MapPin size={12} />
                        {event.city}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  )
}
