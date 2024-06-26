import React from "react";
import Select from "react-tailwindcss-select";
import useSelect from "../../hooks/useSelect";

interface DirectionSelectorProps {
    direction: string;
    setDirection: (value: string) => void;
    data: { [day: string]: { direction: string }[] };
}

const DirectionSelector: React.FC<DirectionSelectorProps> = ({ direction, setDirection, data }) => {
    const directionOptions = Array.from(new Set(data.weekday.map((train) => train.direction))).map((dir) => ({
        label: dir,
        value: dir,
    }));

    const { selectedOption, handleChange } = useSelect({
        options: directionOptions,
        selectedValue: direction,
        handleChangeCallback: (value) => setDirection(value),
    });

    return (
        <div className="mb-4">
            <label htmlFor="direction-select" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                방향
            </label>
            <div className="mt-1 block min-w-32">
                <Select value={selectedOption} onChange={handleChange} options={directionOptions} noOptionsMessage="검색결과가 없습니다" placeholder="방향 선택" />
            </div>
        </div>
    );
};

export default DirectionSelector;
