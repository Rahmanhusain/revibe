/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        slide: "slide 10s linear infinite",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-200%)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        popIn: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.25)" },
          "75%": { transform: "scale(1)" },
          "90%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        popOut: {
          "0%": { transform: "scale(1)" },
          "20%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(0)" },
        },
        popInSimple: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        popOutSimple: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0)" },
        },
        rotateBackAndForth: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(5deg)" },
          "50%": { transform: "rotate(0deg)" },
          "75%": { transform: "rotate(-5deg)" },
        },
        dropped: {
          "0%": {
            transform: "translateY(-40px)",
            "animation-timing-function": "linear",
          },
          "30%": {
            transform: "none",
            "animation-timing-function": "linear",
          },
          "50%": {
            transform: "translateY(-30px)",
            "animation-timing-function": "linear",
          },
          "60%": {
            transform: "none",
            "animation-timing-function": "linear",
          },
          "70%": {
            transform: "translateY(-22.5px)",
            "animation-timing-function": "linear",
          },
          "80%": {
            transform: "none",
            "animation-timing-function": "linear",
          },
          "90%": {
            transform: "translateY(-7.875px)",
            "animation-timing-function": "linear",
          },
          "100%": {
            transform: "none",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in",
        rotateBackAndForth: "rotateBackAndForth 2s linear infinite",
        dropped: "dropped 0.5s linear",
        popIn: "popIn 0.3s linear",
        popOut: "popOut 0.3s linear",
        popInSimple: "popInSimple 0.45s cubic-bezier(0.77, 0.2, 0.05, 1)",
        popOutSimple: "popOutSimple 0.45s cubic-bezier(0.77, 0.2, 0.05, 1)",
        "spin-fast": "spin 600ms linear infinite",
      },
    },
  },
  plugins: [],
}

