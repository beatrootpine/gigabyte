/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gigabyte: {
          primary: '#1F1FFF',
          accent: '#FFD700',
          dark: '#0F0F1F',
          surface: '#1A1A2E',
          text: '#F5F5F5',
          'text-muted': '#A0A0A0',
          success: '#00D084',
          error: '#FF4444',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      spacing: {
        '4xs': '2px',
        '3xs': '4px',
        '2xs': '8px',
        'xs': '12px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
      },
    },
  },
  plugins: [],
}
