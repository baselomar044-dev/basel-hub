/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa',
        },
        accent: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399',
        },
        background: {
          DEFAULT: '#0a0a0f',
          secondary: '#0d1117',
        },
        surface: {
          DEFAULT: '#161b22',
          hover: '#1e2430',
          active: '#252d3a',
        },
        border: {
          DEFAULT: '#1e293b',
          light: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
    },
  },
  plugins: [],
}
