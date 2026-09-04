/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF9F2',
          100: '#F7F5EC',
          200: '#EFECE0',
        },
        nutri: {
          lime: '#D5FF3F',
          pink: '#FF2A85',
          cyan: '#26E1E8',
          purple: '#8B5CF6',
          dark: '#0E1118',
          card: '#11141E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
