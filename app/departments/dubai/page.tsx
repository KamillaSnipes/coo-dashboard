'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar, Rocket, Users, Target, TrendingUp, RefreshCw, CheckCircle, AlertTriangle, FileText, Plus, Trash2 } from 'lucide-react'
import Card from '@/components/Card'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import CalendarView from '@/components/CalendarView'

interface DubaiEvent {
  id: string
  title: string
  startDate: Date
  endDate?: Date
  location?: string
  category: string
  description?: string
  priority?: 'high' | 'medium' | 'low'
}

interface Launch {
  id: string
  title: string
  client: string
  date: Date
  status: 'planning' | 'production' | 'shipping' | 'delivered'
  value?: string
}

// Dubai exhibitions 2026
const initialExhibitions: DubaiEvent[] = [
  { id: '1', title: 'World of Coffee Dubai', startDate: new Date('2026-01-14'), endDate: new Date('2026-01-16'), location: 'Dubai World Trade Centre', category: 'coffee', priority: 'high' },
  { id: '2', title: 'Gulfood 2026', startDate: new Date('2026-02-16'), endDate: new Date('2026-02-20'), location: 'Dubai World Trade Centre', category: 'food', priority: 'high', description: 'Крупнейшая продовольственная выставка на Ближнем Востоке' },
  { id: '3', title: 'Arab Health', startDate: new Date('2026-01-27'), endDate: new Date('2026-01-30'), location: 'Dubai World Trade Centre', category: 'health', priority: 'medium' },
  { id: '4', title: 'GITEX Africa', startDate: new Date('2026-04-14'), endDate: new Date('2026-04-16'), location: 'Marrakech', category: 'tech', priority: 'high' },
  { id: '5', title: 'Beautyworld Middle East', startDate: new Date('2026-10-05'), endDate: new Date('2026-10-07'), location: 'Dubai World Trade Centre', category: 'beauty', priority: 'medium' },
  { id: '6', title: 'The Big 5', startDate: new Date('2026-11-23'), endDate: new Date('2026-11-26'), location: 'Dubai World Trade Centre', category: 'construction', priority: 'medium' },
  { id: '7', title: 'GITEX Global', startDate: new Date('2026-10-12'), endDate: new Date('2026-10-16'), location: 'Dubai World Trade Centre', category: 'tech', priority: 'high', description: 'Главная IT-выставка региона' },
  { id: '8', title: 'Dubai Airshow', startDate: new Date('2026-11-15'), endDate: new Date('2026-11-19'), location: 'Al Maktoum International Airport', category: 'aviation', priority: 'high' },
  { id: '9', title: 'Ramadan Gift Fair', startDate: new Date('2026-02-25'), endDate: new Date('2026-02-28'), location: 'Dubai', category: 'gifts', priority: 'high', description: 'Подарки к Рамадану - ключевое событие' },
]

// Dubai launches 2026
const initialLaunches: Launch[] = [
  { id: '1', title: 'Henkel Ramadan Gifts', client: 'Henkel', date: new Date('2026-02-20'), status: 'production', value: '50,000 AED' },
  { id: '2', title: 'Casa Padel Merch', client: 'Casa Padel', date: new Date('2026-01-30'), status: 'planning' },
  { id: '3', title: 'Yango Africa Launch', client: 'Yango Africa', date: new Date('2026-03-15'), status: 'planning' },
  { id: '4', title: 'Spacetoon Kids Promo', client: 'Spacetoon', date: new Date('2026-04-01'), status: 'planning' },
  { id: '5', title: 'DED Corporate Gifts', client: 'DED', date: new Date('2026-03-10'), status: 'planning' },
  { id: '6', title: 'Platinumlist Event Merch', client: 'Platinumlist', date: new Date('2026-02-15'), status: 'planning' },
]

const eventCategories = [
  { id: 'food', name: 'Food & Beverage', color: '#f97316' },
  { id: 'tech', name: 'Technology', color: '#3b82f6' },
  { id: 'health', name: 'Healthcare', color: '#22c55e' },
  { id: 'beauty', name: 'Beauty', color: '#ec4899' },
  { id: 'construction', name: 'Construction', color: '#eab308' },
  { id: 'aviation', name: 'Aviation', color: '#8b5cf6' },
  { id: 'coffee', name: 'Coffee', color: '#78350f' },
  { id: 'gifts', name: 'Gifts', color: '#ef4444' },
]

export default function DubaiDepartment() {
  const [activeTab, setActiveTab] = useState<'overview' | 'exhibitions' | 'launches' | 'plan'>('overview')
  const [exhibitions, setExhibitions] = useState<DubaiEvent[]>(initialExhibitions)
  const [launches, setLaunches] = useState<Launch[]>(initialLaunches)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [leadershipData, setLeadershipData] = useState<any>(null)
  const [dubaiData, setDubaiData] = useState<any>({
    focus: 'Подготовка подарков к Рамадану, развитие клиентской базы',
    notes: '',
    problems: [],
  })

  const PAGE_ID = 'dubai-department'

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Dubai page data
        const pageResponse = await fetch(`/api/page-data?page=${PAGE_ID}`)
        if (pageResponse.ok) {
          const data = await pageResponse.json()
          if (data.exhibitions) setExhibitions(data.exhibitions.map((e: any) => ({ ...e, startDate: new Date(e.startDate), endDate: e.endDate ? new Date(e.endDate) : undefined })))
          if (data.launches) setLaunches(data.launches.map((l: any) => ({ ...l, date: new Date(l.date) })))
          if (data.dubaiData) setDubaiData(data.dubaiData)
        }

        // Load Nikita's leadership report
        const reportsResponse = await fetch('/api/leadership-reports')
        if (reportsResponse.ok) {
          const data = await reportsResponse.json()
          const nikitaReport = data.reports?.find((r: any) => 
            r.salesPerson?.toLowerCase().includes('никита')
          )
          if (nikitaReport) {
            setLeadershipData(nikitaReport)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const saveData = async () => {
    setSaving(true)
    try {
      await fetch(`/api/page-data?page=${PAGE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exhibitions: exhibitions.map(e => ({ ...e, startDate: e.startDate.toISOString(), endDate: e.endDate?.toISOString() })),
          launches: launches.map(l => ({ ...l, date: l.date.toISOString() })),
          dubaiData,
        })
      })
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  const calendarEvents = exhibitions.map(e => ({
    ...e,
    color: eventCategories.find(c => c.id === e.category)?.color || '#666',
  }))

  const launchEvents = launches.map(l => ({
    id: l.id,
    title: `${l.title} (${l.client})`,
    startDate: l.date,
    category: l.status,
    color: l.status === 'delivered' ? '#22c55e' : l.status === 'shipping' ? '#3b82f6' : l.status === 'production' ? '#f97316' : '#666',
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-primary-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/departments" className="text-dark-400 hover:text-white">
              ← Отделы
            </Link>
          </div>
          <h1 className="text-3xl font-bold mt-2">🇦🇪 Офис Дубай</h1>
          <p className="text-dark-400 mt-1">Никита • Кристина</p>
        </div>
        <div className="flex items-center gap-4">
          {saving && (
            <div className="flex items-center gap-2 text-primary-400">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">Сохранение...</span>
            </div>
          )}
          <StatusBadge status="green" size="md" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-700 pb-1 flex-wrap">
        {[
          { id: 'overview', label: '📊 Обзор', icon: Target },
          { id: 'exhibitions', label: '📅 Выставки', icon: Calendar },
          { id: 'launches', label: '🚀 Запуски', icon: Rocket },
          { id: 'plan', label: '📋 План', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-dark-700 text-white'
                : 'text-dark-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
        
        {/* External links */}
        <div className="ml-auto flex gap-2">
          <a
            href="https://docs.google.com/spreadsheets/d/1D5Md8aWogexxtpy17RZtvvCI8Vam9iNB/edit?gid=477588106#gid=477588106"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg"
          >
            <ExternalLink size={14} />
            Выставки (Google)
          </a>
          <a
            href="https://docs.google.com/spreadsheets/d/1D5Md8aWogexxtpy17RZtvvCI8Vam9iNB/edit?gid=2024838938#gid=2024838938"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg"
          >
            <ExternalLink size={14} />
            Запуски (Google)
          </a>
          <a
            href="https://docs.google.com/document/d/1yS2UKnbVcmJ7wNDQ1wT1FEaCfCLf0k4Y/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg"
          >
            <ExternalLink size={14} />
            План (Google)
          </a>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Current Focus */}
          <Card title="🎯 Текущий фокус">
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <EditableText
                value={dubaiData.focus}
                onSave={(value) => {
                  setDubaiData({ ...dubaiData, focus: value })
                  saveData()
                }}
                className="font-medium"
              />
            </div>
          </Card>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Сотрудников"
              value="2"
              subtitle="Никита + Кристина"
              icon={<Users size={24} />}
            />
            <MetricCard
              title="Клиентов в работе"
              value={`${launches.length}`}
              subtitle="активных проектов"
              icon={<Target size={24} />}
            />
            <MetricCard
              title="Выставок в 2026"
              value={`${exhibitions.length}`}
              subtitle="запланировано"
              icon={<Calendar size={24} />}
            />
            <MetricCard
              title="Ближайший запуск"
              value="Henkel"
              subtitle="Рамадан подарки"
              icon={<Rocket size={24} />}
              trend="up"
            />
          </div>

          {/* Team */}
          <Card title="👥 Команда">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-700/50 rounded-lg">
                <h3 className="font-semibold text-primary-400">Никита</h3>
                <p className="text-sm text-dark-400">Руководитель офиса Дубай</p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>Клиентская работа</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>Развитие бизнеса</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>Финансовый учёт</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-dark-700/50 rounded-lg">
                <h3 className="font-semibold text-blue-400">Кристина</h3>
                <p className="text-sm text-dark-400">Менеджер</p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>Операционная поддержка</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>Работа с проектами</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Leadership Report Data */}
          {leadershipData && (
            <Card title="📋 План/Факт недели (Никита)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">📋 План</h4>
                  <div className="space-y-2">
                    {(leadershipData.plan || []).map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-dark-500">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">✅ Факт</h4>
                  <div className="space-y-2">
                    {(leadershipData.fact || []).map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card title="📝 Заметки">
            <EditableText
              value={dubaiData.notes}
              onSave={(value) => {
                setDubaiData({ ...dubaiData, notes: value })
                saveData()
              }}
              placeholder="Добавить заметки после 1:1 или наблюдений..."
              multiline
              className="min-h-[60px]"
            />
          </Card>
        </>
      )}

      {activeTab === 'exhibitions' && (
        <>
          <Card 
            title="📅 Календарь выставок 2026"
            action={
              <a
                href="https://docs.google.com/spreadsheets/d/1D5Md8aWogexxtpy17RZtvvCI8Vam9iNB/edit?gid=477588106#gid=477588106"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
              >
                <ExternalLink size={14} />
                Открыть в Google
              </a>
            }
          >
            <CalendarView 
              events={calendarEvents}
              title="Выставки Дубай 2026"
              categories={eventCategories}
            />
          </Card>

          {/* Upcoming exhibitions list */}
          <Card title="📋 Ближайшие выставки">
            <div className="space-y-3">
              {exhibitions
                .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                .filter(e => e.startDate >= new Date())
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: eventCategories.find(c => c.id === event.category)?.color }}
                      />
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-dark-400">{event.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {event.startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        {event.endDate && ` — ${event.endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`}
                      </div>
                      {event.priority === 'high' && (
                        <span className="text-xs text-red-400">Высокий приоритет</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </>
      )}

      {activeTab === 'launches' && (
        <>
          <Card 
            title="🚀 Календарь запусков 2026"
            action={
              <a
                href="https://docs.google.com/spreadsheets/d/1D5Md8aWogexxtpy17RZtvvCI8Vam9iNB/edit?gid=2024838938#gid=2024838938"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
              >
                <ExternalLink size={14} />
                Открыть в Google
              </a>
            }
          >
            <CalendarView 
              events={launchEvents}
              title="Запуски Дубай 2026"
              categories={[
                { id: 'planning', name: 'Планирование', color: '#666' },
                { id: 'production', name: 'Производство', color: '#f97316' },
                { id: 'shipping', name: 'Доставка', color: '#3b82f6' },
                { id: 'delivered', name: 'Доставлено', color: '#22c55e' },
              ]}
            />
          </Card>

          {/* Launches list */}
          <Card title="📋 Проекты">
            <div className="space-y-3">
              {launches.map(launch => (
                <div key={launch.id} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        launch.status === 'delivered' ? 'bg-green-500' :
                        launch.status === 'shipping' ? 'bg-blue-500' :
                        launch.status === 'production' ? 'bg-orange-500' : 'bg-dark-500'
                      }`}
                    />
                    <div>
                      <div className="font-medium">{launch.title}</div>
                      <div className="text-sm text-dark-400">{launch.client}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{launch.date.toLocaleDateString('ru-RU')}</div>
                    {launch.value && <div className="text-xs text-green-400">{launch.value}</div>}
                    <StatusBadge 
                      status={launch.status === 'delivered' ? 'green' : launch.status === 'production' ? 'yellow' : 'red'} 
                      size="sm" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {activeTab === 'plan' && (
        <>
          <Card 
            title="📋 Стратегический план Дубай 2026"
            action={
              <a
                href="https://docs.google.com/document/d/1yS2UKnbVcmJ7wNDQ1wT1FEaCfCLf0k4Y/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
              >
                <ExternalLink size={14} />
                Открыть в Google
              </a>
            }
          >
            <div className="space-y-6">
              {/* Q1 */}
              <div className="p-4 bg-dark-700/50 rounded-lg">
                <h3 className="font-semibold text-primary-400 mb-3">Q1 2026 (Январь — Февраль — Март)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Рамадан</strong> — подготовка подарков для клиентов (Henkel, DED)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>Gulfood 2026 — участие и поиск новых клиентов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>Arab Health — развитие healthcare направления</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>Тест карго Aramex / поиск мини-склада</span>
                  </li>
                </ul>
              </div>

              {/* Q2 */}
              <div className="p-4 bg-dark-700/50 rounded-lg">
                <h3 className="font-semibold text-blue-400 mb-3">Q2 2026 (Апрель — Май — Июнь)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>GITEX Africa — расширение в Африку (Yango Africa)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>Развитие клиентской базы в ОАЭ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>Оптимизация логистики и складских процессов</span>
                  </li>
                </ul>
              </div>

              {/* Q3-Q4 */}
              <div className="p-4 bg-dark-700/50 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-3">Q3-Q4 2026 (Июль — Декабрь)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>GITEX Global — главное IT событие региона</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>Beautyworld — развитие beauty-сегмента</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>Dubai Airshow — aviation & defense</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-dark-500">•</span>
                    <span>Подготовка к НГ 2027 и Рамадану 2027</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Key Clients */}
          <Card title="🎯 Ключевые клиенты 2026">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {['Henkel', 'Casa Padel', 'Yango Africa', 'Spacetoon', 'DED', 'Platinumlist'].map(client => (
                <div key={client} className="p-3 bg-dark-700/50 rounded-lg text-center">
                  <div className="font-medium">{client}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
