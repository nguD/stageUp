import { useState } from 'react'
import { blobToDataURL } from '../lib/blob'
import { useRecorder } from '../hooks/useRecorder'
import type { Entry } from '../types'

type EntryType = Entry['type']

type Props = {
  period: Entry['period']
  onAdd: (data: Omit<Entry, 'id' | 'createdAt'>) => void
}

export function AddEntryBlock({ period, onAdd }: Props) {
  const [kind, setKind] = useState<EntryType>('text')
  const [textBody, setTextBody] = useState('')
  const [caption, setCaption] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const { status, error, start, stop, resetError } = useRecorder()

  const periodStyle =
    period === 'morning'
      ? 'border-morning/30 bg-morning/5'
      : 'border-afternoon/30 bg-afternoon/5'

  const handleAddText = () => {
    const t = textBody.trim()
    if (!t) return
    onAdd({ type: 'text', period, content: t })
    setTextBody('')
  }

  const handleStopVoice = async () => {
    const result = await stop()
    if (!result) return
    const audioUrl = await blobToDataURL(result.blob)
    onAdd({
      type: 'voice',
      period,
      audioUrl,
      duration: result.durationSeconds,
    })
  }

  const onFile = (file: File | null) => {
    setPhotoPreview(null)
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setPhotoPreview(url)
    }
    reader.readAsDataURL(file)
  }

  const handleAddPhoto = () => {
    if (!photoPreview) return
    onAdd({
      type: 'photo',
      period,
      photoUrl: photoPreview,
      caption: caption.trim() || undefined,
    })
    setPhotoPreview(null)
    setCaption('')
  }

  return (
    <div
      className={`rounded-xl border border-dashed p-4 ${periodStyle}`}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {(['text', 'voice', 'photo'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setKind(k)
              resetError()
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              kind === k
                ? 'bg-ink text-cream'
                : 'bg-white/80 text-ink/70 hover:bg-white'
            }`}
          >
            {k === 'text' ? 'Texte' : k === 'voice' ? 'Vocal' : 'Photo'}
          </button>
        ))}
      </div>

      {kind === 'text' && (
        <div className="space-y-2">
          <textarea
            value={textBody}
            onChange={(e) => setTextBody(e.target.value)}
            placeholder="Décrivez cette période…"
            rows={4}
            className="w-full resize-y rounded-lg border border-ink/10 bg-white/90 px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
          <button
            type="button"
            onClick={handleAddText}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
          >
            Ajouter le texte
          </button>
        </div>
      )}

      {kind === 'voice' && (
        <div className="space-y-2">
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex flex-wrap gap-2">
            {status !== 'recording' ? (
              <button
                type="button"
                onClick={() => void start()}
                className="rounded-lg bg-morning px-4 py-2 text-sm font-medium text-white"
              >
                Enregistrer
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleStopVoice()}
                className="rounded-lg bg-afternoon px-4 py-2 text-sm font-medium text-white"
              >
                Arrêter et ajouter
              </button>
            )}
          </div>
          {status === 'recording' && (
            <p className="text-xs text-ink/50">Enregistrement en cours…</p>
          )}
        </div>
      )}

      {kind === 'photo' && (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="text-sm text-ink/80 file:mr-2 file:rounded-lg file:border-0 file:bg-ink/10 file:px-3 file:py-1.5 file:text-sm"
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Légende (optionnel)"
            className="w-full rounded-lg border border-ink/10 bg-white/90 px-3 py-2 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Aperçu"
              className="max-h-40 rounded-lg object-contain"
            />
          )}
          <button
            type="button"
            disabled={!photoPreview}
            onClick={handleAddPhoto}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Ajouter la photo
          </button>
        </div>
      )}
    </div>
  )
}
