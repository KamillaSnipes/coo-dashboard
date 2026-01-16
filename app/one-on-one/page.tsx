'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import { ChevronDown, ChevronUp, Calendar, Plus, Save, Trash2, FileText, Clock, Target, AlertTriangle, Lightbulb, User } from 'lucide-react'
import { oneOnOnePeople, departments } from '@/lib/data'

interface Meeting {
  id: string
  date: string
  goals: string
  planFact: string
  risksProblems: string
  initiatives: string
  personalPriorities: string
  summary: string
}

interface PersonData {
  name: string
  role: string
  department: string
  frequency: string
  nextMeeting: string
  meetings: Meeting[]
}

export default function OneOnOnePage() {
  const [people, setPeople] = useState<PersonData[]>(
    oneOnOnePeople.map(p => ({
      ...p,
      nextMeeting: '',
      meetings: []
    }))
  )
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [showNewMeeting, setShowNewMeeting] = useState(false)
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    date: new Date().toISOString().split('T')[0],
    goals: '',
    planFact: '',
    risksProblems: '',
    initiatives: '',
    personalPriorities: '',
    summary: ''
  })
  const [saving, setSaving] = useState(false)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/org')
        if (response.ok) {
          const data = await response.json()
          if (data.oneOnOnePeople?.length > 0) {
            setPeople(data.oneOnOnePeople)
          }
        }
      } catch (error) {
        console.error('Error loading:', error)
      }
    }
    loadData()
  }, [])

  const selectedPersonData = people.find(p => p.name === selectedPerson)

  const addMeeting = async () => {
    if (!selectedPerson || !newMeeting.date) return
    
    setSaving(true)
    const meeting: Meeting = {
      id: Date.now().toString(),
      date: newMeeting.date || '',
      goals: newMeeting.goals || '',
      planFact: newMeeting.planFact || '',
      risksProblems: newMeeting.risksProblems || '',
      initiatives: newMeeting.initiatives || '',
      personalPriorities: newMeeting.personalPriorities || '',
      summary: newMeeting.summary || ''
    }

    const updated = people.map(p => {
      if (p.name === selectedPerson) {
        return { ...p, meetings: [meeting, ...p.meetings] }
      }
      return p
    })
    
    setPeople(updated)
    setShowNewMeeting(false)
    setNewMeeting({
      date: new Date().toISOString().split('T')[0],
      goals: '',
      planFact: '',
      risksProblems: '',
      initiatives: '',
      personalPriorities: '',
      summary: ''
    })

    // Save to API
    try {
      await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oneOnOnePeople: updated })
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  const deleteMeeting = async (meetingId: string) => {
    if (!selectedPerson) return
    
    const updated = people.map(p => {
      if (p.name === selectedPerson) {
        return { ...p, meetings: p.meetings.filter(m => m.id !== meetingId) }
      }
      return p
    })
    
    setPeople(updated)

    try {
      await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oneOnOnePeople: updated })
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const groupedPeople = {
    china: people.filter(p => p.department === 'china'),
    other: people.filter(p => p.department !== 'china' && p.department !== 'ceo'),
    ceo: people.filter(p => p.department === 'ceo'),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">1:1 Встречи</h1>
          <p className="text-dark-400 mt-2">Архив встреч с руководителями</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-400">{people.length}</div>
          <div className="text-sm text-dark-400">человек</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* People List */}
        <div className="lg:col-span-1 space-y-4">
          {/* CEO */}
          <Card title="👑 CEO">
            <div className="space-y-2">
              {groupedPeople.ceo.map((person) => (
                <button
                  key={person.name}
                  onClick={() => setSelectedPerson(person.name)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedPerson === person.name 
                      ? 'bg-primary-500/20 border border-primary-500/50' 
                      : 'bg-dark-700/50 hover:bg-dark-700'
                  }`}
                >
                  <div className="font-semibold">{person.name}</div>
                  <div className="text-sm text-dark-400">{person.frequency}</div>
                  <div className="text-xs text-dark-500 mt-1">
                    {person.meetings.length} встреч в архиве
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* China */}
          <Card title="🇨🇳 РГ Китая">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {groupedPeople.china.map((person) => (
                <button
                  key={person.name}
                  onClick={() => setSelectedPerson(person.name)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedPerson === person.name 
                      ? 'bg-yellow-500/20 border border-yellow-500/50' 
                      : 'bg-dark-700/50 hover:bg-dark-700'
                  }`}
                >
                  <div className="font-semibold text-sm">{person.name}</div>
                  <div className="text-xs text-dark-400">{person.frequency}</div>
                  <div className="text-xs text-dark-500">
                    {person.meetings.length} встреч
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Other */}
          <Card title="🏢 Другие руководители">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {groupedPeople.other.map((person) => (
                <button
                  key={person.name}
                  onClick={() => setSelectedPerson(person.name)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedPerson === person.name 
                      ? 'bg-primary-500/20 border border-primary-500/50' 
                      : 'bg-dark-700/50 hover:bg-dark-700'
                  }`}
                >
                  <div className="font-semibold text-sm">{person.name}</div>
                  <div className="text-xs text-dark-400">{person.role}</div>
                  <div className="text-xs text-dark-500">
                    {person.meetings.length} встреч
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Meeting Details */}
        <div className="lg:col-span-2">
          {selectedPerson && selectedPersonData ? (
            <Card 
              title={`👤 ${selectedPersonData.name}`}
              subtitle={selectedPersonData.role}
            >
              <div className="space-y-6">
                {/* Info */}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2 text-dark-400">
                    <Clock size={16} />
                    <span>{selectedPersonData.frequency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-dark-400">
                    <FileText size={16} />
                    <span>{selectedPersonData.meetings.length} встреч в архиве</span>
                  </div>
                </div>

                {/* Add new meeting */}
                {showNewMeeting ? (
                  <div className="p-4 bg-dark-700/50 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">📝 Новая встреча</h4>
                      <button
                        onClick={() => setShowNewMeeting(false)}
                        className="text-dark-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div>
                      <label className="text-sm text-dark-400 mb-1 block">Дата встречи</label>
                      <input
                        type="date"
                        value={newMeeting.date}
                        onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-dark-400 mb-1 flex items-center gap-2">
                        <Target size={14} /> 1. Цели / Планы
                      </label>
                      <textarea
                        value={newMeeting.goals}
                        onChange={(e) => setNewMeeting({ ...newMeeting, goals: e.target.value })}
                        placeholder="Какие цели и планы обсудили?"
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 h-20"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-dark-400 mb-1 flex items-center gap-2">
                        <FileText size={14} /> 2. План / Факт
                      </label>
                      <textarea
                        value={newMeeting.planFact}
                        onChange={(e) => setNewMeeting({ ...newMeeting, planFact: e.target.value })}
                        placeholder="Что было запланировано vs что сделано?"
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 h-20"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-dark-400 mb-1 flex items-center gap-2">
                        <AlertTriangle size={14} /> 3. Риски / Проблемы
                      </label>
                      <textarea
                        value={newMeeting.risksProblems}
                        onChange={(e) => setNewMeeting({ ...newMeeting, risksProblems: e.target.value })}
                        placeholder="Какие риски и проблемы обсудили?"
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 h-20"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-dark-400 mb-1 flex items-center gap-2">
                        <Lightbulb size={14} /> 4. Инициативы
                      </label>
                      <textarea
                        value={newMeeting.initiatives}
                        onChange={(e) => setNewMeeting({ ...newMeeting, initiatives: e.target.value })}
                        placeholder="Какие инициативы обсудили?"
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 h-20"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-dark-400 mb-1 flex items-center gap-2">
                        <User size={14} /> 5. Личные приоритеты
                      </label>
                      <textarea
                        value={newMeeting.personalPriorities}
                        onChange={(e) => setNewMeeting({ ...newMeeting, personalPriorities: e.target.value })}
                        placeholder="Личные приоритеты сотрудника"
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 h-20"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-dark-400 mb-1 block">📋 Общее саммари</label>
                      <textarea
                        value={newMeeting.summary}
                        onChange={(e) => setNewMeeting({ ...newMeeting, summary: e.target.value })}
                        placeholder="Краткое резюме встречи (или вставьте транскрипцию)"
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 h-24"
                      />
                    </div>

                    <button
                      onClick={addMeeting}
                      disabled={saving}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 rounded-lg font-medium"
                    >
                      <Save size={18} />
                      {saving ? 'Сохранение...' : 'Сохранить встречу'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewMeeting(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl text-dark-400 hover:text-primary-400 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Добавить встречу</span>
                  </button>
                )}

                {/* Meeting Archive */}
                <div>
                  <h4 className="font-semibold mb-4">📚 Архив встреч</h4>
                  {selectedPersonData.meetings.length === 0 ? (
                    <div className="text-center py-8 text-dark-500">
                      Пока нет записей о встречах
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedPersonData.meetings.map((meeting) => (
                        <div key={meeting.id} className="p-4 bg-dark-700/50 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-primary-400" />
                              <span className="font-medium">{meeting.date}</span>
                            </div>
                            <button
                              onClick={() => deleteMeeting(meeting.id)}
                              className="text-dark-500 hover:text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="space-y-3 text-sm">
                            {meeting.goals && (
                              <div>
                                <div className="flex items-center gap-2 text-dark-400 mb-1">
                                  <Target size={14} /> Цели / Планы
                                </div>
                                <div className="text-dark-200 pl-5">{meeting.goals}</div>
                              </div>
                            )}
                            {meeting.planFact && (
                              <div>
                                <div className="flex items-center gap-2 text-dark-400 mb-1">
                                  <FileText size={14} /> План / Факт
                                </div>
                                <div className="text-dark-200 pl-5">{meeting.planFact}</div>
                              </div>
                            )}
                            {meeting.risksProblems && (
                              <div>
                                <div className="flex items-center gap-2 text-dark-400 mb-1">
                                  <AlertTriangle size={14} /> Риски / Проблемы
                                </div>
                                <div className="text-dark-200 pl-5">{meeting.risksProblems}</div>
                              </div>
                            )}
                            {meeting.initiatives && (
                              <div>
                                <div className="flex items-center gap-2 text-dark-400 mb-1">
                                  <Lightbulb size={14} /> Инициативы
                                </div>
                                <div className="text-dark-200 pl-5">{meeting.initiatives}</div>
                              </div>
                            )}
                            {meeting.personalPriorities && (
                              <div>
                                <div className="flex items-center gap-2 text-dark-400 mb-1">
                                  <User size={14} /> Личные приоритеты
                                </div>
                                <div className="text-dark-200 pl-5">{meeting.personalPriorities}</div>
                              </div>
                            )}
                            {meeting.summary && (
                              <div className="pt-2 border-t border-dark-600">
                                <div className="text-dark-400 mb-1">📋 Саммари</div>
                                <div className="text-dark-300 pl-5">{meeting.summary}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] text-dark-500">
              <div className="text-center">
                <div className="text-4xl mb-4">👈</div>
                <div>Выберите человека слева</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
