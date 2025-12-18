/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './side-panel.html',
    './side-panel.tsx',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // Color Palette: Teal/Cyan/Electric Blue (UI-003)
      colors: {
        // Primary accent colors
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Primary cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        electric: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Electric blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Dark mode base colors
        dark: {
          bg: '#0a0a0a', // Dark background (UI-001)
          surface: '#1a1a1a', // Surface color for panels
          border: '#2a2a2a', // Border color
          text: '#ededed', // Light text (UI-001)
          'text-muted': '#a0a0a0', // Muted text
        },
      },
      // Typography Scale (T037)
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      // Glassmorphism & Effects (UI-002, UI-004)
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        // Soft glows and ambient shadows (UI-004)
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-electric': '0 0 20px rgba(59, 130, 246, 0.3)',
        'ambient-sm': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'ambient-md': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'ambient-lg': '0 8px 24px rgba(0, 0, 0, 0.25)',
      },
      // Rounded corners (UI-005)
      borderRadius: {
        'glass': '12px', // Standard glassmorphism panel radius
        'card': '8px', // Card radius
        'button': '6px', // Button radius
      },
      // Transitions (UI-014)
      transitionDuration: {
        'smooth': '250ms', // 200-300ms range
      },
      // Elevation for hover effects (UI-015)
      transform: {
        'lift': 'translateY(-2px)',
      },
    },
  },
  plugins: [],
};


