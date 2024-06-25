import React, { forwardRef } from "react";
import { SearchIcon } from "./Icons";

interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    searchType?: "text" | "numeric";
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput({ placeholder = "", value = "", onChange, name = "", searchType = "text" }, ref) {
    return (
        <div className="relative py-1 px-2.5">
            <SearchIcon className="absolute w-5 h-5 mt-2.5 pb-0.5 ml-2 text-gray-500" />
            <input
                ref={ref}
                className="w-full py-2 pl-8 text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-gray-200 dark:focus:border-gray-500 focus:ring-0 focus:outline-none"
                type="text"
                inputMode={searchType}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
            />
        </div>
    );
});

export default SearchInput;
