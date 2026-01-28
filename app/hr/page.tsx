'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import { Users, Target, AlertTriangle, CheckCircle, Clock, ExternalLink, ChevronDown, ChevronUp, Plus, Trash2, Edit2, Save, X, RefreshCw } from 'lucide-react'

interface HRGoal {
  id: string
  title: string
  status: 'done' | 'in_progress' | 'pending'
  details?: string
}

interface Vacancy {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  status: string
  link?: string
}

interface HrbpCandidate {
  id: string
  name: string
  seniority: string
  experience: string
  strengths: string
  risks: string
  cultureFit: string
  salaryExpectations: string
  status: 'new' | 'in_process' | 'offer' | 'rejected'
  notes?: string
}

interface HRData {
  mainGoal: string
  goals: HRGoal[]
  vacancies: Vacancy[]
  problems: string[]
  hrbpCandidates?: HrbpCandidate[]
  notes: string
}

const defaultData: HRData = {
  mainGoal: 'Создать HR-систему и найти HRBP',
  goals: [
    { id: '1', title: 'Найти и онбордить HRBP', status: 'in_progress', details: 'Приоритет #1' },
    { id: '2', title: 'Настроить систему оценки компетенций', status: 'in_progress', details: 'Разработка таблицы компетенций' },
    { id: '3', title: 'Запустить систему 1:1 встреч', status: 'done' },
    { id: '4', title: 'Описать HR-процессы', status: 'pending' },
    { id: '5', title: 'Внедрить систему грейдов', status: 'pending' },
  ],
  vacancies: [
    { id: '1', title: 'HRBP', priority: 'high', status: 'Активный поиск, интервью', link: '' },
    { id: '2', title: 'Контент-лид', priority: 'high', status: 'Усилили вакансию', link: '' },
    { id: '3', title: 'Тендерный специалист', priority: 'medium', status: 'Поиск', link: '' },
    { id: '4', title: 'Аккаунт-менеджер', priority: 'medium', status: 'Найден хороший кандидат', link: '' },
    { id: '5', title: 'Менеджеры по Китаю', priority: 'medium', status: 'Перезапуск вакансии', link: '' },
  ],
  problems: [
    'Нет выделенного HRBP',
    'Отсутствует система грейдов',
    'Не формализованы HR-процессы',
    'Нет системы оценки компетенций',
  ],
  hrbpCandidates: [],
  notes: '',
}

export default function HRPage() {
  const [data, setData] = useState<HRData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [editingVacancy, setEditingVacancy] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState('')
  const [newVacancy, setNewVacancy] = useState({ title: '', priority: 'medium' as const })
  const [newProblem, setNewProblem] = useState('')
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null)
  const [newCandidate, setNewCandidate] = useState<Partial<HrbpCandidate>>({
    name: '',
    seniority: '',
    experience: '',
    strengths: '',
    risks: '',
    cultureFit: '',
    salaryExpectations: '',
    status: 'new',
    notes: '',
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/page-data?page=hr')
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
  const saveData = async (newData: HRData) => {
    setSaving(true)
    setData(newData)
    try {
      await fetch('/api/page-data?page=hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  // Goal functions
  const addGoal = () => {
    if (!newGoal.trim()) return
    const goal: HRGoal = { id: Date.now().toString(), title: newGoal, status: 'pending' }
    saveData({ ...data, goals: [...data.goals, goal] })
    setNewGoal('')
  }

  const updateGoal = (id: string, updates: Partial<HRGoal>) => {
    saveData({ ...data, goals: data.goals.map(g => g.id === id ? { ...g, ...updates } : g) })
    setEditingGoal(null)
  }

  const deleteGoal = (id: string) => {
    saveData({ ...data, goals: data.goals.filter(g => g.id !== id) })
  }

  // Vacancy functions
  const addVacancy = () => {
    if (!newVacancy.title.trim()) return
    const vacancy: Vacancy = { id: Date.now().toString(), ...newVacancy, status: 'Новая' }
    saveData({ ...data, vacancies: [...data.vacancies, vacancy] })
    setNewVacancy({ title: '', priority: 'medium' })
  }

  const updateVacancy = (id: string, updates: Partial<Vacancy>) => {
    saveData({ ...data, vacancies: data.vacancies.map(v => v.id === id ? { ...v, ...updates } : v) })
    setEditingVacancy(null)
  }

  const deleteVacancy = (id: string) => {
    saveData({ ...data, vacancies: data.vacancies.filter(v => v.id !== id) })
  }

  // Problem functions
  const addProblem = () => {
    if (!newProblem.trim()) return
    saveData({ ...data, problems: [...data.problems, newProblem] })
    setNewProblem('')
  }

  const deleteProblem = (index: number) => {
    saveData({ ...data, problems: data.problems.filter((_, i) => i !== index) })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle size={16} className="text-green-400" />
      case 'in_progress': return <Clock size={16} className="text-yellow-400" />
      default: return <div className="w-4 h-4 rounded-full border-2 border-dark-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">Высокий</span>
      case 'medium': return <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">Средний</span>
      default: return <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">Низкий</span>
    }
  }

  const getCandidateStatusBadge = (status: HrbpCandidate['status']) => {
    switch (status) {
      case 'new':
        return <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">Новый</span>
      case 'in_process':
        return <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full">В процессе</span>
      case 'offer':
        return <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full">Оффер</span>
      case 'rejected':
        return <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full">Отказ</span>
      default:
        return null
    }
  }

  const updateCandidate = (id: string, updates: Partial<HrbpCandidate>) => {
    const current = data.hrbpCandidates || []
    saveData({
      ...data,
      hrbpCandidates: current.map(c => (c.id === id ? { ...c, ...updates } : c)),
    })
  }

  const addCandidate = () => {
    if (!newCandidate.name?.trim()) return
    const current = data.hrbpCandidates || []
    const candidate: HrbpCandidate = {
      id: Date.now().toString(),
      name: newCandidate.name || '',
      seniority: newCandidate.seniority || '',
      experience: newCandidate.experience || '',
      strengths: newCandidate.strengths || '',
      risks: newCandidate.risks || '',
      cultureFit: newCandidate.cultureFit || '',
      salaryExpectations: newCandidate.salaryExpectations || '',
      status: newCandidate.status || 'new',
      notes: newCandidate.notes || '',
    }
    saveData({
      ...data,
      hrbpCandidates: [...current, candidate],
    })
    setNewCandidate({
      name: '',
      seniority: '',
      experience: '',
      strengths: '',
      risks: '',
      cultureFit: '',
      salaryExpectations: '',
      status: 'new',
      notes: '',
    })
  }

  const deleteCandidate = (id: string) => {
    const current = data.hrbpCandidates || []
    saveData({
      ...data,
      hrbpCandidates: current.filter(c => c.id !== id),
    })
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
        <div>
          <h1 className="text-3xl font-bold">👥 HR Department</h1>
          <p className="text-dark-400 mt-2">Создание HR-системы с нуля</p>
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

      {/* Main Goal */}
      <Card>
        <div className="p-2 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/30 rounded-xl">
              <Target className="text-rose-400" size={32} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-rose-300 font-medium mb-1">🎯 КЛЮЧЕВАЯ ЦЕЛЬ</div>
              {editMode ? (
                <input
                  type="text"
                  value={data.mainGoal}
                  onChange={(e) => saveData({ ...data, mainGoal: e.target.value })}
                  className="w-full text-xl font-bold bg-transparent border-b border-rose-500/50 focus:outline-none focus:border-rose-500"
                />
              ) : (
                <div className="text-xl font-bold">{data.mainGoal}</div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Goals & Vacancies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals */}
        <Card title="📋 HR Цели">
          <div className="space-y-3">
            {data.goals.map((goal) => (
              <div key={goal.id} className="p-3 bg-dark-700/50 rounded-lg">
                {editingGoal === goal.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={goal.title}
                      onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                      className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      value={goal.details || ''}
                      onChange={(e) => updateGoal(goal.id, { details: e.target.value })}
                      placeholder="Детали..."
                      className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-sm"
                    />
                    <div className="flex gap-2">
                      {(['pending', 'in_progress', 'done'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateGoal(goal.id, { status })}
                          className={`px-2 py-1 text-xs rounded ${
                            goal.status === status ? 'bg-primary-600 text-white' : 'bg-dark-600 hover:bg-dark-500'
                          }`}
                        >
                          {status === 'done' ? 'Готово' : status === 'in_progress' ? 'В работе' : 'Ожидает'}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <button onClick={() => updateGoal(goal.id, { 
                      status: goal.status === 'done' ? 'pending' : goal.status === 'pending' ? 'in_progress' : 'done' 
                    })}>
                      {getStatusIcon(goal.status)}
                    </button>
                    <div className="flex-1">
                      <div className={goal.status === 'done' ? 'line-through text-dark-500' : ''}>{goal.title}</div>
                      {goal.details && <div className="text-xs text-dark-500 mt-1">{goal.details}</div>}
                    </div>
                    {editMode && (
                      <div className="flex gap-1">
                        <button onClick={() => setEditingGoal(goal.id)} className="p-1 text-dark-400 hover:text-white">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteGoal(goal.id)} className="p-1 text-dark-400 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {editMode && (
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Новая цель..."
                className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && addGoal()}
              />
              <button onClick={addGoal} className="px-3 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg">
                <Plus size={18} />
              </button>
            </div>
          )}
        </Card>

        {/* Vacancies */}
        <Card title="📢 Открытые вакансии">
          <div className="space-y-3">
            {data.vacancies.map((vacancy) => (
              <div key={vacancy.id} className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                {editingVacancy === vacancy.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={vacancy.title}
                      onChange={(e) => updateVacancy(vacancy.id, { title: e.target.value })}
                      className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      value={vacancy.status}
                      onChange={(e) => updateVacancy(vacancy.id, { status: e.target.value })}
                      placeholder="Статус..."
                      className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-sm"
                    />
                    <div className="flex gap-2">
                      {(['high', 'medium', 'low'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => updateVacancy(vacancy.id, { priority: p })}
                          className={`px-2 py-1 text-xs rounded ${
                            vacancy.priority === p ? 'bg-primary-600 text-white' : 'bg-dark-600 hover:bg-dark-500'
                          }`}
                        >
                          {p === 'high' ? 'Высокий' : p === 'medium' ? 'Средний' : 'Низкий'}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary-300">{vacancy.title}</span>
                        {getPriorityBadge(vacancy.priority)}
                      </div>
                      <div className="text-sm text-dark-400 mt-1">{vacancy.status}</div>
                    </div>
                    {editMode && (
                      <div className="flex gap-1">
                        <button onClick={() => setEditingVacancy(vacancy.id)} className="p-1 text-dark-400 hover:text-white">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteVacancy(vacancy.id)} className="p-1 text-dark-400 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {editMode && (
            <div className="space-y-2 mt-4">
              <input
                type="text"
                value={newVacancy.title}
                onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                placeholder="Название вакансии..."
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <select
                  value={newVacancy.priority}
                  onChange={(e) => setNewVacancy({ ...newVacancy, priority: e.target.value as any })}
                  className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="high">Высокий</option>
                  <option value="medium">Средний</option>
                  <option value="low">Низкий</option>
                </select>
                <button onClick={addVacancy} className="px-3 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Problems */}
      <Card title="⚠️ Проблемы HR">
        <div className="space-y-2">
          {data.problems.map((problem, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertTriangle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <span className="flex-1 text-red-200">{problem}</span>
              {editMode && (
                <button onClick={() => deleteProblem(i)} className="p-1 text-dark-400 hover:text-red-400">
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
              value={newProblem}
              onChange={(e) => setNewProblem(e.target.value)}
              placeholder="Добавить проблему..."
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addProblem()}
            />
            <button onClick={addProblem} className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg">
              <Plus size={18} />
            </button>
          </div>
        )}
      </Card>

      {/* HRBP Candidates Profiles */}
      <Card title="🧩 Профили кандидатов HRBP">
        <div className="space-y-4">
          {(data.hrbpCandidates || []).length === 0 && !editMode && (
            <p className="text-dark-500 text-sm">
              Здесь будет удобная сводка по кандидатам HRBP (профиль, сильные стороны, риски, fit под Headcorn).
              Добавь кандидатов в режиме редактирования.
            </p>
          )}

          {(data.hrbpCandidates || []).map((candidate) => (
            <div
              key={candidate.id}
              className="p-4 bg-dark-700/50 rounded-xl border border-dark-600"
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() =>
                  setExpandedCandidate(expandedCandidate === candidate.id ? null : candidate.id)
                }
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{candidate.name}</h3>
                    {getCandidateStatusBadge(candidate.status)}
                  </div>
                  {candidate.seniority && (
                    <p className="text-sm text-dark-400 mt-1">{candidate.seniority}</p>
                  )}
                  {candidate.experience && (
                    <p className="text-xs text-dark-500 mt-1 line-clamp-1">
                      Опыт: {candidate.experience}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {expandedCandidate === candidate.id ? (
                    <ChevronUp size={18} className="text-dark-400" />
                  ) : (
                    <ChevronDown size={18} className="text-dark-400" />
                  )}
                  {editMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCandidate(candidate.id)
                      }}
                      className="p-1 text-dark-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {expandedCandidate === candidate.id && (
                <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <div className="text-dark-400 mb-1">Опыт</div>
                      {editMode ? (
                        <textarea
                          value={candidate.experience}
                          onChange={(e) =>
                            updateCandidate(candidate.id, { experience: e.target.value })
                          }
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 min-h-[60px]"
                        />
                      ) : (
                        <p className="text-dark-200 whitespace-pre-wrap">
                          {candidate.experience || '—'}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="text-dark-400 mb-1">Сильные стороны</div>
                      {editMode ? (
                        <textarea
                          value={candidate.strengths}
                          onChange={(e) =>
                            updateCandidate(candidate.id, { strengths: e.target.value })
                          }
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 min-h-[60px]"
                        />
                      ) : (
                        <p className="text-dark-200 whitespace-pre-wrap">
                          {candidate.strengths || '—'}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="text-dark-400 mb-1">Риски / слабые стороны</div>
                      {editMode ? (
                        <textarea
                          value={candidate.risks}
                          onChange={(e) =>
                            updateCandidate(candidate.id, { risks: e.target.value })
                          }
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 min-h-[60px]"
                        />
                      ) : (
                        <p className="text-dark-200 whitespace-pre-wrap">
                          {candidate.risks || '—'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-dark-400 mb-1">Culture/Fit под Headcorn</div>
                      {editMode ? (
                        <textarea
                          value={candidate.cultureFit}
                          onChange={(e) =>
                            updateCandidate(candidate.id, { cultureFit: e.target.value })
                          }
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 min-h-[60px]"
                        />
                      ) : (
                        <p className="text-dark-200 whitespace-pre-wrap">
                          {candidate.cultureFit || '—'}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="text-dark-400 mb-1">Ожидания по деньгам</div>
                      {editMode ? (
                        <input
                          type="text"
                          value={candidate.salaryExpectations}
                          onChange={(e) =>
                            updateCandidate(candidate.id, { salaryExpectations: e.target.value })
                          }
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2"
                          placeholder="Например: 250–300k фикс + бонус"
                        />
                      ) : (
                        <p className="text-dark-200">
                          {candidate.salaryExpectations || '—'}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="text-dark-400 mb-1">Заметки / вывод по кандидату</div>
                      {editMode ? (
                        <textarea
                          value={candidate.notes || ''}
                          onChange={(e) =>
                            updateCandidate(candidate.id, { notes: e.target.value })
                          }
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 min-h-[60px]"
                        />
                      ) : (
                        <p className="text-dark-200 whitespace-pre-wrap">
                          {candidate.notes || '—'}
                        </p>
                      )}
                    </div>
                    {editMode && (
                      <div>
                        <div className="text-dark-400 mb-1">Статус кандидата</div>
                        <select
                          value={candidate.status}
                          onChange={(e) =>
                            updateCandidate(candidate.id, {
                              status: e.target.value as HrbpCandidate['status'],
                            })
                          }
                          className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="new">Новый</option>
                          <option value="in_process">В процессе</option>
                          <option value="offer">Оффер</option>
                          <option value="rejected">Отказ</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {editMode && (
            <div className="mt-6 border-t border-dark-700 pt-4 space-y-3">
              <div className="text-sm text-dark-400">
                Заполни краткий профиль нового кандидата HRBP (как ты присылаешь в чат/док) и зафиксируй его здесь.
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newCandidate.name || ''}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                    placeholder="Имя кандидата"
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={newCandidate.seniority || ''}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, seniority: e.target.value })
                    }
                    placeholder="Уровень (Senior/Middle, продуктовый/корпоративный HRBP и т.п.)"
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2"
                  />
                  <textarea
                    value={newCandidate.experience || ''}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, experience: e.target.value })
                    }
                    placeholder="Опыт: компании, команды, ключевые проекты"
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <textarea
                    value={newCandidate.strengths || ''}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, strengths: e.target.value })
                    }
                    placeholder="Сильные стороны"
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 min-h-[60px]"
                  />
                  <textarea
                    value={newCandidate.risks || ''}
                    onChange={(e) => setNewCandidate({ ...newCandidate, risks: e.target.value })}
                    placeholder="Риски/красные флажки"
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 min-h-[60px]"
                  />
                  <textarea
                    value={newCandidate.cultureFit || ''}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, cultureFit: e.target.value })
                    }
                    placeholder="Fit под Headcorn (ценности, скорость, стиль)"
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 min-h-[60px]"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={newCandidate.salaryExpectations || ''}
                      onChange={(e) =>
                        setNewCandidate({ ...newCandidate, salaryExpectations: e.target.value })
                      }
                      placeholder="Ожидания по деньгам"
                      className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2"
                    />
                    <select
                      value={newCandidate.status || 'new'}
                      onChange={(e) =>
                        setNewCandidate({
                          ...newCandidate,
                          status: e.target.value as HrbpCandidate['status'],
                        })
                      }
                      className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="new">Новый</option>
                      <option value="in_process">В процессе</option>
                      <option value="offer">Оффер</option>
                      <option value="rejected">Отказ</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={addCandidate}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm"
                >
                  <Plus size={16} />
                  Добавить кандидата HRBP
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Notes */}
      <Card title="📝 Заметки">
        <textarea
          value={data.notes}
          onChange={(e) => saveData({ ...data, notes: e.target.value })}
          placeholder="Добавить заметки по HR..."
          className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-4 py-3 min-h-[120px] focus:outline-none focus:border-primary-500"
        />
      </Card>
    </div>
  )
}
