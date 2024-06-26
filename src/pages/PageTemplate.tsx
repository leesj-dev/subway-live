import React from "react";
import SyncLoader from "react-spinners/SyncLoader";
import LineSelector from "../components/selectors/LineSelector";
import { PageTemplateProps } from "../types";

const PageTemplate: React.FC<PageTemplateProps> = ({ title, selectedLine, handleLineChange, loading, content, entitySelector }) => {
    return (
        <div className="px-4 py-6">
            <h1 className="text-2xl text-gray-900 dark:text-gray-100 font-bold mb-8 break-keep">{title}</h1>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
                <LineSelector selectedLine={selectedLine} handleLineChange={handleLineChange} />
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
