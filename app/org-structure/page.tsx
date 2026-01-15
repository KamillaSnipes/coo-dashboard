'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Building2 } from 'lucide-react'
import Card from '@/components/Card'
import { departments, leadership, companyStats, getDepartmentEmployeeCount, Employee, Department } from '@/lib/data'

function EmployeeCard({ employee, small = false }: { employee: Employee; small?: boolean }) {
  const isVacant = employee.type === 'vacant' || employee.name.includes('VACANT')
  
  return (
    <div className={`${small ? 'p-2' : 'p-3'} rounded-lg ${
      isVacant 
        ? 'bg-dark-600 border border-dashed border-dark-500' 
        : 'bg-dark-700/50'
    }`}>
      <div className={`font-medium ${small ? 'text-sm' : ''} ${isVacant ? 'text-dark-400' : ''}`}>
        {employee.name}
      </div>
      <div className={`text-dark-400 ${small ? 'text-xs' : 'text-sm'}`}>
        {employee.role}
      </div>
    </div>
  )
}

function DepartmentCard({ dept, isExpanded, onToggle }: { 
  dept: Department
  isExpanded: boolean
  onToggle: () => void 
}) {
  const totalEmployees = getDepartmentEmployeeCount(dept)

  return (
    <div className={`rounded-xl border ${dept.color} ${dept.borderColor} overflow-hidden`}>
      <div 
        className="p-4 cursor-pointer hover:bg-dark-700/30 transition-colors flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-dark-400" />
          <div>
            <h3 className="font-semibold">{dept.name}</h3>
            <p className="text-dark-400 text-sm">{totalEmployees} чел.</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {dept.teams ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dept.teams.map((team) => (
                <div key={team.id} className="bg-dark-700/30 rounded-lg p-4">
                  <div className="font-medium text-primary-400 mb-2">{team.name}</div>
                  <div className="mb-3">
                    <EmployeeCard employee={team.lead} />
                  </div>
                  <div className="space-y-2">
                    {team.members.map((member, i) => (
                      <EmployeeCard key={i} employee={member} small />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {dept.employees?.map((employee, i) => (
                <EmployeeCard key={i} employee={employee} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function OrgStructurePage() {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['china']))

  const toggleDept = (id: string) => {
    const newExpanded = new Set(expandedDepts)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedDepts(newExpanded)
  }

  const expandAll = () => {
    setExpandedDepts(new Set(departments.map(d => d.id)))
  }

  const collapseAll = () => {
    setExpandedDepts(new Set())
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Организационная структура</h1>
          <p className="text-dark-400 mt-2">Headcorn / Megamind • {companyStats.total} сотрудников</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors text-sm"
          >
            Развернуть всё
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors text-sm"
          >
            Свернуть
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-400">{companyStats.office}</div>
          <div className="text-sm text-dark-400">Офис</div>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-400">{companyStats.remote}</div>
          <div className="text-sm text-dark-400">Удалённо</div>
        </div>
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-purple-400">{companyStats.hybrid}</div>
          <div className="text-sm text-dark-400">Гибрид</div>
        </div>
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-orange-400">{companyStats.project}</div>
          <div className="text-sm text-dark-400">Проектная</div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-red-400">{companyStats.vacant}+</div>
          <div className="text-sm text-dark-400">Вакансии</div>
        </div>
        <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-primary-400">{companyStats.total}</div>
          <div className="text-sm text-dark-400">Всего</div>
        </div>
      </div>

      {/* Top Management */}
      <Card title="🏛️ Руководство">
        <div className="flex flex-col items-center gap-6">
          {/* CEO Level */}
          <div className="flex gap-6 flex-wrap justify-center">
            {leadership.ceo.map((person, i) => (
              <div key={i} className="bg-primary-500/20 border border-primary-500/50 rounded-xl p-4 text-center min-w-[200px]">
                <div className="font-bold text-lg">{person.name}</div>
                <div className="text-primary-400 text-sm">{person.role}</div>
              </div>
            ))}
          </div>

          <div className="w-px h-8 bg-dark-600"></div>

          {/* COO Level */}
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center min-w-[250px]">
            <div className="font-bold text-lg">{leadership.coo.name}</div>
            <div className="text-green-400 text-sm">{leadership.coo.role}</div>
          </div>

          <div className="w-px h-8 bg-dark-600"></div>
          <div className="text-dark-400 text-sm">↓ Подразделения</div>
        </div>
      </Card>

      {/* Departments */}
      <div className="space-y-4">
        {departments.map((dept) => (
          <DepartmentCard
            key={dept.id}
            dept={dept}
            isExpanded={expandedDepts.has(dept.id)}
            onToggle={() => toggleDept(dept.id)}
          />
        ))}
      </div>

      {/* Legend */}
      <Card title="📋 Легенда">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/30"></div>
            <span className="text-sm">Офис</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/30"></div>
            <span className="text-sm">Дистанционно</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500/30"></div>
            <span className="text-sm">Гибрид</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500/30"></div>
            <span className="text-sm">Проектная занятость</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-dashed border-dark-500"></div>
            <span className="text-sm">Вакансия</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
