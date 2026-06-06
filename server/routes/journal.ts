import { Router } from 'express'
import { requireAuth } from '../auth.js'
import { getJournal, saveJournal } from '../db.js'

export const journalRouter = Router()

journalRouter.use(requireAuth)

journalRouter.get('/', (req, res) => {
  const raw = getJournal(req.user!.id)
  try {
    const days = JSON.parse(raw)
    if (!Array.isArray(days)) {
      res.json({ days: [] })
      return
    }
    res.json({ days })
  } catch {
    res.json({ days: [] })
  }
})

journalRouter.put('/', (req, res) => {
  const days = req.body?.days
  if (!Array.isArray(days)) {
    res.status(400).json({ error: 'Corps invalide : attendu { days: [...] }' })
    return
  }
  saveJournal(req.user!.id, JSON.stringify(days))
  res.json({ ok: true })
})
