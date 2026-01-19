import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import MainLayout from '@/components/MainLayout'

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
      <body>
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  )
}

