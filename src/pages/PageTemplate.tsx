import React from "react";
import SyncLoader from "react-spinners/SyncLoader";
import LineSelector from "../components/selectors/LineSelector";

interface PageTemplateProps {
    title: string;
    content: JSX.Element | null;
    loading: boolean;
    entitySelector: JSX.Element;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, content, loading, entitySelector }) => {
    return (
        <div className="px-3 py-3">
            <h1 className="text-2xl text-gray-900 dark:text-gray-100 font-bold mb-8 break-keep">{title}</h1>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-8">
                <LineSelector />
                {entitySelector}
            </div>
            {loading ? (
                <div className="mt-[10vh]">
                    <SyncLoader color={"#718096"} size={20} />
                </div>
            ) : (
                content
            )}
        </div>
    );
};

export default PageTemplate;
