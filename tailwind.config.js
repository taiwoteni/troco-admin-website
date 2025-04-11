/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",


  ],
  theme: {
    extend: {
      fontFamily:{
        lato: ['var(--font-lato)'],
        quicksand: ['var(--font-quicksand)']
      },
      colors: {
        themeColor: '#109E15',
        tertiary: '#F9F8F6',
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
          background: '#109E15',
          'border-radius': '10px',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          background: '#109E15',

        },
      }, ['responsive', 'hover']);
    },
  ],
};
