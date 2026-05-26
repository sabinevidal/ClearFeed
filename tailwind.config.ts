import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#faf8f4',
          100: '#f5f0e6',
          200: '#ebe6db',
          300: '#e0d9cc',
          400: '#d9d3c7',
        },
        brand: {
          dark: '#1a1a1a',
          body: '#5a5347',
          muted: '#8a7f72',
          border: '#ece7dc',
        },
        accent: {
          gold: '#d4a017',
          'gold-light': '#fef3cd',
        },
        status: {
          safe: '#2e7d32',
          'safe-light': '#f0f7f0',
          warning: '#e65100',
          'warning-light': '#fff0f0',
        },
      },
      fontFamily: {
        sans: ['Arial', 'Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
