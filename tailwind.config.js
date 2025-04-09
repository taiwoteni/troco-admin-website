import { Colors } from './src/utils/Colors';


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    ".src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        themeColor:Colors.themeColor,
        tertiary:Colors.tertiary,
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.custom-scrollbar::-webkit-scrollbar': {
          width: '5px',
        },
        '.custom-scrollbar::-webkit-scrollbar-track': {
          background: 'transparent',
          'border-radius': '10px',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb': {
          background: Colors.themeColor,
          'border-radius': '10px',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          background: Colors.themeColor,

        },
      }, ['responsive', 'hover']);
    },
  ],
};

export default config;
