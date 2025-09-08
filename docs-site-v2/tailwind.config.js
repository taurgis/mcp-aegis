import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      typography: {
        DEFAULT: {
          css: {
            'pre': {
              'overflow-x': 'auto',
              'word-wrap': 'normal',
              'white-space': 'pre',
            },
            'code': {
              'word-wrap': 'break-word',
            },
            'p code': {
              'word-break': 'break-word',
            },
            'li code': {
              'word-break': 'break-word',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};
