import { Link } from 'react-router-dom'

const REPO = 'https://github.com/nguD/stageUp'

const features = [
  {
    title: 'Journal au fil des jours',
    desc: 'Matin et après-midi : texte, notes vocales et photos avec légendes. Tout reste sur ton appareil (navigateur).',
    tone: 'morning' as const,
  },
  {
    title: 'Rapports avec l’IA',
    desc: 'Sélectionne plusieurs journées et génère un rapport de stage, une synthèse d’apprentissages ou un plan de slides avec Claude.',
    tone: 'afternoon' as const,
  },
  {
    title: 'Idées de tâches',
    desc: 'Un onglet dédié avec des propositions pour remplir ton journal, oser des demandes en entreprise ou préparer ta soutenance.',
    tone: 'accent' as const,
  },
  {
    title: 'Sauvegarde',
    desc: 'Exporte ou importe ton journal en JSON pour ne rien perdre entre deux machines ou avant une réinstallation.',
    tone: 'morning' as const,
  },
]

const steps = [
  {
    n: '1',
    title: 'Ouvre l’application',
    text: 'Crée ta première journée et note ce que tu fais, ce que tu apprends et ce qui te surprend.',
  },
  {
    n: '2',
    title: 'Tiens le rythme',
    text: 'Quelques minutes par jour suffisent. Le vocal et la photo vont vite quand tu n’as pas le temps d’écrire.',
  },
  {
    n: '3',
    title: 'Synthétise',
    text: 'Quand tu en as besoin, passe sur Rapport IA pour transformer tes notes en document propre à rendre ou présenter.',
  },
]

const toneCard: Record<(typeof features)[0]['tone'], string> = {
  morning: 'border-morning/30 bg-morning/5',
  afternoon: 'border-afternoon/30 bg-afternoon/5',
  accent: 'border-accent/30 bg-accent/5',
}

const toneDot: Record<(typeof features)[0]['tone'], string> = {
  morning: 'bg-morning',
  afternoon: 'bg-afternoon',
  accent: 'bg-accent',
}

export function LandingPage() {
  return (
    <div className="min-h-screen text-ink">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <span className="font-display text-lg font-semibold text-ink">
            Journal de Stage
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-1.5 text-xs font-medium text-ink/60 transition hover:bg-white/80 hover:text-ink sm:text-sm"
            >
              GitHub
            </a>
            <Link
              to="/app/login"
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
            >
              Ouvrir l’app
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-accent">
            Pour lycée, BTS, BUT, licence, master…
          </p>
          <h1 className="mt-4 text-center font-display text-4xl font-bold leading-tight text-ink md:text-5xl lg:text-6xl">
            Ton journal de stage,
            <span className="text-accent"> sans prise de tête</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-ink/65">
            Une application web gratuite et locale pour noter chaque journée, garder des preuves (texte, audio, images)
            et générer des rapports avec l’intelligence artificielle quand tu dois rendre un document ou préparer une
            présentation.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/app/login"
              className="w-full rounded-xl bg-ink px-8 py-3.5 text-center text-sm font-semibold text-cream shadow-card transition hover:opacity-95 sm:w-auto"
            >
              Commencer maintenant
            </Link>
            <a
              href="#fonctionnalites"
              className="w-full rounded-xl border border-ink/15 bg-white/80 px-8 py-3.5 text-center text-sm font-medium text-ink/80 transition hover:bg-white sm:w-auto"
            >
              Voir les fonctionnalités
            </a>
          </div>
        </section>

        <section
          id="fonctionnalites"
          className="border-t border-ink/10 bg-white/40 px-4 py-16 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-display text-2xl font-bold text-ink md:text-3xl">
              Ce que tu peux faire
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink/55">
              Pensé pour les étudiants : rapide à utiliser, lisible, et utile jusqu’au jour J du rapport ou de l’oral.
            </p>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <li
                  key={f.title}
                  className={`rounded-2xl border p-6 shadow-card ${toneCard[f.tone]}`}
                >
                  <span className={`inline-block h-2 w-2 rounded-full ${toneDot[f.tone]}`} />
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{f.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
          <h2 className="text-center font-display text-2xl font-bold text-ink md:text-3xl">
            Comment ça marche
          </h2>
          <ol className="mt-12 space-y-8 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
            {steps.map((s) => (
              <li
                key={s.n}
                className="relative rounded-2xl border border-ink/10 bg-white/60 p-6 shadow-card"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-ink/10 bg-accent/10 px-4 py-16 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
              Prêt à documenter ton stage ?
            </h2>
            <p className="mt-3 text-sm text-ink/60">
              Connecte-toi avec ton identifiant stagiaire. Ton journal est enregistré sur le serveur ; tu peux aussi
              exporter une sauvegarde JSON depuis l’app.
            </p>
            <Link
              to="/app/login"
              className="mt-8 inline-flex rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-card transition hover:opacity-95"
            >
              Ouvrir Journal de Stage
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/10 px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center text-xs text-ink/45 sm:flex-row sm:text-left">
          <p>Journal de Stage — projet open source pour étudiants en stage.</p>
          <div className="flex gap-4">
            <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-accent">
              Code sur GitHub
            </a>
            <Link to="/app/login" className="hover:text-accent">
              Application
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
