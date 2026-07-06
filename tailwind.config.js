/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        content: "var(--container-main)",
        "content-wide": "var(--container-wide)",
        "content-narrow": "var(--container-narrow)",
      },
      spacing: {
        "ds-1": "var(--space-1)",
        "ds-2": "var(--space-2)",
        "ds-3": "var(--space-3)",
        "ds-4": "var(--space-4)",
        "ds-5": "var(--space-5)",
        "ds-6": "var(--space-6)",
      },
      borderRadius: {
        ds: "var(--radius-default)",
        "ds-lg": "var(--radius-lg)",
      },
      boxShadow: {
        "ds-sm": "var(--shadow-sm)",
        "ds-md": "var(--shadow-md)",
        "ds-lg": "var(--shadow-lg)",
        "ds-xl": "var(--shadow-xl)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      transparent: colors.transparent,
      current: colors.current,
      inherit: colors.inherit,

      black: colors.black,
      white: colors.white,

      slate: colors.slate,
      gray: colors.gray,
      zinc: colors.zinc,
      neutral: colors.neutral,
      stone: colors.stone,

      red: colors.red,
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      lime: colors.lime,
      green: colors.green,
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      rose: colors.rose,

      primary: {
  50: '#fff8e1',
  100: '#ffecb3',
  200: '#ffe082',
  300: '#ffd54f',
  400: '#ffca28',
  500: '#ffb700',
  600: '#ffa000',
  700: '#ff8f00',
  800: '#ff6f00',
  900: '#ffb700',
  DEFAULT: '#ffb700',
  hover: '#ffca28',
  'text-hover': '#ffca28',
},
      secondary: {
  50: '#fff8e1',
  100: '#ffecb3',
  200: '#ffe082',
  300: '#ffd54f',
  400: '#ffca28',
  500: '#ffb700',
  600: '#ffa000',
  700: '#ff8f00',
  800: '#ff6f00',
  900: '#ffb700',
  DEFAULT: '#ffb700',
},
    },
  },
  plugins: [],
};
