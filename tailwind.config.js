export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'hsl(var(--brand) / <alpha-value>)',
        },
        nav: {
          bg: 'hsl(var(--nav-bg) / <alpha-value>)',
          text: 'hsl(var(--nav-text))',
          textHover: 'hsl(var(--nav-text-hover))',
          accent: 'hsl(var(--nav-accent) / <alpha-value>)',
        },
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: {
        'fade-in': 'fade-in 400ms ease-out forwards',
      },
      transitionDuration: {
        soft: '250ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.17, 0.55, 0.55, 1)', // ease-out
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
