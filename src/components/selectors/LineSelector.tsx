import React from "react";
import Select from "react-tailwindcss-select";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import { LineSelectorProps } from "../../types";

const StationSelector: React.FC<LineSelectorProps> = ({ selectedLine, handleLineChange, stations }) => {
    const lineOptions = Object.keys(stations).map((line) => ({
        label: line,
        value: line,
    }));

    const handleChange = (value: SelectValue) => {
        if (value && !Array.isArray(value) && typeof value !== "string") {
            handleLineChange({ target: { value: value.value } } as React.ChangeEvent<HTMLSelectElement>);
        } else {
            handleLineChange({ target: { value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        }
    };

    return (
        <div className="mb-4">
            <label htmlFor="station-select" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                노선명
            </label>
            <div className="mt-1 block min-w-[10.5rem]">
                <Select
                    value={lineOptions.find((option) => option.value === selectedLine) || null}
                    onChange={handleChange}
                    options={lineOptions}
                    noOptionsMessage={"검색결과가 없습니다"}
                    placeholder={"노선 선택"}
                />
            </div>
        </div>
    );
};

export default StationSelector;
