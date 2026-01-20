'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Users, TrendingUp, Clock, Target, ChevronRight, Plus, Trash2, RefreshCw, UserCheck, GitBranch, Calendar, GraduationCap, ArrowRight, AlertTriangle, CheckCircle, FileText } from 'lucide-react'
import Card from '@/components/Card'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import EditableText from '@/components/EditableText'

interface GroupMember {
  id: string
  name: string
  role: string
}

interface Group {
  id: string
  name: string
  lead: string
  leadFullName: string
  membersCount: number
  members: GroupMember[]
  focus: string
  status: 'green' | 'yellow' | 'red'
  avgKpiTime: number
  projects: number
  weeklyPlan: string[]
  weeklyFact: string[]
  problems: string[]
}

// Real data synced with leadership reports
const initialGroups: Group[] = [
  {
    id: 'artem',
    name: 'Группа Артёма',
    lead: 'Артём Василевский',
    leadFullName: 'Артём',
    membersCount: 3,
    members: [
      { id: '1', name: 'Арина', role: 'E2E менеджер' },
      { id: '2', name: 'Света Л', role: 'E2E менеджер' },
      { id: '3', name: 'Юля', role: 'E2E менеджер (новая)' },
    ],
    focus: 'Адаптация нового сотрудника, мерч проработка',
    status: 'green',
    avgKpiTime: 4,
    projects: 15,
    weeklyPlan: [
      'Встреча с ОК',
      'Сбор статистики, подготовка к концу сезона',
      'Мерч проработка',
      '1-1: Юля, Настя',
      'Провести по калькулятору встречу по обновлениям',
      'Проработать правила интересных товаров'
    ],
    weeklyFact: [
      'Адаптация нового сотрудника',
      'Встреча с ОК и ОК+Камилла',
      'Встречи с ОМ (Костей) по мерчу',
      'Подключение к решению горячих вопросов',
      'Проверка гипотезы по интересным товарам',
      'Проработка товаров с нуля как пилоты',
      '1-1 с Ариной и Светой Л'
    ],
    problems: []
  },
  {
    id: 'evgeny',
    name: 'Группа Евгения',
    lead: 'Евгений Косицын',
    leadFullName: 'Женя',
    membersCount: 4,
    members: [
      { id: '1', name: 'Саша', role: 'E2E менеджер' },
      { id: '2', name: 'Настя', role: 'E2E менеджер' },
      { id: '3', name: 'Марина', role: 'E2E менеджер' },
      { id: '4', name: 'Анастасия', role: 'E2E менеджер' },
    ],
    focus: 'Контроль статусов, распределение отпусков',
    status: 'green',
    avgKpiTime: 5,
    projects: 12,
    weeklyPlan: [
      'Контроль обновления статусов по производствам/доставкам/образцам',
      'Встреча с ОК по компетенциям',
      'Встреча с Камиллой по компетенциям',
      'Распределение отпусков',
      'Встреча с командой',
      'Посчитать КПИ за прошлый квартал',
      'Закрыть проекты',
      'Провести 1-1: Саша, Настя, Марина',
      'Анализ планируемых близких к запуску задач'
    ],
    weeklyFact: [],
    problems: []
  },
  {
    id: 'alexandra',
    name: 'Группа Александры',
    lead: 'Александра Комардина',
    leadFullName: 'Саша',
    membersCount: 2,
    members: [
      { id: '1', name: 'Сотрудник 1', role: 'E2E менеджер' },
      { id: '2', name: 'Сотрудник 2', role: 'E2E менеджер' },
    ],
    focus: '',
    status: 'green',
    avgKpiTime: 4,
    projects: 10,
    weeklyPlan: [],
    weeklyFact: [],
    problems: []
  },
  {
    id: 'nastya',
    name: 'Группа Насти А.',
    lead: 'Анастасия Андрианова',
    leadFullName: 'Настя А',
    membersCount: 4,
    members: [
      { id: '1', name: 'Сотрудник 1', role: 'E2E менеджер' },
      { id: '2', name: 'Сотрудник 2', role: 'E2E менеджер' },
      { id: '3', name: 'Сотрудник 3', role: 'E2E менеджер' },
      { id: '4', name: 'Арина (выход)', role: 'E2E менеджер' },
    ],
    focus: 'Ревизия задач, работа с браком, выходная встреча',
    status: 'yellow',
    avgKpiTime: 5,
    projects: 18,
    weeklyPlan: [
      'Ревизия задач в статусах «КП согласование» и «КП согласовано»',
      'Работа с браком по проектам (бадминтон)',
      'Контроль новых запросов',
      'Фиксация отпуска',
      'Выходная встреча с Ариной',
      'Встречи с руками МОК, Камиллой, Рэшадом (таблица компетенций)',
      'Сбор данных по реализованным проектам',
      'Запрос ОС'
    ],
    weeklyFact: [
      'Собрали ОС по декабрьским просчетам - 2 получили проработку',
      'Нашли решение по заказам с браком, перешли в этап переделки',
      'Закрыли заказы за декабрь',
      'Встреча с МОК и Камиллой по компетенциям',
      'Протестировала новинки в инструменте'
    ],
    problems: [
      'Проекты по Альфе кэмп и 8 марта отвалились',
      '8 марта ОДК тоже в пролете',
      'Работа с браком (бадминтон, очки)'
    ]
  },
  {
    id: 'yulia',
    name: 'Группа Юлии',
    lead: 'Юлия Лелик',
    leadFullName: 'Юля',
    membersCount: 2,
    members: [],
    focus: '',
    status: 'green',
    avgKpiTime: 4,
    projects: 11,
    weeklyPlan: [],
    weeklyFact: [],
    problems: []
  },
  {
    id: 'sergey',
    name: 'Группа Сергея',
    lead: 'Сергей Кумашев',
    leadFullName: 'Сергей',
    membersCount: 1,
    members: [],
    focus: 'Новая группа — интеграция',
    status: 'yellow',
    avgKpiTime: 5,
    projects: 5,
    weeklyPlan: [],
    weeklyFact: [],
    problems: []
  },
]

export default function ChinaDepartment() {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'changes'>('overview')
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [leadershipReports, setLeadershipReports] = useState<any[]>([])

  // Load settings and leadership reports
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load settings
        const settingsResponse = await fetch('/api/settings')
        if (settingsResponse.ok) {
          const data = await settingsResponse.json()
          if (data.chinaGroups) {
            setGroups(data.chinaGroups)
          }
          setSettings(data)
        }
        
        // Load leadership reports to sync data
        const reportsResponse = await fetch('/api/leadership-reports')
        if (reportsResponse.ok) {
          const data = await reportsResponse.json()
          if (data.reports) {
            setLeadershipReports(data.reports)
            // Sync with groups
            syncWithLeadershipReports(data.reports)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Sync leadership reports with groups
  const syncWithLeadershipReports = (reports: any[]) => {
    const currentWeek = getMonday(new Date())
    const thisWeekReports = reports.filter(r => r.weekStart === currentWeek)
    
    setGroups(prevGroups => {
      return prevGroups.map(group => {
        const report = thisWeekReports.find(r => 
          r.salesPerson?.toLowerCase().includes(group.leadFullName.toLowerCase()) ||
          group.leadFullName.toLowerCase().includes(r.salesPerson?.toLowerCase() || '')
        )
        if (report) {
          return {
            ...group,
            weeklyPlan: report.plan || group.weeklyPlan,
            weeklyFact: report.fact || group.weeklyFact,
            problems: report.problems || group.problems,
          }
        }
        return group
      })
    })
  }

  // Save settings
  const saveSettings = useCallback(async (newGroups: Group[]) => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, chinaGroups: newGroups })
      })
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }, [settings])

  const updateGroup = (index: number, field: keyof Group, value: any) => {
    const newGroups = [...groups]
    newGroups[index] = { ...newGroups[index], [field]: value }
    setGroups(newGroups)
    saveSettings(newGroups)
  }

  const totalEmployees = groups.reduce((sum, g) => sum + g.membersCount, 0) + groups.length
  const avgKpiTime = Math.round(groups.reduce((sum, g) => sum + g.avgKpiTime, 0) / groups.length)
  const totalProjects = groups.reduce((sum, g) => sum + g.projects, 0)
  const totalProblems = groups.reduce((sum, g) => sum + (g.problems?.length || 0), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/departments" className="text-dark-400 hover:text-white">
              ← Отделы
            </Link>
          </div>
          <h1 className="text-3xl font-bold mt-2">🇨🇳 Департамент по работе с Китаем</h1>
          <p className="text-dark-400 mt-1">
            {groups.map(g => g.lead).join(', ')} • {totalEmployees} чел.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {saving && (
            <div className="flex items-center gap-2 text-primary-400">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">Сохранение...</span>
            </div>
          )}
          <StatusBadge status={totalProblems > 0 ? 'yellow' : 'green'} size="md" />
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
        
        <Link
          href="/departments/china/competencies"
          className="flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 ml-auto"
        >
          <GraduationCap size={18} />
          <span>Матрица компетенций</span>
        </Link>
        
        <Link
          href="/leadership-reports"
          className="flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors text-green-400 hover:text-green-300 hover:bg-green-500/10"
        >
          <FileText size={18} />
          <span>План/Факт рук-лей</span>
        </Link>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Current Focus */}
          <Card title="🎯 Текущий фокус">
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <EditableText
                value={settings.chinaFocus || 'Сократить время просчёта с 5 до 3 дней'}
                onSave={(value) => {
                  const newSettings = { ...settings, chinaFocus: value }
                  setSettings(newSettings)
                  saveSettings(groups)
                }}
                className="font-medium"
              />
            </div>
          </Card>

          {/* Teams Grid - Clickable */}
          <Card title={`👥 Команды (${groups.length} групп)`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group, i) => (
                <div 
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className="p-4 bg-dark-700/50 hover:bg-dark-700 rounded-xl cursor-pointer transition-all border border-transparent hover:border-primary-500/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-primary-400">{group.name}</h3>
                    <StatusBadge status={group.status} size="sm" />
                  </div>
                  <p className="text-dark-300">{group.lead}</p>
                  <p className="text-sm text-dark-500">{group.membersCount} сотрудников</p>
                  {group.focus && (
                    <p className="text-xs text-dark-400 mt-2 truncate">{group.focus}</p>
                  )}
                  {group.problems && group.problems.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-yellow-400 text-xs">
                      <AlertTriangle size={12} />
                      <span>{group.problems.length} проблем</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Metrics */}
          <Card title="📊 Метрики">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-700/50 rounded-lg">
                <div className="text-sm text-dark-400">Время просчёта</div>
                <div className="text-2xl font-bold">{avgKpiTime} дней</div>
                <div className="text-xs text-dark-500">цель: 3 дня</div>
              </div>
              <div className="p-4 bg-dark-700/50 rounded-lg">
                <div className="text-sm text-dark-400">Брак</div>
                <div className="text-2xl font-bold">—</div>
                <div className="text-xs text-dark-500">цель: &lt;1%</div>
              </div>
            </div>
          </Card>

          {/* Problems */}
          {totalProblems > 0 && (
            <Card title="⚠️ Проблемы/Блокеры">
              <div className="space-y-2">
                {groups.flatMap(g => (g.problems || []).map((p, i) => (
                  <div key={`${g.id}-${i}`} className="flex items-start gap-2 text-yellow-400">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{p}</span>
                  </div>
                )))}
                <div className="flex items-start gap-2 text-yellow-400">
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{avgKpiTime} дней на просчёт (цель: 3 дня)</span>
                </div>
                <div className="flex items-start gap-2 text-yellow-400">
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Разница во времени с Китаем</span>
                </div>
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card title="📝 Заметки">
            <EditableText
              value={settings.chinaNotes || ''}
              onSave={(value) => {
                const newSettings = { ...settings, chinaNotes: value }
                setSettings(newSettings)
                saveSettings(groups)
              }}
              placeholder="Добавить заметки после 1:1 или наблюдений..."
              multiline
              className="min-h-[60px]"
            />
          </Card>

          {/* Link to detailed page */}
          <Link 
            href="/departments/china/competencies"
            className="block w-full p-4 bg-primary-600/20 hover:bg-primary-600/30 border border-primary-600/30 rounded-xl text-center text-primary-300 transition-colors"
          >
            Открыть подробную страницу Отдела Китая →
          </Link>
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
                {groups.map((group) => (
                  <div 
                    key={group.id} 
                    onClick={() => setSelectedGroup(group)}
                    className="bg-dark-700 hover:bg-dark-600 rounded-xl p-4 text-center min-w-[140px] cursor-pointer transition-all"
                  >
                    <div className="text-xs text-dark-400 mb-1">{group.name}</div>
                    <div className="font-medium">{group.lead.split(' ')[0]}</div>
                    <div className="text-sm text-dark-400 mt-2">{group.membersCount} чел.</div>
                  </div>
                ))}
                <div className="bg-dark-800 border-2 border-dashed border-dark-600 rounded-xl p-4 text-center min-w-[140px]">
                  <div className="text-xs text-dark-500 mb-1">Группа 7</div>
                  <div className="font-medium text-dark-500">Новый РГ</div>
                  <div className="text-sm text-dark-500 mt-2">планируется</div>
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
                    <li>• {groups.length} групп (планируется +1)</li>
                    <li>• Работают ТОЛЬКО с продажниками</li>
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
                  <h4 className="font-semibold">Матрица компетенций</h4>
                  <p className="text-sm text-dark-400">Разработка матрицы для оценки и развития</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <Calendar size={20} className="text-primary-400" />
                <div>
                  <h4 className="font-semibold">Переход Тищук к Саше</h4>
                  <p className="text-sm text-dark-400">Начинаем в январе 2026</p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Group Detail Modal */}
      {selectedGroup && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedGroup(null)}
        >
          <div 
            className="bg-dark-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                <p className="text-dark-400">{selectedGroup.lead} • {selectedGroup.membersCount} сотрудников</p>
              </div>
              <StatusBadge status={selectedGroup.status} />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-dark-700 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedGroup.avgKpiTime} дн</div>
                <div className="text-xs text-dark-400">Ср. время КП</div>
              </div>
              <div className="p-3 bg-dark-700 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedGroup.projects}</div>
                <div className="text-xs text-dark-400">Проектов</div>
              </div>
              <div className="p-3 bg-dark-700 rounded-lg text-center">
                <div className="text-lg font-bold">{selectedGroup.members.length}</div>
                <div className="text-xs text-dark-400">В команде</div>
              </div>
            </div>

            {/* Members */}
            {selectedGroup.members.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">👥 Команда</h3>
                <div className="space-y-2">
                  {selectedGroup.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-dark-700/50 rounded-lg">
                      <span>{member.name}</span>
                      <span className="text-sm text-dark-400">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly Plan */}
            {selectedGroup.weeklyPlan && selectedGroup.weeklyPlan.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-blue-400">📋 План на неделю</h3>
                <div className="space-y-1">
                  {selectedGroup.weeklyPlan.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-dark-500">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly Fact */}
            {selectedGroup.weeklyFact && selectedGroup.weeklyFact.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-green-400">✅ Факт за неделю</h3>
                <div className="space-y-1">
                  {selectedGroup.weeklyFact.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Problems */}
            {selectedGroup.problems && selectedGroup.problems.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-yellow-400">⚠️ Проблемы</h3>
                <div className="space-y-1">
                  {selectedGroup.problems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedGroup(null)}
              className="w-full mt-4 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function getMonday(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}
