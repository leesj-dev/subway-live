import React from "react";
import { LineSelectorProps } from "../types";

const LineSelector: React.FC<LineSelectorProps> = ({ selectedLine, handleLineChange, stations }) => {
    return (
        <div className="mb-4">
            <label htmlFor="line" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                노선명
            </label>
            <select
                id="line"
                value={selectedLine}
                onChange={handleLineChange}
                className="mt-1 block w-36 pl-3 py-2 text-center text-base border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
                <option value="">노선 선택</option>
                {Object.keys(stations).map((line, index) => (
                    <option key={index} value={line}>
                        {line}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LineSelector;
