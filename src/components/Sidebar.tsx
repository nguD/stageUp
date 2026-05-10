import { useRef } from 'react'
import type { Day } from '../types'
import { formatDayLabel } from '../lib/dates'

type Props = {
  days: Day[]
  activeDate: string | null
  onSelect: (date: string) => void
  onNewDay: () => void
  onRemoveDay: (date: string) => void
  onExportBackup: () => void
  onImportBackup: (file: File) => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  days,
  activeDate,
  onSelect,
  onNewDay,
  onRemoveDay,
  onExportBackup,
  onImportBackup,
  mobileOpen,
  onCloseMobile,
}: Props) {
  const importRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 max-w-[85vw] border-r border-ink/10 bg-cream/95 px-4 py-6 shadow-lg backdrop-blur-sm transition-transform md:static md:z-0 md:w-64 md:max-w-none md:translate-x-0 md:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold text-ink">
            Journal de Stage
          </h1>
          <p className="mt-1 text-xs text-ink/45">Vos journées en un coup d’œil</p>
        </div>
        <button
          type="button"
          onClick={onNewDay}
          className="mb-4 w-full rounded-xl border border-accent/40 bg-white px-3 py-2.5 text-sm font-medium text-accent shadow-sm transition hover:border-accent hover:bg-accent/5"
        >
          Nouvelle journée
        </button>
        <nav className="max-h-[calc(100vh-14rem)] space-y-1 overflow-y-auto pr-1">
          {days.length === 0 && (
            <p className="text-sm text-ink/45">Aucune journée pour l’instant.</p>
          )}
          {days.map((d) => (
            <div
              key={d.date}
              className={`group/day flex items-stretch gap-0.5 rounded-lg transition ${
                activeDate === d.date ? 'bg-ink text-cream shadow-card' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onSelect(d.date)
                  onCloseMobile()
                }}
                className={`flex min-w-0 flex-1 flex-col items-start rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  activeDate === d.date
                    ? 'text-cream'
                    : 'text-ink/80 hover:bg-white/70 hover:shadow-card'
                }`}
              >
                <span className="font-medium capitalize">
                  {formatDayLabel(d.date)}
                </span>
                <span
                  className={`text-xs ${
                    activeDate === d.date ? 'text-cream/70' : 'text-ink/40'
                  }`}
                >
                  {d.entries.length} entrée{d.entries.length !== 1 ? 's' : ''}
                </span>
              </button>
              <button
                type="button"
                title="Supprimer cette journée"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveDay(d.date)
                }}
                className={`shrink-0 rounded-lg px-2 text-xs transition ${
                  activeDate === d.date
                    ? 'text-cream/60 hover:bg-white/10 hover:text-cream'
                    : 'text-ink/35 opacity-0 hover:text-accent group-hover/day:opacity-100'
                }`}
              >
                ×
              </button>
            </div>
          ))}
        </nav>

        <div className="mt-6 space-y-2 border-t border-ink/10 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
            Données
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onExportBackup}
              className="rounded-lg border border-ink/15 bg-white/80 px-3 py-1.5 text-xs font-medium text-ink/80 hover:bg-white"
            >
              Exporter
            </button>
            <button
              type="button"
              onClick={() => importRef.current?.click()}
              className="rounded-lg border border-ink/15 bg-white/80 px-3 py-1.5 text-xs font-medium text-ink/80 hover:bg-white"
            >
              Importer
            </button>
          </div>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImportBackup(f)
              e.target.value = ''
            }}
          />
        </div>
      </aside>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-20 bg-ink/20 md:hidden"
          onClick={onCloseMobile}
        />
      ) : null}
    </>
  )
}
