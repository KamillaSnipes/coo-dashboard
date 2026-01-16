// Единый источник данных для всего дашборда

// Типы занятости
export type EmploymentType = 'office' | 'remote' | 'hybrid' | 'project' | 'vacant'

// Сотрудник
export interface Employee {
  name: string
  role: string
  type?: EmploymentType
}

// Команда (для отдела Китая)
export interface Team {
  id: string
  name: string
  lead: Employee
  members: Employee[]
}

// Отдел
export interface Department {
  id: string
  name: string
  shortName: string
  color: string
  borderColor: string
  head?: Employee
  teams?: Team[]
  employees?: Employee[]
  status: 'green' | 'yellow' | 'red'
  focus?: string
  problems?: string[]
  kpis?: { name: string; value: string; target: string }[]
}

// Руководство
export const leadership = {
  ceo: [
    { name: 'Рэшад Бакиров', role: 'CEO/COO' },
    { name: 'Игорь Богатиков', role: 'CEO/CFO' },
  ],
  cLevel: [
    { name: 'Камилла Каюмова', role: 'COO (Операционный директор)', area: 'Операции, HR, Китай, ВЭД, Развитие' },
    { name: 'Виктория Бакирова', role: 'CCO (Коммерческий директор)', area: 'Продажи' },
  ],
  coo: { name: 'Камилла Каюмова', role: 'COO (Операционный директор)' },
  cco: { name: 'Виктория Бакирова', role: 'CCO (Коммерческий директор)' },
}

// Все отделы компании
export const departments: Department[] = [
  {
    id: 'china',
    name: 'Департамент по работе с Китаем',
    shortName: 'Отдел Китая',
    color: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    status: 'yellow',
    focus: 'Сократить время просчёта с 5 до 3 дней',
    problems: ['5 дней на просчёт (цель: 3 дня)', 'Разница во времени с Китаем'],
    kpis: [
      { name: 'Время просчёта', value: '5 дней', target: '3 дня' },
      { name: 'Брак', value: '—', target: '≤1%' },
    ],
    teams: [
      {
        id: 'china-1',
        name: 'Группа Артёма',
        lead: { name: 'Артём Василевский', role: 'Руководитель группы' },
        members: [
          { name: 'Светлана Литяк', role: 'Менеджер по проектам' },
          { name: 'Киселёва Екатерина', role: 'Менеджер по закупкам' },
          { name: 'Алёна Бицоева', role: 'Менеджер по закупкам' },
        ],
      },
      {
        id: 'china-2',
        name: 'Группа Евгения',
        lead: { name: 'Евгений Косицын', role: 'Руководитель группы' },
        members: [
          { name: 'Фёдор Богдан', role: 'Менеджер по закупкам' },
          { name: 'Екатерина Казакова', role: 'Менеджер по закупкам' },
          { name: 'Виктория Багандова', role: 'Менеджер по закупкам' },
          { name: 'Мария Гуляева', role: 'Менеджер по проектам' },
        ],
      },
      {
        id: 'china-3',
        name: 'Группа Александры',
        lead: { name: 'Александра Комардина', role: 'Руководитель группы' },
        members: [
          { name: 'Дарья Попова', role: 'Менеджер по закупкам' },
          { name: 'Анастасия Тищук', role: 'Менеджер по проектам' },
        ],
      },
      {
        id: 'china-4',
        name: 'Группа Насти А.',
        lead: { name: 'Анастасия Андрианова', role: 'Руководитель группы' },
        members: [
          { name: 'Светлана Червоненко', role: 'Менеджер по проектам' },
          { name: 'Елена Прокопова (Ли)', role: 'Менеджер по закупкам' },
          { name: 'Эмина Арина', role: 'Менеджер по закупкам' },
          { name: 'Чаплыгина Анастасия', role: 'Менеджер по закупкам' },
        ],
      },
      {
        id: 'china-5',
        name: 'Группа Юлии',
        lead: { name: 'Юлия Лелик', role: 'Руководитель группы' },
        members: [
          { name: 'Анастасия Олина', role: 'Менеджер по закупкам' },
          { name: 'Марина Иванова', role: 'Менеджер по закупкам' },
        ],
      },
      {
        id: 'china-6',
        name: 'Группа Сергея',
        lead: { name: 'Сергей Кумашев', role: 'Руководитель группы (старт 26 января)' },
        members: [
          { name: 'VACANT', role: '+1 позиция', type: 'vacant' },
        ],
      },
    ],
  },
  {
    id: 'dev-projects',
    name: 'Отдел развития и спец. проектов',
    shortName: 'Развитие',
    color: 'bg-orange-500/20',
    borderColor: 'border-orange-500/50',
    status: 'green',
    head: { name: 'Анастасия Мирскова', role: 'Руководитель команды' },
    employees: [
      { name: 'Анастасия Мирскова', role: 'Руководитель команды' },
      { name: 'Макарова Екатерина', role: 'Менеджер по проектам' },
    ],
  },
  {
    id: 'sales',
    name: 'Департамент продаж',
    shortName: 'Продажи',
    color: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    status: 'yellow',
    focus: 'Найти РОПа, снизить операционную нагрузку',
    problems: ['70% времени на операционку', 'Нет РОПа'],
    kpis: [
      { name: 'Выручка', value: '—', target: '1,5 млрд' },
      { name: 'Время КП', value: '5 дней', target: '3 дня' },
    ],
    head: { name: 'VACANT', role: 'Руководитель отдела продаж (РОП)', type: 'vacant' as EmploymentType },
    employees: [
      { name: 'VACANT', role: 'Руководитель отдела продаж (РОП)', type: 'vacant' as EmploymentType },
      { name: 'Наталья Лактистова', role: 'Менеджер по продажам' },
      { name: 'Полина Коник', role: 'Менеджер по продажам' },
      { name: 'Алина Титова', role: 'Менеджер по продажам' },
      { name: 'Ирина Ветера', role: 'Менеджер по продажам' },
      { name: 'Елизавета Барабаш', role: 'Ассистент' },
      { name: 'Максим Можкин', role: 'Менеджер по продажам' },
      { name: 'Олег Михайлов', role: 'Ассистент/Аккаунт менеджер' },
      { name: 'Сизиков Тимур', role: 'Менеджер по продажам' },
      { name: 'Диёр Дадаев', role: 'Менеджер по продажам' },
    ],
  },
  {
    id: 'logistics',
    name: 'Логистика',
    shortName: 'Логистика',
    color: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    status: 'green',
    head: { name: 'Александр Сергеенко', role: 'Руководитель команды' },
    employees: [
      { name: 'Александр Сергеенко', role: 'Руководитель команды' },
    ],
  },
  {
    id: 'ved',
    name: 'ВЭД',
    shortName: 'ВЭД',
    color: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    status: 'green',
    head: { name: 'Павел Хохлов', role: 'Руководитель ВЭД' },
    employees: [
      { name: 'Павел Хохлов', role: 'Руководитель ВЭД' },
      { name: 'Галимов Флорид', role: 'Менеджер ВЭД' },
    ],
  },
  {
    id: 'marketing',
    name: 'Маркетинг',
    shortName: 'Маркетинг',
    color: 'bg-pink-500/20',
    borderColor: 'border-pink-500/50',
    status: 'green',
    head: { name: 'Константин Макаров', role: 'CMO - Москва' },
    employees: [
      { name: 'Константин Макаров', role: 'CMO - Москва' },
      { name: 'Екатерина Каменкова', role: 'Ассистент' },
      { name: 'Екатерина Гущан', role: 'Дизайнер' },
      { name: 'Максим Соколов', role: 'Рилсмейкер' },
      { name: 'VACANT', role: 'Контент тимлид', type: 'vacant' },
    ],
  },
  {
    id: 'uae',
    name: 'UAE Department',
    shortName: 'Дубай',
    color: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/50',
    status: 'green',
    head: { name: 'Никита Жирнов', role: 'CMO/COO Dubai' },
    employees: [
      { name: 'Никита Жирнов', role: 'CMO/COO Dubai' },
      { name: 'Кристина Воронецкая', role: 'Sales Dubai' },
    ],
  },
  {
    id: 'hr',
    name: 'HR Department',
    shortName: 'HR',
    color: 'bg-rose-500/20',
    borderColor: 'border-rose-500/50',
    status: 'red',
    focus: 'Создать HR-систему с нуля для масштабирования бизнеса',
    problems: [
      'Руководители неэффективно управляют командами',
      'Нет матрицы компетенций (кроме ОК)',
      'Нет цикла оценки сотрудников',
      'Нет кадрового резерва',
      'Корпоративная культура отсутствует',
      'Нет системы обучения',
    ],
    kpis: [
      { name: 'Матрица компетенций', value: '1/10', target: '10/10' },
      { name: 'Оценка персонала', value: 'Нет', target: '360°' },
    ],
    head: { name: 'Людковский Пётр', role: 'HR менеджер' },
    employees: [
      { name: 'Людковский Пётр', role: 'HR менеджер' },
      { name: 'VACANT', role: 'HR-бизнес-партнер (HRBP)', type: 'vacant' },
    ],
  },
  {
    id: 'backoffice',
    name: 'Back Office',
    shortName: 'Бэк-офис',
    color: 'bg-gray-500/20',
    borderColor: 'border-gray-500/50',
    status: 'green',
    employees: [
      { name: 'Анастасия Василевская', role: 'Администратор' },
      { name: 'Косенкова Наталья', role: 'Главный бухгалтер' },
      { name: 'Ольга Муравьёва', role: 'Офис-менеджер' },
      { name: 'Клининг', role: 'Клининг', type: 'project' },
    ],
  },
  {
    id: 'it',
    name: 'AI & CRM Engineering',
    shortName: 'IT',
    color: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/50',
    status: 'green',
    employees: [
      { name: 'Евгений Якубин', role: 'Planfix engineer' },
    ],
  },
]

// Статистика по компании
export const companyStats = {
  office: 34,
  remote: 10,
  hybrid: 5,
  project: 1,
  vacant: 5,
  total: 49,
}

// Хелпер для подсчёта сотрудников в отделе
export function getDepartmentEmployeeCount(dept: Department): number {
  if (dept.teams) {
    return dept.teams.reduce((sum, team) => sum + team.members.length + 1, 0)
  }
  return dept.employees?.length || 0
}

// Хелпер для получения руководителя отдела
export function getDepartmentHead(dept: Department): string {
  if (dept.head) return dept.head.name
  if (dept.teams && dept.teams.length > 0) {
    return dept.teams.map(t => t.lead.name).join(', ')
  }
  if (dept.employees && dept.employees.length > 0) {
    return dept.employees[0].name
  }
  return '—'
}

// Люди для 1:1 встреч (руководители + ключевые сотрудники)
export const oneOnOnePeople = [
  // Руководители групп Китая
  { name: 'Артём Василевский', role: 'РГ Китай - Группа 1', department: 'china', frequency: 'Еженедельно' },
  { name: 'Евгений Косицын', role: 'РГ Китай - Группа 2', department: 'china', frequency: 'Еженедельно' },
  { name: 'Александра Комардина', role: 'РГ Китай - Группа 3', department: 'china', frequency: 'Еженедельно' },
  { name: 'Анастасия Андрианова', role: 'РГ Китай - Группа 4', department: 'china', frequency: 'Еженедельно' },
  { name: 'Юлия Лелик', role: 'РГ Китай - Группа 5', department: 'china', frequency: 'Еженедельно' },
  { name: 'Сергей Кумашев', role: 'РГ Китай - Группа 6 (с 26 января)', department: 'china', frequency: 'Еженедельно' },
  
  // Руководители других отделов
  { name: 'Анастасия Мирскова', role: 'Руководитель развития', department: 'dev-projects', frequency: '2 раза в месяц' },
  { name: 'Виктория Бакирова', role: 'CCO (Коммерческий директор)', department: 'cco', frequency: 'Еженедельно' },
  { name: 'Александр Сергеенко', role: 'Руководитель логистики', department: 'logistics', frequency: '2 раза в месяц' },
  { name: 'Павел Хохлов', role: 'Руководитель ВЭД', department: 'ved', frequency: '2 раза в месяц' },
  { name: 'Константин Макаров', role: 'CMO Москва', department: 'marketing', frequency: '2 раза в месяц' },
  { name: 'Никита Жирнов', role: 'CMO/COO Dubai', department: 'uae', frequency: 'Еженедельно' },
  { name: 'Евгений Якубин', role: 'IT/Planfix', department: 'it', frequency: '2 раза в месяц' },
  { name: 'Людковский Пётр', role: 'HR менеджер', department: 'hr', frequency: 'Еженедельно' },
  
  // CEO
  { name: 'Рэшад Бакиров', role: 'CEO/COO', department: 'ceo', frequency: 'Еженедельно' },
  { name: 'Игорь Богатиков', role: 'CEO/CFO', department: 'ceo', frequency: 'Еженедельно' },
]

// Стратегические инициативы
export const strategicInitiatives = [
  {
    id: 'operations',
    name: 'Оптимизация операционных процессов',
    goal: 'Снизить операционную нагрузку продажников с 70% до 40-50%',
    status: 'yellow' as const,
    owner: 'Камилла Каюмова',
    stages: [
      { name: 'Ускорение просчётов (5→3 дня)', status: 'in_progress' },
      { name: 'Автоматизация договоров', status: 'pending' },
      { name: 'Умные уведомления', status: 'pending' },
      { name: 'Подробные чек-листы', status: 'pending' },
    ],
  },
  {
    id: 'hr-system',
    name: 'Создание HR-системы с нуля',
    goal: 'Обеспечить готовность команды к масштабированию бизнеса',
    status: 'red' as const,
    owner: 'Камилла Каюмова + HR',
    stages: [
      { name: 'Найм HRBP', status: 'in_progress' },
      { name: 'Повышение управленческой эффективности', status: 'pending' },
      { name: 'Кадровый резерв и планы замены', status: 'pending' },
      { name: 'Формирование корп. культуры', status: 'pending' },
      { name: 'Матрица компетенций (все отделы)', status: 'in_progress' },
      { name: 'Цикл оценки персонала (360°/пульс)', status: 'pending' },
      { name: 'Система обучения и развития', status: 'pending' },
      { name: 'Управление конфликтами и коммуникациями', status: 'pending' },
    ],
    blockers: ['Нужен HRBP'],
  },
  {
    id: 'culture',
    name: 'Трансформация культуры продаж',
    goal: 'Перейти от реактивных продаж к проактивным',
    status: 'red' as const,
    owner: 'Камилла Каюмова + будущий РОП',
    blockers: ['Нужен РОП', 'Отложено до решения операционных проблем'],
  },
  {
    id: 'rop',
    name: 'Найм руководителя отдела продаж',
    goal: 'Найти РОПа, который построит систему продаж',
    status: 'yellow' as const,
    owner: 'Камилла Каюмова + Людковский Пётр',
  },
  {
    id: 'hrbp',
    name: 'Найм HR-бизнес-партнёра',
    goal: 'Найти HRBP для построения HR-системы',
    status: 'in_progress' as const,
    owner: 'Камилла Каюмова + Людковский Пётр',
    stages: [
      { name: 'Вакансия опубликована на HH', status: 'done' },
      { name: 'Отбор кандидатов', status: 'in_progress' },
      { name: 'Интервью', status: 'pending' },
      { name: 'Оффер', status: 'pending' },
    ],
  },
  {
    id: 'finplan',
    name: 'Финансовое планирование 2026',
    goal: 'Рост x2, выручка 1,5 млрд руб.',
    status: 'yellow' as const,
    owner: 'Камилла Каюмова + Косенкова Наталья + CEO',
  },
]

// Ключевые проблемы
export const keyProblems = [
  // Операционные
  {
    id: 'ops-load',
    title: '70% времени продажников на операционку',
    impact: 'high' as const,
    status: 'in_progress' as const,
    owner: 'Камилла Каюмова',
    category: 'operations',
  },
  {
    id: 'kp-time',
    title: '5 дней на просчёт от отдела Китая',
    impact: 'high' as const,
    status: 'in_progress' as const,
    owner: 'Камилла Каюмова + РГ Китая',
    category: 'operations',
  },
  {
    id: 'no-rop',
    title: 'Нет руководителя отдела продаж',
    impact: 'high' as const,
    status: 'open' as const,
    owner: 'Камилла Каюмова + HR',
    category: 'hiring',
  },
  {
    id: 'culture',
    title: 'Отсутствие культуры проактивных продаж',
    impact: 'high' as const,
    status: 'open' as const,
    owner: 'Камилла Каюмова + будущий РОП',
    category: 'culture',
  },
  // HR проблемы
  {
    id: 'hr-managers',
    title: 'Руководители неэффективно управляют командами',
    impact: 'high' as const,
    status: 'open' as const,
    owner: 'HR + Камилла Каюмова',
    category: 'hr',
  },
  {
    id: 'hr-reserve',
    title: 'Нет кадрового резерва и планов замены',
    impact: 'high' as const,
    status: 'open' as const,
    owner: 'HR',
    category: 'hr',
  },
  {
    id: 'hr-culture',
    title: 'Корпоративная культура отсутствует',
    impact: 'high' as const,
    status: 'open' as const,
    owner: 'HR + Камилла Каюмова',
    category: 'hr',
  },
  {
    id: 'hr-competency',
    title: 'Нет матрицы компетенций (кроме ОК)',
    impact: 'medium' as const,
    status: 'in_progress' as const,
    owner: 'Камилла Каюмова',
    category: 'hr',
  },
  {
    id: 'hr-assessment',
    title: 'Нет цикла оценки сотрудников',
    impact: 'medium' as const,
    status: 'open' as const,
    owner: 'HR',
    category: 'hr',
  },
  {
    id: 'hr-training',
    title: 'Нет системы обучения и развития',
    impact: 'medium' as const,
    status: 'open' as const,
    owner: 'HR',
    category: 'hr',
  },
  {
    id: 'hr-conflicts',
    title: 'Нет системы управления конфликтами',
    impact: 'medium' as const,
    status: 'open' as const,
    owner: 'HR',
    category: 'hr',
  },
  {
    id: 'hr-motivation',
    title: 'Нет матрицы мотиваций',
    impact: 'medium' as const,
    status: 'open' as const,
    owner: 'HR',
    category: 'hr',
  },
]

// Фокус на квартал
export const quarterFocus = {
  quarter: 'Q1 2026',
  priorities: [
    'Рост выручки в 2 раза → 1,5 млрд руб.',
    'Маржинальность 30%',
    'КП за 3 дня (сейчас 5 дней)',
    'NPS 75+, Брак ≤1%',
  ],
}

// ===== ФИНАНСОВЫЕ МЕТРИКИ COO =====

// Типы для финансовых данных
export interface FinancialPeriod {
  period: string // "2026-01" для месяца, "2026-Q1" для квартала, "2026" для года
  type: 'month' | 'quarter' | 'year'
  // Выручка
  revenueStarted: number    // По запущенным проектам
  revenueClosed: number     // По закрытым проектам
  // Маржинальность
  marginClosed: number      // % по закрытым проектам
  // Производительность
  projectsSum: number       // Сумма запущенных проектов
  fot: number               // ФОТ (ЗП + ДМС + расходы отделов)
  productivity?: number     // = projectsSum / fot (вычисляется)
}

// Начальные данные (редактируемые)
export const initialFinancials: FinancialPeriod[] = [
  // Январь 2026
  {
    period: '2026-01',
    type: 'month',
    revenueStarted: 0,
    revenueClosed: 0,
    marginClosed: 0,
    projectsSum: 0,
    fot: 0,
  },
]

// HR цели на год
export const hrGoals = {
  mainGoal: 'Обеспечить готовность команды к масштабированию бизнеса через создание работающей HR-системы (с нуля)',
  year1Goals: [
    'Повысить управленческую эффективность',
    'Сформировать кадровый резерв и планы замены для всех ключевых позиций',
    'Сформировать корпоративную культуру, соответствующую бизнес целям компании',
    'Внедрить матрицу компетенций для всех подразделений',
    'Запустить цикл оценки персонала (пульс/360)',
    'Построить систему обучения и развития',
    'Выстроить управление конфликтами и коммуникациями',
  ],
  vacancies: [
    {
      title: 'HR-бизнес-партнёр (HRBP)',
      url: 'https://hh.ru/vacancy/129463745',
      status: 'active',
      publishedDate: '2026-01-15',
    },
  ],
}

