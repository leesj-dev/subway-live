import React from "react";
import useStore from "../../store";
import Select from "react-tailwindcss-select";
import useSelect from "../../hooks/useSelect";
import stations from "../../constants/stations";
import directions from "../../constants/directions";

const LineSelector: React.FC = () => {
    const { selectedLine } = useStore();
    const lineOptions = Object.keys(stations).map((line) => ({
        label: line,
        value: line,
    }));

    const { selectedOption, handleChange } = useSelect({
        options: lineOptions,
        selectedValue: selectedLine,
        handleChangeCallback: (value) => {
            useStore.setState({
                selectedLine: value,
                selectedStation: "",
                selectedTrain: "",
                arrivalInfo: null,
                stationTableData: null,
                trainTableData: null,
                direction: directions[value].up_info,
            });
        },
    });

    return (
        <div className="mb-4">
            <label htmlFor="station-select" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                노선명
            </label>
            <div className="mt-1 block min-w-[10.5rem]">
                <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={lineOptions}
                    noOptionsMessage={"검색결과가 없습니다"}
                    placeholder={"노선 선택"}
                />
            </div>
        </div>
    );
};

export default LineSelector;
