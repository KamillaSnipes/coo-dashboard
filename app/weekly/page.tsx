'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import { CheckCircle, XCircle, Lightbulb, Calendar } from 'lucide-react'

interface WeeklyReview {
  id: string
  weekStart: string
  weekEnd: string
  successes: string[]
  failures: string[]
  failureReasons: string
  decisions: string[]
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
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  
  return {
    start: startOfWeek.toLocaleDateString('ru-RU'),
    end: endOfWeek.toLocaleDateString('ru-RU'),
  }
}

const initialReview: WeeklyReview = {
  id: '1',
  weekStart: getCurrentWeek().start,
  weekEnd: getCurrentWeek().end,
  successes: [],
  failures: [],
  failureReasons: '',
  decisions: [],
  priorities: [
    { task: '', done: false },
    { task: '', done: false },
    { task: '', done: false },
  ],
  departmentStatuses: [
    { name: 'Продажи (Москва)', status: 'yellow' },
    { name: 'Продажи (Дубай)', status: 'green' },
    { name: 'Отдел Китая', status: 'green' },
    { name: 'ВЭД', status: 'green' },
    { name: 'Маркетинг', status: 'green' },
    { name: 'IT', status: 'green' },
  ],
  insights: '',
  nextWeekPriorities: [
    { task: '', reason: '' },
    { task: '', reason: '' },
    { task: '', reason: '' },
  ],
  reflection: { good: '', improve: '', focus: '' },
}

export default function WeeklyPage() {
  const [review, setReview] = useState(initialReview)
  const [newSuccess, setNewSuccess] = useState('')
  const [newFailure, setNewFailure] = useState('')
  const [newDecision, setNewDecision] = useState('')

  const addItem = (field: 'successes' | 'failures' | 'decisions', value: string, setValue: (v: string) => void) => {
    if (!value.trim()) return
    setReview({ ...review, [field]: [...review[field], value] })
    setValue('')
  }

  const removeItem = (field: 'successes' | 'failures' | 'decisions', index: number) => {
    setReview({ ...review, [field]: review[field].filter((_, i) => i !== index) })
  }

  const updatePriority = (index: number, field: 'task' | 'done', value: any) => {
    const newPriorities = [...review.priorities]
    newPriorities[index] = { ...newPriorities[index], [field]: value }
    setReview({ ...review, priorities: newPriorities })
  }

  const updateDepartmentStatus = (index: number, status: 'green' | 'yellow' | 'red') => {
    const newStatuses = [...review.departmentStatuses]
    newStatuses[index].status = status
    setReview({ ...review, departmentStatuses: newStatuses })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Еженедельный обзор</h1>
        <p className="text-dark-400 mt-2">
          Неделя: {review.weekStart} — {review.weekEnd}
        </p>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Successes */}
        <Card title="✅ Что получилось">
          <div className="space-y-3">
            {review.successes.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg group">
                <CheckCircle size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span className="flex-1">{item}</span>
                <button 
                  onClick={() => removeItem('successes', i)}
                  className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSuccess}
                onChange={(e) => setNewSuccess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('successes', newSuccess, setNewSuccess)}
                placeholder="Добавить..."
                className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={() => addItem('successes', newSuccess, setNewSuccess)}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </Card>

        {/* Failures */}
        <Card title="❌ Что не получилось">
          <div className="space-y-3">
            {review.failures.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg group">
                <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span className="flex-1">{item}</span>
                <button 
                  onClick={() => removeItem('failures', i)}
                  className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFailure}
                onChange={(e) => setNewFailure(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('failures', newFailure, setNewFailure)}
                placeholder="Добавить..."
                className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={() => addItem('failures', newFailure, setNewFailure)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Priorities */}
      <Card title="🎯 Фокус недели">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {review.departmentStatuses.map((dept, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-sm">{dept.name}</span>
              <div className="flex gap-2">
                {(['green', 'yellow', 'red'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateDepartmentStatus(i, status)}
                    className={`w-6 h-6 rounded-full transition-all ${
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
        <EditableText
          value={review.insights}
          onSave={(value) => setReview({ ...review, insights: value })}
          placeholder="Что понял(а) на этой неделе? Идеи для улучшения..."
          multiline
          className="bg-dark-700/50 rounded-lg min-h-[100px]"
        />
      </Card>

      {/* Next Week */}
      <Card title="📅 План на следующую неделю">
        <div className="space-y-4">
          {review.nextWeekPriorities.map((priority, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-dark-700/50 rounded-lg">
              <span className="text-primary-400 font-bold text-lg">{i + 1}</span>
              <div className="flex-1 space-y-2">
                <EditableText
                  value={priority.task}
                  onSave={(value) => {
                    const newPriorities = [...review.nextWeekPriorities]
                    newPriorities[i].task = value
                    setReview({ ...review, nextWeekPriorities: newPriorities })
                  }}
                  placeholder="Задача..."
                  className="font-medium"
                />
                <EditableText
                  value={priority.reason}
                  onSave={(value) => {
                    const newPriorities = [...review.nextWeekPriorities]
                    newPriorities[i].reason = value
                    setReview({ ...review, nextWeekPriorities: newPriorities })
                  }}
                  placeholder="Почему важно..."
                  className="text-sm text-dark-400"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reflection */}
      <Card title="🔄 Рефлексия">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-dark-400 text-sm mb-2">Что сделал(а) хорошо:</p>
            <EditableText
              value={review.reflection.good}
              onSave={(value) => setReview({ ...review, reflection: { ...review.reflection, good: value } })}
              placeholder="..."
              multiline
              className="bg-dark-700/50 rounded-lg"
            />
          </div>
          <div>
            <p className="text-dark-400 text-sm mb-2">Что можно улучшить:</p>
            <EditableText
              value={review.reflection.improve}
              onSave={(value) => setReview({ ...review, reflection: { ...review.reflection, improve: value } })}
              placeholder="..."
              multiline
              className="bg-dark-700/50 rounded-lg"
            />
          </div>
          <div>
            <p className="text-dark-400 text-sm mb-2">На что обратить внимание:</p>
            <EditableText
              value={review.reflection.focus}
              onSave={(value) => setReview({ ...review, reflection: { ...review.reflection, focus: value } })}
              placeholder="..."
              multiline
              className="bg-dark-700/50 rounded-lg"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

