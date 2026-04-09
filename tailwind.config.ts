import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b1120',
        surface: '#111827',
        accent: '#7c3aed',
      },
    },
  },
  plugins: [],
}

export default config
