'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import { ChevronDown, ChevronUp, XCircle, ArrowRight, Users } from 'lucide-react'
import { departments, getDepartmentEmployeeCount, getDepartmentHead, quarterFocus } from '@/lib/data'

export default function DepartmentsPage() {
  const [expandedDept, setExpandedDept] = useState<string | null>('china')
  const [notes, setNotes] = useState<Record<string, string>>({})

  const toggleDept = (id: string) => {
    setExpandedDept(expandedDept === id ? null : id)
  }

  const updateNotes = (id: string, value: string) => {
    setNotes({ ...notes, [id]: value })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Трекер по отделам</h1>
          <p className="text-dark-400 mt-2">Детальный статус каждого отдела и синхронизация с общим фокусом</p>
        </div>
        <Link 
          href="/org-structure"
          className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
        >
          <Users size={18} />
          <span>Оргструктура</span>
        </Link>
      </div>

      {/* Focus Reminder */}
      <div className="bg-primary-600/10 border border-primary-600/30 rounded-xl p-4">
        <p className="text-primary-300 font-medium">
          🎯 Общий фокус {quarterFocus.quarter}: {quarterFocus.priorities.slice(0, 2).join(', ')}
        </p>
      </div>

      {/* Departments */}
      <div className="space-y-4">
        {departments.map((dept) => {
          const employeeCount = getDepartmentEmployeeCount(dept)
          const head = getDepartmentHead(dept)

          return (
            <Card key={dept.id} className="overflow-hidden">
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-dark-700/50 transition-colors -m-6 mb-0"
                onClick={() => toggleDept(dept.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-12 rounded-full ${dept.color}`}></div>
                  <div>
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <p className="text-dark-400 text-sm">
                      {head} • {employeeCount} чел.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={dept.status} />
                  {expandedDept === dept.id ? (
                    <ChevronUp size={20} className="text-dark-400" />
                  ) : (
                    <ChevronDown size={20} className="text-dark-400" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedDept === dept.id && (
                <div className="mt-6 pt-6 border-t border-dark-700 space-y-6">
                  
                  {/* Focus */}
                  {dept.focus && (
                    <div>
                      <h4 className="font-medium text-dark-300 mb-3">🎯 Текущий фокус</h4>
                      <div className="p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
                        {dept.focus}
                      </div>
                    </div>
                  )}

                  {/* Teams (for China) */}
                  {dept.teams && (
                    <div>
                      <h4 className="font-medium text-dark-300 mb-3">👥 Команды ({dept.teams.length} групп)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dept.teams.map((team) => (
                          <div key={team.id} className="p-4 bg-dark-700/50 rounded-lg">
                            <div className="font-medium text-primary-400">{team.name}</div>
                            <div className="text-sm text-dark-300 mt-1">{team.lead.name}</div>
                            <div className="text-xs text-dark-500 mt-2">{team.members.length} сотрудников</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Employees (for other departments) */}
                  {dept.employees && !dept.teams && (
                    <div>
                      <h4 className="font-medium text-dark-300 mb-3">👥 Сотрудники</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {dept.employees.map((emp, i) => (
                          <div 
                            key={i} 
                            className={`p-3 rounded-lg ${
                              emp.type === 'vacant' 
                                ? 'bg-dark-600 border border-dashed border-dark-500' 
                                : 'bg-dark-700/50'
                            }`}
                          >
                            <div className={`font-medium text-sm ${emp.type === 'vacant' ? 'text-dark-400' : ''}`}>
                              {emp.name}
                            </div>
                            <div className="text-xs text-dark-500">{emp.role}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KPIs */}
                  {dept.kpis && dept.kpis.length > 0 && (
                    <div>
                      <h4 className="font-medium text-dark-300 mb-3">📊 Метрики</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {dept.kpis.map((kpi, i) => (
                          <div key={i} className="p-4 bg-dark-700/50 rounded-lg">
                            <p className="text-dark-400 text-sm">{kpi.name}</p>
                            <p className="text-xl font-bold mt-1">{kpi.value}</p>
                            <p className="text-dark-500 text-xs mt-1">цель: {kpi.target}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Problems */}
                  {dept.problems && dept.problems.length > 0 && (
                    <div>
                      <h4 className="font-medium text-dark-300 mb-3">⚠️ Проблемы/Блокеры</h4>
                      <ul className="space-y-2">
                        {dept.problems.map((problem, i) => (
                          <li key={i} className="flex items-start gap-2 text-red-300">
                            <XCircle size={16} className="mt-1 flex-shrink-0" />
                            {problem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <h4 className="font-medium text-dark-300 mb-3">📝 Заметки</h4>
                    <EditableText
                      value={notes[dept.id] || ''}
                      onSave={(value) => updateNotes(dept.id, value)}
                      placeholder="Добавить заметки после 1:1 или наблюдений..."
                      multiline
                      className="bg-dark-700/50 rounded-lg"
                    />
                  </div>

                  {/* Detail Link for China */}
                  {dept.id === 'china' && (
                    <Link 
                      href="/departments/china"
                      className="flex items-center justify-center gap-2 p-4 bg-primary-600/20 hover:bg-primary-600/30 border border-primary-600/30 rounded-xl transition-colors text-primary-300"
                    >
                      <span className="font-medium">Открыть подробную страницу Отдела Китая</span>
                      <ArrowRight size={20} />
                    </Link>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
