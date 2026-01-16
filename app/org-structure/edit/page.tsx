'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, RefreshCw, UserPlus, ArrowRight, GripVertical } from 'lucide-react'
import Card from '@/components/Card'

interface Employee {
  id: string
  name: string
  role: string
}

interface Team {
  id: string
  name: string
  lead: Employee
  members: Employee[]
}

interface Department {
  id: string
  name: string
  shortName: string
  teams?: Team[]
  employees?: Employee[]
}

// Initial data from lib/data.ts structure
const initialDepartments: Department[] = [
  {
    id: 'china',
    name: 'Департамент по работе с Китаем',
    shortName: 'Китай',
    teams: [
      {
        id: 'china-1',
        name: 'Группа Артёма',
        lead: { id: 'l1', name: 'Артём Василевский', role: 'РГ' },
        members: [
          { id: 'm1', name: 'Светлана Литяк', role: 'Менеджер' },
          { id: 'm2', name: 'Киселёва Екатерина', role: 'Менеджер' },
          { id: 'm3', name: 'Алёна Бицоева', role: 'Менеджер' },
        ],
      },
      {
        id: 'china-2',
        name: 'Группа Евгения',
        lead: { id: 'l2', name: 'Евгений Косицын', role: 'РГ' },
        members: [
          { id: 'm4', name: 'Фёдор Богдан', role: 'Менеджер' },
          { id: 'm5', name: 'Екатерина Казакова', role: 'Менеджер' },
          { id: 'm6', name: 'Виктория Багандова', role: 'Менеджер' },
          { id: 'm7', name: 'Мария Гуляева', role: 'Менеджер' },
        ],
      },
      {
        id: 'china-3',
        name: 'Группа Александры',
        lead: { id: 'l3', name: 'Александра Комардина', role: 'РГ' },
        members: [
          { id: 'm8', name: 'Дарья Попова', role: 'Менеджер' },
          { id: 'm9', name: 'Анастасия Тищук', role: 'Менеджер' },
        ],
      },
      {
        id: 'china-4',
        name: 'Группа Насти А.',
        lead: { id: 'l4', name: 'Анастасия Андрианова', role: 'РГ' },
        members: [
          { id: 'm10', name: 'Светлана Червоненко', role: 'Менеджер' },
          { id: 'm11', name: 'Елена Прокопова (Ли)', role: 'Менеджер' },
          { id: 'm12', name: 'Эмина Арина', role: 'Менеджер' },
          { id: 'm13', name: 'Чаплыгина Анастасия', role: 'Менеджер' },
        ],
      },
      {
        id: 'china-5',
        name: 'Группа Юлии',
        lead: { id: 'l5', name: 'Юлия Лелик', role: 'РГ' },
        members: [
          { id: 'm14', name: 'Анастасия Олина', role: 'Менеджер' },
          { id: 'm15', name: 'Марина Иванова', role: 'Менеджер' },
        ],
      },
      {
        id: 'china-6',
        name: 'Группа Сергея',
        lead: { id: 'l6', name: 'Сергей Кумашев', role: 'РГ' },
        members: [],
      },
    ],
  },
  {
    id: 'sales',
    name: 'Департамент продаж',
    shortName: 'Продажи',
    employees: [
      { id: 's1', name: 'Виктория Бакирова', role: 'Руководитель' },
      { id: 's2', name: 'Наталья Лактистова', role: 'Менеджер' },
      { id: 's3', name: 'Полина Коник', role: 'Менеджер' },
      { id: 's4', name: 'Алина Титова', role: 'Менеджер' },
      { id: 's5', name: 'Ирина Ветера', role: 'Менеджер' },
      { id: 's6', name: 'Елизавета Барабаш', role: 'Ассистент' },
      { id: 's7', name: 'Максим Можкин', role: 'Менеджер' },
      { id: 's8', name: 'Олег Михайлов', role: 'Аккаунт' },
      { id: 's9', name: 'Сизиков Тимур', role: 'Менеджер' },
      { id: 's10', name: 'Диёр Дадаев', role: 'Менеджер' },
    ],
  },
  {
    id: 'dev-projects',
    name: 'Отдел развития',
    shortName: 'Развитие',
    employees: [
      { id: 'd1', name: 'Анастасия Мирскова', role: 'Руководитель' },
      { id: 'd2', name: 'Макарова Екатерина', role: 'Менеджер' },
    ],
  },
  {
    id: 'ved',
    name: 'ВЭД',
    shortName: 'ВЭД',
    employees: [
      { id: 'v1', name: 'Павел Хохлов', role: 'Руководитель' },
      { id: 'v2', name: 'Галимов Флорид', role: 'Менеджер' },
    ],
  },
  {
    id: 'marketing',
    name: 'Маркетинг',
    shortName: 'Маркетинг',
    employees: [
      { id: 'mk1', name: 'Константин Макаров', role: 'CMO' },
      { id: 'mk2', name: 'Екатерина Каменкова', role: 'Ассистент' },
      { id: 'mk3', name: 'Екатерина Гущан', role: 'Дизайнер' },
      { id: 'mk4', name: 'Максим Соколов', role: 'Рилсмейкер' },
    ],
  },
  {
    id: 'uae',
    name: 'UAE Department',
    shortName: 'Дубай',
    employees: [
      { id: 'u1', name: 'Никита Жирнов', role: 'CMO/COO Dubai' },
      { id: 'u2', name: 'Кристина Воронецкая', role: 'Sales' },
    ],
  },
]

export default function OrgStructureEditPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [saving, setSaving] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<{emp: Employee, fromDept: string, fromTeam?: string} | null>(null)
  const [newEmployeeName, setNewEmployeeName] = useState('')
  const [newEmployeeRole, setNewEmployeeRole] = useState('')
  const [addingTo, setAddingTo] = useState<{deptId: string, teamId?: string} | null>(null)

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/org')
        if (response.ok) {
          const data = await response.json()
          if (data.departments?.length > 0) {
            setDepartments(data.departments)
          }
        }
      } catch (error) {
        console.error('Error loading:', error)
      }
    }
    loadData()
  }, [])

  // Save data
  const saveData = async () => {
    setSaving(true)
    try {
      await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departments })
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  // Move employee to different department/team
  const moveEmployee = (toDeptId: string, toTeamId?: string) => {
    if (!selectedEmployee) return

    const { emp, fromDept, fromTeam } = selectedEmployee

    setDepartments(depts => {
      return depts.map(dept => {
        // Remove from source
        if (dept.id === fromDept) {
          if (fromTeam && dept.teams) {
            return {
              ...dept,
              teams: dept.teams.map(team => {
                if (team.id === fromTeam) {
                  return { ...team, members: team.members.filter(m => m.id !== emp.id) }
                }
                return team
              })
            }
          } else if (dept.employees) {
            return { ...dept, employees: dept.employees.filter(e => e.id !== emp.id) }
          }
        }
        
        // Add to destination
        if (dept.id === toDeptId) {
          if (toTeamId && dept.teams) {
            return {
              ...dept,
              teams: dept.teams.map(team => {
                if (team.id === toTeamId) {
                  return { ...team, members: [...team.members, emp] }
                }
                return team
              })
            }
          } else if (dept.employees) {
            return { ...dept, employees: [...dept.employees, emp] }
          }
        }
        
        return dept
      })
    })

    setSelectedEmployee(null)
    saveData()
  }

  // Add new employee
  const addEmployee = () => {
    if (!addingTo || !newEmployeeName.trim()) return

    const newEmp: Employee = {
      id: `new-${Date.now()}`,
      name: newEmployeeName,
      role: newEmployeeRole || 'Сотрудник'
    }

    setDepartments(depts => {
      return depts.map(dept => {
        if (dept.id === addingTo.deptId) {
          if (addingTo.teamId && dept.teams) {
            return {
              ...dept,
              teams: dept.teams.map(team => {
                if (team.id === addingTo.teamId) {
                  return { ...team, members: [...team.members, newEmp] }
                }
                return team
              })
            }
          } else if (dept.employees) {
            return { ...dept, employees: [...dept.employees, newEmp] }
          }
        }
        return dept
      })
    })

    setNewEmployeeName('')
    setNewEmployeeRole('')
    setAddingTo(null)
    saveData()
  }

  // Delete employee
  const deleteEmployee = (deptId: string, empId: string, teamId?: string) => {
    if (!confirm('Удалить сотрудника?')) return

    setDepartments(depts => {
      return depts.map(dept => {
        if (dept.id === deptId) {
          if (teamId && dept.teams) {
            return {
              ...dept,
              teams: dept.teams.map(team => {
                if (team.id === teamId) {
                  return { ...team, members: team.members.filter(m => m.id !== empId) }
                }
                return team
              })
            }
          } else if (dept.employees) {
            return { ...dept, employees: dept.employees.filter(e => e.id !== empId) }
          }
        }
        return dept
      })
    })
    saveData()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/org-structure" className="p-2 hover:bg-dark-700 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Редактирование оргструктуры</h1>
            <p className="text-dark-400 mt-1">Добавляйте, удаляйте и перемещайте сотрудников</p>
          </div>
        </div>
        <button
          onClick={saveData}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 rounded-lg"
        >
          {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          Сохранить
        </button>
      </div>

      {/* Selected employee indicator */}
      {selectedEmployee && (
        <div className="p-4 bg-primary-500/20 border border-primary-500/50 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GripVertical size={20} className="text-primary-400" />
            <span>Выбран: <strong>{selectedEmployee.emp.name}</strong></span>
            <span className="text-dark-400">— нажмите на отдел/команду для перемещения</span>
          </div>
          <button
            onClick={() => setSelectedEmployee(null)}
            className="text-dark-400 hover:text-white"
          >
            Отмена
          </button>
        </div>
      )}

      {/* Departments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map(dept => (
          <Card key={dept.id} title={dept.name}>
            {dept.teams ? (
              // Teams view (China)
              <div className="space-y-4">
                {dept.teams.map(team => (
                  <div 
                    key={team.id}
                    className={`p-4 rounded-xl transition-all ${
                      selectedEmployee 
                        ? 'bg-dark-700/50 hover:bg-primary-500/20 cursor-pointer border-2 border-transparent hover:border-primary-500' 
                        : 'bg-dark-700/50'
                    }`}
                    onClick={() => selectedEmployee && moveEmployee(dept.id, team.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-primary-400">{team.name}</div>
                        <div className="text-sm text-dark-400">{team.lead.name} (РГ)</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setAddingTo({ deptId: dept.id, teamId: team.id })
                        }}
                        className="text-dark-400 hover:text-primary-400"
                      >
                        <UserPlus size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-1">
                      {team.members.map(member => (
                        <div 
                          key={member.id}
                          className={`flex items-center justify-between p-2 rounded ${
                            selectedEmployee?.emp.id === member.id 
                              ? 'bg-primary-500/30' 
                              : 'hover:bg-dark-600'
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEmployee({ emp: member, fromDept: dept.id, fromTeam: team.id })
                            }}
                            className="flex items-center gap-2 text-left flex-1"
                          >
                            <GripVertical size={14} className="text-dark-500" />
                            <span className="text-sm">{member.name}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEmployee(dept.id, member.id, team.id)
                            }}
                            className="text-dark-500 hover:text-red-400 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add form for this team */}
                    {addingTo?.deptId === dept.id && addingTo?.teamId === team.id && (
                      <div className="mt-3 pt-3 border-t border-dark-600 space-y-2" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={newEmployeeName}
                          onChange={e => setNewEmployeeName(e.target.value)}
                          placeholder="Имя сотрудника"
                          className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-sm"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newEmployeeRole}
                            onChange={e => setNewEmployeeRole(e.target.value)}
                            placeholder="Роль"
                            className="flex-1 bg-dark-600 border border-dark-500 rounded px-3 py-2 text-sm"
                          />
                          <button onClick={addEmployee} className="px-3 py-2 bg-primary-600 rounded">
                            <Plus size={18} />
                          </button>
                          <button onClick={() => setAddingTo(null)} className="px-3 py-2 bg-dark-600 rounded">
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Regular employees view
              <div 
                className={`space-y-2 ${
                  selectedEmployee ? 'cursor-pointer' : ''
                }`}
                onClick={() => selectedEmployee && moveEmployee(dept.id)}
              >
                <div className="flex justify-end mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAddingTo({ deptId: dept.id })
                    }}
                    className="text-dark-400 hover:text-primary-400"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>

                {dept.employees?.map(emp => (
                  <div 
                    key={emp.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      selectedEmployee?.emp.id === emp.id 
                        ? 'bg-primary-500/30' 
                        : 'bg-dark-700/50 hover:bg-dark-700'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEmployee({ emp, fromDept: dept.id })
                      }}
                      className="flex items-center gap-2 text-left flex-1"
                    >
                      <GripVertical size={14} className="text-dark-500" />
                      <div>
                        <div className="text-sm font-medium">{emp.name}</div>
                        <div className="text-xs text-dark-400">{emp.role}</div>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteEmployee(dept.id, emp.id)
                      }}
                      className="text-dark-500 hover:text-red-400 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Add form */}
                {addingTo?.deptId === dept.id && !addingTo?.teamId && (
                  <div className="mt-3 pt-3 border-t border-dark-600 space-y-2" onClick={e => e.stopPropagation()}>
                    <input
                      type="text"
                      value={newEmployeeName}
                      onChange={e => setNewEmployeeName(e.target.value)}
                      placeholder="Имя сотрудника"
                      className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newEmployeeRole}
                        onChange={e => setNewEmployeeRole(e.target.value)}
                        placeholder="Роль"
                        className="flex-1 bg-dark-600 border border-dark-500 rounded px-3 py-2 text-sm"
                      />
                      <button onClick={addEmployee} className="px-3 py-2 bg-primary-600 rounded">
                        <Plus size={18} />
                      </button>
                      <button onClick={() => setAddingTo(null)} className="px-3 py-2 bg-dark-600 rounded">
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center text-dark-500 text-sm">
        🔄 Нажмите на сотрудника → выберите место назначения → перемещение выполнится автоматически
      </div>
    </div>
  )
}

