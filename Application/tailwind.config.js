/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/routers/**/*.{js,jsx,ts,tsx}",
  ],
    
  theme: {
    extend: {
      // boxShadow: {
      //   'custom': '0px -7px 25px 25px white',
      // }
      colors: {
        "primary": "rgb(249,97,99 )",
      },
      spacing: {
        "profile": '95px', // Replace '24rem' with your desired size
      },
    }
  },
  plugins: [],
}

