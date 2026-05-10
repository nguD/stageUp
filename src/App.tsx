import { useMemo, useState } from 'react'
import { DayView } from './components/DayView'
import { RapportView } from './components/RapportView'
import { Sidebar } from './components/Sidebar'
import { useStorage } from './hooks/useStorage'
import type { Entry } from './types'

type Tab = 'journal' | 'rapport'

function App() {
  const { days, createTodayIfNeeded, addEntry, removeEntry } = useStorage()
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

  return (
    <div className="flex min-h-screen bg-cream text-ink">
      <Sidebar
        days={days}
        activeDate={effectiveDate}
        onSelect={setActiveDate}
        onNewDay={onNewDay}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col md:pl-0">
        <header className="sticky top-0 z-10 border-b border-ink/10 bg-cream/90 px-4 py-3 backdrop-blur-md md:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <button
              type="button"
              className="rounded-lg border border-ink/15 bg-white/80 px-3 py-2 text-sm md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              Menu
            </button>
            <nav className="flex flex-1 justify-center gap-1 sm:justify-end">
              <button
                type="button"
                onClick={() => setTab('journal')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === 'rapport'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-ink/65 hover:bg-white/70'
                }`}
              >
                Rapport IA
              </button>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-8">
          {tab === 'journal' && (
            <>
              {!activeDay ? (
                <div className="rounded-2xl border border-dashed border-ink/15 bg-white/40 px-6 py-16 text-center">
                  <p className="font-display text-lg text-ink/70">
                    Aucune journée pour le moment.
                  </p>
                  <p className="mt-2 text-sm text-ink/45">
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
        </main>
      </div>
    </div>
  )
}

export default App
