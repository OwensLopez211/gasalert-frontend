/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customDark: '#0D1117', // Color del fondo del Dashboard
        dashboardBackground: '#111517', // Fondo oscuro principal (usado como en tu LoginPage)
        gray950: '#1F2937', // Alternativa para el fondo actual del Dashboard
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"), // Para ocultar scrollbars cuando sea necesario
  ],
};
