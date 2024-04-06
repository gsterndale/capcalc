import { content, plugin } from "flowbite-react/tailwind";
/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./public/**/*.html",

  // Or if using `src` directory:
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  content({ base: "../" }),
];
export const theme = {
  extend: {},
};
export const plugins = [plugin()];
