/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        editorial: {
          bg: '#F5F2EB',
          fg: '#1A1A18',
          accent: '#A63A28',
          surface: '#EAE6D9',
        }
      }
    },
  },
  plugins: [],
}