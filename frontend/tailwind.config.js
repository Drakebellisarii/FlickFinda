/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy vintage deep-blue cinema palette
        'cinema-navy': {
          DEFAULT: '#0A1929',
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
          950: '#0A1929',
        },
        'deep-blue': '#0D1B2A',
        'navy-bg': '#0F1419',
        'dark-navy': '#000814',
        
        // Retro orange accents (warm, vintage feel)
        'retro-orange': {
          DEFAULT: '#FF6B35',
          light: '#FF8C61',
          dark: '#E6551F',
        },
        
        // Subtle gold details (elegant, premium)
        'gold': {
          DEFAULT: '#D4AF37',
          light: '#F4D03F',
          dark: '#B8941E',
          metallic: '#CFB53B',
        },
        
        // Apple-inspired neutrals
        'apple-gray': {
          50: '#F5F5F7',
          100: '#E8E8ED',
          200: '#D2D2D7',
          300: '#B0B0B5',
          400: '#86868B',
          500: '#6E6E73',
          600: '#515154',
          700: '#3A3A3C',
          800: '#2C2C2E',
          900: '#1C1C1E',
        },
        
        'glass-white': 'rgba(255, 255, 255, 0.95)',
        'glass-overlay': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(10, 25, 41, 0.85)',
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
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'gold-glow': '0 8px 25px rgba(212, 175, 55, 0.3)',
        'retro-glow': '0 8px 25px rgba(255, 107, 53, 0.3)',
        'card': '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'card-hover': '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'apple': '0 2px 10px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
