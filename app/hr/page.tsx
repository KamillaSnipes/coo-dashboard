'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import { Users, Target, AlertTriangle, CheckCircle, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { hrGoals, keyProblems, strategicInitiatives, departments } from '@/lib/data'

export default function HRPage() {
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null)
  
  const hrDept = departments.find(d => d.id === 'hr')
  const hrProblems = keyProblems.filter(p => p.category === 'hr')
  const hrInitiatives = strategicInitiatives.filter(i => i.id === 'hr-system' || i.id === 'hrbp')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">👥 HR Department</h1>
          <p className="text-dark-400 mt-2">Создание HR-системы с нуля</p>
        </div>
        <StatusBadge status="red" />
      </div>

      {/* Main Goal */}
      <Card>
        <div className="p-2 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/30 rounded-xl">
              <Target className="text-rose-400" size={32} />
            </div>
            <div>
              <div className="text-sm text-rose-300 font-medium mb-1">🎯 КЛЮЧЕВАЯ ЦЕЛЬ</div>
              <div className="text-xl font-bold">{hrGoals.mainGoal}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Team & Vacancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="👤 Текущая команда">
          <div className="space-y-3">
            {hrDept?.employees?.map((emp, i) => (
              <div 
                key={i}
                className={`p-4 rounded-xl ${
                  emp.type === 'vacant' 
                    ? 'bg-red-500/10 border border-dashed border-red-500/30' 
                    : 'bg-dark-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${emp.type === 'vacant' ? 'text-red-400' : ''}`}>
                      {emp.name}
                    </div>
                    <div className="text-sm text-dark-400">{emp.role}</div>
                  </div>
                  {emp.type === 'vacant' && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      Вакансия
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="📢 Открытые вакансии">
          {hrGoals.vacancies.map((vacancy, i) => (
            <div key={i} className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-primary-300">{vacancy.title}</div>
                  <div className="text-sm text-dark-400 mt-1">
                    Опубликовано: {vacancy.publishedDate}
                  </div>
                </div>
                <a
                  href={vacancy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm"
                >
                  <ExternalLink size={14} />
                  hh.ru
                </a>
              </div>
              <div className="mt-3 p-3 bg-dark-700/50 rounded-lg text-sm text-dark-300">
                <strong>Требования:</strong> опыт HRBP/HR от 3 лет, Performance Review, развитие руководителей, 
                создание культуры с нуля. Опыт в B2B/продажах/логистике — плюс.
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Year 1 Goals */}
      <Card title="📋 Цели на 1-й год">
        <div className="space-y-3">
          {hrGoals.year1Goals.map((goal, i) => (
            <div 
              key={i}
              className="p-4 bg-dark-700/50 rounded-xl hover:bg-dark-700 transition-colors cursor-pointer"
              onClick={() => setExpandedGoal(expandedGoal === i ? null : i)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 font-bold">
                    {i + 1}
                  </div>
                  <span>{goal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={i === 4 ? 'yellow' : 'red'} size="sm" />
                  {expandedGoal === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
              {expandedGoal === i && (
                <div className="mt-4 pt-4 border-t border-dark-600 text-sm text-dark-400">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-dark-500">Статус:</span>
                      <span className="ml-2">{i === 4 ? 'В работе (ОК)' : 'Не начато'}</span>
                    </div>
                    <div>
                      <span className="text-dark-500">Ответственный:</span>
                      <span className="ml-2">HR + COO</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Problems & Initiatives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problems */}
        <Card title="🚨 Проблемы HR" action={<span className="text-sm text-dark-400">{hrProblems.length}</span>}>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {hrProblems.map(problem => (
              <div 
                key={problem.id}
                className="p-3 bg-dark-700/50 rounded-lg flex items-start gap-3"
              >
                <AlertTriangle 
                  size={16} 
                  className={problem.impact === 'high' ? 'text-red-400 mt-0.5' : 'text-yellow-400 mt-0.5'} 
                />
                <div className="flex-1">
                  <div className="text-sm">{problem.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge 
                      status={problem.status === 'in_progress' ? 'yellow' : 'red'} 
                      size="sm" 
                    />
                    <span className="text-xs text-dark-500">{problem.owner}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Initiatives */}
        <Card title="🚀 Инициативы">
          <div className="space-y-4">
            {hrInitiatives.map(initiative => (
              <div key={initiative.id} className="p-4 bg-dark-700/50 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold">{initiative.name}</div>
                    <div className="text-sm text-dark-400">{initiative.goal}</div>
                  </div>
                  <StatusBadge status={initiative.status} size="sm" />
                </div>
                {initiative.stages && (
                  <div className="space-y-2">
                    {initiative.stages.map((stage, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {stage.status === 'done' ? (
                          <CheckCircle size={14} className="text-green-400" />
                        ) : stage.status === 'in_progress' ? (
                          <Clock size={14} className="text-yellow-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 border border-dark-500 rounded-full" />
                        )}
                        <span className={stage.status === 'done' ? 'text-dark-400 line-through' : ''}>
                          {stage.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="flex gap-4">
        <Link 
          href="/org-structure" 
          className="flex-1 p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center"
        >
          <div className="text-2xl mb-2">🏢</div>
          <div className="font-medium">Оргструктура</div>
        </Link>
        <Link 
          href="/one-on-one" 
          className="flex-1 p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center"
        >
          <div className="text-2xl mb-2">👤</div>
          <div className="font-medium">1:1 с HR</div>
        </Link>
        <Link 
          href="/problems" 
          className="flex-1 p-4 bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors text-center"
        >
          <div className="text-2xl mb-2">🚨</div>
          <div className="font-medium">Все проблемы</div>
        </Link>
      </div>
    </div>
  )
}

