// tailwind.config.js (in your project root)
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sandstone: '#D4B483',
        nileTwilight: '#1E2D3B', // camelCase becomes kebab-case in classes
        pharaohBlack: '#0D1B1E',
        papyrus: '#F0E6D2',
        lapis: '#266691',
        sunset: '#B85C38',
        gold: '#C9A66B',
      },
    },
  },
  plugins: [],
}