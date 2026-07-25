/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Keep existing colors (so existing code doesn't break)
        primary: '#8B4513',
        secondary: '#D4A574',
        accent: '#C68E5C',
        
        // Add new colors
        ink: '#0B0B0C',
        'ink-soft': '#17161A',
        bone: '#EDE6D8',
        gold: '#B8923F',
        'gold-light': '#D9B872',
        'gold-dark': '#8C6C2E',
        oxblood: '#6B2A1D',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // ✅ New animations
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-6px) scale(1.03)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(184,146,63,0.35)' },
          '50%': { boxShadow: '0 0 0 14px rgba(184,146,63,0)' },
        },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        'fade-up': 'fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        // ✅ New animations
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}