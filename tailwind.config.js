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
          50: '#ede7f6',
          100: '#d1c4e9',
          200: '#b39ddb',
          300: '#9575cd',
          400: '#7e57c2',
          500: '#673ab7',
          600: '#5e35b1',
          700: '#512da8',
          800: '#4527a0',
          900: '#311b92',
        },
        secondary: {
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688',
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', '-apple-system', 'sans-serif'],
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
