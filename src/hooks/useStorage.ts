import { useCallback, useState } from 'react'
import { todayISO } from '../lib/dates'
import type { Day, Entry } from '../types'

const STORAGE_KEY = 'journal-stage-days'

function sortDays(days: Day[]): Day[] {
  return [...days].sort((a, b) => b.date.localeCompare(a.date))
}

function loadInitial(): Day[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Day[]
    return sortDays(parsed)
  } catch {
    return []
  }
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

function persist(next: Day[]): Day[] {
  const sorted = sortDays(next)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
  return sorted
}

export function useStorage() {
  const [days, setDays] = useState<Day[]>(loadInitial)

  const createTodayIfNeeded = useCallback((): string => {
    const today = todayISO()
    setDays((prev) => {
      if (prev.some((d) => d.date === today)) return sortDays(prev)
      return persist([...prev, { date: today, entries: [] }])
    })
    return today
  }, [])

  const addEntry = useCallback((date: string, entryData: Omit<Entry, 'id' | 'createdAt'>) => {
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
      return persist(next)
    })
  }, [])

  const removeEntry = useCallback((date: string, entryId: number) => {
    setDays((prev) => {
      const next = prev.map((d) =>
        d.date === date
          ? { ...d, entries: d.entries.filter((e) => e.id !== entryId) }
          : d,
      )
      return persist(next)
    })
  }, [])

  const removeDay = useCallback((date: string) => {
    setDays((prev) => persist(prev.filter((d) => d.date !== date)))
  }, [])

  const replaceAllDays = useCallback((next: Day[]) => {
    setDays(persist(next))
  }, [])

  return {
    days,
    createTodayIfNeeded,
    addEntry,
    removeEntry,
    removeDay,
    replaceAllDays,
  }
}
