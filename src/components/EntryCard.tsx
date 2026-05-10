import type { Entry } from '../types'

type Props = {
  entry: Entry
  onDelete: () => void
}

const periodLabel = (p: Entry['period']) => (p === 'morning' ? 'Matin' : 'Après-midi')

export function EntryCard({ entry, onDelete }: Props) {
  return (
    <article className="group rounded-xl border border-ink/10 bg-white/60 px-4 py-3 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="mb-2 flex items-start justify-between gap-2">
        <span
          className={`text-xs font-medium uppercase tracking-wide ${
            entry.period === 'morning' ? 'text-morning' : 'text-afternoon'
          }`}
        >
          {periodLabel(entry.period)}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-ink/40 opacity-0 transition group-hover:opacity-100 hover:text-accent"
        >
          Supprimer
        </button>
      </div>
      {entry.type === 'text' && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
          {entry.content}
        </p>
      )}
      {entry.type === 'voice' && entry.audioUrl && (
        <div className="space-y-1">
          <p className="text-xs text-ink/50">
            Note vocale
            {entry.duration != null ? ` · ${entry.duration}s` : null}
          </p>
          <audio controls src={entry.audioUrl} className="h-9 w-full max-w-md" />
        </div>
      )}
      {entry.type === 'photo' && entry.photoUrl && (
        <div className="space-y-2">
          <img
            src={entry.photoUrl}
            alt={entry.caption || 'Photo du journal'}
            className="max-h-64 w-full rounded-lg object-contain"
          />
          {entry.caption ? (
            <p className="text-sm text-ink/80">{entry.caption}</p>
          ) : null}
        </div>
      )}
    </article>
  )
}
