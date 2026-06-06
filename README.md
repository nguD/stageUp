# Journal de Stage

Application web pour tenir un **journal de stage** quotidien (texte, vocal, photos) et générer des synthèses avec **Claude** (API Anthropic).

## Stack

- [Vite](https://vitejs.dev/) + **React 18** + **TypeScript**
- [Tailwind CSS](https://tailwindcss.com/) v3
- **API Node (Express)** + **SQLite** — un journal par stagiaire connecté
- Authentification : **3 comptes privés** (login / mot de passe)
- IA : **Anthropic Messages API** (`claude-sonnet-4-20250514`)

## Prérequis

- Node.js 18+ (recommandé : LTS)

## Installation

```bash
git clone https://github.com/nguD/stageUp.git
cd stageUp
npm install
cp .env.example .env
```

Éditez `.env` :

- **`JWT_SECRET`** — chaîne longue et aléatoire (min. 16 caractères)
- **`STAGIAIRE1_USER` / `STAGIAIRE1_PASS` / `STAGIAIRE1_NAME`** (idem 2 et 3) — identifiants des 3 stagiaires
- **`VITE_ANTHROPIC_API_KEY`** (optionnel) — pour l’onglet Rapport IA

Les comptes sont **créés automatiquement** au premier démarrage du serveur s’ils n’existent pas encore.

## Scripts

```bash
npm run dev          # frontend :5173 + API :3001 (proxy /api)
npm run dev:web      # Vite seul
npm run dev:server   # API seule
npm run build        # dist/ + server/dist/
npm start            # production : API + fichiers statiques
```

- **Vitrine** : http://localhost:5173/
- **Connexion** : http://localhost:5173/app/login
- **Journal** : http://localhost:5173/app (après login)

## Comptes stagiaires

Chaque stagiaire a **son propre journal** en base. Les mots de passe sont hashés (bcrypt). Ne commitez jamais le fichier `.env`.

Exemple (à personnaliser dans `.env`) :

| Identifiant   | Variable mot de passe |
|---------------|------------------------|
| `stagiaire1`  | `STAGIAIRE1_PASS`      |
| `stagiaire2`  | `STAGIAIRE2_PASS`      |
| `stagiaire3`  | `STAGIAIRE3_PASS`      |

## Déploiement sur [Render](https://render.com/)

L’app est un **Web Service Node** (plus un simple site statique) avec disque persistant pour SQLite.

1. Déployer via [`render.yaml`](render.yaml) (*Blueprint*) ou créer un **Web Service**.
2. **Build** : `npm ci && npm run build`
3. **Start** : `node server/dist/index.js`
4. **Disque** : monter `/data`, variable `DATABASE_PATH=/data/journal.db`
5. Renseigner dans **Environment** : `JWT_SECRET`, les 3 paires `STAGIAIREn_USER/PASS/NAME`, optionnellement `VITE_ANTHROPIC_API_KEY` (au build).

## Fonctionnalités

- **Connexion** : espace privé par stagiaire
- **Journal** : matin / après-midi, texte, vocal, photo ; sauvegarde serveur à chaque modification
- **Export / import JSON** : sauvegarde locale téléchargeable (sidebar)
- **Rapport IA** : synthèse multi-jours via Claude
- **Propositions** : idées de tâches et de demandes en entreprise

## Sécurité

- Session par **cookie httpOnly** (JWT 30 jours)
- **`VITE_ANTHROPIC_API_KEY`** reste visible dans le bundle si définie au build — proto / usage personnel uniquement

## Structure

```
server/         API Express, SQLite, auth
src/            Frontend React
render.yaml     Déploiement Render (Web Service + disque)
```

## Licence

Projet privé / usage personnel sauf mention contraire.
