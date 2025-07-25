import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/simulators/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Enhanced dark mode palette
        dark: {
          primary: '#0F1115',    // Deep background
          secondary: '#1A1D23',  // Card backgrounds
          tertiary: '#252A32',   // Elevated surfaces
          accent: '#2F3540',     // Interactive elements
          border: '#3A4048',     // Borders and dividers
          text: {
            primary: '#FFFFFF',   // High contrast text
            secondary: '#E5E7EB', // Medium contrast text
            tertiary: '#9CA3AF',  // Low contrast text
            muted: '#6B7280',     // Disabled text
          },
        },
        light: {
          primary: '#FFFFFF',    // Pure white background
          secondary: '#F9FAFB',  // Light gray background
          tertiary: '#F3F4F6',   // Card backgrounds
          accent: '#E5E7EB',     // Interactive elements
          border: '#D1D5DB',     // Borders
          text: {
            primary: '#111827',   // Dark text
            secondary: '#374151', // Medium text
            tertiary: '#6B7280',  // Light text
            muted: '#9CA3AF',     // Disabled text
          },
        },
        // Simulator-specific accent colors
        simulator: {
          dfa: {
            light: '#10B981',
            dark: '#34D399',
            bg: 'rgba(16, 185, 129, 0.1)',
          },
          nfa: {
            light: '#8B5CF6',
            dark: '#A78BFA',
            bg: 'rgba(139, 92, 246, 0.1)',
          },
          pda: {
            light: '#F59E0B',
            dark: '#FBBF24',
            bg: 'rgba(245, 158, 11, 0.1)',
          },
          tm: {
            light: '#3B82F6',
            dark: '#60A5FA',
            bg: 'rgba(59, 130, 246, 0.1)',
          },
          fsm: {
            light: '#EF4444',
            dark: '#F87171',
            bg: 'rgba(239, 68, 68, 0.1)',
          },
        },
      },
      backgroundImage: {
        // Enhanced gradients for visual hierarchy
        'gradient-dark-primary': 'linear-gradient(135deg, #0F1115 0%, #1A1D23 100%)',
        'gradient-dark-secondary': 'linear-gradient(135deg, #1A1D23 0%, #252A32 100%)',
        'gradient-dark-tertiary': 'linear-gradient(135deg, #252A32 0%, #2F3540 100%)',
        'gradient-light-primary': 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
        'gradient-light-secondary': 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
        'gradient-light-tertiary': 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
        // Simulator gradients
        'gradient-dfa': 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)',
        'gradient-nfa': 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)',
        'gradient-pda': 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
        'gradient-tm': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.05) 100%)',
        'gradient-fsm': 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.05) 100%)',
      },
      boxShadow: {
        // Enhanced shadows for depth
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
        'light-glow': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
