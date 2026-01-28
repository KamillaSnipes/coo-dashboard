'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import { ChevronDown, ChevronUp, Target, AlertTriangle, CheckCircle, Clock, Plus, Trash2, Edit2, X, RefreshCw, Save } from 'lucide-react'

interface Stage {
  id: string
  name: string
  status: 'done' | 'in_progress' | 'pending'
}

interface Initiative {
  id: string
  name: string
  goal: string
  owner: string
  status: 'green' | 'yellow' | 'red'
  stages: Stage[]
  blockers: string[]
  notes: string
}

interface InitiativesData {
  quarter: string
  priorities: string[]
  initiatives: Initiative[]
}

const defaultData: InitiativesData = {
  quarter: 'Q1 2026',
  priorities: [
    'Сократить время КП до 3 дней',
    'Найти и онбордить HRBP',
    'Запустить систему оценки компетенций',
    'Снизить операционную нагрузку до 50%'
  ],
  initiatives: [
    {
      id: 'ops',
      name: 'Оптимизация операций',
      goal: 'Сократить время КП с 5 до 3 дней, автоматизировать рутину',
      owner: 'Камилла Каюмова',
      status: 'yellow',
      stages: [
        { id: '1', name: 'Аудит текущих процессов КП', status: 'done' },
        { id: '2', name: 'Карта bottlenecks в воронке', status: 'done' },
        { id: '3', name: 'Автоматизация шаблонов КП', status: 'in_progress' },
        { id: '4', name: 'Интеграция с CRM', status: 'pending' },
      ],
      blockers: ['Зависимость от IT для интеграций'],
      notes: ''
    },
    {
      id: 'hr',
      name: 'HR-система',
      goal: 'Создать HR-систему с нуля, найти HRBP',
      owner: 'Петр + Камилла',
      status: 'red',
      stages: [
        { id: '1', name: 'Найти HRBP', status: 'in_progress' },
        { id: '2', name: 'Описать HR-процессы', status: 'pending' },
        { id: '3', name: 'Внедрить систему грейдов', status: 'pending' },
      ],
      blockers: ['Нет HRBP', 'Нет времени на HR-задачи'],
      notes: ''
    },
    {
      id: 'competencies',
      name: 'Система компетенций',
      goal: 'Разработать и внедрить оценку компетенций МОК',
      owner: 'Камилла + Артем + Женя',
      status: 'yellow',
      stages: [
        { id: '1', name: 'Разработка таблицы компетенций', status: 'in_progress' },
        { id: '2', name: 'Синхронизация с руководителями', status: 'in_progress' },
        { id: '3', name: 'Пилотная оценка', status: 'pending' },
        { id: '4', name: 'Масштабирование', status: 'pending' },
      ],
      blockers: [],
      notes: ''
    },
    {
      id: 'sales-culture',
      name: 'Культура проактивных продаж',
      goal: 'Переход от реактивных к проактивным продажам',
      owner: 'Виктория Бакирова',
      status: 'yellow',
      stages: [
        { id: '1', name: 'Анализ текущей культуры', status: 'done' },
        { id: '2', name: 'Обучение команды', status: 'in_progress' },
        { id: '3', name: 'Внедрение новых KPI', status: 'pending' },
      ],
      blockers: ['70% операционной нагрузки'],
      notes: ''
    }
  ]
}

export default function InitiativesPage() {
  const [data, setData] = useState<InitiativesData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [expandedInit, setExpandedInit] = useState<string | null>('ops')
  const [editingInit, setEditingInit] = useState<string | null>(null)
  const [newPriority, setNewPriority] = useState('')

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/page-data?page=initiatives')
        if (response.ok) {
          const saved = await response.json()
          if (saved && Object.keys(saved).length > 0) {
            setData({ ...defaultData, ...saved })
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
  const saveData = async (newData: InitiativesData) => {
    setSaving(true)
    setData(newData)
    try {
      await fetch('/api/page-data?page=initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  const toggleInit = (id: string) => {
    setExpandedInit(expandedInit === id ? null : id)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle size={16} className="text-green-400" />
      case 'in_progress': return <Clock size={16} className="text-yellow-400" />
      default: return <div className="w-4 h-4 rounded-full border-2 border-dark-500" />
    }
  }

  // Priority functions
  const addPriority = () => {
    if (!newPriority.trim()) return
    saveData({ ...data, priorities: [...data.priorities, newPriority] })
    setNewPriority('')
  }

  const removePriority = (index: number) => {
    saveData({ ...data, priorities: data.priorities.filter((_, i) => i !== index) })
  }

  // Initiative functions
  const updateInitiative = (id: string, updates: Partial<Initiative>) => {
    saveData({ 
      ...data, 
      initiatives: data.initiatives.map(i => i.id === id ? { ...i, ...updates } : i) 
    })
  }

  const updateStage = (initId: string, stageId: string, status: Stage['status']) => {
    const init = data.initiatives.find(i => i.id === initId)
    if (!init) return
    const newStages = init.stages.map(s => s.id === stageId ? { ...s, status } : s)
    updateInitiative(initId, { stages: newStages })
  }

  const addBlocker = (initId: string, blocker: string) => {
    const init = data.initiatives.find(i => i.id === initId)
    if (!init || !blocker.trim()) return
    updateInitiative(initId, { blockers: [...init.blockers, blocker] })
  }

  const removeBlocker = (initId: string, index: number) => {
    const init = data.initiatives.find(i => i.id === initId)
    if (!init) return
    updateInitiative(initId, { blockers: init.blockers.filter((_, i) => i !== index) })
  }

  const addStage = (initId: string, name: string) => {
    const init = data.initiatives.find(i => i.id === initId)
    if (!init || !name.trim()) return
    const newStage: Stage = { id: Date.now().toString(), name, status: 'pending' }
    updateInitiative(initId, { stages: [...init.stages, newStage] })
  }

  const removeStage = (initId: string, stageId: string) => {
    const init = data.initiatives.find(i => i.id === initId)
    if (!init) return
    updateInitiative(initId, { stages: init.stages.filter(s => s.id !== stageId) })
  }

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
          <h1 className="text-3xl font-bold">Стратегические инициативы</h1>
          <p className="text-dark-400 mt-2">Ключевые проекты и их прогресс</p>
        </div>
        <div className="flex items-center gap-2">
          {saving && (
            <div className="flex items-center gap-2 text-primary-400 text-sm">
              <RefreshCw size={14} className="animate-spin" />
              Сохранение...
            </div>
          )}
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              editMode ? 'bg-primary-600 text-white' : 'bg-dark-700 hover:bg-dark-600'
            }`}
          >
            {editMode ? <X size={18} /> : <Edit2 size={18} />}
            {editMode ? 'Готово' : 'Редактировать'}
          </button>
        </div>
      </div>

      {/* Quarter Focus */}
      <Card title={`🎯 Фокус ${data.quarter}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.priorities.map((priority, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-primary-500/10 rounded-lg">
              <Target size={20} className="text-primary-400 flex-shrink-0" />
              <span className="flex-1">{priority}</span>
              {editMode && (
                <button onClick={() => removePriority(i)} className="p-1 text-dark-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        {editMode && (
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              placeholder="Добавить приоритет..."
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addPriority()}
            />
            <button onClick={addPriority} className="px-3 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg">
              <Plus size={18} />
            </button>
          </div>
        )}
      </Card>

      {/* Digital Transformation Strategy */}
      <Card title="🚀 Цифровая трансформация (Q1–Q2 2026)">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-dark-700/60 rounded-xl border border-dark-600">
              <h3 className="font-semibold text-primary-300 mb-2">1. Основной бизнес-процесс</h3>
              <p className="text-sm text-dark-300 mb-2">
                Путь клиента от первого контакта до реализации проекта — не линейный, с постоянными циклами возврата в бриф и пересчёт.
              </p>
              <ul className="text-sm text-dark-400 space-y-1">
                <li>• Клиент → Бриф / IdeaBoard → Расчёт + КП → Образец → Реализация → Отгрузка</li>
                <li>• Обратные петли: уточнение брифа, пересчёт, доработка образцов</li>
                <li>• Один клиент = много проектов (портфельный подход)</li>
              </ul>
            </div>

            <div className="p-4 bg-dark-700/60 rounded-xl border border-dark-600">
              <h3 className="font-semibold text-primary-300 mb-2">2. IdeaBoard как новый центр брифа</h3>
              <p className="text-sm text-dark-300 mb-2">
                Центральный инструмент для этапа брифа, который собирает все идеи и артефакты в одну структуру.
              </p>
              <ul className="text-sm text-dark-400 space-y-1">
                <li>• Источники: ручная загрузка, 1688, Pinterest, из проектов, Telegram-бот</li>
                <li>• Адаптивные карточки: картинки, каталоги, видео, части</li>
                <li>• Позиции: с ценой (из калькулятора) и сырые (с 1688)</li>
                <li>• Функции: макапы, группировка, диапазоны цен, скрытие, Drag&Drop, внутренняя цена</li>
                <li>• Клиентская страница: брендированный интерфейс с лайками, комментариями и кнопкой «🚀 В работу»</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-dark-700/60 rounded-xl border border-dark-600">
              <h3 className="font-semibold text-primary-300 mb-2">3. Product Intelligence</h3>
              <p className="text-sm text-dark-300 mb-2">
                Обогащение базы позиций через ИИ, чтобы продавцы искали не по артикулам, а по задачам клиента.
              </p>
              <ul className="text-sm text-dark-400 space-y-1">
                <li>• Входящий поток: ~20 000 позиций в год</li>
                <li>• Скоринг (ИИ анализирует): качество заполнения, уникальность, потенциал продаж → решение ✅/❌</li>
                <li>• Обогащение: категории применения, гипотезы использования, теги/ключевые слова, похожие товары</li>
                <li>• Результат: качественная база, готовая для смыслового поиска</li>
              </ul>
            </div>

            <div className="p-4 bg-dark-700/60 rounded-xl border border-dark-600">
              <h3 className="font-semibold text-primary-300 mb-2">4. ИИ-агенты и DSO</h3>
              <p className="text-sm text-dark-300 mb-2">
                Слой управляемых ИИ-агентов + база решений, которая не даёт теряться договорённостям.
              </p>
              <ul className="text-sm text-dark-400 space-y-1">
                <li>• Архитектура агентов: оператор → агент брифа → агент поиска → конструктор</li>
                <li>• Инструменты агентов: IdeaBoard API, база позиций (embeddings), конструктор, калькулятор</li>
                <li>• DSO (Decision System Operations): база решений с тегами, статусами и владельцами</li>
                <li>• ИИ-анализ: конфликты решений, напоминания, контекст связанных решений</li>
                <li>• Действия: эскалация, уведомления ответственным, отчёты по запросу</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Initiatives */}
      <div className="space-y-4">
        {data.initiatives.map((init) => (
          <Card key={init.id} className="overflow-hidden">
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-dark-700/50 transition-colors -m-6 mb-0"
              onClick={() => toggleInit(init.id)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{init.name}</h3>
                  <p className="text-dark-400 text-sm mt-1">{init.goal}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {editMode && (
                  <select
                    value={init.status}
                    onChange={(e) => {
                      e.stopPropagation()
                      updateInitiative(init.id, { status: e.target.value as any })
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-dark-700 border border-dark-600 rounded px-2 py-1 text-sm"
                  >
                    <option value="green">Зелёный</option>
                    <option value="yellow">Жёлтый</option>
                    <option value="red">Красный</option>
                  </select>
                )}
                <StatusBadge status={init.status} />
                {expandedInit === init.id ? (
                  <ChevronUp size={20} className="text-dark-400" />
                ) : (
                  <ChevronDown size={20} className="text-dark-400" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedInit === init.id && (
              <div className="mt-6 pt-6 border-t border-dark-700 space-y-6">
                {/* Owner */}
                <div>
                  <h4 className="font-medium text-dark-300 mb-2">👤 Ответственный</h4>
                  {editMode ? (
                    <input
                      type="text"
                      value={init.owner}
                      onChange={(e) => updateInitiative(init.id, { owner: e.target.value })}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2"
                    />
                  ) : (
                    <p className="text-dark-200">{init.owner}</p>
                  )}
                </div>

                {/* Stages */}
                <div>
                  <h4 className="font-medium text-dark-300 mb-3">📋 Этапы</h4>
                  <div className="space-y-2">
                    {init.stages.map((stage) => (
                      <div key={stage.id} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
                        <button 
                          onClick={() => updateStage(init.id, stage.id, 
                            stage.status === 'done' ? 'pending' : 
                            stage.status === 'pending' ? 'in_progress' : 'done'
                          )}
                        >
                          {getStatusIcon(stage.status)}
                        </button>
                        <span className={`flex-1 ${stage.status === 'done' ? 'line-through text-dark-500' : ''}`}>
                          {stage.name}
                        </span>
                        {editMode && (
                          <button 
                            onClick={() => removeStage(init.id, stage.id)}
                            className="p-1 text-dark-400 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {editMode && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Добавить этап..."
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            addStage(init.id, e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Blockers */}
                <div>
                  <h4 className="font-medium text-dark-300 mb-3">🚫 Блокеры</h4>
                  {init.blockers.length > 0 ? (
                    <ul className="space-y-2">
                      {init.blockers.map((blocker, i) => (
                        <li key={i} className="flex items-start gap-2 text-red-300 p-2 bg-red-500/10 rounded-lg">
                          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                          <span className="flex-1">{blocker}</span>
                          {editMode && (
                            <button 
                              onClick={() => removeBlocker(init.id, i)}
                              className="p-1 text-dark-400 hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-dark-500 text-sm">Нет блокеров</p>
                  )}
                  {editMode && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Добавить блокер..."
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            addBlocker(init.id, e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-medium text-dark-300 mb-2">📝 Заметки</h4>
                  <textarea
                    value={init.notes}
                    onChange={(e) => updateInitiative(init.id, { notes: e.target.value })}
                    placeholder="Добавить заметки..."
                    className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 min-h-[80px] focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
