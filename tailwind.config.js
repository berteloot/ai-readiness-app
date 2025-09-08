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
        // LSG Brand Colors - Primary blues
        'lean-blue': '#0099ff',
        'momentum-blue': '#006ef2',
        'trust-navy': '#002e66',
        'midnight-core': '#001f38',

        // LSG Brand Colors - Neutrals
        'soft-slate': '#e2e9ea',
        'paper-offwhite': '#f5f5f7',
        'altitude-white': '#e3e8eb',

        // LSG Brand Colors - Accents
        'lavender-mist': '#a3a6fa',
        'aqua-breeze': '#abe8e5',
        'solar-orange': '#ff8221',
        'sandstone': '#d6d1bd',

        // LSG Brand Colors - Night accents
        'lavender-mist-night': '#170a47',
        'aqua-breeze-night': '#0a3847',
        'solar-orange-night': '#450d0a',
        'sandstone-night': '#452e0a',

        // Legacy colors for backward compatibility
        primary: {
          50: '#e9f0fb',
          100: '#d3e1f7',
          200: '#a7c3ef',
          300: '#7aa5e7',
          400: '#4e87df',
          500: '#2b6fd8',
          600: '#1f58ad',
          700: '#184383',
          800: '#112e59',
          900: '#0b203d',
          DEFAULT: '#0099ff', // Updated to lean-blue
        },
        accent: {
          50: '#fff2e8',
          100: '#ffd9bf',
          200: '#ffbf99',
          300: '#ffa472',
          400: '#ff8a4b',
          500: '#f5721f',
          600: '#c95a1a',
          700: '#9e4514',
          800: '#73310e',
          900: '#4f2109',
          DEFAULT: '#ff8221', // Updated to solar-orange
        },
        success: '#1f9d55',
        warning: '#f59e0b',
        error: '#dc2626',
        neutral: {
          0: '#ffffff',
          50: '#f7f8fb',
          100: '#eef1f6',
          200: '#dfe5ef',
          300: '#c8d1e0',
          400: '#a3afc4',
          500: '#7e8ca6',
          600: '#5c6a86',
          700: '#3e4a62',
          800: '#243043',
          900: '#141b27',
          DEFAULT: '#243043',
        },
        background: {
          surface: '#ffffff',
          muted: '#f7f8fb',
          elevated: '#ffffff',
        },
        text: {
          primary: '#141b27',
          secondary: '#3e4a62',
          onPrimary: '#ffffff',
          onAccent: '#ffffff',
        },
        border: {
          subtle: '#eef1f6',
          default: '#dfe5ef',
          strong: '#c8d1e0',
        },
      },
      fontFamily: {
        sans: ['FormaDJR', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['FormaDJR', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['FormaDJR', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
      },
      boxShadow: {
        'card': '0 8px 24px rgba(0,0,0,0.08)',
        'popover': '0 12px 28px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
