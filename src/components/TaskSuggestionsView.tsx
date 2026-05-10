import { useState } from 'react'

type Section = {
  title: string
  description: string
  accent: 'morning' | 'afternoon' | 'accent'
  items: string[]
}

const SECTIONS: Section[] = [
  {
    title: 'Dans ton journal (au quotidien)',
    description:
      'Exemples de choses à noter, photographier ou enregistrer en vocal.',
    accent: 'morning',
    items: [
      'Résumer en 3 lignes ce que tu as fait ce matin et cet après-midi.',
      'Noter une consigne ou un objectif que ton tuteur t’a donné.',
      'Décrire un outil logiciel ou une méthode que tu as découverts.',
      'Expliquer une erreur ou un blocage et comment tu l’as géré.',
      'Lister deux questions que tu aimerais poser demain à l’équipe.',
      'Prendre en photo un poste de travail, un schéma au tableau ou une maquette (avec autorisation).',
      'Noter un moment où tu as collaboré avec quelqu’un et ce que tu en retiens.',
    ],
  },
  {
    title: 'À explorer ou demander à voir',
    description:
      'Idées de demandes à faire à ton tuteur ou à l’équipe pour enrichir ton stage.',
    accent: 'afternoon',
    items: [
      'Demander à assister à une réunion (interne ou avec un client) en observateur.',
      'Proposer de revoir un dossier ou un projet déjà traité pour comprendre le contexte.',
      'Demander une visite d’un autre service ou d’un autre site.',
      'Demander à voir comment sont gérés les plannings, les tickets ou la documentation.',
      'Solliciter un retour rapide sur une tâche que tu viens de rendre.',
    ],
  },
  {
    title: 'Pour l’onglet Rapport IA',
    description:
      'Tu peux d’abord remplir le journal, puis générer un document — ou t’en inspirer pour formuler tes propres demandes ailleurs.',
    accent: 'accent',
    items: [
      'Générer un rapport de stage à partir de plusieurs semaines déjà saisies.',
      'Obtenir une liste d’« apprentissages » classés par thème (technique, relationnel, organisation).',
      'Produire un plan de slides pour ta soutenance orale.',
      'Après coup : demander à l’IA de relire ton texte (dans un autre outil) en précisant ton niveau et le ton voulu.',
    ],
  },
]

const accentBorder: Record<Section['accent'], string> = {
  morning: 'border-morning/35 bg-morning/5',
  afternoon: 'border-afternoon/35 bg-afternoon/5',
  accent: 'border-accent/35 bg-accent/5',
}

const accentTitle: Record<Section['accent'], string> = {
  morning: 'text-morning',
  afternoon: 'text-afternoon',
  accent: 'text-accent',
}

export function TaskSuggestionsView() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      window.alert('Copie impossible sur ce navigateur.')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-16">
      <header>
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          Propositions de tâches
        </h2>
        <p className="mt-2 text-sm text-ink/55">
          Des pistes pour alimenter ton journal, oser des demandes en entreprise ou
          préparer ton rapport. Clique sur « Copier » pour réutiliser une phrase telle
          quelle.
        </p>
      </header>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section
            key={section.title}
            className={`rounded-2xl border p-5 shadow-card ${accentBorder[section.accent]}`}
          >
            <h3
              className={`font-display text-lg font-semibold ${accentTitle[section.accent]}`}
            >
              {section.title}
            </h3>
            <p className="mt-1 text-sm text-ink/55">{section.description}</p>
            <ul className="mt-4 space-y-3">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-ink/8 bg-white/70 px-3 py-2.5 text-sm leading-relaxed text-ink/90"
                >
                  <span className="min-w-0 flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => void copy(item)}
                    className="shrink-0 rounded-lg border border-ink/10 bg-white px-2.5 py-1 text-xs font-medium text-ink/70 hover:border-accent/40 hover:text-accent"
                  >
                    {copied === item ? 'Copié' : 'Copier'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
