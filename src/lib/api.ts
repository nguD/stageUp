import type { Day } from '../types'

const API = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new Error(data.error ?? `Erreur ${res.status}`)
  }
  return data
}

export type AuthUser = {
  id: number
  username: string
  displayName: string
}

export async function fetchMe(): Promise<AuthUser | null> {
  try {
    const data = await request<{ user: AuthUser }>('/auth/me')
    return data.user
  } catch {
    return null
  }
}

export async function login(username: string, password: string): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  return data.user
}

export async function logout(): Promise<void> {
  await request('/auth/logout', { method: 'POST' })
}

export async function fetchJournal(): Promise<Day[]> {
  const data = await request<{ days: Day[] }>('/journal')
  return data.days
}

export async function saveJournal(days: Day[]): Promise<void> {
  await request('/journal', {
    method: 'PUT',
    body: JSON.stringify({ days }),
  })
}
