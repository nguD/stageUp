import { useCallback, useEffect, useState } from 'react'
import { fetchJournal, saveJournal } from '../lib/api'
import { todayISO } from '../lib/dates'
import type { Day, Entry } from '../types'

function sortDays(days: Day[]): Day[] {
  return [...days].sort((a, b) => b.date.localeCompare(a.date))
}

function nextEntryId(days: Day[]): number {
  let max = 0
  for (const day of days) {
    for (const e of day.entries) {
      if (e.id > max) max = e.id
    }
  }
  return max + 1
}

export function useStorage() {
  const [days, setDays] = useState<Day[]>([])
  const [loading, setLoading] = useState(true)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setSyncError(null)
    fetchJournal()
      .then((data) => setDays(sortDays(data)))
      .catch((e) => {
        setSyncError(e instanceof Error ? e.message : 'Impossible de charger le journal')
        setDays([])
      })
      .finally(() => setLoading(false))
  }, [])

  const persist = useCallback(async (next: Day[]) => {
    const sorted = sortDays(next)
    setDays(sorted)
    try {
      await saveJournal(sorted)
      setSyncError(null)
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : 'Sauvegarde impossible')
      throw e
    }
    return sorted
  }, [])

  const createTodayIfNeeded = useCallback((): string => {
    const today = todayISO()
    setDays((prev) => {
      if (prev.some((d) => d.date === today)) return sortDays(prev)
      const next = sortDays([...prev, { date: today, entries: [] }])
      void persist(next)
      return next
    })
    return today
  }, [persist])

  const addEntry = useCallback(
    (date: string, entryData: Omit<Entry, 'id' | 'createdAt'>) => {
      setDays((prev) => {
        const id = nextEntryId(prev)
        const entry: Entry = {
          ...entryData,
          id,
          createdAt: new Date().toISOString(),
        }
        const idx = prev.findIndex((d) => d.date === date)
        let next: Day[]
        if (idx === -1) {
          next = [...prev, { date, entries: [entry] }]
        } else {
          next = prev.map((d, i) =>
            i === idx ? { ...d, entries: [...d.entries, entry] } : d,
          )
        }
        void persist(next)
        return sortDays(next)
      })
    },
    [persist],
  )

  const removeEntry = useCallback(
    (date: string, entryId: number) => {
      setDays((prev) => {
        const next = prev.map((d) =>
          d.date === date
            ? { ...d, entries: d.entries.filter((e) => e.id !== entryId) }
            : d,
        )
        void persist(next)
        return sortDays(next)
      })
    },
    [persist],
  )

  const removeDay = useCallback(
    (date: string) => {
      setDays((prev) => {
        const next = prev.filter((d) => d.date !== date)
        void persist(next)
        return sortDays(next)
      })
    },
    [persist],
  )

  const replaceAllDays = useCallback(
    (next: Day[]) => {
      void persist(next)
    },
    [persist],
  )

  return {
    days,
    loading,
    syncError,
    createTodayIfNeeded,
    addEntry,
    removeEntry,
    removeDay,
    replaceAllDays,
  }
}
