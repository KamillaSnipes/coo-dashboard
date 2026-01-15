'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, TrendingUp, Clock, Target, ChevronRight, Plus, Trash2, RefreshCw, UserCheck, GitBranch, Calendar } from 'lucide-react'
import Card from '@/components/Card'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'

interface GroupMember {
  id: string
  name: string
  grade: string
  role: string
  kpiProgress: number
}

interface Group {
  id: string
  name: string
  lead: string
  membersCount: number
  members: GroupMember[]
  focus: string
  status: 'green' | 'yellow' | 'red'
  avgKpiTime: number
  projects: number
}

const initialGroups: Group[] = [
  {
    id: '1',
    name: 'Группа 1',
    lead: 'РГ 1',
    membersCount: 4,
    members: [],
    focus: '',
    status: 'green',
    avgKpiTime: 4,
    projects: 15
  },
  {
    id: '2',
    name: 'Группа 2',
    lead: 'РГ 2',
    membersCount: 3,
    members: [],
    focus: '',
    status: 'green',
    avgKpiTime: 5,
    projects: 12
  },
  {
    id: '3',
    name: 'Группа 3',
    lead: 'РГ 3',
    membersCount: 4,
    members: [],
    focus: '',
    status: 'yellow',
    avgKpiTime: 6,
    projects: 10
  },
  {
    id: '4',
    name: 'Группа 4',
    lead: 'РГ 4',
    membersCount: 5,
    members: [],
    focus: '',
    status: 'green',
    avgKpiTime: 4,
    projects: 18
  },
  {
    id: '5',
    name: 'Группа 5',
    lead: 'РГ 5',
    membersCount: 3,
    members: [],
    focus: '',
    status: 'green',
    avgKpiTime: 5,
    projects: 11
  },
]

export default function ChinaDepartment() {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'changes'>('overview')

  // Load settings
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.chinaGroups) {
            setGroups(data.chinaGroups)
          }
          setSettings(data)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Save settings
  const saveSettings = useCallback(async (newSettings: any) => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }, [])

  const updateGroup = (index: number, field: keyof Group, value: any) => {
    const newGroups = [...groups]
    newGroups[index] = { ...newGroups[index], [field]: value }
    setGroups(newGroups)
    saveSettings({ ...settings, chinaGroups: newGroups })
  }

  const totalEmployees = groups.reduce((sum, g) => sum + g.membersCount, 0) + groups.length
  const avgKpiTime = Math.round(groups.reduce((sum, g) => sum + g.avgKpiTime, 0) / groups.length)
  const totalProjects = groups.reduce((sum, g) => sum + g.projects, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🇨🇳 Отдел Китая</h1>
          <p className="text-dark-400 mt-2">Управление закупками и производством</p>
        </div>
        <div className="flex items-center gap-4">
          {saving && (
            <div className="flex items-center gap-2 text-primary-400">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">Сохранение...</span>
            </div>
          )}
          <StatusBadge status="green" size="md" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-700 pb-1">
        {[
          { id: 'overview', label: 'Обзор' },
          { id: 'structure', label: 'Структура' },
          { id: 'changes', label: 'Трансформация' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-dark-700 text-white'
                : 'text-dark-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Всего сотрудников"
              value={`${totalEmployees}`}
              subtitle={`${groups.length} РГ + ${totalEmployees - groups.length} менеджеров`}
              icon={<Users size={24} />}
            />
            <MetricCard
              title="Среднее время КП"
              value={`${avgKpiTime} дн`}
              subtitle="цель: 3 дня"
              icon={<Clock size={24} />}
              trend={avgKpiTime > 3 ? 'down' : 'up'}
              trendValue={avgKpiTime > 3 ? 'нужно ускорить' : 'в норме'}
            />
            <MetricCard
              title="Проектов в работе"
              value={`${totalProjects}`}
              subtitle="по всем группам"
              icon={<Target size={24} />}
            />
            <MetricCard
              title="Групп"
              value={`${groups.length}`}
              subtitle="скоро +1 (конец января)"
              icon={<GitBranch size={24} />}
              trend="up"
              trendValue="+1 в январе"
            />
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="⚡ Ключевые особенности">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Работают <strong>только с продажниками</strong>, не напрямую с клиентами</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Рабочие часы: <strong>9:00 — 16:00 МСК</strong> (синхрон с Китаем)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>E2E менеджеры: ведут проект <strong>от просчёта до доставки</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Решения принимаются <strong>коллегиально</strong> (все РГ + COO)</span>
                </li>
              </ul>
            </Card>

            <Card title="🎯 Текущий фокус">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Clock size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Сократить время просчёта с <strong>5 до 3 дней</strong></span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
                  <TrendingUp size={20} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>Внедрить <strong>новую систему грейдов</strong> и KPI</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <UserCheck size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Интегрировать <strong>+1 РГ</strong> в конце января</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Groups Table */}
          <Card title="👥 Группы">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw size={24} className="animate-spin text-primary-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-dark-400 text-sm border-b border-dark-700">
                      <th className="pb-4 font-medium">Группа</th>
                      <th className="pb-4 font-medium">РГ</th>
                      <th className="pb-4 font-medium">Человек</th>
                      <th className="pb-4 font-medium">Ср. время КП</th>
                      <th className="pb-4 font-medium">Проектов</th>
                      <th className="pb-4 font-medium">Фокус</th>
                      <th className="pb-4 font-medium">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {groups.map((group, i) => (
                      <tr key={group.id} className="hover:bg-dark-700/50 transition-colors">
                        <td className="py-4 font-medium">{group.name}</td>
                        <td className="py-4">
                          <EditableText
                            value={group.lead}
                            onSave={(value) => updateGroup(i, 'lead', value)}
                            placeholder="Имя РГ..."
                            className="text-sm"
                          />
                        </td>
                        <td className="py-4 text-dark-300">{group.membersCount}</td>
                        <td className="py-4">
                          <span className={group.avgKpiTime > 4 ? 'text-yellow-400' : 'text-green-400'}>
                            {group.avgKpiTime} дн
                          </span>
                        </td>
                        <td className="py-4 text-dark-300">{group.projects}</td>
                        <td className="py-4">
                          <EditableText
                            value={group.focus}
                            onSave={(value) => updateGroup(i, 'focus', value)}
                            placeholder="Добавить фокус..."
                            className="text-sm"
                          />
                        </td>
                        <td className="py-4">
                          <StatusBadge status={group.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {activeTab === 'structure' && (
        <>
          {/* Organization Chart */}
          <Card title="📊 Текущая структура">
            <div className="flex flex-col items-center py-8">
              {/* COO */}
              <div className="bg-primary-500/20 border border-primary-500/50 rounded-xl p-4 text-center mb-4">
                <div className="text-sm text-primary-400">Руководитель</div>
                <div className="font-bold text-lg">COO (Камилла)</div>
              </div>
              
              <div className="w-px h-8 bg-dark-600"></div>
              
              {/* Group Leads */}
              <div className="text-sm text-dark-400 mb-4">Коллегиальные решения</div>
              
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                {groups.map((group, i) => (
                  <div key={group.id} className="bg-dark-700 rounded-xl p-4 text-center min-w-[140px]">
                    <div className="text-xs text-dark-400 mb-1">{group.name}</div>
                    <div className="font-medium">{group.lead || `РГ ${i + 1}`}</div>
                    <div className="text-sm text-dark-400 mt-2">{group.membersCount} чел.</div>
                  </div>
                ))}
                <div className="bg-dark-800 border-2 border-dashed border-dark-600 rounded-xl p-4 text-center min-w-[140px]">
                  <div className="text-xs text-dark-500 mb-1">Группа 6</div>
                  <div className="font-medium text-dark-500">Новый РГ</div>
                  <div className="text-sm text-dark-500 mt-2">конец января</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Roles */}
          <Card title="👤 Роли в отделе">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-primary-400">Руководитель группы (РГ)</h3>
                <ul className="space-y-2 text-dark-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                    <span>Управление группой 3-5 человек</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                    <span>Распределение задач внутри группы</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                    <span>Контроль качества и сроков</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                    <span>Участие в коллегиальных решениях</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-primary-400 mt-1 flex-shrink-0" />
                    <span>Развитие и наставничество команды</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4 text-green-400">E2E Менеджер (с грейдами)</h3>
                <ul className="space-y-2 text-dark-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span>Полный цикл: от просчёта до доставки</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span>Работа с китайскими фабриками</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span>Коммуникация с продажниками</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span>Грейды определяют сложность проектов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span>Функция наставника (опционально)</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'changes' && (
        <>
          {/* Before/After */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="❌ Было (до трансформации)">
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h4 className="font-semibold mb-2">2 отдела с разной структурой</h4>
                  <ul className="text-sm text-dark-300 space-y-1">
                    <li>• Отдел 1 — только с продажами</li>
                    <li>• Отдел 2 — с продажами + напрямую с РА</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-700 rounded-lg">
                  <h4 className="font-semibold mb-2">20 человек, сложная иерархия:</h4>
                  <ul className="text-sm text-dark-300 space-y-1">
                    <li>• 2 руководителя отдела</li>
                    <li>• Менеджеры закупок (только просчёты)</li>
                    <li>• Менеджеры по проектам (весь цикл)</li>
                    <li>• 1 тимлид с 5 сотрудниками (не считал, не вёл проекты)</li>
                    <li>• Наставники (только онбординг)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-700 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-400">Проблемы:</h4>
                  <ul className="text-sm text-dark-300 space-y-1">
                    <li>• Размытые зоны ответственности</li>
                    <li>• Работа напрямую с клиентами (дублирование)</li>
                    <li>• Неэффективная роль тимлида</li>
                    <li>• Наставники без чёткого функционала</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card title="✅ Стало (новая структура)">
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold mb-2">Единый отдел с группами</h4>
                  <ul className="text-sm text-dark-300 space-y-1">
                    <li>• 5 групп (скоро 6)</li>
                    <li>• Работают ТОЛЬКО с продажниками</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-700 rounded-lg">
                  <h4 className="font-semibold mb-2">~25 человек, простая структура:</h4>
                  <ul className="text-sm text-dark-300 space-y-1">
                    <li>• COO — общее руководство</li>
                    <li>• 5-6 РГ (руководители групп)</li>
                    <li>• E2E менеджеры с грейдами</li>
                    <li>• Функция наставника внутри групп</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-700 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-400">Преимущества:</h4>
                  <ul className="text-sm text-dark-300 space-y-1">
                    <li>• Чёткие зоны ответственности</li>
                    <li>• Единый канал (через продажников)</li>
                    <li>• Грейды = путь развития</li>
                    <li>• Коллегиальные решения РГ + COO</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Changes in Progress */}
          <Card title="🔄 Трансформация в процессе">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                <div>
                  <h4 className="font-semibold">Новая система грейдов</h4>
                  <p className="text-sm text-dark-400">Разработка и внедрение грейдов для E2E менеджеров</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                <div>
                  <h4 className="font-semibold">Новая система KPI</h4>
                  <p className="text-sm text-dark-400">Изменение KPI для РГ и менеджеров</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                <div>
                  <h4 className="font-semibold">Матрица компетенций</h4>
                  <p className="text-sm text-dark-400">Разработка матрицы для оценки и развития</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <Calendar size={20} className="text-primary-400" />
                <div>
                  <h4 className="font-semibold">Интеграция нового РГ</h4>
                  <p className="text-sm text-dark-400">Конец января 2026 — добавление 6-й группы</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Decision Making */}
          <Card title="🤝 Принятие решений">
            <div className="p-6 bg-dark-700 rounded-xl text-center">
              <h4 className="font-semibold text-lg mb-4">Коллегиальная модель</h4>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="bg-primary-500/20 px-4 py-2 rounded-lg">COO</div>
                <span className="text-dark-500">+</span>
                <div className="bg-dark-600 px-4 py-2 rounded-lg">РГ 1</div>
                <span className="text-dark-500">+</span>
                <div className="bg-dark-600 px-4 py-2 rounded-lg">РГ 2</div>
                <span className="text-dark-500">+</span>
                <div className="bg-dark-600 px-4 py-2 rounded-lg">РГ 3</div>
                <span className="text-dark-500">+</span>
                <div className="bg-dark-600 px-4 py-2 rounded-lg">РГ 4</div>
                <span className="text-dark-500">+</span>
                <div className="bg-dark-600 px-4 py-2 rounded-lg">РГ 5</div>
              </div>
              <p className="text-dark-400 text-sm mt-4">
                Все стратегические решения по отделу принимаются совместно всеми руководителями групп и COO
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

