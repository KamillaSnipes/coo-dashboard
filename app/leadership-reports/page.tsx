'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Target, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Minus, Upload, X, Save, ChevronDown, ChevronUp, RefreshCw, FileText, Users, Clock, BarChart3, Flag } from 'lucide-react'
import Card from '@/components/Card'

interface WeeklyReport {
  id: string
  manager: string
  department: string
  weekStart: string
  plan: string
  fact: string
  completionRate: number // 0-100
  issues: string[]
  highlights: string[]
  createdAt: string
}

interface ManagerProfile {
  name: string
  department: string
  color: string
}

// Managers list
const managers: ManagerProfile[] = [
  { name: 'Виктория Бакирова', department: 'Отдел продаж', color: 'green' },
  { name: 'Константин', department: 'Маркетинг', color: 'purple' },
  { name: 'Артем', department: 'Китай/МОК', color: 'orange' },
  { name: 'Настя А', department: 'Китай/МОК', color: 'pink' },
  { name: 'Женя', department: 'Китай', color: 'cyan' },
  { name: 'Настя Мирскова', department: 'МОК', color: 'yellow' },
  { name: 'Павел', department: 'Логистика', color: 'blue' },
  { name: 'Петр', department: 'HR', color: 'red' },
  { name: 'Никита', department: 'Дубай', color: 'amber' },
]

// Parse raw text to extract plan/fact
function parseManagerReport(rawText: string): { plan: string; fact: string; issues: string[]; highlights: string[] } {
  const text = rawText.trim()
  const lines = text.split('\n')
  
  let plan = ''
  let fact = ''
  let issues: string[] = []
  let highlights: string[] = []
  
  let currentSection = ''
  let sectionContent: string[] = []
  
  const planKeywords = ['план', 'plan', 'планы']
  const factKeywords = ['факт', 'fact', 'выполнено', 'сделано']
  const issueKeywords = ['проблем', 'issue', 'алерт', 'сигнал', 'риск', 'брак', 'сложност']
  const highlightKeywords = ['успех', 'достиж', 'готово', 'закрыли', 'выполнили', 'хорошо']
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    
    // Check for section headers
    if (planKeywords.some(kw => lowerLine.includes(kw) && (lowerLine.includes(':') || lowerLine.includes('19') || lowerLine.includes('12')))) {
      if (currentSection && sectionContent.length) {
        if (currentSection === 'plan') plan = sectionContent.join('\n')
        if (currentSection === 'fact') fact = sectionContent.join('\n')
      }
      currentSection = 'plan'
      sectionContent = []
      continue
    }
    
    if (factKeywords.some(kw => lowerLine.includes(kw) && (lowerLine.includes(':') || lowerLine.includes('12') || lowerLine.includes('16')))) {
      if (currentSection && sectionContent.length) {
        if (currentSection === 'plan') plan = sectionContent.join('\n')
        if (currentSection === 'fact') fact = sectionContent.join('\n')
      }
      currentSection = 'fact'
      sectionContent = []
      continue
    }
    
    // Extract issues
    if (issueKeywords.some(kw => lowerLine.includes(kw))) {
      issues.push(line.trim())
    }
    
    // Extract highlights
    if (highlightKeywords.some(kw => lowerLine.includes(kw))) {
      highlights.push(line.trim())
    }
    
    if (line.trim()) {
      sectionContent.push(line)
    }
  }
  
  // Save last section
  if (currentSection && sectionContent.length) {
    if (currentSection === 'plan') plan = sectionContent.join('\n')
    if (currentSection === 'fact') fact = sectionContent.join('\n')
  }
  
  // If no clear sections, try to split by date patterns
  if (!plan && !fact) {
    const parts = text.split(/(?=план|факт)/i)
    if (parts.length >= 2) {
      for (const part of parts) {
        if (part.toLowerCase().startsWith('план')) plan = part
        if (part.toLowerCase().startsWith('факт')) fact = part
      }
    } else {
      // Put everything in plan
      plan = text
    }
  }
  
  return { plan: plan.trim(), fact: fact.trim(), issues, highlights }
}

// Calculate completion rate based on plan vs fact
function calculateCompletionRate(plan: string, fact: string): number {
  if (!plan || !fact) return 0
  
  const planItems = plan.split('\n').filter(l => l.trim().match(/^[-•\d.]/)).length || 1
  const factItems = fact.split('\n').filter(l => l.trim().match(/^[-•\d.]/)).length || 0
  
  // Also check for completion keywords in fact
  const completedKeywords = ['готово', 'ок', 'выполнено', 'сделано', 'закрыли', '✓', '✅']
  const factLower = fact.toLowerCase()
  const completedMentions = completedKeywords.filter(kw => factLower.includes(kw)).length
  
  const baseRate = Math.min(100, Math.round((factItems / planItems) * 100))
  const bonus = Math.min(20, completedMentions * 5)
  
  return Math.min(100, baseRate + bonus)
}

// Initial reports data
const initialReports: WeeklyReport[] = [
  {
    id: 'vika-0119',
    manager: 'Виктория Бакирова',
    department: 'Отдел продаж',
    weekStart: '2026-01-19',
    plan: `На этой неделе два общих блока:

1. Максимально провести 1:1 с командой и руководителями, чтобы погрузиться в работу и проекты
   - общее собрание отдела продаж
   - собрание по двум нововведениям в воронке ПФ
   - личные встречи с менеджерами и Рук командами по Китаю, Костей, Камиллой

2. Забрать и разгрести дела, которые были распределены на команду во время моего отсутствия
   - Иллан, новые лиды, план-факт, воронка продаж, заполнение сделок, таблички с оплатами проектов`,
    fact: `1. Отбор кандидатов для тендер-менеджера ОП и аккаунт-менеджер для Полины - выбрали кандидатов для первички

2. Работа с отчетами МП по 2025 году - первичные цифры по суммам сделок и проектам собраны

3. Работа со стратегиями МП 2026 года - первая итерация прошла, много комментариев и непонимания как строить стратегию

4. Консолидация отчета 2025 всей команды - собрали вместе с Диером

5. Обновление таблички план-факт и ЗП таблички на январь - готово

6. Работа над новым план-фактом на 2026 год - скелет готов

7. Работа над структурой ОП - есть 3 варианта, но еще сомнения`,
    completionRate: 75,
    issues: [
      'Много комментариев и непонимания как строить стратегию на 2026',
      'Сомнения по структуре ОП - не видит роста сотрудников/компании в вариантах',
      'Концентрация выручки в 1-2 клиентах - риск',
      'Команда вывозит за счёт вовлечённости - ресурс ограничен'
    ],
    highlights: [
      'В пайплайне 40–65 млн ₽',
      'Деньги есть - не проблема найти сделки',
      'Первичные цифры 2025 собраны',
      'План-факт и ЗП таблички обновлены'
    ],
    createdAt: '2026-01-19T09:00:00.000Z'
  },
  {
    id: 'kostya-0119',
    manager: 'Константин',
    department: 'Маркетинг',
    weekStart: '2026-01-19',
    plan: `- подготовка предложения ко встрече с Wildberries (пришли с запросом на 10.000 НГ подарков)
- подготовка отчета план/факт за 2025-2026 год
- подготовка стратегии маркетинга на 2026-2027 год
- работа по подготовке предложения для Отелло / 2Гис
- проработка мерча Headcorn для сотрудников и клиентов`,
    fact: `- закончили с отправкой НГ подарков тем кто не смог принять до НГ (сотрудники, Иллан, клиенты)
- доделки по сайту, блок "наш подход", "контакты"
- проработка мерча Headcorn с Машей и командой по Китаю
- подготовка ко встрече с ОТП Банком
- прочая операционка`,
    completionRate: 60,
    issues: [],
    highlights: [
      'Wildberries пришли с запросом на 10.000 НГ подарков',
      'Сайт обновлён - блоки "наш подход" и "контакты"'
    ],
    createdAt: '2026-01-19T09:00:00.000Z'
  },
  {
    id: 'artem-0119',
    manager: 'Артем',
    department: 'Китай/МОК',
    weekStart: '2026-01-19',
    plan: `1. Встреча с ОК
2. Сбор статистики, подготовка к концу сезона
3. Мерч проработка
4. 1-1: Юля, Настя
5. Провести по калькулятору встречу по обновлениям и вопросам
6. Проработать правила интересных товаров (собраться всеми неравнодушными)

Основной фокус на запуске образцов и тиражей`,
    fact: `1. Адаптация нового сотрудника
3. Встреча с ОК и ОК+Камилла
4. Встречи с ОМ (Костей) по нашему мерчу и сбор идей позиций
5. Подключение к решению горячих вопросов по проблемным проектам
6. В планах пушнуть клиентов и попробовать спровоцировать кого-то на заказы
7. Проверить гипотезу по интересным товарам
8. Проработка товаров с нуля как пилоты (для нас-клиентов)
9. Собрание с командой
10. 1-1 с Ариной и Светой Л
11. Зафинали с Кастомом долги, жду пока чекнут и оплатят`,
    completionRate: 80,
    issues: [
      'Горячие вопросы по проблемным проектам',
      'С тиражами сейчас сложнее'
    ],
    highlights: [
      'Адаптация нового сотрудника',
      'Зафинали с Кастомом долги'
    ],
    createdAt: '2026-01-19T09:00:00.000Z'
  },
  {
    id: 'nastya-a-0119',
    manager: 'Настя А',
    department: 'Китай/МОК',
    weekStart: '2026-01-19',
    plan: `Операционка:
- ревизия задач в статусах «КП согласование» и «КП согласовано» от прямых клиентов
- работа с браком по проектам, а именно бадминтон
- контроль новых запросов
- фиксация отпуска

Встречи:
- выходная встреча с Ариной
- встречи с руками МОК, Камиллой, Рэшадом (доработка таблицы компетенций, синхронизация ожиданий)

Аналитика:
- сбор данных по реализованным проектам
- запрос ОС`,
    fact: `- собрали ОС по декабрьским просчетам - 2 получили дальнейшую проработку, идем к заказам
- Проекты по Альфе кэмп и 8 марта - отвалились, 8 марта ОДК тоже в пролете
- нашли решение по заказам с браком, перешли в этап переделки. Клиент успокоился.
- закрыли заказы за декабрь
- встреча с МОК и Камиллой по компетенциям
- протестировала новинки в инструменте. Подсветила их плюсы`,
    completionRate: 70,
    issues: [
      'Проекты по Альфе кэмп и 8 марта - отвалились',
      '8 марта ОДК тоже в пролете',
      'Работа с браком по проектам (бадминтон)'
    ],
    highlights: [
      'Нашли решение по заказам с браком, клиент успокоился',
      'Закрыли заказы за декабрь',
      '2 просчёта получили дальнейшую проработку'
    ],
    createdAt: '2026-01-19T09:00:00.000Z'
  },
  {
    id: 'petr-0119',
    manager: 'Петр',
    department: 'HR',
    weekStart: '2026-01-19',
    plan: `Рекрутмент:
- Встречаемся в офисе с кандидатом в HRBP
- Назначены встречи с разработчиками, аккаунтами, тендерными специалистами
- Перезапускаю вакансию менеджеров по Китаю
- Усилили контент лида - сделали временный баннер, поднимаем в выдаче

Работа с командой:
- Экзит Арина
- Жду от Екатерины план по первому коммуникационному занятию
- Подготовка к выходу новичка
- Проработка выезда

Хоз:
- Получить камеру микрофон, протестировать
- Поиск стола на складе для маркетинга
- Монитор для Алины
- Подготовить рабочее место для новичка`,
    fact: `Рекрутмент - приоритет контент лид и HRBP, Аккаунт и тендерный специалист, менеджеры по Китаю. - ок, работаем

Ждём HRBP в офисе, контент лидов активно смотрим

Один тендерный спец в отказ, хороший аккаунт попался - передаю Вике

Выход новичка - ок

Работа с командой:
- Расписать интервью с Комардиной, провести с Олегом (не успели) - ок
- Объявление об отпусках - ок
- Сбор группы welcome meeting - перенос, нет Диёра, группа будет совсем маленькой
- Оформление сотрудников в штат (Олина, Иванова, Комардина) - делаем

Хоз:
- Выбрали камеру и микрофон, заказываем - ждём камеру к пятнице
- С микрофоном заминка, но тоже будет в пятнице
- Маркетинг просит второй стол - ищем человека`,
    completionRate: 65,
    issues: [
      'Один тендерный спец в отказ',
      'Welcome meeting перенос - нет Диёра',
      'С микрофоном заминка'
    ],
    highlights: [
      'Хороший аккаунт попался - передаю Вике',
      'Выход новичка - ок',
      'Объявление об отпусках - ок'
    ],
    createdAt: '2026-01-19T09:00:00.000Z'
  },
  {
    id: 'nikita-0119',
    manager: 'Никита',
    department: 'Дубай',
    weekStart: '2026-01-19',
    plan: `- операционка, фин. учет
- встреча с Henkel, контроль новых запусков
- аккаунтинг текущих клиентов
- встречи Yango Africa, Spacetoon, DED, Platinumlist
- оптимизация google ads
- 1:1 Кристина
- тест карго Aramex/поиск мини-склада
- подготовка лендинга для Рамадана`,
    fact: `- операционка
- встречи Henkel, Casa Padel
- контроль текущих производств
- подготовка подарков Рамадан
- тест карго Aramex/поиск мини-склада
- новые запуски Henkel`,
    completionRate: 70,
    issues: [],
    highlights: [
      'Новые запуски Henkel',
      'Подготовка подарков Рамадан'
    ],
    createdAt: '2026-01-19T09:00:00.000Z'
  },
  {
    id: 'zhenya-0112',
    manager: 'Женя',
    department: 'Китай',
    weekStart: '2026-01-12',
    plan: `- Контроль обновления статусов по производствам/доставкам/образцам
- Встреча с ОК по компетенциям
- Встреча с Камиллой по компетенциям
- Распределение отпусков
- Встреча с Командой
- Посчитать КПИ за прошлый квартал
- Закрыть проекты
- Провести 1-1: Саша/Настя/Марина
- Анализ планируемых близких к запуску задач, подумать как дожать`,
    fact: '',
    completionRate: 0,
    issues: [],
    highlights: [],
    createdAt: '2026-01-12T09:00:00.000Z'
  },
  {
    id: 'nastya-m-0112',
    manager: 'Настя Мирскова',
    department: 'МОК',
    weekStart: '2026-01-12',
    plan: `1. Выполненные проекты декабря
2. Закрыть проекты
3. Просчет мерча Headcorn
4. Ставки в калькуляторе следим, обновляем
5. Обновление курса для МОК (+ калькулятор, - ненужные теперь уроки), перенос его в вик
6. Учусь работать с курсором
7. Обсудить новые задачи с Камиллой`,
    fact: '',
    completionRate: 0,
    issues: [],
    highlights: [],
    createdAt: '2026-01-12T09:00:00.000Z'
  },
  {
    id: 'pavel-0112',
    manager: 'Павел',
    department: 'Логистика',
    weekStart: '2026-01-12',
    plan: `- Подготовка к отправке прибывающих грузов Яндекса (общебренд + подарки на НГ) - отправляем в страны СНГ из РФ
- Финализирую метрики по KPI
- Отпуска
- Повторный контроль по новым запускам и текущим проектам
- Операционная работа
- Обновление ставок на перевозку от подрядчиков`,
    fact: '',
    completionRate: 0,
    issues: [],
    highlights: [],
    createdAt: '2026-01-12T09:00:00.000Z'
  }
]

export default function LeadershipReportsPage() {
  const [reports, setReports] = useState<WeeklyReport[]>([])
  const [selectedWeek, setSelectedWeek] = useState<string>('2026-01-19')
  const [expandedManager, setExpandedManager] = useState<string | null>(null)
  const [editingReport, setEditingReport] = useState<WeeklyReport | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState('')
  const [importManager, setImportManager] = useState('')
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Get Monday of week
  function getMonday(date: Date): string {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    return d.toISOString().split('T')[0]
  }

  // Format week for display
  function formatWeek(dateStr: string): string {
    const date = new Date(dateStr)
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 4)
    return `${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/leadership-reports')
        if (response.ok) {
          const data = await response.json()
          if (data.reports && data.reports.length > 0) {
            // Merge with initial data
            const merged = [...initialReports]
            for (const report of data.reports) {
              const existingIndex = merged.findIndex(r => r.id === report.id)
              if (existingIndex >= 0) {
                merged[existingIndex] = report
              } else {
                merged.push(report)
              }
            }
            setReports(merged)
          } else {
            setReports(initialReports)
            // Save initial data
            await fetch('/api/leadership-reports', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reports: initialReports })
            })
          }
        }
      } catch (error) {
        console.error('Error loading:', error)
        setReports(initialReports)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Get reports for selected week
  const weekReports = reports.filter(r => r.weekStart === selectedWeek)

  // Get report for specific manager
  const getReportForManager = (managerName: string): WeeklyReport | undefined => {
    return weekReports.find(r => r.manager === managerName)
  }

  // Save report
  const saveReport = async (report: WeeklyReport) => {
    setSaving(true)
    try {
      const updatedReports = [...reports]
      const existingIndex = updatedReports.findIndex(r => r.id === report.id)
      
      if (existingIndex >= 0) {
        updatedReports[existingIndex] = report
      } else {
        updatedReports.push(report)
      }

      setReports(updatedReports)

      await fetch('/api/leadership-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reports: updatedReports })
      })

      setEditingReport(null)
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  // Create new report
  const createReport = (manager: ManagerProfile) => {
    setEditingReport({
      id: `${manager.name.toLowerCase().replace(/\s/g, '-')}-${selectedWeek}`,
      manager: manager.name,
      department: manager.department,
      weekStart: selectedWeek,
      plan: '',
      fact: '',
      completionRate: 0,
      issues: [],
      highlights: [],
      createdAt: new Date().toISOString()
    })
  }

  // Handle import
  const handleImport = () => {
    if (!importManager || !importText.trim()) return
    
    const manager = managers.find(m => m.name === importManager)
    if (!manager) return
    
    const parsed = parseManagerReport(importText)
    const completionRate = calculateCompletionRate(parsed.plan, parsed.fact)
    
    const newReport: WeeklyReport = {
      id: `${manager.name.toLowerCase().replace(/\s/g, '-')}-${selectedWeek}-${Date.now()}`,
      manager: manager.name,
      department: manager.department,
      weekStart: selectedWeek,
      plan: parsed.plan,
      fact: parsed.fact,
      completionRate,
      issues: parsed.issues,
      highlights: parsed.highlights,
      createdAt: new Date().toISOString()
    }
    
    setEditingReport(newReport)
    setShowImportModal(false)
    setImportText('')
    setImportManager('')
  }

  // Get completion color
  const getCompletionColor = (rate: number): string => {
    if (rate >= 80) return 'text-green-400'
    if (rate >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  // Get completion icon
  const getCompletionIcon = (rate: number) => {
    if (rate >= 80) return <TrendingUp className="text-green-400" size={16} />
    if (rate >= 50) return <Minus className="text-yellow-400" size={16} />
    return <TrendingDown className="text-red-400" size={16} />
  }

  // Get all issues for the week
  const getAllIssues = (): { manager: string; issue: string }[] => {
    const issues: { manager: string; issue: string }[] = []
    weekReports.forEach(r => {
      r.issues.forEach(issue => {
        issues.push({ manager: r.manager, issue })
      })
    })
    return issues
  }

  // Calculate average completion
  const getAverageCompletion = (): number => {
    if (weekReports.length === 0) return 0
    const total = weekReports.reduce((sum, r) => sum + r.completionRate, 0)
    return Math.round(total / weekReports.length)
  }

  // Get weeks
  const getWeeks = (): string[] => {
    return ['2026-01-19', '2026-01-12', '2026-01-05', '2025-12-29']
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-primary-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-dark-700 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">План/Факт руководителей</h1>
            <p className="text-dark-400 mt-1">Отслеживание выполнения и выявление проблем</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
          >
            <Upload size={18} />
            Импорт текста
          </button>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
          >
            <BarChart3 size={18} />
            {showAnalytics ? 'Скрыть аналитику' : 'Аналитика'}
          </button>
        </div>
      </div>

      {/* Week selector */}
      <Card>
        <div className="flex items-center gap-4">
          <Calendar className="text-primary-400" size={20} />
          <span className="text-dark-300">Неделя:</span>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
          >
            {getWeeks().map(week => (
              <option key={week} value={week}>
                {formatWeek(week)}
              </option>
            ))}
          </select>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="text-dark-400">
              Отчётов: {weekReports.length} / {managers.length}
            </span>
            <span className={`font-medium ${getCompletionColor(getAverageCompletion())}`}>
              Среднее выполнение: {getAverageCompletion()}%
            </span>
          </div>
        </div>
      </Card>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Completion Summary */}
          <Card className="bg-gradient-to-br from-primary-900/30 to-dark-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="text-primary-400" size={20} />
              Выполнение
            </h3>
            <div className="space-y-2">
              {weekReports.sort((a, b) => b.completionRate - a.completionRate).map(r => (
                <div key={r.id} className="flex items-center justify-between">
                  <span className="text-sm text-dark-300">{r.manager}</span>
                  <div className="flex items-center gap-2">
                    {getCompletionIcon(r.completionRate)}
                    <span className={`text-sm font-medium ${getCompletionColor(r.completionRate)}`}>
                      {r.completionRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Issues */}
          <Card className="bg-gradient-to-br from-red-900/20 to-dark-800 border-red-500/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-400" size={20} />
              Проблемы и риски
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {getAllIssues().length > 0 ? getAllIssues().map((item, i) => (
                <div key={i} className="text-sm">
                  <span className="text-dark-500">{item.manager}:</span>{' '}
                  <span className="text-red-300">{item.issue}</span>
                </div>
              )) : (
                <p className="text-dark-400 text-sm">Нет выявленных проблем</p>
              )}
            </div>
          </Card>

          {/* Your Action Items */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-dark-800 border-blue-500/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Flag className="text-blue-400" size={20} />
              Мои действия (COO)
            </h3>
            <div className="space-y-2 text-sm">
              {getAverageCompletion() < 70 && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-yellow-400 mt-0.5 shrink-0" size={14} />
                  <span>Разобрать причины низкого выполнения с руководителями</span>
                </div>
              )}
              {getAllIssues().length > 3 && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-red-400 mt-0.5 shrink-0" size={14} />
                  <span>Приоритизировать решение {getAllIssues().length} проблем</span>
                </div>
              )}
              {weekReports.some(r => r.issues.some(i => i.toLowerCase().includes('брак'))) && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-orange-400 mt-0.5 shrink-0" size={14} />
                  <span>Встреча по качеству - браки в производстве</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-blue-400 mt-0.5 shrink-0" size={14} />
                <span>1:1 с руководителями у кого выполнение &lt;60%</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Импорт отчёта руководителя</h3>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-dark-700 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <p className="text-dark-400 text-sm mb-4">
              Вставьте текст отчёта - система распределит по План/Факт и выделит проблемы
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Руководитель</label>
                <select
                  value={importManager}
                  onChange={(e) => setImportManager(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                >
                  <option value="">Выберите руководителя</option>
                  {managers.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({m.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Текст отчёта</label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[300px] font-mono text-sm"
                  placeholder="Вставьте полный текст отчёта с планом и фактом..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={handleImport}
                disabled={!importManager || !importText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg"
              >
                <Upload size={18} />
                Импортировать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">{editingReport.manager}</h3>
            <p className="text-dark-400 text-sm mb-6">{editingReport.department} • {formatWeek(selectedWeek)}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Target size={16} className="text-blue-400" />
                  План
                </label>
                <textarea
                  value={editingReport.plan}
                  onChange={(e) => setEditingReport({ ...editingReport, plan: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[200px]"
                  placeholder="Что планировалось сделать..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  Факт
                </label>
                <textarea
                  value={editingReport.fact}
                  onChange={(e) => {
                    const newFact = e.target.value
                    const newRate = calculateCompletionRate(editingReport.plan, newFact)
                    setEditingReport({ ...editingReport, fact: newFact, completionRate: newRate })
                  }}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[200px]"
                  placeholder="Что было сделано..."
                />
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <AlertTriangle size={16} className="text-red-400" />
                  Проблемы (каждая с новой строки)
                </label>
                <textarea
                  value={editingReport.issues.join('\n')}
                  onChange={(e) => setEditingReport({ 
                    ...editingReport, 
                    issues: e.target.value.split('\n').filter(l => l.trim())
                  })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[100px]"
                  placeholder="Выявленные проблемы..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <TrendingUp size={16} className="text-green-400" />
                  Успехи (каждый с новой строки)
                </label>
                <textarea
                  value={editingReport.highlights.join('\n')}
                  onChange={(e) => setEditingReport({ 
                    ...editingReport, 
                    highlights: e.target.value.split('\n').filter(l => l.trim())
                  })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[100px]"
                  placeholder="Достижения и успехи..."
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                Выполнение: {editingReport.completionRate}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingReport.completionRate}
                onChange={(e) => setEditingReport({ ...editingReport, completionRate: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingReport(null)}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={() => saveReport(editingReport)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 rounded-lg"
              >
                {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Managers list */}
      <div className="space-y-3">
        {managers.map(manager => {
          const report = getReportForManager(manager.name)
          const isExpanded = expandedManager === manager.name

          return (
            <Card key={manager.name} className="overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedManager(isExpanded ? null : manager.name)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${report ? 'bg-green-500' : 'bg-dark-500'}`} />
                  <div>
                    <span className="font-medium">{manager.name}</span>
                    <span className="text-dark-400 text-sm ml-2">({manager.department})</span>
                  </div>
                  {report && (
                    <div className="flex items-center gap-2 ml-4">
                      {getCompletionIcon(report.completionRate)}
                      <span className={`text-sm font-medium ${getCompletionColor(report.completionRate)}`}>
                        {report.completionRate}%
                      </span>
                      {report.issues.length > 0 && (
                        <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                          {report.issues.length} проблем
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!report && (
                    <button
                      onClick={(e) => { e.stopPropagation(); createReport(manager) }}
                      className="flex items-center gap-1 px-3 py-1 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm"
                    >
                      Добавить отчёт
                    </button>
                  )}
                  {report && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingReport(report) }}
                      className="px-3 py-1 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
                    >
                      Редактировать
                    </button>
                  )}
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isExpanded && report && (
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-2">
                        <Target size={14} />
                        План
                      </div>
                      <p className="text-sm text-dark-300 whitespace-pre-wrap bg-dark-900/50 rounded-lg p-3">
                        {report.plan || '—'}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-green-400 mb-2">
                        <CheckCircle2 size={14} />
                        Факт
                      </div>
                      <p className="text-sm text-dark-300 whitespace-pre-wrap bg-dark-900/50 rounded-lg p-3">
                        {report.fact || '—'}
                      </p>
                    </div>
                  </div>

                  {(report.issues.length > 0 || report.highlights.length > 0) && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {report.issues.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-red-400 mb-2">
                            <AlertTriangle size={14} />
                            Проблемы
                          </div>
                          <ul className="text-sm text-red-300 space-y-1">
                            {report.issues.map((issue, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-500">•</span>
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {report.highlights.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-green-400 mb-2">
                            <TrendingUp size={14} />
                            Успехи
                          </div>
                          <ul className="text-sm text-green-300 space-y-1">
                            {report.highlights.map((highlight, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isExpanded && !report && (
                <div className="mt-4 pt-4 border-t border-dark-700 text-center text-dark-400">
                  Отчёт за эту неделю не добавлен
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
