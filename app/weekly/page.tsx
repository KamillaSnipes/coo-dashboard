'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import EditableText from '@/components/EditableText'
import { CheckCircle, XCircle, Lightbulb, Calendar, Upload, X, RefreshCw, Save } from 'lucide-react'

interface WeeklyReview {
  id: string
  weekStart: string
  weekEnd: string
  factItems: string[]
  planItems: string[]
  meetings: string[]
  successes: string[]
  failures: string[]
  priorities: { task: string; done: boolean }[]
  departmentStatuses: { name: string; status: 'green' | 'yellow' | 'red' }[]
  insights: string
  nextWeekPriorities: { task: string; reason: string }[]
  reflection: { good: string; improve: string; focus: string }
}

const getCurrentWeek = () => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 4)
  
  return {
    start: startOfWeek.toLocaleDateString('ru-RU'),
    end: endOfWeek.toLocaleDateString('ru-RU'),
  }
}

const initialReview: WeeklyReview = {
  id: '1',
  weekStart: getCurrentWeek().start,
  weekEnd: getCurrentWeek().end,
  factItems: [
    'Провели встречу с РГ ОК по матрице',
    'Запустили релиз контрагента и изменили структуру отлова спама и сделок в ПФ',
    'Оформили Валтворден',
    'Сделали каркас по клиентам ОАЭ на 26 г',
    '1:1 с Настей',
    '1:1 с Женей Якубиным',
    '1:1 с Женей',
    '1:1 с Кристиной',
    '1:1 с Юлей',
    'Запуск Дашборда для ОК',
    'Актуализировали данные по приходам / + прогнозы',
  ],
  planItems: [
    'Очные собеседования с кандидатами на HRBP, + отсмотр кандидатов',
    'Правки по дашборду сотрудников ОК',
    'Синхронизация ПФ и моего склада по платежному календарю',
    'Тест Валтворден',
    'Продолжаем работу по проекту безопасность',
    'Начинаем переход Тищук к Саше',
    'Тестирую / дорабатываю личный управленческий дашборд',
    'Собираем конверсию по клиентам',
  ],
  meetings: [
    'Паша',
    'Вика',
    'РГ ОК, компетенции',
    'Общая встреча с РГ ОК',
    'Настя',
  ],
  successes: [],
  failures: [],
  priorities: [
    { task: 'HRBP - собеседования', done: false },
    { task: 'Дашборд ОК - правки', done: false },
    { task: 'Безопасность проект', done: false },
  ],
  departmentStatuses: [
    { name: 'Продажи (Москва)', status: 'yellow' },
    { name: 'Продажи (Дубай)', status: 'green' },
    { name: 'Отдел Китая', status: 'green' },
    { name: 'ВЭД', status: 'green' },
    { name: 'Маркетинг', status: 'green' },
    { name: 'IT', status: 'green' },
    { name: 'HR', status: 'red' },
  ],
  insights: '',
  nextWeekPriorities: [
    { task: '', reason: '' },
    { task: '', reason: '' },
    { task: '', reason: '' },
  ],
  reflection: { good: '', improve: '', focus: '' },
}

// Parse imported text
function parseImportedText(text: string): { factItems: string[], planItems: string[], meetings: string[] } {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l)
  
  let factItems: string[] = []
  let planItems: string[] = []
  let meetings: string[] = []
  
  let currentSection = ''
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    
    // Detect section headers
    if (lowerLine.includes('факт') && (lowerLine.includes(':') || lowerLine.length < 15)) {
      currentSection = 'fact'
      continue
    }
    if (lowerLine.includes('план') && (lowerLine.includes(':') || lowerLine.length < 15)) {
      currentSection = 'plan'
      continue
    }
    if (lowerLine.includes('встреч') && (lowerLine.includes(':') || lowerLine.length < 20)) {
      currentSection = 'meetings'
      continue
    }
    
    // Clean the line (remove bullets, etc)
    let cleanLine = line.replace(/^[•\-\*\d\.\)]+\s*/, '').trim()
    if (!cleanLine) continue
    
    // Check if this is a meeting line within plan
    if (currentSection === 'plan' && cleanLine.startsWith('-')) {
      meetings.push(cleanLine.replace(/^-\s*/, ''))
      continue
    }
    
    // Add to appropriate section
    if (currentSection === 'fact') {
      factItems.push(cleanLine)
    } else if (currentSection === 'plan') {
      planItems.push(cleanLine)
    } else if (currentSection === 'meetings') {
      meetings.push(cleanLine)
    }
  }
  
  return { factItems, planItems, meetings }
}

export default function WeeklyPage() {
  const [review, setReview] = useState<WeeklyReview>(initialReview)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState('')
  const [newFactItem, setNewFactItem] = useState('')
  const [newPlanItem, setNewPlanItem] = useState('')
  const [newMeeting, setNewMeeting] = useState('')
  const [newSuccess, setNewSuccess] = useState('')
  const [newFailure, setNewFailure] = useState('')

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/page-data?page=weekly')
        if (response.ok) {
          const saved = await response.json()
          if (saved && Object.keys(saved).length > 0) {
            setReview({ ...initialReview, ...saved })
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
  const saveData = async (newReview: WeeklyReview) => {
    setSaving(true)
    setReview(newReview)
    try {
      await fetch('/api/page-data?page=weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  // Handle import
  const handleImport = () => {
    const parsed = parseImportedText(importText)
    saveData({
      ...review,
      factItems: [...review.factItems, ...parsed.factItems],
      planItems: [...review.planItems, ...parsed.planItems],
      meetings: [...review.meetings, ...parsed.meetings],
    })
    setImportText('')
    setShowImportModal(false)
  }

  // Add/remove items
  const addItem = (field: 'factItems' | 'planItems' | 'meetings' | 'successes' | 'failures', value: string, setValue: (v: string) => void) => {
    if (!value.trim()) return
    saveData({ ...review, [field]: [...(review[field] as string[]), value] })
    setValue('')
  }

  const removeItem = (field: 'factItems' | 'planItems' | 'meetings' | 'successes' | 'failures', index: number) => {
    saveData({ ...review, [field]: (review[field] as string[]).filter((_, i) => i !== index) })
  }

  const updatePriority = (index: number, field: 'task' | 'done', value: any) => {
    const newPriorities = [...review.priorities]
    newPriorities[index] = { ...newPriorities[index], [field]: value }
    saveData({ ...review, priorities: newPriorities })
  }

  const updateDepartmentStatus = (index: number, status: 'green' | 'yellow' | 'red') => {
    const newStatuses = [...review.departmentStatuses]
    newStatuses[index].status = status
    saveData({ ...review, departmentStatuses: newStatuses })
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
          <h1 className="text-3xl font-bold">Еженедельный обзор</h1>
          <p className="text-dark-400 mt-2">
            Неделя: {review.weekStart} — {review.weekEnd}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saving && (
            <div className="flex items-center gap-2 text-primary-400 text-sm">
              <RefreshCw size={14} className="animate-spin" />
              Сохранение...
            </div>
          )}
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
          >
            <Upload size={18} />
            Импорт План/Факт
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowImportModal(false)}>
          <div className="bg-dark-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Импорт План/Факт</h2>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-dark-700 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-dark-400 text-sm mb-4">
              Вставьте текст с вашим планом и фактом — система автоматически распределит по блокам.
              <br />Используйте слова "Факт:", "План:", "Встречи:" для разделения секций.
            </p>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Факт:
• Провели встречу с РГ ОК
• Запустили релиз контрагента
• 1:1 с Настей

План:
• Собеседования с кандидатами на HRBP
• Правки по дашборду
• Встречи:
-Паша
-Вика`}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 min-h-[300px] font-mono text-sm"
            />

            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="w-full mt-4 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Импортировать
            </button>
          </div>
        </div>
      )}

      {/* Fact / Plan Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Факт */}
        <Card title="✅ Факт (что сделано)">
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {review.factItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-green-500/10 rounded-lg group">
                <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                <span className="flex-1 text-sm">{item}</span>
                <button 
                  onClick={() => removeItem('factItems', i)}
                  className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newFactItem}
              onChange={(e) => setNewFactItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem('factItems', newFactItem, setNewFactItem)}
              placeholder="Добавить..."
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => addItem('factItems', newFactItem, setNewFactItem)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm"
            >
              +
            </button>
          </div>
        </Card>

        {/* План */}
        <Card title="📋 План (что сделать)">
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {review.planItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-blue-500/10 rounded-lg group">
                <Calendar size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="flex-1 text-sm">{item}</span>
                <button 
                  onClick={() => removeItem('planItems', i)}
                  className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newPlanItem}
              onChange={(e) => setNewPlanItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem('planItems', newPlanItem, setNewPlanItem)}
              placeholder="Добавить..."
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => addItem('planItems', newPlanItem, setNewPlanItem)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
            >
              +
            </button>
          </div>
        </Card>
      </div>

      {/* Meetings */}
      <Card title="👥 Встречи на неделе">
        <div className="flex flex-wrap gap-2">
          {review.meetings.map((meeting, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg group">
              <span className="text-sm">{meeting}</span>
              <button 
                onClick={() => removeItem('meetings', i)}
                className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 transition-all"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newMeeting}
            onChange={(e) => setNewMeeting(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem('meetings', newMeeting, setNewMeeting)}
            placeholder="Добавить встречу..."
            className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={() => addItem('meetings', newMeeting, setNewMeeting)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm"
          >
            +
          </button>
        </div>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Successes */}
        <Card title="🎉 Что получилось хорошо">
          <div className="space-y-2">
            {review.successes.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-green-500/10 rounded-lg group">
                <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                <span className="flex-1 text-sm">{item}</span>
                <button 
                  onClick={() => removeItem('successes', i)}
                  className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newSuccess}
              onChange={(e) => setNewSuccess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem('successes', newSuccess, setNewSuccess)}
              placeholder="Добавить успех..."
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => addItem('successes', newSuccess, setNewSuccess)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm"
            >
              +
            </button>
          </div>
        </Card>

        {/* Failures */}
        <Card title="❌ Что не получилось">
          <div className="space-y-2">
            {review.failures.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-red-500/10 rounded-lg group">
                <XCircle size={16} className="text-red-400 mt-1 flex-shrink-0" />
                <span className="flex-1 text-sm">{item}</span>
                <button 
                  onClick={() => removeItem('failures', i)}
                  className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newFailure}
              onChange={(e) => setNewFailure(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem('failures', newFailure, setNewFailure)}
              placeholder="Добавить..."
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => addItem('failures', newFailure, setNewFailure)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm"
            >
              +
            </button>
          </div>
        </Card>
      </div>

      {/* Priorities */}
      <Card title="🎯 Фокус недели (ТОП-3)">
        <div className="space-y-3">
          {review.priorities.map((priority, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                onClick={() => updatePriority(i, 'done', !priority.done)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  priority.done 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-dark-500 hover:border-primary-500'
                }`}
              >
                {priority.done && <CheckCircle size={14} className="text-white" />}
              </button>
              <span className="text-dark-400 font-medium w-6">{i + 1}.</span>
              <EditableText
                value={priority.task}
                onSave={(value) => updatePriority(i, 'task', value)}
                placeholder="Добавить приоритет..."
                className={`flex-1 ${priority.done ? 'line-through text-dark-500' : ''}`}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Department Statuses */}
      <Card title="📊 Статус отделов (краткий)">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {review.departmentStatuses.map((dept, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-sm">{dept.name}</span>
              <div className="flex gap-1">
                {(['green', 'yellow', 'red'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateDepartmentStatus(i, status)}
                    className={`w-5 h-5 rounded-full transition-all ${
                      dept.status === status 
                        ? status === 'green' ? 'bg-green-500' : status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                        : 'bg-dark-600 hover:opacity-80'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card 
        title="💡 Инсайты и идеи"
        action={<Lightbulb size={20} className="text-yellow-400" />}
      >
        <textarea
          value={review.insights}
          onChange={(e) => saveData({ ...review, insights: e.target.value })}
          placeholder="Что понял(а) на этой неделе? Идеи для улучшения..."
          className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 min-h-[100px] focus:outline-none focus:border-primary-500"
        />
      </Card>

      {/* Reflection */}
      <Card title="🔄 Рефлексия">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-dark-400 text-sm mb-2">Что сделал(а) хорошо:</p>
            <textarea
              value={review.reflection.good}
              onChange={(e) => saveData({ ...review, reflection: { ...review.reflection, good: e.target.value } })}
              placeholder="..."
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 min-h-[80px] focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <p className="text-dark-400 text-sm mb-2">Что можно улучшить:</p>
            <textarea
              value={review.reflection.improve}
              onChange={(e) => saveData({ ...review, reflection: { ...review.reflection, improve: e.target.value } })}
              placeholder="..."
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 min-h-[80px] focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <p className="text-dark-400 text-sm mb-2">На что обратить внимание:</p>
            <textarea
              value={review.reflection.focus}
              onChange={(e) => saveData({ ...review, reflection: { ...review.reflection, focus: e.target.value } })}
              placeholder="..."
              className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 min-h-[80px] focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
