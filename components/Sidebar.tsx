'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Rocket, 
  Calendar, 
  AlertTriangle,
  Shield,
  Network,
  BarChart3,
  Target,
  Briefcase,
  LogOut,
  Mic
} from 'lucide-react'

const navigation = [
  { name: 'Главный дашборд', href: '/', icon: LayoutDashboard },
  { name: 'Мои KPI & OKR', href: '/my-okr', icon: Target },
  { name: 'Финансы COO', href: '/financials', icon: BarChart3 },
  { name: 'Оргструктура', href: '/org-structure', icon: Network },
  { name: 'Отделы', href: '/departments', icon: Building2 },
  { name: 'Клиенты', href: '/clients', icon: Briefcase },
  { name: '1:1 Встречи', href: '/one-on-one', icon: Users },
  { name: 'Записи встреч', href: '/recordings', icon: Mic },
  { name: 'Стратегия', href: '/initiatives', icon: Rocket },
  { name: 'Неделя', href: '/weekly', icon: Calendar },
  { name: 'Проблемы', href: '/problems', icon: AlertTriangle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-900 border-r border-dark-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <h1 className="text-xl font-bold gradient-text">COO Dashboard</h1>
        <p className="text-sm text-dark-400 mt-1">Headcorn / Megamind</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

      {/* Footer - Security & User */}
      <div className="p-4 border-t border-dark-700 space-y-2">
        <Link 
          href="/settings/security"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            pathname === '/settings/security'
              ? 'bg-primary-600 text-white'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'
          }`}
        >
          <Shield size={20} />
          <span className="font-medium">Безопасность</span>
        </Link>
        
        {session?.user && (
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-dark-500 truncate">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-800 rounded-lg transition-colors"
              title="Выйти"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

