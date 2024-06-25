import React from "react";
import Select from "../../react-tailwindcss-select/components/Select";
import { SelectValue } from "../../react-tailwindcss-select/types";
import { StationSelectorProps } from "../../types";

const StationSelector: React.FC<StationSelectorProps> = ({ selectedStation, handleStationChange, stations, selectedLine }) => {
    const stationOptions =
        stations[selectedLine]?.map((station) => ({
            label: station.name,
            value: station.name,
        })) || [];

    const handleChange = (value: SelectValue) => {
        if (value && !Array.isArray(value) && typeof value !== "string") {
            handleStationChange({ target: { value: value.value } } as React.ChangeEvent<HTMLSelectElement>);
        } else {
            handleStationChange({ target: { value: "" } } as React.ChangeEvent<HTMLSelectElement>);
        }
    };

    return (
        <div className="mb-4">
            <label htmlFor="station-select" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                역명
            </label>
            <div className="mt-1 block min-w-[10.5rem]">
                <Select
                    value={stationOptions.find((option) => option.value === selectedStation) || null}
                    onChange={handleChange}
                    options={stationOptions}
                    isDisabled={!selectedLine}
                    isSearchable={true}
                    noOptionsMessage={"검색결과가 없습니다"}
                    placeholder={"역 선택"}
                />
            </div>
        </div>
    );
};

export default StationSelector;
