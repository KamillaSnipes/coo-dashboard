'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Building2, Users, Edit2 } from 'lucide-react'
import Card from '@/components/Card'
import { departments, leadership, companyStats, getDepartmentEmployeeCount, Department } from '@/lib/data'

// Цвета для отделов
const deptColors: Record<string, string> = {
  china: 'bg-yellow-500/30 border-yellow-500',
  'dev-projects': 'bg-orange-500/30 border-orange-500',
  sales: 'bg-green-500/30 border-green-500',
  logistics: 'bg-blue-500/30 border-blue-500',
  ved: 'bg-purple-500/30 border-purple-500',
  marketing: 'bg-pink-500/30 border-pink-500',
  uae: 'bg-cyan-500/30 border-cyan-500',
  backoffice: 'bg-gray-500/30 border-gray-500',
  it: 'bg-indigo-500/30 border-indigo-500',
}

export default function OrgStructurePage() {
  const [expandedDept, setExpandedDept] = useState<string | null>('china')
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree')

  const chinaDept = departments.find(d => d.id === 'china')
  const otherDepts = departments.filter(d => d.id !== 'china')

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
            onClick={() => setViewMode('tree')}
            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'tree' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300'}`}
          >
            🌳 Дерево
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300'}`}
          >
            📋 Список
          </button>
          <Link
            href="/org-structure/edit"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
          >
            <Edit2 size={16} />
            Редактировать
          </Link>
        </div>
      </div>

      {viewMode === 'tree' ? (
        /* TREE VIEW */
        <div className="org-tree overflow-x-auto pb-8">
          <div className="min-w-[1200px]">
            
            {/* Level 1: CEO */}
            <div className="flex justify-center mb-4">
              <div className="flex gap-8">
                {leadership.ceo.map((person, i) => (
                  <div key={i} className="relative">
                    <div className="bg-gradient-to-br from-primary-500/30 to-primary-600/30 border-2 border-primary-500 rounded-xl p-4 text-center min-w-[180px] shadow-lg shadow-primary-500/20">
                      <div className="font-bold text-lg">{person.name}</div>
                      <div className="text-primary-300 text-sm">{person.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connector line */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-dark-500"></div>
            </div>

            {/* Level 2: COO */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-green-500/30 to-green-600/30 border-2 border-green-500 rounded-xl p-4 text-center min-w-[220px] shadow-lg shadow-green-500/20">
                <div className="font-bold text-lg">{leadership.coo.name}</div>
                <div className="text-green-300 text-sm">{leadership.coo.role}</div>
              </div>
            </div>

            {/* Connector line */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-dark-500"></div>
            </div>

            {/* Horizontal line across all departments */}
            <div className="flex justify-center mb-4">
              <div className="w-[90%] h-px bg-dark-500"></div>
            </div>

            {/* Level 3: Departments */}
            <div className="flex justify-center gap-3 mb-4">
              {departments.map((dept) => {
                const count = getDepartmentEmployeeCount(dept)
                const colors = deptColors[dept.id] || 'bg-dark-700 border-dark-500'
                
                return (
                  <div key={dept.id} className="flex flex-col items-center">
                    {/* Vertical connector */}
                    <div className="w-px h-4 bg-dark-500 -mt-4"></div>
                    
                    <button
                      onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                      className={`${colors} border-2 rounded-xl p-3 text-center min-w-[110px] transition-all hover:scale-105 ${expandedDept === dept.id ? 'ring-2 ring-white/30' : ''}`}
                    >
                      <div className="font-semibold text-sm">{dept.shortName}</div>
                      <div className="text-xs text-dark-300 mt-1">{count} чел.</div>
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Level 4: Expanded department details */}
            {expandedDept && (
              <div className="mt-8">
                {expandedDept === 'china' && chinaDept?.teams && (
                  <div className="flex flex-col items-center">
                    {/* Connector */}
                    <div className="w-px h-8 bg-yellow-500/50"></div>
                    
                    {/* Horizontal line for teams */}
                    <div className="w-[80%] h-px bg-yellow-500/50 mb-4"></div>
                    
                    {/* Teams */}
                    <div className="flex justify-center gap-4 flex-wrap">
                      {chinaDept.teams.map((team) => (
                        <div key={team.id} className="flex flex-col items-center">
                          {/* Vertical connector */}
                          <div className="w-px h-4 bg-yellow-500/50 -mt-4"></div>
                          
                          {/* Team Lead */}
                          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-3 text-center min-w-[140px] mb-2">
                            <div className="font-semibold text-sm text-yellow-300">{team.name}</div>
                            <div className="text-xs text-white mt-1">{team.lead.name.split(' ')[0]}</div>
                            <div className="text-xs text-dark-400">РГ</div>
                          </div>
                          
                          {/* Connector to members */}
                          <div className="w-px h-4 bg-yellow-500/30"></div>
                          
                          {/* Team Members */}
                          <div className="space-y-1">
                            {team.members.map((member, i) => (
                              <div 
                                key={i}
                                className={`text-xs px-3 py-1.5 rounded-lg text-center ${
                                  member.type === 'vacant' 
                                    ? 'bg-dark-700 border border-dashed border-dark-500 text-dark-400' 
                                    : 'bg-dark-700/50 text-dark-200'
                                }`}
                              >
                                {member.name.split(' ')[0]}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {expandedDept !== 'china' && (
                  <div className="flex flex-col items-center">
                    {/* Find the department */}
                    {(() => {
                      const dept = departments.find(d => d.id === expandedDept)
                      if (!dept?.employees) return null
                      const colors = deptColors[dept.id] || 'bg-dark-700/50'
                      
                      return (
                        <>
                          <div className="w-px h-8 bg-dark-500"></div>
                          <div className={`${colors.split(' ')[0]} border border-dark-500 rounded-xl p-4`}>
                            <div className="font-semibold mb-3 text-center">{dept.name}</div>
                            <div className="flex flex-wrap gap-2 justify-center max-w-md">
                              {dept.employees.map((emp, i) => (
                                <div 
                                  key={i}
                                  className={`text-xs px-3 py-1.5 rounded-lg ${
                                    emp.type === 'vacant'
                                      ? 'bg-dark-700 border border-dashed border-dark-500 text-dark-400'
                                      : i === 0 
                                        ? 'bg-dark-600 text-white font-medium' 
                                        : 'bg-dark-700/50 text-dark-200'
                                  }`}
                                >
                                  {emp.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-6">
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

          {/* Departments list */}
          {departments.map((dept) => {
            const count = getDepartmentEmployeeCount(dept)
            const isExpanded = expandedDept === dept.id
            
            return (
              <div key={dept.id} className={`rounded-xl border ${dept.color} ${dept.borderColor} overflow-hidden`}>
                <button
                  onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-dark-700/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 size={20} />
                    <div className="text-left">
                      <div className="font-semibold">{dept.name}</div>
                      <div className="text-sm text-dark-400">{count} чел.</div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0">
                    {dept.teams ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dept.teams.map((team) => (
                          <div key={team.id} className="bg-dark-700/30 rounded-lg p-4">
                            <div className="font-medium text-primary-400 mb-2">{team.name}</div>
                            <div className="p-2 bg-dark-700/50 rounded mb-2">
                              <div className="font-medium text-sm">{team.lead.name}</div>
                              <div className="text-xs text-dark-400">{team.lead.role}</div>
                            </div>
                            <div className="space-y-1">
                              {team.members.map((member, i) => (
                                <div key={i} className={`text-sm p-2 rounded ${member.type === 'vacant' ? 'text-dark-500' : 'text-dark-300'}`}>
                                  {member.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {dept.employees?.map((emp, i) => (
                          <div key={i} className={`p-2 rounded-lg text-sm ${emp.type === 'vacant' ? 'text-dark-500 bg-dark-700/30' : 'bg-dark-700/50'}`}>
                            <div className="font-medium">{emp.name}</div>
                            <div className="text-xs text-dark-400">{emp.role}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-dark-500 text-sm">
        {viewMode === 'tree' ? 'Нажмите на отдел, чтобы раскрыть структуру' : 'Нажмите на отдел для просмотра сотрудников'}
      </div>
    </div>
  )
}
