import React from 'react';

interface LineSelectorProps {
    selectedLine: string;
    handleLineChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    stations: {
        [key: string]: Array<{ name: string; id: string }>;
    };
}

const LineSelector: React.FC<LineSelectorProps> = ({ selectedLine, handleLineChange, stations }) => {
    return (
        <div className="mb-4">
            <label htmlFor="line" className="block text-base font-medium text-gray-700">
                노선명
            </label>
            <select
                id="line"
                value={selectedLine}
                onChange={handleLineChange}
                className="mt-1 block w-full pl-3 py-2 text-center text-base border-gray-300 rounded-md"
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