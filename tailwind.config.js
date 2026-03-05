/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./ahmadcss/**/*.{html,js,py}",
    "../frappe/frappe/**/*.{html,js}",
    "../erpnext/erpnext/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        secondary: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Inter', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'material-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'material-2': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        'material-3': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        'material-4': '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
        'material-5': '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
      }
    },
  },
  plugins: [],
}
