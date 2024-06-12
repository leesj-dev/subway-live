import React from "react";

interface StationSelectorProps {
    selectedStation: string;
    handleStationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    stations: {
        [key: string]: Array<{ name: string; id: string }>;
    };
    selectedLine: string;
}

const StationSelector: React.FC<StationSelectorProps> = ({ selectedStation, handleStationChange, stations, selectedLine }) => {
    return (
        <div className="mb-4">
            <label htmlFor="station" className="block text-base font-medium text-gray-700">
                역명
            </label>
            <select
                id="station"
                value={selectedStation}
                onChange={handleStationChange}
                className="mt-1 block w-full pl-3 py-2 text-center text-base border-gray-300 rounded-md"
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