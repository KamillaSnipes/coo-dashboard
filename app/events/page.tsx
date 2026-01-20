'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Plus, Edit2, X, Trash2, RefreshCw } from 'lucide-react'
import CalendarView from '@/components/CalendarView'
import Card from '@/components/Card'

interface EventItem {
  id: string
  title: string
  start: number[]
  end: number[]
  location: string
  category: string
  description: string
  priority?: 'high'
  notes?: string
}

// Выставки 2026
const defaultEventsData: EventItem[] = [
  // Январь
  { id: 'efea', title: 'EFEA 2026 — Евразийский Ивент Форум', start: [2026, 0, 21], end: [2026, 0, 23], location: 'СПб, ПетроКонгресс', category: 'marketing', description: 'Ивент-индустрия, Маркетинг, Реклама, HR', priority: 'high' as const },
  
  // Февраль
  { id: 'prodexpo', title: 'ПРОДЭКСПО-2026', start: [2026, 1, 9], end: [2026, 1, 12], location: 'Москва, Крокус Экспо', category: 'industry', description: 'Продукты питания, напитки и сырье' },
  { id: 'b2b-pr', title: 'B2B PR+ Forum', start: [2026, 1, 11], end: [2026, 1, 11], location: 'Москва, Холидей Инн Лесная', category: 'marketing', description: 'PR B2B', priority: 'high' as const },
  { id: 'pr-forum', title: 'PR+ Forum', start: [2026, 1, 11], end: [2026, 1, 13], location: 'Москва, Лесная Сафмар', category: 'marketing', description: 'PR и коммуникации', priority: 'high' as const },
  { id: 'hospitality', title: 'Hospitality Sales Forum', start: [2026, 1, 12], end: [2026, 1, 15], location: 'Санкт-Петербург', category: 'industry', description: 'HoReCa, гостиничный бизнес' },
  { id: 'reklam-hub', title: 'Рекламный хаб', start: [2026, 1, 17], end: [2026, 1, 18], location: 'СПб, Экспофорум', category: 'marketing', description: 'B2B Реклама', priority: 'high' as const },
  { id: 'cjf', title: 'CJF — Детская мода', start: [2026, 1, 17], end: [2026, 1, 19], location: 'Москва, Тимирязев Центр', category: 'industry', description: 'Детская мода' },
  { id: 'kadry', title: 'Кадровый резерв страны', start: [2026, 1, 19], end: [2026, 1, 20], location: 'Москва, Radisson Blu', category: 'hr', description: 'HR и рекрутинг' },
  { id: 'lakokraska', title: 'ИНТЕРЛАКОКРАСКА', start: [2026, 1, 24], end: [2026, 1, 27], location: 'Москва, Тимирязев Центр', category: 'industry', description: 'Лакокрасочная промышленность' },
  { id: 'pr-force', title: 'PR FORCE', start: [2026, 1, 26], end: [2026, 1, 26], location: 'Москва, Красносельская', category: 'marketing', description: 'PR-директора', priority: 'high' as const },
  { id: 'new-media', title: 'NEW MEDIA FORCE', start: [2026, 1, 27], end: [2026, 1, 27], location: 'Москва, Красносельская', category: 'marketing', description: 'Новые медиа и PR', priority: 'high' as const },
  
  // Март
  { id: 'neftegaz', title: 'НЕФТЕГАЗ-2026', start: [2026, 2, 2], end: [2026, 2, 5], location: 'Москва, Крокус Экспо', category: 'industry', description: 'Нефтегазовая отрасль' },
  { id: 'shiny', title: 'ШИНЫ, РТИ и КАУЧУКИ', start: [2026, 2, 2], end: [2026, 2, 5], location: 'Москва', category: 'industry', description: 'Резинотехническая промышленность' },
  { id: 'steklo', title: 'МИР СТЕКЛА', start: [2026, 2, 4], end: [2026, 2, 6], location: 'Москва', category: 'industry', description: 'Стекольная промышленность' },
  { id: 'spring-mkt', title: 'Spring Marketing Forum', start: [2026, 2, 5], end: [2026, 2, 5], location: 'СПб, Коринтия', category: 'marketing', description: 'Маркетинг', priority: 'high' as const },
  { id: 'business-force', title: 'BUSINESS FORCE', start: [2026, 2, 12], end: [2026, 2, 12], location: 'Москва, IRRI-LOFT', category: 'marketing', description: 'Маркетинг, Продажи, Развитие бизнеса', priority: 'high' as const },
  { id: 'textile', title: 'Российская неделя текстиля', start: [2026, 2, 16], end: [2026, 2, 19], location: 'Москва, Тимирязев Центр', category: 'industry', description: 'Текстильная промышленность' },
  { id: 'consumer', title: 'Consumer Brand Marketing', start: [2026, 2, 18], end: [2026, 2, 18], location: 'Москва, Сущевский Сафмар', category: 'marketing', description: 'FMCG бренды', priority: 'high' as const },
  { id: 'fmcg', title: 'FMCG & Retail Trade Marketing', start: [2026, 2, 20], end: [2026, 2, 20], location: 'Москва, Сущевский Сафмар', category: 'marketing', description: 'Торговый маркетинг', priority: 'high' as const },
  { id: 'soldout', title: 'SOLD OUT', start: [2026, 2, 23], end: [2026, 2, 24], location: 'СПб, Cosmos Hotel', category: 'industry', description: 'Форум' },
  
  // Апрель
  { id: 'metalloobrabotka', title: 'Металлообработка', start: [2026, 3, 14], end: [2026, 3, 17], location: 'Москва, Крокус Экспо', category: 'industry', description: 'Металлообрабатывающая промышленность' },
  { id: 'transport', title: 'TransRussia', start: [2026, 3, 21], end: [2026, 3, 24], location: 'Москва, Крокус Экспо', category: 'industry', description: 'Транспорт и логистика' },
  
  // Май
  { id: 'innoprom', title: 'ИННОПРОМ Казахстан', start: [2026, 4, 14], end: [2026, 4, 16], location: 'Астана', category: 'industry', description: 'Промышленность' },
  
  // Июнь
  { id: 'pmef', title: 'ПМЭФ-2026', start: [2026, 5, 2], end: [2026, 5, 5], location: 'Санкт-Петербург', category: 'marketing', description: 'Петербургский международный экономический форум', priority: 'high' as const },
  
  // Сентябрь
  { id: 'worldfood', title: 'WorldFood Moscow', start: [2026, 8, 15], end: [2026, 8, 18], location: 'Москва, Крокус Экспо', category: 'industry', description: 'Продукты питания' },
  
  // Октябрь
  { id: 'sport', title: 'Россия — спортивная держава', start: [2026, 9, 8], end: [2026, 9, 10], location: 'Москва', category: 'industry', description: 'Спортивная индустрия' },
]

const categories = [
  { id: 'marketing', name: 'Маркетинг & PR', color: '#ef4444' },
  { id: 'industry', name: 'Промышленность', color: '#3b82f6' },
  { id: 'hr', name: 'HR', color: '#22c55e' },
]

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>(defaultEventsData)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({
    title: '', location: '', category: 'marketing', description: '', notes: ''
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/page-data?page=events')
        if (response.ok) {
          const saved = await response.json()
          if (saved?.events && saved.events.length > 0) {
            setEvents(saved.events)
          }
        }
      } catch (error) {
        console.error('Error loading:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Save data
  const saveData = async (newEvents: EventItem[]) => {
    setSaving(true)
    setEvents(newEvents)
    try {
      await fetch('/api/page-data?page=events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: newEvents })
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  // Add event
  const addEvent = () => {
    if (!newEvent.title) return
    const event: EventItem = {
      id: Date.now().toString(),
      title: newEvent.title || '',
      start: [2026, 0, 1],
      end: [2026, 0, 1],
      location: newEvent.location || '',
      category: newEvent.category || 'marketing',
      description: newEvent.description || '',
      notes: newEvent.notes
    }
    saveData([...events, event])
    setNewEvent({ title: '', location: '', category: 'marketing', description: '', notes: '' })
    setShowAddModal(false)
  }

  // Update event
  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    saveData(events.map(e => e.id === id ? { ...e, ...updates } : e))
    setEditingEvent(null)
  }

  // Delete event
  const deleteEvent = (id: string) => {
    saveData(events.filter(e => e.id !== id))
    setSelectedEvent(null)
  }

  // Update event notes
  const updateEventNotes = (id: string, notes: string) => {
    saveData(events.map(e => e.id === id ? { ...e, notes } : e))
  }

  const calendarEvents = events.map(e => ({
    id: e.id,
    title: e.title,
    startDate: new Date(e.start[0], e.start[1], e.start[2]),
    endDate: e.end ? new Date(e.end[0], e.end[1], e.end[2]) : undefined,
    color: categories.find(c => c.id === e.category)?.color || '#666',
    category: e.category,
    location: e.location,
    description: e.description,
    priority: e.priority,
    notes: e.notes,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-primary-500" size={32} />
      </div>
    )
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
            <h1 className="text-3xl font-bold">Календарь выставок 2026</h1>
            <p className="text-dark-400 mt-1">План посещения выставок и форумов</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saving && (
            <div className="flex items-center gap-2 text-primary-400 text-sm">
              <RefreshCw size={14} className="animate-spin" />
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
          >
            <Plus size={18} />
            Добавить
          </button>
          <a
            href="https://docs.google.com/spreadsheets/d/1JLZNhgD0aod1weiMqynKmY_oAhnP3bJTiCi1xuiwq_w/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
          >
            <ExternalLink size={16} />
            Таблица
          </a>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-dark-800 rounded-2xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Добавить выставку</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-dark-700 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={newEvent.title || ''}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Название выставки"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                value={newEvent.location || ''}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Место проведения"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2"
              />
              <select
                value={newEvent.category || 'marketing'}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <textarea
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Описание"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 min-h-[80px]"
              />
            </div>
            <button onClick={addEvent} className="w-full mt-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg">
              Добавить
            </button>
          </div>
        </div>
      )}

      {/* Calendar */}
      <CalendarView 
        events={calendarEvents}
        title="Выставки 2026"
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
                {selectedEvent.location && (
                  <p className="text-dark-300 mt-1">📍 {selectedEvent.location}</p>
                )}
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
                    ⭐ Высокий приоритет
                  </div>
                )}
              </div>
            </div>
            
            {/* Notes */}
            <div className="mt-4">
              <label className="text-sm text-dark-400 mb-2 block">📝 Заметки</label>
              <textarea
                value={selectedEvent.notes || ''}
                onChange={(e) => {
                  updateEventNotes(selectedEvent.id, e.target.value)
                  setSelectedEvent({ ...selectedEvent, notes: e.target.value })
                }}
                placeholder="Добавить заметки..."
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 min-h-[80px] text-sm"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => deleteEvent(selectedEvent.id)}
                className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="flex-1 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
