/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sanchay: {
          deepNavy: '#062A4A',
          darkNavy: '#073B63',
          navyAccent: '#0A4A7A',
          gold: '#C9A227',
          goldLight: '#E5C358',
          goldHover: '#B8921E',
          cream: '#F7F1E3',
          creamLight: '#FAF6EE',
          creamDark: '#EFE7D5',
          textDark: '#1F2933',
          textMuted: '#52606D',
          borderCream: '#E2D8C3',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        archival: '0 4px 20px -2px rgba(6, 42, 74, 0.08), 0 2px 6px -1px rgba(6, 42, 74, 0.04)',
        goldGlow: '0 0 15px rgba(201, 162, 39, 0.3)',
      }
    },
  },
  plugins: [],
}
