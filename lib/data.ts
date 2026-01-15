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
  coo: { name: 'Камилла Каюмова', role: 'COO (Операционный директор)' },
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
        name: 'Группа 1',
        lead: { name: 'Артём Василевский', role: 'Руководитель группы' },
        members: [
          { name: 'Светлана Литяк', role: 'Менеджер по проектам' },
          { name: 'Елена Прокопова (Ли)', role: 'Менеджер по закупкам' },
          { name: 'Светлана Червоненко', role: 'Менеджер по проектам' },
          { name: 'Эмина Арина', role: 'Менеджер по закупкам' },
        ],
      },
      {
        id: 'china-2',
        name: 'Группа 2',
        lead: { name: 'Евгений Косицын', role: 'Руководитель группы' },
        members: [
          { name: 'Мария Гуляева', role: 'Менеджер по проектам' },
          { name: 'Екатерина Казакова', role: 'Менеджер по закупкам' },
          { name: 'Фёдор Богдан', role: 'Менеджер по закупкам' },
          { name: 'Виктория Багандова', role: 'Менеджер по закупкам' },
          { name: 'Дарья Попова', role: 'Менеджер по закупкам' },
        ],
      },
      {
        id: 'china-3',
        name: 'Группа 3',
        lead: { name: 'Александра Комардина', role: 'Руководитель группы' },
        members: [
          { name: 'Анастасия Тищук', role: 'Менеджер по проектам' },
          { name: 'Анастасия Олина', role: 'Менеджер по закупкам' },
          { name: 'Марина Иванова', role: 'Менеджер по закупкам' },
        ],
      },
      {
        id: 'china-4',
        name: 'Группа 4',
        lead: { name: 'Анастасия Андрианова', role: 'Руководитель группы' },
        members: [
          { name: 'Киселёва Екатерина', role: 'Менеджер по закупкам' },
          { name: 'Екатерина Волкова', role: 'Ассистент' },
          { name: 'Чаплыгина Анастасия', role: 'Менеджер по закупкам' },
        ],
      },
      {
        id: 'china-5',
        name: 'Группа 5',
        lead: { name: 'Юлия Лелик', role: 'Руководитель группы' },
        members: [
          { name: 'Алёна Бицоева', role: 'Менеджер по закупкам' },
          { name: 'VACANT', role: '+1 позиция', type: 'vacant' },
        ],
      },
      {
        id: 'china-6',
        name: 'Группа 6',
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
    head: { name: 'Виктория Бакирова', role: 'Руководитель команды' },
    employees: [
      { name: 'Виктория Бакирова', role: 'Руководитель команды' },
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
    id: 'backoffice',
    name: 'Back Office',
    shortName: 'Бэк-офис',
    color: 'bg-gray-500/20',
    borderColor: 'border-gray-500/50',
    status: 'green',
    employees: [
      { name: 'Анастасия Василевская', role: 'Администратор' },
      { name: 'Людковский Пётр', role: 'HR менеджер' },
      { name: 'Косенкова Наталья', role: 'Главный бухгалтер' },
      { name: 'Ольга Муравьёва', role: 'Офис-менеджер' },
      { name: 'Клининг', role: 'Клининг', type: 'project' },
      { name: 'VACANT?', role: 'Позиция', type: 'vacant' },
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
  { name: 'Виктория Бакирова', role: 'Руководитель продаж', department: 'sales', frequency: 'Еженедельно' },
  { name: 'Александр Сергеенко', role: 'Руководитель логистики', department: 'logistics', frequency: '2 раза в месяц' },
  { name: 'Павел Хохлов', role: 'Руководитель ВЭД', department: 'ved', frequency: '2 раза в месяц' },
  { name: 'Константин Макаров', role: 'CMO Москва', department: 'marketing', frequency: '2 раза в месяц' },
  { name: 'Никита Жирнов', role: 'CMO/COO Dubai', department: 'uae', frequency: 'Еженедельно' },
  { name: 'Евгений Якубин', role: 'IT/Planfix', department: 'it', frequency: '2 раза в месяц' },
  { name: 'Людковский Пётр', role: 'HR', department: 'backoffice', frequency: '2 раза в месяц' },
  
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
    id: 'finplan',
    name: 'Финансовое планирование 2026',
    goal: 'Рост x2, выручка 1,5 млрд руб.',
    status: 'yellow' as const,
    owner: 'Камилла Каюмова + Косенкова Наталья + CEO',
  },
]

// Ключевые проблемы
export const keyProblems = [
  {
    id: 'ops-load',
    title: '70% времени продажников на операционку',
    impact: 'high' as const,
    status: 'in_progress' as const,
    owner: 'Камилла Каюмова',
  },
  {
    id: 'kp-time',
    title: '5 дней на просчёт от отдела Китая',
    impact: 'high' as const,
    status: 'in_progress' as const,
    owner: 'Камилла Каюмова + РГ Китая',
  },
  {
    id: 'no-rop',
    title: 'Нет руководителя отдела продаж',
    impact: 'high' as const,
    status: 'open' as const,
    owner: 'Камилла Каюмова + HR',
  },
  {
    id: 'culture',
    title: 'Отсутствие культуры проактивных продаж',
    impact: 'high' as const,
    status: 'open' as const,
    owner: 'Камилла Каюмова + будущий РОП',
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

