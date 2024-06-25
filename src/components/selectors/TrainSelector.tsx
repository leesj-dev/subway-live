import React from "react";
import Select from "../react-tailwindcss-select/Select";
import { SelectValue } from "../react-tailwindcss-select/type";
import { TrainSelectorProps } from "../../types";

const TrainSelector: React.FC<TrainSelectorProps> = ({ selectedTrain, handleTrainChange, trains, selectedLine, destinations }) => {
    const trainOptions = [
        {
            label: `${destinations[selectedLine]?.up_info}행`,
            options: trains[selectedLine]?.up_info.sort((a, b) => a.localeCompare(b)).map((train) => ({ label: train, value: train })),
        },
        {
            label: `${destinations[selectedLine]?.down_info}행`,
            options: trains[selectedLine]?.down_info.sort((a, b) => a.localeCompare(b)).map((train) => ({ label: train, value: train })),
        },
    ];

    const handleChange = (value: SelectValue) => {
        if (value && !Array.isArray(value) && typeof value !== "string") {
            handleTrainChange({ target: { value: value.value } } as React.ChangeEvent<HTMLSelectElement>);
        } else {
            handleTrainChange({ target: { value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        }
    };

    // Flatten all options to search for the selected train
    if (!selectedLine) return null;
    const allOptions = trainOptions.flatMap((group) => group.options);
    const selectedOption = allOptions.find((option) => option.value === selectedTrain) || null;

    return (
        <div className="mb-4">
            <label htmlFor="station-select" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                열차번호
            </label>
            <div className="mt-1 block min-w-[10.5rem]">
                <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={trainOptions}
                    isDisabled={!selectedLine}
                    isSearchable={true}
                    searchType={"numeric"}
                    noOptionsMessage={"검색결과가 없습니다"}
                    placeholder={"열차 선택"}
                />
            </div>
        </div>
    );
};

export default TrainSelector;
