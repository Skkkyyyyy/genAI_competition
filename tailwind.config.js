/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        bg1:'#fafafa',
        bg2:'#ffffff',
        primary:'#82ddf0',
        secondary:'#5296a5',
        tertiary:'#eaf5f7',
        text:'#cccccc',
      }
    },
  },
  plugins: [],
}

