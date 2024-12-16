/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/primereact/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [],
};
