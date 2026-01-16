import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { DataProvider } from '@/contexts/DataContext'

export const metadata: Metadata = {
  title: 'COO Dashboard | Headcorn',
  description: 'Центр управления для операционного директора',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="flex min-h-screen">
        <DataProvider>
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </DataProvider>
      </body>
    </html>
  )
}

