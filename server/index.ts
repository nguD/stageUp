import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { authRouter } from './routes/auth.js'
import { journalRouter } from './routes/journal.js'
import { db, seedUsers } from './db.js'

seedUsers()

const app = express()
const port = Number(process.env.PORT) || 3001
const distPath = path.join(process.cwd(), 'dist')

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? true,
    credentials: true,
  }),
)
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/journal', journalRouter)

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`[server] http://localhost:${port}`)
  console.log(`[server] base SQLite : ${db.name}`)
})
