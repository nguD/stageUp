import { useMemo, useState } from 'react'
import { generateWithClaude } from '../lib/anthropic'
import { buildFullPrompt, buildJournalNarrative } from '../lib/journalPrompt'
import type { Day, DocKind } from '../types'

const DOC_OPTIONS: { id: DocKind; label: string; hint: string }[] = [
  {
    id: 'rapport',
    label: 'Rapport de stage',
    hint: 'Document formel et structuré',
  },
  {
    id: 'apprentissages',
    label: 'Apprentissages',
    hint: 'Compétences et axes à creuser',
  },
  {
    id: 'slides',
    label: 'Plan de slides',
    hint: 'Structure de présentation de fin de stage',
  },
]

type Props = {
  days: Day[]
}

function totalEntryCount(days: Day[]): number {
  return days.reduce((n, d) => n + d.entries.length, 0)
}

export function RapportView({ days }: Props) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY ?? ''
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [docKind, setDocKind] = useState<DocKind>('rapport')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const globalStats = useMemo(() => {
    const nDays = days.length
    const nEntries = totalEntryCount(days)
    const avg = nDays > 0 ? (nEntries / nDays).toFixed(1) : '0'
    return { nDays, nEntries, avg }
  }, [days])

  const selectionStats = useMemo(() => {
    const selDays = days.filter((d) => selected.has(d.date))
    const nDays = selDays.length
    const nEntries = totalEntryCount(selDays)
    const avg = nDays > 0 ? (nEntries / nDays).toFixed(1) : '0'
    return { nDays, nEntries, avg }
  }, [days, selected])

  const toggleDate = (date: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }

  const selectAll = () => {
    setSelected(new Set(days.map((d) => d.date)))
  }

  const clearSelection = () => setSelected(new Set())

  const handleGenerate = async () => {
    setErr(null)
    setOutput('')
    if (!apiKey.trim()) {
      setErr(
        'Clé API manquante. Ajoutez VITE_ANTHROPIC_API_KEY dans un fichier .env à la racine du projet, puis relancez le serveur de dev.',
      )
      return
    }
    const picked = days.filter((d) => selected.has(d.date))
    if (picked.length === 0) {
      setErr('Sélectionnez au moins une journée.')
      return
    }
    setLoading(true)
    try {
      const narrative = buildJournalNarrative(picked)
      const prompt = buildFullPrompt(docKind, narrative)
      const text = await generateWithClaude(apiKey.trim(), prompt)
      setOutput(text)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Échec de la génération')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16">
      <header>
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          Rapport IA
        </h2>
        <p className="mt-2 text-sm text-ink/55">
          Choisissez les journées à inclure et le type de document. Le modèle{' '}
          <code className="rounded bg-ink/5 px-1 text-xs">claude-sonnet-4-20250514</code>{' '}
          synthétise votre journal.
        </p>
      </header>

      <section className="grid gap-4 rounded-2xl border border-ink/10 bg-white/50 p-5 shadow-card sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            Statistiques globales
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-ink/80">
            <li>Jours enregistrés : {globalStats.nDays}</li>
            <li>Entrées totales : {globalStats.nEntries}</li>
            <li>Moyenne entrées / jour : {globalStats.avg}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            Sélection (génération)
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-ink/80">
            <li>Jours sélectionnés : {selectionStats.nDays}</li>
            <li>Entrées dans la sélection : {selectionStats.nEntries}</li>
            <li>Moyenne entrées / jour (sélection) : {selectionStats.avg}</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink">Journées</span>
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-accent hover:underline"
          >
            Tout sélectionner
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-ink/45 hover:text-ink"
          >
            Effacer
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {days.length === 0 && (
            <p className="text-sm text-ink/45">Ajoutez des journées dans l’onglet Journal.</p>
          )}
          {days.map((d) => {
            const on = selected.has(d.date)
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => toggleDate(d.date)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  on
                    ? 'border-accent bg-accent text-white shadow-sm'
                    : 'border-ink/15 bg-white/80 text-ink/75 hover:border-ink/25'
                }`}
              >
                {d.date}
                <span className="ml-1 text-xs opacity-80">({d.entries.length})</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Type de document</h3>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {DOC_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDocKind(opt.id)}
              className={`flex flex-1 flex-col rounded-xl border px-4 py-3 text-left text-sm transition sm:min-w-[10rem] ${
                docKind === opt.id
                  ? 'border-accent bg-accent/10 shadow-card'
                  : 'border-ink/10 bg-white/60 hover:shadow-card'
              }`}
            >
              <span className="font-medium text-ink">{opt.label}</span>
              <span className="text-xs text-ink/50">{opt.hint}</span>
            </button>
          ))}
        </div>
      </section>

      {err && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {err}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleGenerate()}
          className="rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-cream shadow-sm transition hover:opacity-95 disabled:opacity-50"
        >
          {loading ? 'Génération…' : 'Générer'}
        </button>
        <button
          type="button"
          disabled={!output}
          onClick={() => void handleCopy()}
          className="rounded-xl border border-ink/15 bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-white disabled:opacity-40"
        >
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>

      {output ? (
        <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-ink/70">Résultat</h3>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink/90">
            {output}
          </pre>
        </section>
      ) : null}
    </div>
  )
}
