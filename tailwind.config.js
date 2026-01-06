/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#140E17',           // Main Background
          card: '#251A2A',         // Cards / Panels
          cardAlt: '#452B40',      // Alt Cards / Panels
          primary: '#CB7896',      // Primary (Pink/Rose)
          secondary: '#705367',    // Secondary (Muted Purple)
          accent: '#CB7896',       // Icons & Accents
          text: '#EFF5F3',          // Primary Text (Soft Green/White)
          textDim: '#A28FA1',      // Secondary Text (Brightened for Contrast)
        }
      },
    },
  },
  plugins: [],
}
