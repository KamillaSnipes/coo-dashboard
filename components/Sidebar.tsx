'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Rocket, 
  Calendar, 
  AlertTriangle,
  Settings,
  Network,
  BarChart3,
  UserCog,
  Target,
  FileText,
  Briefcase,
  CalendarDays
} from 'lucide-react'

const navigation = [
  { name: 'Главный дашборд', href: '/', icon: LayoutDashboard },
  { name: 'Мои KPI & OKR', href: '/my-okr', icon: Target },
  { name: 'Финансы COO', href: '/financials', icon: BarChart3 },
  { name: 'Оргструктура', href: '/org-structure', icon: Network },
  { name: 'Отделы', href: '/departments', icon: Building2 },
  { name: 'Клиенты', href: '/clients', icon: Briefcase },
  { name: 'Выставки 2026', href: '/events', icon: CalendarDays },
  { name: '1:1 Встречи', href: '/one-on-one', icon: Users },
  { name: 'Стратегия', href: '/initiatives', icon: Rocket },
  { name: 'Неделя', href: '/weekly', icon: Calendar },
  { name: 'Проблемы', href: '/problems', icon: AlertTriangle },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-900 border-r border-dark-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <h1 className="text-xl font-bold gradient-text">COO Dashboard</h1>
        <p className="text-sm text-dark-400 mt-1">Headcorn / Megamind</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-primary-600 text-white' 
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center gap-3 px-4 py-3 text-dark-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-dark-800">
          <Settings size={20} />
          <span className="font-medium">Настройки</span>
        </div>
      </div>
    </aside>
  )
}

