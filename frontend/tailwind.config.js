/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#111827',
        border: '#1F2937',
        primary: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#34D399',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          light: '#F87171',
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FBBF24',
        },
        safe: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#34D399',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-danger': '0 0 25px -5px rgba(239, 68, 68, 0.25)',
        'glow-warning': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

