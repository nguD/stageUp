export interface Entry {
  id: number
  type: 'text' | 'voice' | 'photo'
  period: 'morning' | 'afternoon'
  createdAt: string
  content?: string
  audioUrl?: string
  duration?: number
  photoUrl?: string
  caption?: string
}

export interface Day {
  date: string
  entries: Entry[]
}

export type DocKind = 'rapport' | 'apprentissages' | 'slides'
