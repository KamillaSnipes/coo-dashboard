'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, List, Calendar, CalendarDays, LayoutGrid, Search, Plus } from 'lucide-react'

type ViewMode = 'list' | 'day' | 'week' | 'month' | 'year'

interface CalendarEvent {
  id: string
  title: string
  startDate: Date
  endDate?: Date
  color: string
  category?: string
  location?: string
  description?: string
  priority?: 'high' | 'medium' | 'low'
}

interface CalendarViewProps {
  events: CalendarEvent[]
  title: string
  categories?: { id: string; name: string; color: string }[]
  onEventClick?: (event: CalendarEvent) => void
}

const MONTHS_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const DAYS_FULL_RU = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
const getFirstDayOfMonth = (month: number, year: number) => {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export default function CalendarView({ events, title, categories, onEventClick }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('year')
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 16))
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const today = new Date()
  const isToday = (date: Date) => 
    date.getDate() === today.getDate() && 
    date.getMonth() === today.getMonth() && 
    date.getFullYear() === today.getFullYear()

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (selectedCategory && e.category !== selectedCategory) return false
      if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [events, selectedCategory, searchQuery])

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(e => {
      const start = new Date(e.startDate)
      const end = e.endDate ? new Date(e.endDate) : start
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      const checkDate = new Date(date)
      checkDate.setHours(12, 0, 0, 0)
      return checkDate >= start && checkDate <= end
    })
  }

  const navigate = (direction: number) => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + direction)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + direction * 7)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction)
        break
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + direction)
        break
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => setCurrentDate(new Date())

  const renderMiniMonth = (monthIndex: number, year: number) => {
    const daysInMonth = getDaysInMonth(monthIndex, year)
    const firstDay = getFirstDayOfMonth(monthIndex, year)
    const prevMonthDays = getDaysInMonth(monthIndex - 1, year)
    
    const days = []
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, monthIndex - 1, prevMonthDays - i) })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, monthIndex, i) })
    }
    
    // Next month days
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, monthIndex + 1, i) })
    }

    return (
      <div className="select-none">
        <h3 className="text-red-400 font-semibold mb-2 text-sm">{MONTHS_RU[monthIndex]}</h3>
        <div className="grid grid-cols-7 gap-0 text-xs">
          {DAYS_RU.map(d => (
            <div key={d} className="text-center text-dark-500 py-1 text-[10px]">{d}</div>
          ))}
          {days.map((d, i) => {
            const dayEvents = getEventsForDate(d.date)
            const isTodayDate = isToday(d.date)
            
            return (
              <div
                key={i}
                onClick={() => {
                  setCurrentDate(d.date)
                  setViewMode('day')
                }}
                className={`
                  relative text-center py-1 cursor-pointer rounded text-[11px]
                  ${d.isCurrentMonth ? 'text-dark-200' : 'text-dark-600'}
                  ${isTodayDate ? 'bg-red-500 text-white rounded-full' : 'hover:bg-dark-700'}
                `}
              >
                {d.day}
                {dayEvents.length > 0 && !isTodayDate && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-[1px]">
                    {dayEvents.slice(0, 3).map((e, j) => (
                      <div key={j} className="w-1 h-1 rounded-full" style={{ backgroundColor: e.color }} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderYearView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="bg-dark-800/50 rounded-xl p-3">
          {renderMiniMonth(i, currentDate.getFullYear())}
        </div>
      ))}
    </div>
  )

  const renderMonthView = () => {
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const daysInMonth = getDaysInMonth(month, year)
    const firstDay = getFirstDayOfMonth(month, year)
    
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)

    return (
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {DAYS_RU.map(d => (
            <div key={d} className="text-center text-dark-400 py-2 text-sm font-medium">{d}</div>
          ))}
          {days.map((day, i) => {
            if (!day) return <div key={i} className="min-h-[100px]" />
            
            const date = new Date(year, month, day)
            const dayEvents = getEventsForDate(date)
            const isTodayDate = isToday(date)
            
            return (
              <div
                key={i}
                onClick={() => {
                  setCurrentDate(date)
                  setViewMode('day')
                }}
                className={`min-h-[100px] p-2 rounded-lg border cursor-pointer transition-all hover:bg-dark-700/50
                  ${isTodayDate ? 'border-red-500 bg-red-500/10' : 'border-dark-700'}
                `}
              >
                <div className={`text-sm font-medium mb-1 ${isTodayDate ? 'text-red-400' : ''}`}>{day}</div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(e => (
                    <div
                      key={e.id}
                      className="text-xs p-1 rounded truncate"
                      style={{ backgroundColor: e.color + '30', borderLeft: `2px solid ${e.color}` }}
                      onClick={(ev) => { ev.stopPropagation(); onEventClick?.(e) }}
                    >
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-dark-400">+{dayEvents.length - 3}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    const dayOfWeek = startOfWeek.getDay()
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startOfWeek.setDate(startOfWeek.getDate() - diff)

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + i)
      return date
    })

    return (
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, i) => {
            const dayEvents = getEventsForDate(date)
            const isTodayDate = isToday(date)
            
            return (
              <div key={i} className="min-h-[400px]">
                <div className={`text-center p-2 rounded-t-lg ${isTodayDate ? 'bg-red-500' : 'bg-dark-700'}`}>
                  <div className="text-xs text-dark-300">{DAYS_RU[i]}</div>
                  <div className={`text-lg font-bold ${isTodayDate ? 'text-white' : ''}`}>{date.getDate()}</div>
                </div>
                <div className="border border-dark-700 border-t-0 rounded-b-lg p-2 min-h-[350px] space-y-1">
                  {dayEvents.map(e => (
                    <div
                      key={e.id}
                      className="text-xs p-2 rounded cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: e.color + '30', borderLeft: `3px solid ${e.color}` }}
                      onClick={() => onEventClick?.(e)}
                    >
                      <div className="font-medium">{e.title}</div>
                      {e.location && <div className="text-dark-400 text-[10px]">{e.location}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate)
    const dayOfWeek = currentDate.getDay()
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="text-dark-400">{DAYS_FULL_RU[dayIndex]}</div>
          <div className="text-4xl font-bold">{currentDate.getDate()}</div>
          <div className="text-dark-400">{MONTHS_RU[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
        </div>
        
        {dayEvents.length === 0 ? (
          <div className="text-center text-dark-400 py-12">Нет событий на этот день</div>
        ) : (
          <div className="space-y-3">
            {dayEvents.map(e => (
              <div
                key={e.id}
                className="p-4 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: e.color + '20', borderLeft: `4px solid ${e.color}` }}
                onClick={() => onEventClick?.(e)}
              >
                <div className="font-bold text-lg">{e.title}</div>
                {e.location && <div className="text-dark-300 text-sm mt-1">📍 {e.location}</div>}
                {e.description && <div className="text-dark-400 text-sm mt-2">{e.description}</div>}
                {e.endDate && e.startDate.getTime() !== e.endDate.getTime() && (
                  <div className="text-dark-400 text-sm mt-2">
                    {e.startDate.getDate()} — {e.endDate.getDate()} {MONTHS_RU[e.endDate.getMonth()]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderListView = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    
    // Group by month
    const grouped = sortedEvents.reduce((acc, event) => {
      const monthKey = `${event.startDate.getFullYear()}-${event.startDate.getMonth()}`
      if (!acc[monthKey]) acc[monthKey] = []
      acc[monthKey].push(event)
      return acc
    }, {} as Record<string, CalendarEvent[]>)

    return (
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {Object.entries(grouped).map(([key, events]) => {
          const [year, month] = key.split('-').map(Number)
          return (
            <div key={key}>
              <h3 className="text-lg font-bold text-red-400 mb-3 sticky top-0 bg-dark-900 py-2">
                {MONTHS_RU[month]} {year}
              </h3>
              <div className="space-y-2">
                {events.map(e => (
                  <div
                    key={e.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-dark-800 hover:bg-dark-700 cursor-pointer transition-colors"
                    onClick={() => onEventClick?.(e)}
                  >
                    <div className="text-center min-w-[50px]">
                      <div className="text-2xl font-bold">{e.startDate.getDate()}</div>
                      {e.endDate && e.endDate.getDate() !== e.startDate.getDate() && (
                        <div className="text-xs text-dark-400">— {e.endDate.getDate()}</div>
                      )}
                    </div>
                    <div className="w-1 h-12 rounded" style={{ backgroundColor: e.color }} />
                    <div className="flex-1">
                      <div className="font-medium">{e.title}</div>
                      {e.location && <div className="text-sm text-dark-400">{e.location}</div>}
                      {e.description && <div className="text-sm text-dark-500 line-clamp-1">{e.description}</div>}
                    </div>
                    {e.priority === 'high' && (
                      <div className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">Важно</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const getNavigationLabel = () => {
    switch (viewMode) {
      case 'year':
        return currentDate.getFullYear().toString()
      case 'month':
        return `${MONTHS_RU[currentDate.getMonth()]} ${currentDate.getFullYear()}`
      case 'week':
        const startOfWeek = new Date(currentDate)
        const dayOfWeek = startOfWeek.getDay()
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        startOfWeek.setDate(startOfWeek.getDate() - diff)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(endOfWeek.getDate() + 6)
        return `${startOfWeek.getDate()} — ${endOfWeek.getDate()} ${MONTHS_RU[endOfWeek.getMonth()]}`
      case 'day':
        return `${currentDate.getDate()} ${MONTHS_RU[currentDate.getMonth()]} ${currentDate.getFullYear()}`
      default:
        return title
    }
  }

  return (
    <div className="bg-dark-900 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-dark-700 rounded-lg"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? <Plus size={20} className="rotate-45" /> : <Search size={20} />}
          </button>
          
          {showSearch && (
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark-700 px-3 py-1.5 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-dark-800 rounded-lg p-1">
          {[
            { mode: 'list' as ViewMode, icon: <List size={16} />, label: 'Список' },
            { mode: 'day' as ViewMode, icon: <Calendar size={16} />, label: 'День' },
            { mode: 'week' as ViewMode, icon: <CalendarDays size={16} />, label: 'Неделя' },
            { mode: 'month' as ViewMode, icon: <LayoutGrid size={16} />, label: 'Месяц' },
            { mode: 'year' as ViewMode, label: 'Год' },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5
                ${viewMode === mode ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white'}
              `}
            >
              {icon}
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">{getNavigationLabel()}</h2>
        
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-dark-700 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToToday}
            className="px-4 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
          >
            Сегодня
          </button>
          <button onClick={() => navigate(1)} className="p-2 hover:bg-dark-700 rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      {categories && categories.length > 0 && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-xs transition-colors
              ${!selectedCategory ? 'bg-dark-600 text-white' : 'bg-dark-800 text-dark-400 hover:text-white'}
            `}
          >
            Все
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1.5
                ${selectedCategory === cat.id ? 'text-white' : 'text-dark-400 hover:text-white'}
              `}
              style={{ 
                backgroundColor: selectedCategory === cat.id ? cat.color + '40' : undefined,
                borderColor: cat.color
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="overflow-auto max-h-[calc(100vh-300px)]">
        {viewMode === 'year' && renderYearView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'list' && renderListView()}
      </div>
    </div>
  )
}

