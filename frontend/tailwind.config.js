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
        contentTitle: "50px",
        contentBottom: "120px",
      },
      gridTemplateRows: {
        contentWithBottom: "50px minmax(300px, auto) 120px",
        contentWithoutBottom: "50px minmax(300px, auto)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
