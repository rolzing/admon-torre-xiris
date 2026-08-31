/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fa',
          100: '#dce6f4',
          200: '#bccde8',
          300: '#93aed7',
          400: '#6489c0',
          500: '#456ba8',
          600: '#35548b',
          700: '#2d4471',
          800: '#283a5e',
          900: '#1f2d48',
          950: '#141d30',
        },
        accent: {
          50: '#eefbf5',
          100: '#d6f5e5',
          200: '#b0eacf',
          300: '#7cd9b2',
          400: '#45bf8f',
          500: '#22a676',
          600: '#16845f',
          700: '#136a4e',
          800: '#125540',
          900: '#0f4636',
          950: '#082720',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,29,48,0.04), 0 4px 16px rgba(20,29,48,0.06)',
        'card-hover': '0 2px 4px rgba(20,29,48,0.06), 0 12px 32px rgba(20,29,48,0.12)',
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
