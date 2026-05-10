/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /** Fond très clair légèrement bleu-violet */
        cream: '#EEF2FF',
        /** Texte principal — bleu nuit lisible */
        ink: '#151B2E',
        /** Actions / onglet actif — indigo vif */
        accent: '#6366F1',
        /** Bloc matin — cyan énergique */
        morning: '#0891B2',
        /** Bloc après-midi — magenta / violet */
        afternoon: '#A855F7',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(21, 27, 46, 0.06), 0 4px 14px rgba(99, 102, 241, 0.08)',
        'card-hover':
          '0 4px 14px rgba(21, 27, 46, 0.08), 0 10px 28px rgba(99, 102, 241, 0.12)',
      },
    },
  },
  plugins: [],
}
