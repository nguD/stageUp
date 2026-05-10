/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F4EF',
        ink: '#1C1A17',
        accent: '#C17B4A',
        morning: '#4A7C9E',
        afternoon: '#7B6B9E',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 26, 23, 0.06), 0 4px 12px rgba(28, 26, 23, 0.04)',
        'card-hover':
          '0 4px 12px rgba(28, 26, 23, 0.08), 0 8px 24px rgba(28, 26, 23, 0.06)',
      },
    },
  },
  plugins: [],
}
