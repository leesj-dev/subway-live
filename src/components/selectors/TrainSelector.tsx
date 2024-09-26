import React, { useMemo } from "react";
import useStore from "../../store";
import Select from "react-tailwindcss-select";
import useSelect from "../../hooks/useSelect";
import directions from "../../constants/directions";
import trains from "../../constants/trains";

const TrainSelector: React.FC = () => {
    const { selectedLine, selectedTrain } = useStore();
    const trainOptions = useMemo(
        () =>
            selectedLine
                ? [
                      {
                          label: `${directions[selectedLine]?.up_info}행`,
                          options: trains[selectedLine]?.up_info.sort((a, b) => a.localeCompare(b)).map((train) => ({ label: train, value: train })),
                      },
                      {
                          label: `${directions[selectedLine]?.down_info}행`,
                          options: trains[selectedLine]?.down_info
                              .sort((a, b) => a.localeCompare(b))
                              .map((train) => ({ label: train, value: train })),
                      },
                  ]
                : [],
        [selectedLine]
    );

    const allOptions = trainOptions.flatMap((group) => group.options);

    const { selectedOption, handleChange } = useSelect({
        options: allOptions,
        selectedValue: selectedTrain,
        handleChangeCallback: (value) => {
            useStore.setState({ selectedTrain: value, arrivalInfo: null, trainTableData: null });
        },
    });

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
