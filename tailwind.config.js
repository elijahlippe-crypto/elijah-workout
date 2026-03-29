/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        surface: '#1a1a1a',
        card: '#242424',
        border: '#2e2e2e',
        accent: '#3b82f6',
        orange: '#f97316',
        muted: '#6b7280',
        text: '#e5e7eb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
