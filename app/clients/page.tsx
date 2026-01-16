'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Building2, User, Calendar, Tag, Phone, Mail, Globe, Edit2, Trash2, Save, X, RefreshCw, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '@/components/Card'

interface Client {
  id: string
  name: string
  company: string
  industry: string
  segment: 'enterprise' | 'mid' | 'small' // Крупный, Средний, Малый бизнес
  contactPerson: string
  phone: string
  email: string
  website: string
  needs: string // Потребности
  orderFrequency: string // Когда заказывают
  averageOrder: string // Средний чек
  lastOrder: string // Последний заказ
  notes: string
  assignedTo: string // Ответственный менеджер
  status: 'active' | 'potential' | 'inactive'
  createdAt: string
  updatedAt: string
}

const industries = [
  'IT и технологии',
  'Финансы и банки',
  'Ритейл',
  'FMCG',
  'Фарма',
  'Автопром',
  'Недвижимость',
  'Телеком',
  'Медиа и реклама',
  'Производство',
  'Рекламное агентство',
  'Другое'
]

const segments: { value: Client['segment']; label: string; color: string }[] = [
  { value: 'enterprise', label: 'Enterprise', color: 'bg-purple-500' },
  { value: 'mid', label: 'Средний бизнес', color: 'bg-blue-500' },
  { value: 'small', label: 'Малый бизнес', color: 'bg-green-500' },
]

const statuses: { value: Client['status']; label: string; color: string }[] = [
  { value: 'active', label: 'Активный', color: 'bg-green-500' },
  { value: 'potential', label: 'Потенциальный', color: 'bg-yellow-500' },
  { value: 'inactive', label: 'Неактивный', color: 'bg-gray-500' },
]

const salesTeam = [
  'Наталья Лактистова',
  'Полина Коник',
  'Алина Титова',
  'Ирина Ветера',
  'Максим Можкин',
  'Сизиков Тимур',
  'Диёр Дадаев',
]

const emptyClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  company: '',
  industry: '',
  segment: 'mid',
  contactPerson: '',
  phone: '',
  email: '',
  website: '',
  needs: '',
  orderFrequency: '',
  averageOrder: '',
  lastOrder: '',
  notes: '',
  assignedTo: '',
  status: 'potential'
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterIndustry, setFilterIndustry] = useState<string>('')
  const [filterSegment, setFilterSegment] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterManager, setFilterManager] = useState<string>('')
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/clients')
        if (response.ok) {
          const data = await response.json()
          if (data.clients) {
            setClients(data.clients)
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
  const saveClients = async (updatedClients: Client[]) => {
    setSaving(true)
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clients: updatedClients })
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  // Create client
  const createClient = () => {
    setEditingClient({
      ...emptyClient,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Client)
    setIsCreating(true)
  }

  // Save client
  const saveClient = async () => {
    if (!editingClient) return

    const updatedClient = { ...editingClient, updatedAt: new Date().toISOString() }
    let updatedClients: Client[]

    if (isCreating) {
      updatedClients = [...clients, updatedClient]
    } else {
      updatedClients = clients.map(c => c.id === updatedClient.id ? updatedClient : c)
    }

    setClients(updatedClients)
    await saveClients(updatedClients)
    setEditingClient(null)
    setIsCreating(false)
  }

  // Delete client
  const deleteClient = async (id: string) => {
    if (!confirm('Удалить клиента?')) return
    
    const updatedClients = clients.filter(c => c.id !== id)
    setClients(updatedClients)
    await saveClients(updatedClients)
  }

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesIndustry = !filterIndustry || client.industry === filterIndustry
    const matchesSegment = !filterSegment || client.segment === filterSegment
    const matchesStatus = !filterStatus || client.status === filterStatus
    const matchesManager = !filterManager || client.assignedTo === filterManager

    return matchesSearch && matchesIndustry && matchesSegment && matchesStatus && matchesManager
  })

  // Stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    potential: clients.filter(c => c.status === 'potential').length,
    enterprise: clients.filter(c => c.segment === 'enterprise').length,
  }

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
          <Link href="/" className="p-2 hover:bg-dark-700 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">База клиентов</h1>
            <p className="text-dark-400 mt-1">Информация о клиентах и их потребностях</p>
          </div>
        </div>
        <button
          onClick={createClient}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
        >
          <Plus size={18} />
          Добавить клиента
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-400">{stats.total}</div>
          <div className="text-sm text-dark-400">Всего клиентов</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-400">{stats.active}</div>
          <div className="text-sm text-dark-400">Активных</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.potential}</div>
          <div className="text-sm text-dark-400">Потенциальных</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-400">{stats.enterprise}</div>
          <div className="text-sm text-dark-400">Enterprise</div>
        </Card>
      </div>

      {/* Search and filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по названию, компании, контакту..."
              className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${showFilters ? 'bg-primary-600' : 'bg-dark-700'}`}
          >
            <Filter size={18} />
            Фильтры
            {(filterIndustry || filterSegment || filterStatus || filterManager) && (
              <span className="w-2 h-2 bg-primary-400 rounded-full" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-dark-700 grid md:grid-cols-4 gap-4">
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
            >
              <option value="">Все отрасли</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <select
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
            >
              <option value="">Все сегменты</option>
              {segments.map(seg => (
                <option key={seg.value} value={seg.value}>{seg.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
            >
              <option value="">Все статусы</option>
              {statuses.map(st => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
            <select
              value={filterManager}
              onChange={(e) => setFilterManager(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
            >
              <option value="">Все менеджеры</option>
              {salesTeam.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}
      </Card>

      {/* Edit modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {isCreating ? 'Новый клиент' : 'Редактировать клиента'}
              </h3>
              <button onClick={() => { setEditingClient(null); setIsCreating(false) }} className="p-2 hover:bg-dark-700 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название / Имя</label>
                <input
                  type="text"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="Название клиента"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Компания</label>
                <input
                  type="text"
                  value={editingClient.company}
                  onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="ООО Компания"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Отрасль</label>
                <select
                  value={editingClient.industry}
                  onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                >
                  <option value="">Выберите отрасль</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Сегмент</label>
                <select
                  value={editingClient.segment}
                  onChange={(e) => setEditingClient({ ...editingClient, segment: e.target.value as Client['segment'] })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                >
                  {segments.map(seg => (
                    <option key={seg.value} value={seg.value}>{seg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Контактное лицо</label>
                <input
                  type="text"
                  value={editingClient.contactPerson}
                  onChange={(e) => setEditingClient({ ...editingClient, contactPerson: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Телефон</label>
                <input
                  type="text"
                  value={editingClient.phone}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="+7 999 123 45 67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editingClient.email}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="client@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Сайт</label>
                <input
                  type="text"
                  value={editingClient.website}
                  onChange={(e) => setEditingClient({ ...editingClient, website: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="https://company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ответственный менеджер</label>
                <select
                  value={editingClient.assignedTo}
                  onChange={(e) => setEditingClient({ ...editingClient, assignedTo: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                >
                  <option value="">Выберите менеджера</option>
                  {salesTeam.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Статус</label>
                <select
                  value={editingClient.status}
                  onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value as Client['status'] })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                >
                  {statuses.map(st => (
                    <option key={st.value} value={st.value}>{st.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Когда заказывают</label>
                <input
                  type="text"
                  value={editingClient.orderFrequency}
                  onChange={(e) => setEditingClient({ ...editingClient, orderFrequency: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="Ежеквартально, к праздникам..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Средний чек</label>
                <input
                  type="text"
                  value={editingClient.averageOrder}
                  onChange={(e) => setEditingClient({ ...editingClient, averageOrder: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="500 000 ₽"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Последний заказ</label>
                <input
                  type="text"
                  value={editingClient.lastOrder}
                  onChange={(e) => setEditingClient({ ...editingClient, lastOrder: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="Декабрь 2025"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Потребности</label>
                <textarea
                  value={editingClient.needs}
                  onChange={(e) => setEditingClient({ ...editingClient, needs: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  placeholder="Какие товары/услуги интересуют, особые требования..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Заметки</label>
                <textarea
                  value={editingClient.notes}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  placeholder="Дополнительная информация..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setEditingClient(null); setIsCreating(false) }}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={saveClient}
                disabled={saving || !editingClient.name}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 rounded-lg"
              >
                {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clients list */}
      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <Card className="text-center py-12">
            <Building2 className="mx-auto text-dark-500 mb-4" size={48} />
            <p className="text-dark-400">
              {clients.length === 0 ? 'Клиенты ещё не добавлены' : 'Клиенты не найдены'}
            </p>
            {clients.length === 0 && (
              <button
                onClick={createClient}
                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
              >
                <Plus size={18} />
                Добавить первого клиента
              </button>
            )}
          </Card>
        ) : (
          filteredClients.map(client => {
            const isExpanded = expandedClient === client.id
            const statusInfo = statuses.find(s => s.value === client.status)
            const segmentInfo = segments.find(s => s.value === client.segment)

            return (
              <Card key={client.id} className="overflow-hidden">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${statusInfo?.color || 'bg-gray-500'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{client.name}</span>
                        {client.company && (
                          <span className="text-dark-400">• {client.company}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-dark-400 mt-1">
                        {client.industry && (
                          <span className="flex items-center gap-1">
                            <Tag size={12} />
                            {client.industry}
                          </span>
                        )}
                        {segmentInfo && (
                          <span className={`px-2 py-0.5 rounded text-xs ${segmentInfo.color}/20 text-white`}>
                            {segmentInfo.label}
                          </span>
                        )}
                        {client.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {client.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingClient(client); setIsCreating(false) }}
                      className="p-2 hover:bg-dark-700 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteClient(client.id) }}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-dark-700 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {client.contactPerson && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Контакт</div>
                        <div className="flex items-center gap-2 text-sm">
                          <User size={14} className="text-primary-400" />
                          {client.contactPerson}
                        </div>
                      </div>
                    )}
                    {client.phone && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Телефон</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-green-400" />
                          {client.phone}
                        </div>
                      </div>
                    )}
                    {client.email && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Email</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-blue-400" />
                          {client.email}
                        </div>
                      </div>
                    )}
                    {client.website && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Сайт</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe size={14} className="text-purple-400" />
                          <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                            {client.website}
                          </a>
                        </div>
                      </div>
                    )}
                    {client.orderFrequency && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Когда заказывают</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-yellow-400" />
                          {client.orderFrequency}
                        </div>
                      </div>
                    )}
                    {client.averageOrder && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Средний чек</div>
                        <div className="text-sm font-medium text-green-400">{client.averageOrder}</div>
                      </div>
                    )}
                    {client.needs && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <div className="text-xs text-dark-400 mb-1">Потребности</div>
                        <p className="text-sm text-dark-300">{client.needs}</p>
                      </div>
                    )}
                    {client.notes && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <div className="text-xs text-dark-400 mb-1">Заметки</div>
                        <p className="text-sm text-dark-300">{client.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

