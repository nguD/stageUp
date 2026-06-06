import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { findUserById } from './db.js'

const COOKIE_NAME = 'journal_token'

export type JwtPayload = { userId: number }

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET manquant ou trop court (min. 16 caractères)')
  }
  return secret
}

export function signToken(userId: number): string {
  return jwt.sign({ userId } satisfies JwtPayload, jwtSecret(), { expiresIn: '30d' })
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: '/' })
}

export function readToken(req: Request): string | null {
  const cookie = req.cookies?.[COOKIE_NAME]
  if (typeof cookie === 'string' && cookie) return cookie
  return null
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = readToken(req)
  if (!token) {
    res.status(401).json({ error: 'Non authentifié' })
    return
  }
  try {
    const payload = jwt.verify(token, jwtSecret()) as JwtPayload
    const user = findUserById(payload.userId)
    if (!user) {
      res.status(401).json({ error: 'Utilisateur introuvable' })
      return
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Session expirée' })
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string; display_name: string }
    }
  }
}
