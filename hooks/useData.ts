'use client'

import { useState, useEffect, useCallback } from 'react'

export function useData<T>(endpoint: string, initialData: T) {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${endpoint}`)
        if (response.ok) {
          const result = await response.json()
          if (Array.isArray(result) && result.length > 0) {
            setData(result as T)
          } else if (!Array.isArray(result) && Object.keys(result).length > 0) {
            setData(result as T)
          }
        }
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err)
        setError(`Failed to fetch ${endpoint}`)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [endpoint])

  // Save data
  const saveData = useCallback(async (newData: any) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      })
      
      if (response.ok) {
        const result = await response.json()
        return result
      }
    } catch (err) {
      console.error(`Error saving ${endpoint}:`, err)
      setError(`Failed to save ${endpoint}`)
    }
  }, [endpoint])

  return { data, setData, loading, error, saveData }
}

// Debounced save hook
export function useDebouncedSave(saveFunction: (data: any) => Promise<any>, delay = 1000) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const debouncedSave = useCallback((data: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    const newTimeoutId = setTimeout(() => {
      saveFunction(data)
    }, delay)
    
    setTimeoutId(newTimeoutId)
  }, [saveFunction, delay, timeoutId])

  return debouncedSave
}

