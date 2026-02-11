/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy/Blue colors from HTML templates
        'cinema-navy': {
          DEFAULT: '#1E3A8A',
          50: '#E0E7FF',
          100: '#C7D2FE',
          200: '#A5B4FC',
          300: '#818CF8',
          400: '#6366F1',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#1E3A8A',
          950: '#0F172A',
        },
        'deep-blue': '#3730A3',
        'navy-bg': '#0F172A',
        'dark-navy': '#0B1426',
        
        // Gold/Amber accents from HTML templates
        'retro-orange': {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        
        // Gold from HTML templates
        'gold': {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
          metallic: '#FBBF24',
        },
        
        // Slate/Gray neutrals from HTML templates
        'apple-gray': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        
        'glass-white': 'rgba(255, 255, 255, 0.95)',
        'glass-overlay': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(30, 58, 138, 0.85)',
      },
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(30, 58, 138, 0.2)',
        'gold-glow': '0 8px 25px rgba(245, 158, 11, 0.3)',
        'retro-glow': '0 8px 25px rgba(245, 158, 11, 0.3)',
        'card': '0 10px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(245, 158, 11, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 2px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'apple': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'apple-lg': '0 10px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
