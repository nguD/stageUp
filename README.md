# Journal de Stage

Application web pour tenir un **journal de stage** quotidien (texte, vocal, photos) et générer des synthèses avec **Claude** (API Anthropic).

## Stack

- [Vite](https://vitejs.dev/) + **React 18** + **TypeScript**
- [Tailwind CSS](https://tailwindcss.com/) v3
- Persistance dans le **navigateur** (`localStorage`)
- IA : **Anthropic Messages API** (`claude-sonnet-4-20250514`)

## Prérequis

- Node.js 18+ (recommandé : LTS)

## Installation

```bash
git clone https://github.com/nguD/stageUp.git
cd stageUp
npm install
```

Créez un fichier `.env` à la racine (voir [`.env.example`](.env.example)) :

```bash
cp .env.example .env
# Éditez .env et ajoutez votre clé :
# VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Relancez le serveur de développement après toute modification de `.env`.

## Scripts

```bash
npm run dev      # http://localhost:5173
npm run build    # production dans dist/
npm run preview  # prévisualiser le build
```

## Fonctionnalités

- **Journal** : liste des journées, création du jour courant, périodes **Matin** / **Après-midi**, entrées texte, enregistrement vocal (MediaRecorder), photo + légende (base64).
- **Rapport IA** : sélection multi-jours, choix du type de document (rapport formel, apprentissages, plan de slides), génération via l’API, copie du résultat, statistiques globales et sur la sélection.

## Sécurité et clé API

La variable `VITE_ANTHROPIC_API_KEY` est injectée **côté client** au build : toute personne peut voir la clé dans le bundle si vous déployez l’app telle quelle. Ce modèle convient à un **usage personnel / local** ou à un mode « apportez votre propre clé » en confiance. Pour un déploiement public, préférez un **backend** ou une fonction serverless qui appelle Anthropic sans exposer la clé.

L’API est appelée depuis le navigateur avec l’en-tête requis `anthropic-dangerous-direct-browser-access` (voir [documentation Anthropic](https://docs.anthropic.com/)).

## Structure des sources

```
src/
  components/   Sidebar, DayView, EntryCard, AddEntryBlock, RapportView
  hooks/        useStorage, useRecorder
  lib/          anthropic, journalPrompt, blob, dates
  types/
  App.tsx
  main.tsx
```

## Licence

Projet privé / usage personnel sauf mention contraire.
