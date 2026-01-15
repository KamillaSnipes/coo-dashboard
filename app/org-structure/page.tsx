'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Users, Building2, MapPin, User } from 'lucide-react'
import Card from '@/components/Card'

interface Employee {
  name: string
  role: string
  type?: 'office' | 'remote' | 'hybrid' | 'project' | 'vacant'
}

interface Team {
  id: string
  name: string
  lead?: Employee
  members: Employee[]
  color: string
}

interface Department {
  id: string
  name: string
  color: string
  teams?: Team[]
  employees?: Employee[]
}

// Организационная структура
const ceoLevel = [
  { name: 'Рэшад Бакиров', role: 'CEO/COO' },
  { name: 'Игорь Богатиков', role: 'CEO/CFO' },
]

const cooLevel = { name: 'Камилла Каюмова', role: 'COO (Операционный директор)' }

const departments: Department[] = [
  {
    id: 'china',
    name: 'Департамент по работе с Китаем',
    color: 'bg-yellow-500/20 border-yellow-500/50',
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
        color: 'bg-yellow-400/10',
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
        color: 'bg-yellow-400/10',
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
        color: 'bg-yellow-400/10',
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
        color: 'bg-yellow-400/10',
      },
      {
        id: 'china-5',
        name: 'Группа 5',
        lead: { name: 'Юлия Лелик', role: 'Руководитель группы' },
        members: [
          { name: 'Алёна Бицоева', role: 'Менеджер по закупкам' },
          { name: 'VACANT', role: '+1 позиция', type: 'vacant' },
        ],
        color: 'bg-yellow-400/10',
      },
      {
        id: 'china-6',
        name: 'Группа 6',
        lead: { name: 'Сергей Кумашев', role: 'Руководитель группы (старт 26 января)' },
        members: [
          { name: 'VACANT', role: '+1 позиция', type: 'vacant' },
        ],
        color: 'bg-yellow-400/10',
      },
    ],
  },
  {
    id: 'dev-projects',
    name: 'Отдел развития и спец. проектов',
    color: 'bg-orange-500/20 border-orange-500/50',
    employees: [
      { name: 'Анастасия Мирскова', role: 'Руководитель команды' },
      { name: 'Макарова Екатерина', role: 'Менеджер по проектам' },
    ],
  },
  {
    id: 'sales',
    name: 'Департамент продаж',
    color: 'bg-green-500/20 border-green-500/50',
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
    color: 'bg-blue-500/20 border-blue-500/50',
    employees: [
      { name: 'Александр Сергеенко', role: 'Руководитель команды' },
    ],
  },
  {
    id: 'ved',
    name: 'ВЭД',
    color: 'bg-purple-500/20 border-purple-500/50',
    employees: [
      { name: 'Павел Хохлов', role: 'Руководитель ВЭД' },
      { name: 'Галимов Флорид', role: 'Менеджер ВЭД' },
    ],
  },
  {
    id: 'marketing',
    name: 'Маркетинг',
    color: 'bg-pink-500/20 border-pink-500/50',
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
    color: 'bg-cyan-500/20 border-cyan-500/50',
    employees: [
      { name: 'Никита Жирнов', role: 'CMO/COO Dubai' },
      { name: 'Кристина Воронецкая', role: 'Sales Dubai' },
    ],
  },
  {
    id: 'backoffice',
    name: 'Back Office',
    color: 'bg-gray-500/20 border-gray-500/50',
    employees: [
      { name: 'Анастасия Василевская', role: 'Администратор' },
      { name: 'Людковский Пётр', role: 'HR менеджер' },
      { name: 'Косенкова Наталья', role: 'Главный бухгалтер' },
      { name: 'Ольга Муравьёва', role: 'Офис-менеджер' },
      { name: 'Клининг', role: 'Клининг' },
      { name: 'VACANT?', role: 'Позиция', type: 'vacant' },
    ],
  },
  {
    id: 'it',
    name: 'AI & CRM Engineering',
    color: 'bg-indigo-500/20 border-indigo-500/50',
    employees: [
      { name: 'Евгений Якубин', role: 'Planfix engineer' },
    ],
  },
]

// Статистика
const stats = {
  office: 34,
  remote: 10,
  hybrid: 5,
  project: 1,
  vacant: 5,
  total: 49,
}

function EmployeeCard({ employee, small = false }: { employee: Employee; small?: boolean }) {
  const isVacant = employee.type === 'vacant' || employee.name.includes('VACANT')
  
  return (
    <div className={`${small ? 'p-2' : 'p-3'} rounded-lg ${
      isVacant 
        ? 'bg-dark-600 border border-dashed border-dark-500' 
        : 'bg-dark-700/50'
    }`}>
      <div className={`font-medium ${small ? 'text-sm' : ''} ${isVacant ? 'text-dark-400' : ''}`}>
        {employee.name}
      </div>
      <div className={`text-dark-400 ${small ? 'text-xs' : 'text-sm'}`}>
        {employee.role}
      </div>
    </div>
  )
}

function DepartmentCard({ dept, isExpanded, onToggle }: { 
  dept: Department
  isExpanded: boolean
  onToggle: () => void 
}) {
  const totalEmployees = dept.teams 
    ? dept.teams.reduce((sum, team) => sum + team.members.length + 1, 0)
    : (dept.employees?.length || 0)

  return (
    <div className={`rounded-xl border ${dept.color} overflow-hidden`}>
      <div 
        className="p-4 cursor-pointer hover:bg-dark-700/30 transition-colors flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-dark-400" />
          <div>
            <h3 className="font-semibold">{dept.name}</h3>
            <p className="text-dark-400 text-sm">{totalEmployees} чел.</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {dept.teams ? (
            // Отображение команд (для Отдела Китая)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dept.teams.map((team) => (
                <div key={team.id} className={`${team.color} rounded-lg p-4`}>
                  <div className="font-medium text-primary-400 mb-2">{team.name}</div>
                  {team.lead && (
                    <div className="mb-3">
                      <EmployeeCard employee={team.lead} />
                    </div>
                  )}
                  <div className="space-y-2">
                    {team.members.map((member, i) => (
                      <EmployeeCard key={i} employee={member} small />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Обычное отображение сотрудников
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {dept.employees?.map((employee, i) => (
                <EmployeeCard key={i} employee={employee} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function OrgStructurePage() {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['china']))

  const toggleDept = (id: string) => {
    const newExpanded = new Set(expandedDepts)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedDepts(newExpanded)
  }

  const expandAll = () => {
    setExpandedDepts(new Set(departments.map(d => d.id)))
  }

  const collapseAll = () => {
    setExpandedDepts(new Set())
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Организационная структура</h1>
          <p className="text-dark-400 mt-2">Headcorn / Megamind • {stats.total} сотрудников</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors text-sm"
          >
            Развернуть всё
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors text-sm"
          >
            Свернуть
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-400">{stats.office}</div>
          <div className="text-sm text-dark-400">Офис</div>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.remote}</div>
          <div className="text-sm text-dark-400">Удалённо</div>
        </div>
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.hybrid}</div>
          <div className="text-sm text-dark-400">Гибрид</div>
        </div>
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-orange-400">{stats.project}</div>
          <div className="text-sm text-dark-400">Проектная</div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-red-400">{stats.vacant}+</div>
          <div className="text-sm text-dark-400">Вакансии</div>
        </div>
        <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl text-center">
          <div className="text-2xl font-bold text-primary-400">{stats.total}</div>
          <div className="text-sm text-dark-400">Всего</div>
        </div>
      </div>

      {/* Top Management */}
      <Card title="🏛️ Руководство">
        <div className="flex flex-col items-center gap-6">
          {/* CEO Level */}
          <div className="flex gap-6">
            {ceoLevel.map((person, i) => (
              <div key={i} className="bg-primary-500/20 border border-primary-500/50 rounded-xl p-4 text-center min-w-[200px]">
                <div className="font-bold text-lg">{person.name}</div>
                <div className="text-primary-400 text-sm">{person.role}</div>
              </div>
            ))}
          </div>

          <div className="w-px h-8 bg-dark-600"></div>

          {/* COO Level */}
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center min-w-[250px]">
            <div className="font-bold text-lg">{cooLevel.name}</div>
            <div className="text-green-400 text-sm">{cooLevel.role}</div>
          </div>

          <div className="w-px h-8 bg-dark-600"></div>

          {/* Departments indicator */}
          <div className="text-dark-400 text-sm">↓ Подразделения</div>
        </div>
      </Card>

      {/* Departments */}
      <div className="space-y-4">
        {departments.map((dept) => (
          <DepartmentCard
            key={dept.id}
            dept={dept}
            isExpanded={expandedDepts.has(dept.id)}
            onToggle={() => toggleDept(dept.id)}
          />
        ))}
      </div>

      {/* Legend */}
      <Card title="📋 Легенда">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/30"></div>
            <span className="text-sm">Офис</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/30"></div>
            <span className="text-sm">Дистанционно</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500/30"></div>
            <span className="text-sm">Гибрид</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500/30"></div>
            <span className="text-sm">Проектная занятость</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-dashed border-dark-500"></div>
            <span className="text-sm">Вакансия</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

