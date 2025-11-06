/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef6ff',
          100: '#dbeefe',
          200: '#b6ddfe',
          500: '#27548A', // your blue
          600: '#1f436f',
        },
        accent: {
          DEFAULT: '#DDA853', // gold
        },
        neutralbg: {
          DEFAULT: '#F3F3E0', // cream background
        },
      },
      screens: {
        'md': '768px',   // tablet
        'md2': '991px',  // custom in-between
        'lg': '1024px',  // desktop breakpoint you asked
      },
    },
  },
  plugins: [],
}

