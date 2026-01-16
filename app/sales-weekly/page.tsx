'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Calendar, Target, CheckSquare, Package, Truck, CreditCard, Save, ChevronDown, ChevronUp, RefreshCw, FileText } from 'lucide-react'
import Card from '@/components/Card'

interface WeeklyPlan {
  id: string
  salesPerson: string
  weekStart: string // YYYY-MM-DD
  goals: string
  tasks: string
  projects: string
  productionLogistics: string
  payment: string
  createdAt: string
}

interface WeeklySummary {
  weekStart: string
  plans: WeeklyPlan[]
  summary?: string
}

// Sales team members
const salesTeam = [
  'Алина Титова',
  'Наталья Лактистова',
  'Полина Коник',
  'Максим Можкин',
  'Елизавета Барабаш',
  'Ирина Ветера',
  'Сизиков Тимур',
  'Диёр Дадаев',
]

// Initial plans data for week 12-16 January
const initialPlans: WeeklySummary[] = [
  {
    weekStart: '2026-01-12',
    plans: [
      {
        id: 'plan-alina-0112',
        salesPerson: 'Алина Титова',
        weekStart: '2026-01-12',
        goals: `Кроссовки S7 тендер
Забрать победу S7 детские наборы дальнего следования
Сумка машиниста верить и забрать победу
S7 забрать победу по органайзерам`,
        tasks: `Дожимы срочные:
• Точка банк – решение по брелоку и калькулятору + отправить подарки
• ГК РОСТ – дожать клиента на отшив сигнальных образцов
• Полотенчики для S7 – жду ОС
• S7 тендер органайзеры – отправить образец качества для тендера (в Москве 16-17.01)

Отчёты:
• План продаж 2025 и 2026 - отредактировать до 16.01
• МИРО что же делают продажи? До 17.01
• Отправить подарки клиентам
• Внести ДС в ЗП за декабрь`,
        projects: `Запуски/образцы:
• БСК – переделываем брак + комплимент в Проекте 111
• S7 запуск тиража органайзеры контроль
• Перекресток селект – производим тираж, через предтиражники
• Готовим новые запуски образцов для Солнца Москвы – ждем оплату
• Запуск сигнального образца шопперы для НФ ГРУПП контроль
• Мармеладыч – готовим с Костей дизайн проект
• Косметички S7 контролируем эталоны качества по образцам + подать цены до 26.01.26`,
        productionLogistics: `Контроль производства образцов и тиражей`,
        payment: `Ожидаем оплату от Солнца Москвы`,
        createdAt: '2026-01-12T09:00:00.000Z'
      },
      {
        id: 'plan-natasha-0119',
        salesPerson: 'Наталья Лактистова',
        weekStart: '2026-01-12',
        goals: `Альфа - получить даты образцов, сориентировать клиента
Шлемы - утвердить доки и запустить производство`,
        tasks: `Отдать расчеты:
• Пуш коллекция
• Каталог Альфа
• Шлемы мото
• Игрушки КФС
• Яндекс Пэй

Взять ОС:
• Наталия: попсокеты и пуллеры
• Галкина запросы
• Немцева запросы
• Русгидро
• Корал клаб
• Ядро рюкзак - попинать на запуск
• Коллекционные роверы - Людмила ОС по образцам качества
• ОАК конфест`,
        projects: `Работа над проектами/клиентами:
• Взять запрос Пэя + получить номер + бриф + задача на просчет
• Дожать на встречу Альфа по текстилю
• Дожать руководителя Катю на звонок
• НГ межнар: обновить статусы
• НГ общебренд: обновить статусы
• Проверить все договора и инвойсы НГ и Общебренд
• Статуэтки - расписать Виктории статусы по проектам
• Кликеры - сказать о задержке и уточнить статус
• Бетбум - подумать, что сделать, чтобы появились запросы
• Договор Корал Клаб - ОС`,
        productionLogistics: `Контроль производства образцов:
• Кроссовки Яндекс
• Альфа Банк (пуш, НСК, ВиТ, Поверы)
• Статуэтки
• Тубус статуэтки РФ
• Одеяла Баира
• Образец дождевика, который едет в Китай

Контроль тиражей:
• Янго мерч, текстиль, НГ
• Кликеры
• Стаканы ПИМС
• Кенгуру подставки
• Офис бокс Иллан`,
        payment: `Отправить образцы в МСК:
• Рюкзак Яндекс раскладки
• Сейф-теги`,
        createdAt: '2026-01-12T09:00:00.000Z'
      },
      {
        id: 'plan-polina-0112',
        salesPerson: 'Полина Коник',
        weekStart: '2026-01-12',
        goals: `Провести чистку по производствам, актуализировать активные и близкие к запуску задачи
Итоги предыдущей недели: выжила`,
        tasks: `Клиенты и проекты:

Т-Банк:
• КП по бомберам
• Чат с идеями
• Аккумулировать итоги встречи в задачу + КП к ней
• Обновление данных по задаче с питомцами
• Обновление данных по задаче с одеждой
• Пообщаться с клиентом по задаче фестивалей
• Пообщаться с клиентом по лизингу и авто
• Вернуться с новостями по рюкзаку
• Преза по детским подаркам

Иллан:
• Пройтись по действующим задачам + клиента проинформировать по статусам
• Сумки Тедди - новости по готовности образца сумки + решаем по пакетам
• Тех карта - в медленном режиме делаем все еще
• ДомКлик фарфор - новости с производства
• Тиффани - решение по запуску
• Варежки - новости по производству
• Расчет по шнуркам ГПБ
• Образец рюкзака Палитра - уточнить ОС
• Решение вопроса по компенсации и частному банку`,
        projects: `Зейтс:
• Новости по тиражу коробок
• Новости по производству тиража Весны
• Отгрузки Ростикс
• КП по Лету

Конфест:
• ВК - уточнить по статусу
• Игла - новая задача поставить
• ОДК - новые позиции

Гроуп:
• Награды - решаем вопросики по открытке`,
        productionLogistics: `Т-Банк:
• Кармашки - доставка
• Ланъярды - доставка
• Кликеры - производство
• Рюкзак - образец производство
• Веер - образец производство

Зейтс:
• Ростикс - доставка + отгрузки
• Зеркала - отгрузки
• Ручки Янго - отгрузки
• Холодовые пады - отгрузки
• Спейс - доставка + отгрузки
• Ручки инъектран - отгрузка 2 тиражей

Иллан:
• ДомКлик — завершение производства
• Варежки ВТБ - производство
• Бутылки ГПБ - отгрузка
• Тедди сумки - производство`,
        payment: `Документы:
• Частный банк - завершение по оплатам
• Лампы зейтс - оплата
• Полароиды Конфест - оплаты`,
        createdAt: '2026-01-12T09:00:00.000Z'
      },
      {
        id: 'plan-maxim-0112',
        salesPerson: 'Максим Можкин',
        weekStart: '2026-01-12',
        goals: `Шнурки S7, лампы СДМ банк`,
        tasks: `• Петербургская недвижимость - ждем ОС по браку
• Лампы СДМ - ждем в МСК
• Семена - жду новостей от Паши
• Шнурки S7 - готовим доки
• Астория - готовим КП
• Иллан - Азбука ОС
• Иллан ЛДПР кружки - ОС
• Иллан МТС - образец переходника ждем
• Иллан яйцо по тиражу
• Компасы - ждем тираж в МСК
• Иллан лемана про - ОС
• Иллан новые запросы
• Катана - ждем тираж
• Бизиборд - ОС
• Губин - футляры и салфетки ОС
• Медиалаб - КП
• Полати ПБ - КП
• Дождевики ария считаем
• Чекнуть доставку НГ подарков клиентам`,
        projects: `Встречи:
• Пикабу запланировать
• Самолет плюс запланировать
• Воя запланировать`,
        productionLogistics: `• Шнурки S7 - готовим доки
• Компасы - ждем тираж в МСК
• Катана - ждем тираж`,
        payment: `Ожидаем оплаты по текущим проектам`,
        createdAt: '2026-01-12T09:00:00.000Z'
      },
      {
        id: 'plan-lelya-0112',
        salesPerson: 'Елизавета Барабаш',
        weekStart: '2026-01-12',
        goals: `Взять ТЗ от Molecule на просчет гипсовых арома-саше/отправить образцы тканей
Подготовить просчет для WB на игрульку`,
        tasks: `Клиенты и проекты:

ВодоходЪ:
• Производство завершено/отгрузка в Иркутск
• Клиент заказал сигнальный - монеты (получил). Ждем ОС от начальницы, которая вернется после 25 января

Эдельвейс:
• Таблетницы отдали КП - ждем результаты, предложили доставку из МСК в Кемерово взять на себя

Директория:
• Вкусно и Точка - 2 просчета
• 1 по Актибио
• Результаты пока не предоставили, буду оживлять после НГ праздники`,
        projects: `ВодоходЪ - отдали КП по обуви ждем результат
Таврида Арт - Брелки - отдали КП - ждем ОС от клиента
Next Level Group - МТС (попали в пул поставщиков) - подготовили КП по позициям - ждем результаты
Molecule - косметички отдали КП, на стадии принятия решения. Приехали образцы тканей из Китая - отправим клиенту. Новый запрос на просчет гипсовых ароматизаторов
Никомед - участие в тендере - отдали КП, результатов пока нет`,
        productionLogistics: `Отгрузка ВодоходЪ в Иркутск`,
        payment: `Ожидаем решения по КП`,
        createdAt: '2026-01-12T09:00:00.000Z'
      },
      {
        id: 'plan-irina-0112',
        salesPerson: 'Ирина Ветера',
        weekStart: '2026-01-12',
        goals: `Дожать в оплату всех, кто откладывал запуск на январь`,
        tasks: `Получить ОС по запуску:
• Островок (согласование от клиента)
• ЦУМ (ОС по ракетке и гендерным)
• Иллан (вазы, бутылки, ежик, сквиш)
• Аск (повтор дадосов)
• Альбина (награды, сервопривод)
• SBL (кепки)

Отдать расчеты:
• КФ Победа (сквиш шоколадный)
• Банк Казани (ежики)
• ЦУМ (исходящее предложение по развитию линейки мерча)`,
        projects: `Работа над проектами:
• Инъектран - ведение производства, контроль доков. В среду заканчиваем клеить ЧЗ и отправляем. Созвониться по следующим тиражам.
• ЦУМ - подбираю идеи для гендерных праздников. Дожать подписание договора
• Иллан Холдмарк - контроль образца
• Екатерина - дожать запуск косметички
• Мегафон - назначить встречу
• Иллан - дожать в запуск ежик и значки
• Озон - для тендера делаем образец награды и рюкзака. Нужны еще кейсы без НДА с наградными статуэтками для презентации`,
        productionLogistics: `• Провей. Таблетницы уже приехали в МСК. Сквиш готов, 5 января отправили с фабрики.
• Сколково - 13.01 отгрузка готовой партии брелоков. Готовлю подборку для исходящего предложения`,
        payment: `Дожать в оплату клиентов, отложивших запуск на январь`,
        createdAt: '2026-01-12T09:00:00.000Z'
      }
    ]
  }
]

export default function SalesWeeklyPage() {
  const [weeklyData, setWeeklyData] = useState<WeeklySummary[]>([])
  const [selectedWeek, setSelectedWeek] = useState<string>(getMonday(new Date()))
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null)
  const [editingPlan, setEditingPlan] = useState<WeeklyPlan | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSummary, setShowSummary] = useState(false)

  // Get Monday of current week
  function getMonday(date: Date): string {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    return d.toISOString().split('T')[0]
  }

  // Format date for display
  function formatWeek(dateStr: string): string {
    const date = new Date(dateStr)
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 6)
    return `${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/sales-weekly')
        if (response.ok) {
          const data = await response.json()
          if (data.weeklyData && data.weeklyData.length > 0) {
            setWeeklyData(data.weeklyData)
          } else {
            // No saved data - use initial plans and save them
            setWeeklyData(initialPlans)
            setSelectedWeek('2026-01-12')
            // Save initial data
            await fetch('/api/sales-weekly', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ weeklyData: initialPlans })
            })
          }
        }
      } catch (error) {
        console.error('Error loading:', error)
        // On error, still show initial data
        setWeeklyData(initialPlans)
        setSelectedWeek('2026-01-12')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Get current week's data
  const currentWeekData = weeklyData.find(w => w.weekStart === selectedWeek) || { weekStart: selectedWeek, plans: [] }

  // Get plan for a specific person
  const getPlanForPerson = (person: string): WeeklyPlan | undefined => {
    return currentWeekData.plans.find(p => p.salesPerson === person)
  }

  // Save plan
  const savePlan = async (plan: WeeklyPlan) => {
    setSaving(true)
    try {
      // Update local state
      const updatedWeeklyData = [...weeklyData]
      const weekIndex = updatedWeeklyData.findIndex(w => w.weekStart === selectedWeek)
      
      if (weekIndex >= 0) {
        const planIndex = updatedWeeklyData[weekIndex].plans.findIndex(p => p.salesPerson === plan.salesPerson)
        if (planIndex >= 0) {
          updatedWeeklyData[weekIndex].plans[planIndex] = plan
        } else {
          updatedWeeklyData[weekIndex].plans.push(plan)
        }
      } else {
        updatedWeeklyData.push({ weekStart: selectedWeek, plans: [plan] })
      }

      setWeeklyData(updatedWeeklyData)

      // Save to API
      await fetch('/api/sales-weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyData: updatedWeeklyData })
      })

      setEditingPlan(null)
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  // Create new plan for person
  const createPlan = (person: string) => {
    setEditingPlan({
      id: `plan-${Date.now()}`,
      salesPerson: person,
      weekStart: selectedWeek,
      goals: '',
      tasks: '',
      projects: '',
      productionLogistics: '',
      payment: '',
      createdAt: new Date().toISOString()
    })
  }

  // Generate summary
  const generateSummary = (): string => {
    const plans = currentWeekData.plans
    if (plans.length === 0) return 'Нет данных за эту неделю'

    let summary = `📊 **Саммари недели ${formatWeek(selectedWeek)}**\n\n`
    summary += `Отчёты подали: ${plans.length} из ${salesTeam.length} менеджеров\n\n`

    // Goals summary
    summary += `🎯 **Цели:**\n`
    plans.forEach(p => {
      if (p.goals) summary += `• ${p.salesPerson}: ${p.goals.substring(0, 100)}${p.goals.length > 100 ? '...' : ''}\n`
    })

    // Projects summary
    summary += `\n📁 **Проекты:**\n`
    plans.forEach(p => {
      if (p.projects) summary += `• ${p.salesPerson}: ${p.projects.substring(0, 100)}${p.projects.length > 100 ? '...' : ''}\n`
    })

    // Payment summary
    summary += `\n💰 **Оплаты:**\n`
    plans.forEach(p => {
      if (p.payment) summary += `• ${p.salesPerson}: ${p.payment.substring(0, 100)}${p.payment.length > 100 ? '...' : ''}\n`
    })

    return summary
  }

  // Get previous weeks
  const getPreviousWeeks = (): string[] => {
    const weeks: string[] = []
    const today = new Date()
    for (let i = 0; i < 12; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - (i * 7))
      weeks.push(getMonday(d))
    }
    // Ensure 2026-01-12 is included
    if (!weeks.includes('2026-01-12')) {
      weeks.push('2026-01-12')
    }
    return weeks
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
            <h1 className="text-3xl font-bold">Еженедельные планы продаж</h1>
            <p className="text-dark-400 mt-1">Планы и отчёты отдела продаж</p>
          </div>
        </div>
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
        >
          <FileText size={18} />
          {showSummary ? 'Скрыть саммари' : 'Показать саммари'}
        </button>
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
            {getPreviousWeeks().map(week => (
              <option key={week} value={week}>
                {formatWeek(week)}
              </option>
            ))}
          </select>
          <div className="ml-auto text-sm text-dark-400">
            Подано отчётов: {currentWeekData.plans.length} / {salesTeam.length}
          </div>
        </div>
      </Card>

      {/* Summary */}
      {showSummary && (
        <Card className="bg-gradient-to-br from-primary-900/30 to-dark-800 border-primary-500/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="text-primary-400" size={20} />
            Саммари недели
          </h3>
          <pre className="whitespace-pre-wrap text-sm text-dark-200 font-sans">
            {generateSummary()}
          </pre>
        </Card>
      )}

      {/* Edit modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              План: {editingPlan.salesPerson}
            </h3>
            <p className="text-dark-400 text-sm mb-6">
              Неделя: {formatWeek(selectedWeek)}
            </p>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Target size={16} className="text-yellow-400" />
                  Цели
                </label>
                <textarea
                  value={editingPlan.goals}
                  onChange={(e) => setEditingPlan({ ...editingPlan, goals: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  placeholder="Цели на неделю..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <CheckSquare size={16} className="text-blue-400" />
                  Задачи
                </label>
                <textarea
                  value={editingPlan.tasks}
                  onChange={(e) => setEditingPlan({ ...editingPlan, tasks: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  placeholder="Задачи на неделю..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Package size={16} className="text-purple-400" />
                  Работа над проектами
                </label>
                <textarea
                  value={editingPlan.projects}
                  onChange={(e) => setEditingPlan({ ...editingPlan, projects: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  placeholder="Какие проекты в работе..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Truck size={16} className="text-green-400" />
                  Производство и логистика
                </label>
                <textarea
                  value={editingPlan.productionLogistics}
                  onChange={(e) => setEditingPlan({ ...editingPlan, productionLogistics: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  placeholder="Статус производства и логистики..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <CreditCard size={16} className="text-emerald-400" />
                  Оплата (Предоплата / Постоплата)
                </label>
                <textarea
                  value={editingPlan.payment}
                  onChange={(e) => setEditingPlan({ ...editingPlan, payment: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  placeholder="Ожидаемые оплаты..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={() => savePlan(editingPlan)}
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

      {/* Sales team list */}
      <div className="space-y-3">
        {salesTeam.map(person => {
          const plan = getPlanForPerson(person)
          const isExpanded = expandedPerson === person

          return (
            <Card key={person} className="overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedPerson(isExpanded ? null : person)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${plan ? 'bg-green-500' : 'bg-dark-500'}`} />
                  <span className="font-medium">{person}</span>
                  {plan && (
                    <span className="text-xs text-dark-400">
                      Обновлено: {new Date(plan.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!plan && (
                    <button
                      onClick={(e) => { e.stopPropagation(); createPlan(person) }}
                      className="flex items-center gap-1 px-3 py-1 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm"
                    >
                      <Plus size={14} />
                      Добавить план
                    </button>
                  )}
                  {plan && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingPlan(plan) }}
                      className="px-3 py-1 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
                    >
                      Редактировать
                    </button>
                  )}
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isExpanded && plan && (
                <div className="mt-4 pt-4 border-t border-dark-700 grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-yellow-400 mb-1">
                      <Target size={14} />
                      Цели
                    </div>
                    <p className="text-sm text-dark-300 whitespace-pre-wrap">{plan.goals || '—'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-1">
                      <CheckSquare size={14} />
                      Задачи
                    </div>
                    <p className="text-sm text-dark-300 whitespace-pre-wrap">{plan.tasks || '—'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-400 mb-1">
                      <Package size={14} />
                      Проекты
                    </div>
                    <p className="text-sm text-dark-300 whitespace-pre-wrap">{plan.projects || '—'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                      <Truck size={14} />
                      Производство и логистика
                    </div>
                    <p className="text-sm text-dark-300 whitespace-pre-wrap">{plan.productionLogistics || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 mb-1">
                      <CreditCard size={14} />
                      Оплата
                    </div>
                    <p className="text-sm text-dark-300 whitespace-pre-wrap">{plan.payment || '—'}</p>
                  </div>
                </div>
              )}

              {isExpanded && !plan && (
                <div className="mt-4 pt-4 border-t border-dark-700 text-center text-dark-400">
                  План на эту неделю не добавлен
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

