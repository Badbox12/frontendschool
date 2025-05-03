import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary:"bg-blue-300"
      },
      body: {
        'overflow-y-hidden': 'overflow-y: hidden',
      },
     
    },
  },
  plugins: [
    function({addUtilities} : any) {
      addUtilities({
        '.drop-shadow-glow': {
          'text-shadow': '0 0 6px #818cf8, 0 0 10px #6366f1, 0 0 2px #a5b4fc',
        },
      })

    }
  ],
} satisfies Config;
