/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        "code::before": {
                            content: "&nbsp;&nbsp;",
                        },
                        "code::after": {
                            content: "&nbsp;&nbsp;",
                        },
                        code: {
                            background: "rgba(185, 185, 185, 0.2)",
                            wordWrap: "break-word",
                            boxDecorationBreak: "clone",
                            padding: ".2rem .4rem",
                            borderRadius: ".3rem",
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
