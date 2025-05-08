/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo["500"],
        'primary-active': colors.indigo["600"],
        'primary-hover': colors.indigo["400"]
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

