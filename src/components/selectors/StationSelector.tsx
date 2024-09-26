import React, { useEffect, useMemo } from "react";
import useStore from "../../store";
import Select from "react-tailwindcss-select";
import useSelect from "../../hooks/useSelect";
import stations from "../../constants/stations";

const StationSelector: React.FC = () => {
    const { selectedLine, selectedStation } = useStore();
    const stationOptions = useMemo(
        () =>
            stations[selectedLine]
                ? stations[selectedLine].map((station) => ({
                      label: station.name,
                      value: station.name,
                  }))
                : [],
        [selectedLine]
    );

    const { selectedOption, handleChange } = useSelect({
        options: stationOptions,
        selectedValue: selectedStation,
        handleChangeCallback: (value) => {
            useStore.setState({ selectedStation: value, arrivalInfo: null, stationTableData: null });
        },
    });

    useEffect(() => {
        const matchingOption = stationOptions.find((option) => option.value === selectedStation);
        if (matchingOption && selectedOption?.value !== matchingOption.value) {
            handleChange(matchingOption);
        }
    }, [selectedStation, stationOptions, selectedOption, handleChange]);

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
                    isSearchable
                    noOptionsMessage="검색결과가 없습니다"
                    placeholder="역 선택"
                />
            </div>
        </div>
    );
};

export default StationSelector;
