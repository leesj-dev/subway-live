import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const HomePage: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch("/subway-live/guide.md")
            .then((response) => response.text())
            .then((text) => {
                setMarkdown(text);
                setIsLoading(false);
            });
    }, []);

    if (!isLoading) {
        return (
            <div className="p-6">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm md:prose-base lg:prose-lg prose-gray dark:prose-invert mx-auto text-left leading-normal lg:leading-snug"
                >
                    {markdown}
                </Markdown>
                <footer className="mt-10 text-center w-full text-gray-400 dark:text-gray-500">&copy; 2024 이승준. All Rights Reserved.</footer>
            </div>
        );
    }
};

export default HomePage;
