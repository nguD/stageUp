import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { clearAuthCookie, requireAuth, setAuthCookie, signToken } from '../auth.js'
import { findUserByUsername } from '../db.js'

export const authRouter = Router()

authRouter.post('/login', (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''

  if (!username || !password) {
    res.status(400).json({ error: 'Identifiant et mot de passe requis' })
    return
  }

  const user = findUserByUsername(username)
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' })
    return
  }

  const token = signToken(user.id)
  setAuthCookie(res, token)
  res.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
    },
  })
})

authRouter.post('/logout', (_req, res) => {
  clearAuthCookie(res)
  res.json({ ok: true })
})

authRouter.get('/me', requireAuth, (req, res) => {
  const user = req.user!
  res.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
    },
  })
})
