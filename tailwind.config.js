/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ["'Roboto'", 'sans-serif'],
      },
      colors: {
        'white': '#ffffff',
        'black': '#1E1F20',
        'primary': '#009ea9',
        'primary-light': '#e6feff',
        'secondary': '#db8104',
        'warn': '#db8104',       
        'light-bg': '#F7F7F7',       
        'dark-txt': '#0e2238',       
        'color-txt': '#737373',       
      },
    }
  },
  plugins: [
    plugin(function ({
      addBase,
      addComponents,
      addUtilities,
    }) {
      addBase({})
      addComponents({})
      addUtilities({})
    })
  ],
}