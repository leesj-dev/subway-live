import React from "react";
import Select from "react-tailwindcss-select";
import useSelect from "../../hooks/useSelect";
import { StationSelectorProps } from "../../types";
import stations from "../../constants/stations";

const StationSelector: React.FC<StationSelectorProps> = ({ selectedStation, handleStationChange, selectedLine }) => {
    const stationOptions =
        stations[selectedLine]?.map((station) => ({
            label: station.name,
            value: station.name,
        })) || [];

    const { selectedOption, handleChange } = useSelect({
        options: stationOptions,
        selectedValue: selectedStation,
        handleChangeCallback: (value) => handleStationChange({ target: { value: value } } as React.ChangeEvent<HTMLSelectElement>),
    });

    return (
        <div className="mb-4">
            <label htmlFor="station-select" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                역명
            </label>
            <div className="mt-1 block min-w-[10.5rem]">
                <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={stationOptions}
                    isDisabled={!selectedLine}
                    isSearchable={true}
                    noOptionsMessage="검색결과가 없습니다"
                    placeholder="역 선택"
                />
            </div>
        </div>
    );
};

export default StationSelector;
