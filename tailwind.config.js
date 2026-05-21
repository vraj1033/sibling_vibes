/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        blush: '#FFD6E0',
        peach: '#FFB347',
        dusty: '#C4A882',
        mocha: '#6B4226',
        sienna: '#A0522D',
        rose: '#FF8FAB',
        lavender: '#DBC4F0',
        midnight: '#0D0D1A',
        starlight: '#F5E6CA',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
        cursive: ['"Dancing Script"', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'swing': 'swing 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'heart-pop': 'heartPop 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        swing: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,143,171,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,143,171,0.8), 0 0 60px rgba(255,179,71,0.4)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        heartPop: {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '60%': { transform: 'scale(1.3)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
