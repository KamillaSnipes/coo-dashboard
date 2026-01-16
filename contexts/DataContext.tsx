'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { departments as staticDepartments, leadership as staticLeadership, oneOnOnePeople as staticPeople, strategicInitiatives as staticInitiatives, keyProblems as staticProblems, quarterFocus as staticFocus } from '@/lib/data'

interface Alert {
  id: string
  text: string
  owner: string
  priority: 'high' | 'medium' | 'low'
}

interface FocusData {
  quarter: string
  priorities: string[]
}

interface DataContextType {
  // Alerts
  alerts: Alert[]
  setAlerts: (alerts: Alert[]) => void
  
  // Focus
  focus: FocusData
  setFocus: (focus: FocusData) => void
  
  // Financials
  financials: any[]
  setFinancials: (financials: any[]) => void
  
  // OKR
  myKPIs: any[]
  setMyKPIs: (kpis: any[]) => void
  myOKRs: any[]
  setMyOKRs: (okrs: any[]) => void
  
  // 1:1 People
  oneOnOnePeople: any[]
  setOneOnOnePeople: (people: any[]) => void
  
  // Org Structure (editable)
  orgDepartments: any[]
  setOrgDepartments: (depts: any[]) => void
  
  // Loading & Saving
  loading: boolean
  saving: boolean
  saveAll: () => Promise<void>
  refresh: () => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // State
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', text: '70% времени продажников на операционку', owner: 'Камилла Каюмова', priority: 'high' },
    { id: '2', text: '5 дней на просчёт от отдела Китая', owner: 'Камилла Каюмова + РГ Китая', priority: 'high' },
    { id: '3', text: 'Нет руководителя отдела продаж', owner: 'Камилла Каюмова + HR', priority: 'high' },
    { id: '4', text: 'HR-система отсутствует (нужен HRBP)', owner: 'Камилла Каюмова + Людковский Пётр', priority: 'high' },
  ])
  
  const [focus, setFocus] = useState<FocusData>({
    quarter: staticFocus.quarter,
    priorities: staticFocus.priorities,
  })
  
  const [financials, setFinancials] = useState<any[]>([])
  const [myKPIs, setMyKPIs] = useState<any[]>([])
  const [myOKRs, setMyOKRs] = useState<any[]>([])
  const [oneOnOnePeople, setOneOnOnePeople] = useState<any[]>(staticPeople.map(p => ({ ...p, meetings: [] })))
  const [orgDepartments, setOrgDepartments] = useState<any[]>([])

  // Load all data
  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/org')
      if (response.ok) {
        const data = await response.json()
        if (data.alerts?.length > 0) setAlerts(data.alerts)
        if (data.focus?.quarter) setFocus(data.focus)
        if (data.financials?.length > 0) setFinancials(data.financials)
        if (data.myKPIs?.length > 0) setMyKPIs(data.myKPIs)
        if (data.myOKRs?.length > 0) setMyOKRs(data.myOKRs)
        if (data.oneOnOnePeople?.length > 0) setOneOnOnePeople(data.oneOnOnePeople)
        if (data.orgDepartments?.length > 0) setOrgDepartments(data.orgDepartments)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save all data
  const saveAll = useCallback(async () => {
    setSaving(true)
    try {
      await fetch('/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alerts,
          focus,
          financials,
          myKPIs,
          myOKRs,
          oneOnOnePeople,
          orgDepartments,
        })
      })
    } catch (error) {
      console.error('Error saving data:', error)
    } finally {
      setSaving(false)
    }
  }, [alerts, focus, financials, myKPIs, myOKRs, oneOnOnePeople, orgDepartments])

  // Auto-save when data changes
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        saveAll()
      }, 1000) // Debounce 1 second
      return () => clearTimeout(timer)
    }
  }, [alerts, focus, financials, myKPIs, myOKRs, oneOnOnePeople, orgDepartments, loading, saveAll])

  // Initial load
  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <DataContext.Provider value={{
      alerts, setAlerts,
      focus, setFocus,
      financials, setFinancials,
      myKPIs, setMyKPIs,
      myOKRs, setMyOKRs,
      oneOnOnePeople, setOneOnOnePeople,
      orgDepartments, setOrgDepartments,
      loading, saving,
      saveAll, refresh,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

