/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./node_modules/react-tailwindcss-select/dist/index.esm.js"],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        "code::before": {
                            content: "",
                        },
                        "code::after": {
                            content: "",
                        },
                        code: {
                            background: "rgba(180, 180, 180, 0.2)",
                            wordWrap: "break-word",
                            boxDecorationBreak: "clone",
                            padding: ".1rem .2rem",
                            borderRadius: ".2rem",
                        },
                    },
                },
            },
        },
        fontFamily: {
            Pretendard: ["Pretendard"],
        },
    },
    plugins: [typography],
};
