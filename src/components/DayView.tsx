import { AddEntryBlock } from './AddEntryBlock'
import { EntryCard } from './EntryCard'
import type { Day, Entry } from '../types'
import { formatDayLabel } from '../lib/dates'

type Props = {
  day: Day
  onAddEntry: (data: Omit<Entry, 'id' | 'createdAt'>) => void
  onRemoveEntry: (entryId: number) => void
}

export function DayView({ day, onAddEntry, onRemoveEntry }: Props) {
  const morning = day.entries.filter((e) => e.period === 'morning')
  const afternoon = day.entries.filter((e) => e.period === 'afternoon')

  return (
    <div className="space-y-10">
      <header>
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          {formatDayLabel(day.date)}
        </h2>
        <p className="mt-1 text-sm text-ink/50">{day.date}</p>
      </header>

      <section className="space-y-4">
        <h3 className="flex items-center gap-2 font-display text-lg font-medium text-morning">
          <span className="h-2 w-2 rounded-full bg-morning" />
          Matin
        </h3>
        <AddEntryBlock period="morning" onAdd={onAddEntry} />
        <ul className="space-y-3">
          {morning.map((e) => (
            <li key={e.id}>
              <EntryCard entry={e} onDelete={() => onRemoveEntry(e.id)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="flex items-center gap-2 font-display text-lg font-medium text-afternoon">
          <span className="h-2 w-2 rounded-full bg-afternoon" />
          Après-midi
        </h3>
        <AddEntryBlock period="afternoon" onAdd={onAddEntry} />
        <ul className="space-y-3">
          {afternoon.map((e) => (
            <li key={e.id}>
              <EntryCard entry={e} onDelete={() => onRemoveEntry(e.id)} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
