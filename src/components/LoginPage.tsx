import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) navigate('/app', { replace: true })
  }, [user, navigate])

  if (user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate('/app', { replace: true })
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Connexion impossible')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col text-ink">
      <header className="border-b border-ink/10 bg-cream/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <span className="font-display text-lg font-semibold">Journal de Stage</span>
          <Link to="/" className="text-xs text-ink/50 hover:text-accent">
            ← Accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-ink/10 bg-white/70 p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold text-ink">Connexion</h1>
          <p className="mt-2 text-sm text-ink/55">
            Espace privé réservé aux stagiaires. Chaque compte possède son propre journal.
          </p>

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-4">
            <div>
              <label htmlFor="username" className="mb-1 block text-xs font-medium text-ink/60">
                Identifiant
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2.5 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-medium text-ink/60">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2.5 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                required
              />
            </div>

            {err && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {err}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
            >
              {submitting ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
