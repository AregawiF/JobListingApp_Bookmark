import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        mygreen: '#56CDAD',
        bgGreen: '#56CDAD',
        mygray: '#7C8493',
        myorange: '#FFB836',
        mypurple: '#4640DE',
        cardHover: '#D6DDEB',
        graybg: '#F8F8FD',
        darkgray: '#515B6F',
        orangeBG: '#EB8533',
        primaryPurple:'#4640DE', 
        darkerPrimaryPurple: '#1a167f', 
        formGray: '#202430',
        errorRed: '#F44336',
        
      },
      fontFamily: {
        Epilogue : ['Epilogue'],
        Poppins : ['Poppins'], 
        Roboto: ['Roboto']
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
export default config;
