/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#dc2626',
          darkRed: '#991b1b',
          glass: 'rgba(15, 23, 42, 0.75)',
        }
      }
    },
  },
  plugins: [],
}
