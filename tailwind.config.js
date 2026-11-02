const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', ...fontFamily.serif],
        body: ['var(--font-body)', ...fontFamily.sans],
        serif: ['var(--font-heading)', ...fontFamily.serif],
      },
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        paper2: 'rgb(var(--paper-2) / <alpha-value>)',
        maroon: { DEFAULT: 'rgb(var(--maroon) / <alpha-value>)', light: 'rgb(var(--maroon-light) / <alpha-value>)' },
        gold: { DEFAULT: 'rgb(var(--gold) / <alpha-value>)', dark: 'rgb(var(--gold-dark) / <alpha-value>)' },
        ink: 'rgb(var(--ink) / <alpha-value>)',
        mute: 'rgb(var(--mute) / <alpha-value>)',
        rule: 'rgb(var(--rule) / <alpha-value>)',
        night: 'rgb(var(--night) / <alpha-value>)',
        dusk: 'rgb(var(--dusk) / <alpha-value>)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
    },
  },
  plugins: [
    require('@iconify/tailwind'),
  ],
};