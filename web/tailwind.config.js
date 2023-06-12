/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "../node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
    "../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
