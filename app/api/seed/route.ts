import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST seed initial data
export async function POST() {
  try {
    // Check if data already exists
    const existingDepts = await prisma.department.count()
    if (existingDepts > 0) {
      return NextResponse.json({ message: 'Data already seeded' })
    }

    // Seed departments
    await prisma.department.createMany({
      data: [
        { name: 'Отдел продаж (Москва)', lead: 'Ищем РОПа', employees: 8, status: 'yellow', problems: ['70% времени на операционку', 'Нет РОПа'] },
        { name: 'Отдел продаж (Дубай)', employees: 2, status: 'green' },
        { name: 'Отдел Китая (Закупки)', employees: 20, status: 'green', problems: ['Долгие просчеты', 'Разница во времени'] },
        { name: 'ВЭД (Логистика)', employees: 2, status: 'green' },
        { name: 'Маркетинг', status: 'green' },
        { name: 'IT', employees: 1, status: 'green' },
      ]
    })

    // Seed people for 1:1
    await prisma.person.createMany({
      data: [
        { role: 'Руководитель отдела Китая', frequency: 'Еженедельно' },
        { role: 'Руководитель ВЭД', frequency: '2 раза в месяц' },
        { role: 'Руководитель маркетинга', frequency: '2 раза в месяц' },
        { role: 'IT', frequency: '2 раза в месяц' },
        { role: 'Руководитель Дубай', frequency: 'Еженедельно' },
        { name: 'CEO 1', role: 'CEO', frequency: 'Еженедельно' },
        { name: 'CEO 2', role: 'CEO', frequency: 'Еженедельно' },
      ]
    })

    // Seed initiatives
    await prisma.initiative.createMany({
      data: [
        {
          name: 'Оптимизация операционных процессов',
          goal: 'Снизить операционную нагрузку продажников с 70% до 40-50%',
          status: 'yellow',
          owner: 'COO',
          stages: [
            { id: 1, name: 'Ускорение просчетов (5→3 дня)', status: 'in_progress' },
            { id: 2, name: 'Автоматизация договоров', status: 'pending' },
            { id: 3, name: 'Умные уведомления', status: 'pending' },
            { id: 4, name: 'Подробные чек-листы', status: 'pending' },
          ]
        },
        {
          name: 'Трансформация культуры и компетенций',
          goal: 'Перейти от реактивных продаж к проактивным',
          status: 'red',
          owner: 'COO + HR',
          blockers: ['Нужен РОП', 'Отложено до решения операционных проблем'],
          nextStep: 'Вернуться после решения операционных проблем'
        },
        {
          name: 'Найм руководителя отдела продаж (РОП)',
          goal: 'Найти РОПа, который построит систему продаж',
          status: 'yellow',
          owner: 'COO + Рекрутер'
        },
        {
          name: 'Финансовое планирование 2026',
          goal: 'Подготовить финплан на 2026 год',
          status: 'yellow',
          owner: 'COO + Бухгалтер + CEO'
        }
      ]
    })

    // Seed problems
    await prisma.problem.createMany({
      data: [
        {
          title: '70% времени продажников на операционку',
          description: 'Менеджеры по продажам тратят 70% рабочего времени на операционную работу вместо продаж',
          impact: 'high',
          status: 'in_progress',
          rootCause: [
            'Отсутствие разделения ролей (но разделение невозможно в отрасли)',
            'Долгий цикл просчета (5 дней)',
            'Ручное формирование договоров'
          ],
          plan: [
            { task: 'Ускорить просчеты (5→3 дня)', done: false },
            { task: 'Автоматизировать договоры', done: false },
            { task: 'Настроить умные уведомления', done: false }
          ],
          owner: 'COO'
        },
        {
          title: '5 дней на просчет от отдела Китая',
          description: 'Среднее время подготовки просчета — 5 дней, цель — 3 дня',
          impact: 'high',
          status: 'in_progress',
          rootCause: ['Разница во времени Москва-Китай', 'Нет типизации запросов', 'Нет SLA'],
          owner: 'COO + Руководители отдела Китая'
        },
        {
          title: 'Отсутствие культуры проактивных продаж',
          description: 'Менеджеры работают реактивно, не генерируют идеи',
          impact: 'high',
          status: 'open',
          rootCause: ['Отсутствие системы компетенций', 'Менеджеры не умеют работать с ИИ-инструментами'],
          owner: 'COO + будущий РОП'
        }
      ]
    })

    return NextResponse.json({ message: 'Data seeded successfully' })
  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}

