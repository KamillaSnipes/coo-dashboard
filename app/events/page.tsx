'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Tag, Filter, ChevronDown, ChevronUp, Star, ExternalLink } from 'lucide-react'
import Card from '@/components/Card'

interface Event {
  id: string
  month: string
  dates: string
  city: string
  name: string
  topic: string
  isMarketingRelated: 'Да' | 'Нет' | 'Частично'
  venue: string
  priority?: 'high' | 'medium' | 'low'
  notes?: string
}

// Календарь выставок 2026
const events: Event[] = [
  // ЯНВАРЬ
  {
    id: 'efea-2026',
    month: 'Январь',
    dates: '21–23',
    city: 'Санкт-Петербург',
    name: 'Евразийский Ивент Форум / EFEA 2026',
    topic: 'Ивент-индустрия, Маркетинг, Реклама, HR',
    isMarketingRelated: 'Да',
    venue: 'ПетроКонгресс, КЦ',
    priority: 'high',
    notes: 'Ключевое мероприятие для ивент-индустрии'
  },

  // ФЕВРАЛЬ
  {
    id: 'prodexpo-2026',
    month: 'Февраль',
    dates: '09–12',
    city: 'Москва',
    name: 'ПРОДЭКСПО-2026',
    topic: 'Продукты питания, напитки и сырье',
    isMarketingRelated: 'Нет',
    venue: 'МВЦ «Крокус Экспо»',
    priority: 'medium',
    notes: 'Крупнейшая выставка продуктов питания — потенциальные клиенты FMCG'
  },
  {
    id: 'b2b-pr-forum-2026',
    month: 'Февраль',
    dates: '11',
    city: 'Москва',
    name: 'B2B PR+ Forum 2026',
    topic: 'PR в сфере B2B',
    isMarketingRelated: 'Да',
    venue: 'Холидей Инн Москва Лесная',
    priority: 'high'
  },
  {
    id: 'pr-forum-2026',
    month: 'Февраль',
    dates: '11–13',
    city: 'Москва',
    name: 'PR+ Forum 2026',
    topic: 'Всероссийский форум профессионалов сферы PR',
    isMarketingRelated: 'Да',
    venue: 'Лесная Сафмар',
    priority: 'high'
  },
  {
    id: 'hospitality-sales-2026',
    month: 'Февраль',
    dates: '12–15',
    city: 'Санкт-Петербург',
    name: 'Hospitality Sales Forum 2026',
    topic: 'Продажи в индустрии гостеприимства, Маркетинг',
    isMarketingRelated: 'Частично',
    venue: 'Санкт-Петербург',
    priority: 'medium'
  },
  {
    id: 'reklamnyi-hub-2026',
    month: 'Февраль',
    dates: '17–18',
    city: 'Санкт-Петербург',
    name: 'Рекламный хаб Северной Столицы 2026',
    topic: 'B2B-переговоры по Рекламе и услугам',
    isMarketingRelated: 'Да',
    venue: 'Экспофорум',
    priority: 'high',
    notes: 'B2B переговоры — отличная возможность для новых контактов'
  },
  {
    id: 'cjf-2026',
    month: 'Февраль',
    dates: '17–19',
    city: 'Москва',
    name: 'CJF – ДЕТСКАЯ МОДА-2026. Весна',
    topic: 'Детская и юношеская мода',
    isMarketingRelated: 'Нет',
    venue: 'ВК «Тимирязев Центр»',
    priority: 'low'
  },
  {
    id: 'kadrovyi-rezerv-2026',
    month: 'Февраль',
    dates: '19–20',
    city: 'Москва',
    name: 'Кадровый резерв 2026',
    topic: 'HR-конференция',
    isMarketingRelated: 'Частично',
    venue: 'Radisson Blu Belorusskaya Hotel',
    priority: 'medium',
    notes: 'HR-конференция — Welcome Packs, корп. мерч'
  },
  {
    id: 'interlakokraska-2026',
    month: 'Февраль',
    dates: '24–27',
    city: 'Москва',
    name: 'ИНТЕРЛАКОКРАСКА-2026',
    topic: 'Лакокрасочные материалы',
    isMarketingRelated: 'Нет',
    venue: 'ВК «Тимирязев Центр»',
    priority: 'low'
  },
  {
    id: 'pr-force-2026',
    month: 'Февраль',
    dates: '26',
    city: 'Москва',
    name: 'PR FORCE 2026',
    topic: 'Всероссийский Форум PR-директоров',
    isMarketingRelated: 'Да',
    venue: 'Отель Москва Красносельская',
    priority: 'high',
    notes: 'PR-директора — ключевые ЛПР для заказов мерча'
  },
  {
    id: 'new-media-force-2026',
    month: 'Февраль',
    dates: '27',
    city: 'Москва',
    name: 'NEW MEDIA FORCE 2026',
    topic: 'Всероссийский PR Форум',
    isMarketingRelated: 'Да',
    venue: 'Отель Москва Красносельская',
    priority: 'high'
  },

  // МАРТ
  {
    id: 'neftegaz-2026',
    month: 'Март',
    dates: '02–05',
    city: 'Москва',
    name: 'НЕФТЕГАЗ-2026',
    topic: 'Оборудование и технологии для нефтегазового комплекса',
    isMarketingRelated: 'Нет',
    venue: 'МВЦ «Крокус Экспо»',
    priority: 'medium',
    notes: 'Потенциал: ЛУКОЙЛ, Газпром и другие юбиляры 2026'
  },
  {
    id: 'shiny-2026',
    month: 'Март',
    dates: '02–05',
    city: 'Москва',
    name: 'ШИНЫ, РТИ И КАУЧУКИ-2026',
    topic: 'Резинотехнические изделия, шины',
    isMarketingRelated: 'Нет',
    venue: 'Москва',
    priority: 'low'
  },
  {
    id: 'mir-stekla-2026',
    month: 'Март',
    dates: '04–06',
    city: 'Москва',
    name: 'МИР СТЕКЛА-2026',
    topic: 'Стеклопродукция, оборудование',
    isMarketingRelated: 'Нет',
    venue: 'Москва',
    priority: 'low'
  },
  {
    id: 'spring-marketing-2026',
    month: 'Март',
    dates: '5',
    city: 'Санкт-Петербург',
    name: 'Spring Marketing Forum 2026',
    topic: 'Маркетинг, Реклама, Продажи, PR',
    isMarketingRelated: 'Да',
    venue: 'Отель Коринтия',
    priority: 'high',
    notes: 'Ключевой маркетинг-форум весны'
  },
  {
    id: 'business-force-2026',
    month: 'Март',
    dates: '12',
    city: 'Москва',
    name: 'BUSINESS FORCE FORUM 2026',
    topic: 'Маркетинг, Продажи, Клиентский сервис',
    isMarketingRelated: 'Да',
    venue: 'IRRI-LOFT',
    priority: 'high'
  },
  {
    id: 'textile-week-2026',
    month: 'Март',
    dates: '16–19',
    city: 'Москва',
    name: 'Российская текстильная неделя-2026',
    topic: 'Текстильная отрасль',
    isMarketingRelated: 'Нет',
    venue: 'ВК «Тимирязев Центр»',
    priority: 'medium',
    notes: 'Потенциальные партнёры по текстилю'
  },
  {
    id: 'consumer-brand-2026',
    month: 'Март',
    dates: '18',
    city: 'Москва',
    name: 'Consumer Brand 2026',
    topic: 'Создание и продвижение FMCG-брендов',
    isMarketingRelated: 'Да',
    venue: 'Сущевский Сафмар',
    priority: 'high',
    notes: 'FMCG-бренды — ключевые клиенты для промо-продукции'
  },
  {
    id: 'fmcg-retail-2026',
    month: 'Март',
    dates: '20',
    city: 'Москва',
    name: 'FMCG & Retail Trade Marketing Forum 2026',
    topic: 'Торговый маркетинг',
    isMarketingRelated: 'Да',
    venue: 'Сущевский Сафмар',
    priority: 'high',
    notes: 'Торговый маркетинг ритейла — промо-продукция'
  },
  {
    id: 'sold-out-2026',
    month: 'Март',
    dates: '23–24',
    city: 'Санкт-Петербург',
    name: 'SOLD OUT 2026',
    topic: 'Специализированный форум',
    isMarketingRelated: 'Нет',
    venue: 'Cosmos Saint-Petersburg Pribaltiyskaya Hotel',
    priority: 'medium'
  },
]

const months = ['Все', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const cities = ['Все', 'Москва', 'Санкт-Петербург']
const marketingFilter = ['Все', 'Да', 'Частично', 'Нет']

export default function EventsPage() {
  const [filterMonth, setFilterMonth] = useState('Все')
  const [filterCity, setFilterCity] = useState('Все')
  const [filterMarketing, setFilterMarketing] = useState('Все')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesMonth = filterMonth === 'Все' || event.month === filterMonth
    const matchesCity = filterCity === 'Все' || event.city === filterCity
    const matchesMarketing = filterMarketing === 'Все' || event.isMarketingRelated === filterMarketing
    return matchesMonth && matchesCity && matchesMarketing
  })

  // Group by month
  const eventsByMonth = filteredEvents.reduce((acc, event) => {
    if (!acc[event.month]) acc[event.month] = []
    acc[event.month].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  // Stats
  const stats = {
    total: events.length,
    marketing: events.filter(e => e.isMarketingRelated === 'Да').length,
    highPriority: events.filter(e => e.priority === 'high').length,
    moscow: events.filter(e => e.city === 'Москва').length,
    spb: events.filter(e => e.city === 'Санкт-Петербург').length,
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/50'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      case 'low': return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
      default: return 'bg-dark-700'
    }
  }

  const getMarketingBadge = (related: string) => {
    switch (related) {
      case 'Да': return 'bg-green-500/20 text-green-300'
      case 'Частично': return 'bg-yellow-500/20 text-yellow-300'
      case 'Нет': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-dark-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-dark-700 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Календарь выставок 2026</h1>
            <p className="text-dark-400 mt-1">План посещения выставок и форумов для поиска клиентов</p>
          </div>
        </div>
        <a
          href="https://docs.google.com/spreadsheets/d/1JLZNhgD0aod1weiMqynKmY_oAhnP3bJTiCi1xuiwq_w/edit?gid=1741008272#gid=1741008272"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
        >
          <ExternalLink size={16} />
          Открыть таблицу
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-400">{stats.total}</div>
          <div className="text-sm text-dark-400">Всего мероприятий</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-400">{stats.marketing}</div>
          <div className="text-sm text-dark-400">Маркетинг/Реклама</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-red-400">{stats.highPriority}</div>
          <div className="text-sm text-dark-400">Высокий приоритет</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.moscow}</div>
          <div className="text-sm text-dark-400">Москва</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-400">{stats.spb}</div>
          <div className="text-sm text-dark-400">Санкт-Петербург</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="text-primary-400" size={20} />
            <span className="font-medium">Фильтры</span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${showFilters ? 'bg-primary-600' : 'bg-dark-700'}`}
          >
            <Filter size={18} />
            {showFilters ? 'Скрыть' : 'Показать'}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-dark-700 grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-dark-400 mb-2">Месяц</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-2">Город</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-2">Связь с маркетингом</label>
              <select
                value={filterMarketing}
                onChange={(e) => setFilterMarketing(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
              >
                {marketingFilter.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Events by Month */}
      {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
        <div key={month}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-primary-400" size={20} />
            {month} 2026
            <span className="text-sm font-normal text-dark-400">({monthEvents.length} мероприятий)</span>
          </h2>
          
          <div className="space-y-3">
            {monthEvents.map(event => {
              const isExpanded = expandedEvent === event.id
              
              return (
                <Card 
                  key={event.id} 
                  className={`overflow-hidden border-l-4 ${
                    event.priority === 'high' ? 'border-l-red-500' :
                    event.priority === 'medium' ? 'border-l-yellow-500' :
                    'border-l-dark-600'
                  }`}
                >
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold">{event.name}</span>
                        {event.priority === 'high' && (
                          <Star className="text-yellow-400 fill-yellow-400" size={16} />
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs ${getMarketingBadge(event.isMarketingRelated)}`}>
                          {event.isMarketingRelated === 'Да' ? '✓ Маркетинг' : 
                           event.isMarketingRelated === 'Частично' ? '~ Частично' : 'Другое'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-dark-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {event.dates} {month}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {event.city}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-dark-700 space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-dark-400 mb-1">Тематика</div>
                          <div className="flex items-center gap-2 text-sm">
                            <Tag size={14} className="text-primary-400" />
                            {event.topic}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-dark-400 mb-1">Место проведения</div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={14} className="text-green-400" />
                            {event.venue}
                          </div>
                        </div>
                      </div>
                      {event.notes && (
                        <div className="p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
                          <div className="text-sm text-primary-300">💡 {event.notes}</div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {filteredEvents.length === 0 && (
        <Card className="text-center py-12">
          <Calendar className="mx-auto text-dark-500 mb-4" size={48} />
          <p className="text-dark-400">Мероприятия не найдены по выбранным фильтрам</p>
        </Card>
      )}
    </div>
  )
}

