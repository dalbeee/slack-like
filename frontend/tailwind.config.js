/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "**/components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minHeight: {
        content: "95vh",
        top: "5vh",
      },
      height: {
        content: "95vh",
        leftColumnContent: "80vh",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
