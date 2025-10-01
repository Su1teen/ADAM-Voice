import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}', 
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'apple-blue': '#0A84FF',
        'apple-green': '#30D158',
        'apple-orange': '#FF9F0A',
        'apple-red': '#FF453A',
        'apple-purple': '#BF5AF2',
        'apple-pink': '#FF375F',
        'apple-teal': '#64D2FF',
      },
      fontFamily: {
        'sf-pro': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      backdropBlur: {
        'apple': '32px',
        'apple-strong': '48px',
      },
      borderRadius: {
        'apple': '24px',
        'apple-lg': '28px',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.7)',
        'apple-md': '0 4px 16px rgba(0, 0, 0, 0.75)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.8)',
        'apple-xl': '0 16px 48px rgba(0, 0, 0, 0.85)',
        'apple-glow-blue': '0 0 24px rgba(10, 132, 255, 0.25)',
        'apple-glow-blue-strong': '0 0 48px rgba(10, 132, 255, 0.4)',
      },
    },
  },
} satisfies Config
