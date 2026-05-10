import type { Day, DocKind, Entry } from '../types'

const PHOTO_INLINE_MAX = 48_000

function entryToLines(entry: Entry): string[] {
  const period = entry.period === 'morning' ? 'Matin' : 'Après-midi'
  if (entry.type === 'text') {
    const t = entry.content?.trim()
    if (!t) return []
    return [`[${period} — texte]`, t]
  }
  if (entry.type === 'voice') {
    const d = entry.duration != null ? ` (~${entry.duration}s)` : ''
    return [`[${period} — note vocale${d}]`, '(contenu audio — synthétiser à partir du contexte voisin si besoin)']
  }
  if (entry.type === 'photo') {
    const cap = entry.caption?.trim()
    const url = entry.photoUrl ?? ''
    const huge = url.startsWith('data:') && url.length > PHOTO_INLINE_MAX
    if (huge) {
      return [
        `[${period} — photo]`,
        cap ? `Légende : ${cap}` : 'Photo jointe (données image non incluses dans le prompt — se fier à la légende).',
      ]
    }
    return [
      `[${period} — photo]`,
      cap ? `Légende : ${cap}` : '(photo sans légende)',
    ]
  }
  return []
}

export function buildJournalNarrative(days: Day[]): string {
  const blocks: string[] = []
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  for (const day of sorted) {
    blocks.push(`## Journée du ${day.date}`)
    const entries = [...day.entries].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    for (const e of entries) {
      blocks.push(...entryToLines(e), '')
    }
  }
  return blocks.join('\n').trim()
}

function instructionsFor(kind: DocKind): string {
  switch (kind) {
    case 'rapport':
      return `Tu es un assistant pour un stagiaire. Rédige un rapport de stage formel et structuré (titres, sous-parties) à partir du journal ci-dessous. Style professionnel, français.`
    case 'apprentissages':
      return `À partir du journal ci-dessous, produis une synthèse des apprentissages : compétences acquises, ce qui a été compris, et des points à approfondir. Structure claire avec listes si utile. Français.`
    case 'slides':
      return `Propose un plan de slides pour une présentation de fin de stage (titres de sections + bullets par slide). Pas besoin de design graphique, uniquement la structure et les idées clés. Français.`
    default:
      return ''
  }
}

export function buildFullPrompt(kind: DocKind, narrative: string): string {
  return `${instructionsFor(kind)}

### Journal du stagiaire

${narrative}`
}
