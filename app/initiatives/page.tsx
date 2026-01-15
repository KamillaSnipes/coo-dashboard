'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'
import { ChevronDown, ChevronUp, Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { strategicInitiatives, quarterFocus } from '@/lib/data'

export default function InitiativesPage() {
  const [expandedInit, setExpandedInit] = useState<string | null>('operations')
  const [notes, setNotes] = useState<Record<string, string>>({})

  const toggleInit = (id: string) => {
    setExpandedInit(expandedInit === id ? null : id)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle size={16} className="text-green-400" />
      case 'in_progress': return <Clock size={16} className="text-yellow-400" />
      default: return <div className="w-4 h-4 rounded-full border-2 border-dark-500" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Стратегические инициативы</h1>
        <p className="text-dark-400 mt-2">Ключевые проекты и их прогресс</p>
      </div>

      {/* Quarter Focus */}
      <Card title={`🎯 Фокус ${quarterFocus.quarter}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quarterFocus.priorities.map((priority, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-primary-500/10 rounded-lg">
              <Target size={20} className="text-primary-400 flex-shrink-0" />
              <span>{priority}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Initiatives */}
      <div className="space-y-4">
        {strategicInitiatives.map((init) => (
          <Card key={init.id} className="overflow-hidden">
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-dark-700/50 transition-colors -m-6 mb-0"
              onClick={() => toggleInit(init.id)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{init.name}</h3>
                  <p className="text-dark-400 text-sm mt-1">{init.goal}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={init.status} />
                {expandedInit === init.id ? (
                  <ChevronUp size={20} className="text-dark-400" />
                ) : (
                  <ChevronDown size={20} className="text-dark-400" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedInit === init.id && (
              <div className="mt-6 pt-6 border-t border-dark-700 space-y-6">
                {/* Owner */}
                <div>
                  <h4 className="font-medium text-dark-300 mb-2">👤 Ответственный</h4>
                  <p className="text-dark-200">{init.owner}</p>
                </div>

                {/* Stages */}
                {init.stages && init.stages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-dark-300 mb-3">📋 Этапы</h4>
                    <div className="space-y-2">
                      {init.stages.map((stage, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
                          {getStatusIcon(stage.status)}
                          <span className={stage.status === 'done' ? 'line-through text-dark-500' : ''}>
                            {stage.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blockers */}
                {init.blockers && init.blockers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-dark-300 mb-3">🚫 Блокеры</h4>
                    <div className="space-y-2">
                      {init.blockers.map((blocker, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300">
                          <AlertTriangle size={16} className="flex-shrink-0" />
                          <span>{blocker}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h4 className="font-medium text-dark-300 mb-3">📝 Заметки</h4>
                  <EditableText
                    value={notes[init.id] || ''}
                    onSave={(value) => setNotes({ ...notes, [init.id]: value })}
                    placeholder="Добавить заметки..."
                    multiline
                    className="bg-dark-700/50 rounded-lg"
                  />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-dark-700 rounded-xl text-center">
          <div className="text-2xl font-bold">{strategicInitiatives.length}</div>
          <div className="text-sm text-dark-400">Всего</div>
        </div>
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {strategicInitiatives.filter(i => i.status === 'yellow').length}
          </div>
          <div className="text-sm text-dark-400">Требуют внимания</div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-red-400">
            {strategicInitiatives.filter(i => i.status === 'red').length}
          </div>
          <div className="text-sm text-dark-400">Критично</div>
        </div>
      </div>
    </div>
  )
}
