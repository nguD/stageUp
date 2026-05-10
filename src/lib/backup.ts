import type { Day, Entry } from '../types'

function isEntry(x: unknown): x is Entry {
  if (!x || typeof x !== 'object') return false
  const e = x as Record<string, unknown>
  if (typeof e.id !== 'number' || typeof e.type !== 'string') return false
  if (e.type !== 'text' && e.type !== 'voice' && e.type !== 'photo') return false
  if (e.period !== 'morning' && e.period !== 'afternoon') return false
  if (typeof e.createdAt !== 'string') return false
  return true
}

function isDay(x: unknown): x is Day {
  if (!x || typeof x !== 'object') return false
  const d = x as Record<string, unknown>
  if (typeof d.date !== 'string' || !Array.isArray(d.entries)) return false
  return d.entries.every(isEntry)
}

/** Accepte un tableau de journées ou un objet `{ days: [...] }` exporté par l’app. */
export function validateDaysPayload(raw: unknown): Day[] | null {
  if (Array.isArray(raw) && raw.every(isDay)) return raw
  if (raw && typeof raw === 'object' && 'days' in raw) {
    const days = (raw as { days: unknown }).days
    if (Array.isArray(days) && days.every(isDay)) return days
  }
  return null
}

export function downloadJournalBackup(days: Day[], filename: string): void {
  const payload = { version: 1, exportedAt: new Date().toISOString(), days }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
