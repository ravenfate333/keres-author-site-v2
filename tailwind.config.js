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
        'fade-scale-strong': {
          from: { opacity: 0, transform: 'translateY(0.5rem) scale(0.94)' },
          to:   { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 400ms ease-out forwards',
        'fade-scale-strong': 'fade-scale-strong 240ms cubic-bezier(0.2, 0.7, 0.3, 1) forwards',
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
