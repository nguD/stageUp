import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DayView } from './components/DayView'
import { RapportView } from './components/RapportView'
import { Sidebar } from './components/Sidebar'
import { TaskSuggestionsView } from './components/TaskSuggestionsView'
import { useAuth } from './context/AuthContext'
import { useStorage } from './hooks/useStorage'
import { downloadJournalBackup, validateDaysPayload } from './lib/backup'
import { todayISO } from './lib/dates'
import type { Entry } from './types'

type Tab = 'journal' | 'rapport' | 'propositions'

function App() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const {
    days,
    loading,
    syncError,
    createTodayIfNeeded,
    addEntry,
    removeEntry,
    removeDay,
    replaceAllDays,
  } = useStorage()
  const [activeDate, setActiveDate] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('journal')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const effectiveDate = useMemo(() => {
    if (days.length === 0) return null
    if (activeDate && days.some((d) => d.date === activeDate)) return activeDate
    return days[0].date
  }, [days, activeDate])

  const activeDay = useMemo(
    () => days.find((d) => d.date === effectiveDate) ?? null,
    [days, effectiveDate],
  )

  const onNewDay = () => {
    const today = createTodayIfNeeded()
    setActiveDate(today)
    setTab('journal')
    setSidebarOpen(false)
  }

  const onAddEntry = (data: Omit<Entry, 'id' | 'createdAt'>) => {
    if (!effectiveDate) return
    addEntry(effectiveDate, data)
  }

  const onRemoveEntry = (entryId: number) => {
    if (!effectiveDate) return
    removeEntry(effectiveDate, entryId)
  }

  const onRemoveDay = (date: string) => {
    if (
      !window.confirm(
        'Supprimer cette journée et toutes ses entrées ? Cette action est irréversible.',
      )
    ) {
      return
    }
    removeDay(date)
  }

  const onExportBackup = () => {
    const name = `journal-stage-${todayISO()}.json`
    downloadJournalBackup(days, name)
  }

  const onImportBackup = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string)
        const imported = validateDaysPayload(raw)
        if (!imported) {
          window.alert(
            'Fichier non reconnu. Attendu : tableau de journées ou objet { days: [...] }.',
          )
          return
        }
        if (
          !window.confirm(
            'Remplacer toutes les données du journal par ce fichier ? Les entrées actuelles seront perdues si vous n’avez pas exporté avant.',
          )
        ) {
          return
        }
        replaceAllDays(imported)
      } catch {
        window.alert('Impossible de lire le fichier JSON.')
      }
    }
    reader.readAsText(file)
  }

  const onLogout = async () => {
    await logout()
    navigate('/app/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-ink">
        <p className="text-sm text-ink/55">Chargement de ton journal…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-cream text-ink">
      <Sidebar
        days={days}
        activeDate={effectiveDate}
        onSelect={setActiveDate}
        onNewDay={onNewDay}
        onRemoveDay={onRemoveDay}
        onExportBackup={onExportBackup}
        onImportBackup={onImportBackup}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col md:pl-0">
        <header className="sticky top-0 z-10 border-b border-ink/10 bg-cream/90 px-4 py-3 backdrop-blur-md md:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-ink/15 bg-white/80 px-3 py-2 text-sm md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                Menu
              </button>
              <Link
                to="/"
                className="rounded-lg px-2 py-1.5 text-xs font-medium text-ink/50 transition hover:bg-white/80 hover:text-accent md:text-sm"
              >
                ← Accueil
              </Link>
            </div>
            <nav className="flex flex-1 flex-wrap items-center justify-center gap-1 sm:justify-end">
              <button
                type="button"
                onClick={() => setTab('journal')}
                className={`rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  tab === 'journal'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-ink/65 hover:bg-white/70'
                }`}
              >
                Journal
              </button>
              <button
                type="button"
                onClick={() => setTab('rapport')}
                className={`rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  tab === 'rapport'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-ink/65 hover:bg-white/70'
                }`}
              >
                Rapport IA
              </button>
              <button
                type="button"
                onClick={() => setTab('propositions')}
                className={`rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  tab === 'propositions'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-ink/65 hover:bg-white/70'
                }`}
              >
                Propositions
              </button>
              {user && (
                <div className="ml-1 flex items-center gap-2 border-l border-ink/10 pl-2 sm:ml-2 sm:pl-3">
                  <span className="hidden max-w-[8rem] truncate text-xs text-ink/50 sm:inline">
                    {user.displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => void onLogout()}
                    className="rounded-full px-3 py-2 text-xs font-medium text-ink/55 hover:bg-white/70 sm:text-sm"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </nav>
          </div>
        </header>

        <main
          className={`mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-8 ${
            tab === 'journal' ? 'pb-28 md:pb-8' : ''
          }`}
        >
          {syncError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {syncError}
            </p>
          )}
          {tab === 'journal' && (
            <>
              {!activeDay ? (
                <div className="rounded-2xl border border-dashed border-ink/15 bg-white/40 px-6 py-16 text-center">
                  <p className="font-display text-lg text-ink/70">
                    Aucune journée pour le moment.
                  </p>
                  <p className="mt-2 text-sm text-ink/45 md:hidden">
                    Appuyez sur « Nouvelle journée » en bas de l’écran.
                  </p>
                  <p className="mt-2 hidden text-sm text-ink/45 md:block">
                    Utilisez « Nouvelle journée » dans le menu pour commencer.
                  </p>
                </div>
              ) : (
                <DayView
                  day={activeDay}
                  onAddEntry={onAddEntry}
                  onRemoveEntry={onRemoveEntry}
                />
              )}
            </>
          )}
          {tab === 'rapport' && <RapportView days={days} />}
          {tab === 'propositions' && <TaskSuggestionsView />}
        </main>

        {tab === 'journal' && (
          <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur-md md:hidden">
            <div className="mx-auto flex max-w-4xl justify-stretch">
              <button
                type="button"
                onClick={onNewDay}
                className="w-full rounded-xl border border-accent/40 bg-white px-4 py-3 text-sm font-medium text-accent shadow-sm transition hover:border-accent hover:bg-accent/5"
              >
                Nouvelle journée
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
