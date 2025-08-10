// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     darkMode: 'class',
//     content: [
//       './pages/**/*.{js,ts,jsx,tsx,mdx}',
//       './components/**/*.{js,ts,jsx,tsx,mdx}',
//       './app/**/*.{js,ts,jsx,tsx,mdx}',
//     ],
//     theme: {
//       extend: {
//         backgroundImage: {
//           'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//           'gradient-conic':
//             'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
//         },
//         colors: {
//           // Custom colors for light/dark mode
//           'light-bg': '#f8f9fa',
//           'light-surface': '#ffffff',
//           'light-text': '#212529',
//           'dark-bg': '#0f172a',
//           'dark-surface': '#1e293b',
//           'dark-text': '#f1f5f9',
//         },
//         animation: {
//           'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         },
//       },
//     },
//     plugins: [],
//   }








import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Add this line for class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Keep all your existing theme extensions
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;