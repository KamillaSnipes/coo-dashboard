'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import { Calendar, Plus, ChevronDown, ChevronUp } from 'lucide-react'

interface Meeting {
  id: number
  date: string
  status: 'green' | 'yellow' | 'red'
  discussed: string[]
  agreements: { text: string; done: boolean }[]
  openQuestions: string[]
  notes: string
}

interface Person {
  id: string
  name: string
  role: string
  frequency: string
  dayTime: string
  nextMeeting: string
  meetings: Meeting[]
}

const initialPeople: Person[] = [
  {
    id: '1',
    name: '',
    role: 'Руководитель отдела Китая',
    frequency: 'Еженедельно',
    dayTime: '',
    nextMeeting: '',
    meetings: [],
  },
  {
    id: '2',
    name: '',
    role: 'Руководитель ВЭД',
    frequency: '2 раза в месяц',
    dayTime: '',
    nextMeeting: '',
    meetings: [],
  },
  {
    id: '3',
    name: '',
    role: 'Руководитель маркетинга',
    frequency: '2 раза в месяц',
    dayTime: '',
    nextMeeting: '',
    meetings: [],
  },
  {
    id: '4',
    name: '',
    role: 'IT',
    frequency: '2 раза в месяц',
    dayTime: '',
    nextMeeting: '',
    meetings: [],
  },
  {
    id: '5',
    name: '',
    role: 'Руководитель Дубай',
    frequency: 'Еженедельно',
    dayTime: '',
    nextMeeting: '',
    meetings: [],
  },
  {
    id: '6',
    name: 'CEO 1',
    role: 'CEO',
    frequency: 'Еженедельно',
    dayTime: '',
    nextMeeting: '',
    meetings: [],
  },
  {
    id: '7',
    name: 'CEO 2',
    role: 'CEO',
    frequency: 'Еженедельно',
    dayTime: '',
    nextMeeting: '',
    meetings: [],
  },
]

export default function OneOnOnePage() {
  const [people, setPeople] = useState(initialPeople)
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null)
  const [showAddMeeting, setShowAddMeeting] = useState<string | null>(null)

  const togglePerson = (id: string) => {
    setExpandedPerson(expandedPerson === id ? null : id)
  }

  const updatePerson = (id: string, field: keyof Person, value: any) => {
    setPeople(people.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const addMeeting = (personId: string) => {
    const today = new Date().toLocaleDateString('ru-RU')
    const newMeeting: Meeting = {
      id: Date.now(),
      date: today,
      status: 'green',
      discussed: [],
      agreements: [],
      openQuestions: [],
      notes: '',
    }
    setPeople(people.map(p => 
      p.id === personId 
        ? { ...p, meetings: [newMeeting, ...p.meetings] }
        : p
    ))
    setShowAddMeeting(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">1:1 Встречи</h1>
        <p className="text-dark-400 mt-2">Планирование и история встреч с руководителями</p>
      </div>

      {/* Schedule Overview */}
      <Card title="📅 Расписание 1:1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-dark-400 text-sm border-b border-dark-700">
                <th className="pb-4 font-medium">Сотрудник</th>
                <th className="pb-4 font-medium">Должность</th>
                <th className="pb-4 font-medium">Частота</th>
                <th className="pb-4 font-medium">День/Время</th>
                <th className="pb-4 font-medium">Следующая встреча</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {people.map((person) => (
                <tr key={person.id} className="hover:bg-dark-700/50 transition-colors">
                  <td className="py-4">
                    <EditableText
                      value={person.name}
                      onSave={(value) => updatePerson(person.id, 'name', value)}
                      placeholder="Имя..."
                      className="font-medium"
                    />
                  </td>
                  <td className="py-4 text-dark-300">{person.role}</td>
                  <td className="py-4 text-dark-300">{person.frequency}</td>
                  <td className="py-4">
                    <EditableText
                      value={person.dayTime}
                      onSave={(value) => updatePerson(person.id, 'dayTime', value)}
                      placeholder="Пн 10:00..."
                      className="text-sm"
                    />
                  </td>
                  <td className="py-4">
                    <EditableText
                      value={person.nextMeeting}
                      onSave={(value) => updatePerson(person.id, 'nextMeeting', value)}
                      placeholder="Дата..."
                      className="text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Meeting History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">История встреч</h2>
        
        {people.map((person) => (
          <Card key={person.id} className="overflow-hidden">
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-dark-700/50 transition-colors -m-6 mb-0"
              onClick={() => togglePerson(person.id)}
            >
              <div>
                <h3 className="font-semibold">{person.name || person.role}</h3>
                <p className="text-dark-400 text-sm">{person.role}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-dark-400 text-sm">
                  {person.meetings.length} встреч
                </span>
                {expandedPerson === person.id ? (
                  <ChevronUp size={20} className="text-dark-400" />
                ) : (
                  <ChevronDown size={20} className="text-dark-400" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedPerson === person.id && (
              <div className="mt-6 pt-6 border-t border-dark-700">
                {/* Add Meeting Button */}
                <button
                  onClick={() => addMeeting(person.id)}
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-6"
                >
                  <Plus size={18} />
                  <span>Добавить встречу</span>
                </button>

                {/* Meetings */}
                {person.meetings.length === 0 ? (
                  <p className="text-dark-500 text-center py-8">
                    Нет записей о встречах
                  </p>
                ) : (
                  <div className="space-y-4">
                    {person.meetings.map((meeting) => (
                      <div key={meeting.id} className="p-4 bg-dark-700/50 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-primary-400" />
                            <span className="font-medium">{meeting.date}</span>
                          </div>
                          <StatusBadge status={meeting.status} size="sm" />
                        </div>

                        <div>
                          <p className="text-dark-400 text-sm mb-2">Заметки:</p>
                          <EditableText
                            value={meeting.notes}
                            onSave={(value) => {
                              const updatedMeetings = person.meetings.map(m =>
                                m.id === meeting.id ? { ...m, notes: value } : m
                              )
                              updatePerson(person.id, 'meetings', updatedMeetings)
                            }}
                            placeholder="Добавить заметки..."
                            multiline
                            className="bg-dark-800 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

