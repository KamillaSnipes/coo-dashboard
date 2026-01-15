'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import { ChevronDown, ChevronUp, Calendar, Plus } from 'lucide-react'
import { oneOnOnePeople, departments } from '@/lib/data'

interface Meeting {
  id: string
  date: string
  status: 'green' | 'yellow' | 'red'
  notes: string
  discussed: string[]
  agreements: string[]
}

interface PersonWithMeetings {
  name: string
  role: string
  department: string
  frequency: string
  nextMeeting?: string
  meetings: Meeting[]
}

export default function OneOnOnePage() {
  const [people, setPeople] = useState<PersonWithMeetings[]>(
    oneOnOnePeople.map(p => ({
      ...p,
      nextMeeting: '',
      meetings: []
    }))
  )
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null)

  const togglePerson = (name: string) => {
    setExpandedPerson(expandedPerson === name ? null : name)
  }

  const getDepartmentColor = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId)
    return dept?.color || 'bg-dark-700'
  }

  const groupedPeople = {
    china: people.filter(p => p.department === 'china'),
    other: people.filter(p => p.department !== 'china' && p.department !== 'ceo'),
    ceo: people.filter(p => p.department === 'ceo'),
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">1:1 Встречи</h1>
          <p className="text-dark-400 mt-2">Трекер встреч с руководителями и ключевыми сотрудниками</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-400">{people.length}</div>
          <div className="text-sm text-dark-400">человек</div>
        </div>
      </div>

      {/* CEO */}
      <Card title="👑 CEO">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedPeople.ceo.map((person) => (
            <div 
              key={person.name}
              className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{person.name}</div>
                  <div className="text-sm text-dark-400">{person.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-primary-400">{person.frequency}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* China Department */}
      <Card title="🇨🇳 Руководители групп Китая">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupedPeople.china.map((person) => (
            <div 
              key={person.name}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                expandedPerson === person.name 
                  ? 'bg-yellow-500/20 border border-yellow-500/30' 
                  : 'bg-dark-700/50 hover:bg-dark-700'
              }`}
              onClick={() => togglePerson(person.name)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{person.name}</div>
                  <div className="text-sm text-dark-400">{person.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-yellow-400">{person.frequency}</div>
                </div>
              </div>
              
              {expandedPerson === person.name && (
                <div className="mt-4 pt-4 border-t border-dark-600 space-y-3">
                  <div>
                    <label className="text-xs text-dark-400">Следующая встреча</label>
                    <EditableText
                      value={person.nextMeeting || ''}
                      onSave={(value) => {
                        setPeople(people.map(p => 
                          p.name === person.name ? { ...p, nextMeeting: value } : p
                        ))
                      }}
                      placeholder="Добавить дату..."
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-400">Заметки</label>
                    <EditableText
                      value=""
                      onSave={() => {}}
                      placeholder="Добавить заметки..."
                      multiline
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Other Departments */}
      <Card title="🏢 Руководители других отделов">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupedPeople.other.map((person) => {
            const deptColor = getDepartmentColor(person.department)
            return (
              <div 
                key={person.name}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  expandedPerson === person.name 
                    ? `${deptColor} border border-dark-500` 
                    : 'bg-dark-700/50 hover:bg-dark-700'
                }`}
                onClick={() => togglePerson(person.name)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{person.name}</div>
                    <div className="text-sm text-dark-400">{person.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-dark-300">{person.frequency}</div>
                  </div>
                </div>
                
                {expandedPerson === person.name && (
                  <div className="mt-4 pt-4 border-t border-dark-600 space-y-3">
                    <div>
                      <label className="text-xs text-dark-400">Следующая встреча</label>
                      <EditableText
                        value={person.nextMeeting || ''}
                        onSave={(value) => {
                          setPeople(people.map(p => 
                            p.name === person.name ? { ...p, nextMeeting: value } : p
                          ))
                        }}
                        placeholder="Добавить дату..."
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-400">Заметки</label>
                      <EditableText
                        value=""
                        onSave={() => {}}
                        placeholder="Добавить заметки..."
                        multiline
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-yellow-400">{groupedPeople.china.length}</div>
          <div className="text-sm text-dark-400">РГ Китая</div>
        </div>
        <div className="p-4 bg-dark-700 rounded-xl text-center">
          <div className="text-2xl font-bold">{groupedPeople.other.length}</div>
          <div className="text-sm text-dark-400">Другие руководители</div>
        </div>
        <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-primary-400">{groupedPeople.ceo.length}</div>
          <div className="text-sm text-dark-400">CEO</div>
        </div>
      </div>
    </div>
  )
}
