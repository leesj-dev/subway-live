import React from "react";
import Select from "react-tailwindcss-select";
import useSelect from "../../hooks/useSelect";
import stations from "../../constants/stations";

interface LineSelectorProps {
    selectedLine: string;
    handleLineChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const LineSelector: React.FC<LineSelectorProps> = ({ selectedLine, handleLineChange }) => {
    const lineOptions = Object.keys(stations).map((line) => ({
        label: line,
        value: line,
    }));

    const { selectedOption, handleChange } = useSelect({
        options: lineOptions,
        selectedValue: selectedLine,
        handleChangeCallback: (value) => handleLineChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>),
    });

    return (
        <div className="mb-4">
            <label htmlFor="station-select" className="block text-base font-medium text-zinc-700 dark:text-zinc-300">
                노선명
            </label>
            <div className="mt-1 block min-w-[10.5rem]">
                <Select value={selectedOption} onChange={handleChange} options={lineOptions} noOptionsMessage={"검색결과가 없습니다"} placeholder={"노선 선택"} />
            </div>
        </div>
    );
};

export default LineSelector;
