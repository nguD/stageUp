import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import fs from 'node:fs'
import path from 'node:path'

export type UserRow = {
  id: number
  username: string
  display_name: string
}

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), 'data', 'journal.db')
const dir = path.dirname(dbPath)
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

export const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS journal_data (
    user_id INTEGER PRIMARY KEY,
    data TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`)

type SeedAccount = { username: string; password: string; displayName: string }

function readSeedAccounts(): SeedAccount[] {
  const accounts: SeedAccount[] = []
  for (let i = 1; i <= 3; i++) {
    const username = process.env[`STAGIAIRE${i}_USER`]
    const password = process.env[`STAGIAIRE${i}_PASS`]
    const displayName = process.env[`STAGIAIRE${i}_NAME`] ?? `Stagiaire ${i}`
    if (username && password) {
      accounts.push({ username, password, displayName })
    }
  }
  return accounts
}

export function seedUsers(): void {
  const accounts = readSeedAccounts()
  if (accounts.length === 0) {
    console.warn(
      '[db] Aucun compte stagiaire défini. Renseignez STAGIAIRE1_USER/PASS … STAGIAIRE3_USER/PASS dans .env',
    )
    return
  }

  const insertUser = db.prepare(
    'INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)',
  )
  const insertJournal = db.prepare(
    "INSERT INTO journal_data (user_id, data, updated_at) VALUES (?, '[]', ?)",
  )
  const findUser = db.prepare('SELECT id FROM users WHERE username = ?')

  for (const acc of accounts) {
    const existing = findUser.get(acc.username) as { id: number } | undefined
    if (existing) continue

    const hash = bcrypt.hashSync(acc.password, 12)
    const result = insertUser.run(acc.username, hash, acc.displayName)
    const userId = Number(result.lastInsertRowid)
    insertJournal.run(userId, new Date().toISOString())
    console.log(`[db] Compte créé : ${acc.username}`)
  }
}

export function findUserByUsername(username: string): (UserRow & { password_hash: string }) | undefined {
  return db
    .prepare('SELECT id, username, password_hash, display_name FROM users WHERE username = ?')
    .get(username) as (UserRow & { password_hash: string }) | undefined
}

export function findUserById(id: number): UserRow | undefined {
  return db
    .prepare('SELECT id, username, display_name FROM users WHERE id = ?')
    .get(id) as UserRow | undefined
}

export function getJournal(userId: number): string {
  const row = db
    .prepare('SELECT data FROM journal_data WHERE user_id = ?')
    .get(userId) as { data: string } | undefined
  return row?.data ?? '[]'
}

export function saveJournal(userId: number, data: string): void {
  db.prepare(
    `INSERT INTO journal_data (user_id, data, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
  ).run(userId, data, new Date().toISOString())
}
