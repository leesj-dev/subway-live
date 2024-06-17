import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const HomePage: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>("");
    useEffect(() => {
        fetch("/subway-live/guide.md")
            .then((response) => response.text())
            .then((text) => setMarkdown(text));
    }, []);
    return (
        <div className="p-6">
            <Markdown remarkPlugins={[remarkGfm]} className="prose lg:prose-lg prose-gray dark:prose-invert mx-auto text-left leading-snug lg:leading-snug">
                {markdown}
            </Markdown>
            <footer className="mt-10 text-center w-full text-gray-400 dark:text-gray-500">&copy; 2024 이승준. All Rights Reserved.</footer>
        </div>
    );
};

export default HomePage;
