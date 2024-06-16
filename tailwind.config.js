/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
        fontFamily: {
            Pretendard: ["Pretendard"],
        },
    },
    plugins: [typography],
};
