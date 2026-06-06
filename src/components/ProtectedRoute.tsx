import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-ink">
        <p className="text-sm text-ink/55">Chargement…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/app/login" state={{ from: location.pathname }} replace />
  }

  return children
}
