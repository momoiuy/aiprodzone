import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)'
        },
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          ink: 'var(--accent-ink)',
          soft: 'var(--accent-soft)'
        },
        'accent-ink': 'var(--accent-ink)',
        'accent-soft': 'var(--accent-soft)',
        text: {
          DEFAULT: 'var(--text)',
          heading: 'var(--text-heading)',
          muted: 'var(--text-muted)'
        },
        'text-heading': 'var(--text-heading)',
        'text-muted': 'var(--text-muted)',
        'focus-ring': 'var(--focus-ring)'
      },
      fontFamily: {
        arabic: ['var(--font-cairo)', 'Cairo', 'var(--font-inter)', 'Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
