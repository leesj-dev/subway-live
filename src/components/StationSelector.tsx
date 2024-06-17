import React from "react";
import { StationSelectorProps } from "../types";

const StationSelector: React.FC<StationSelectorProps> = ({ selectedStation, handleStationChange, stations, selectedLine }) => {
    return (
        <div className="mb-4">
            <label htmlFor="station" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                역명
            </label>
            <select
                id="station"
                value={selectedStation}
                onChange={handleStationChange}
                className="mt-1 block w-36 pl-3 py-2 text-center border text-base border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedLine}
            >
                <option value="">역 선택</option>
                {stations[selectedLine]?.map((station, index) => (
                    <option key={index} value={station.name}>
                        {station.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default StationSelector;
