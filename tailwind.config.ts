import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    colors:{
      'gray': {
          100: '#D0D0D0',
          200: '#D0D0D0',
          300: '#D0D0D0',
          400: '#9A9A9A',
          500: '#D0D0D0',
          600: '#9A9A9A',
          700: '#9A9A9A',
          800: '#D0D0D0',
          900: '##D0D0D0',
    },
        
         'white': '#ffffff',
          'blue': {
          100: '#008BD0',
          200: '#008BD0',
          300: '#008BD0',
          400: '#008BD0',
          500: '#008BD0',
          600: '#008BD0',
          700: '#008BD0',
          800: '#008BD0',
          900: '#008BD0',
    }},
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;



