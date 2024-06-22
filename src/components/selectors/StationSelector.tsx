import React from "react";
import Selector from "./Selector";
import { StationSelectorProps } from "../../types";

const StationSelector: React.FC<StationSelectorProps> = ({ selectedStation, handleStationChange, stations, selectedLine }) => {
    const stationOptions =
        stations[selectedLine]?.map((station) => ({
            label: station.name,
            value: station.name,
        })) || [];

    return <Selector label="역명" value={selectedStation} options={stationOptions} handleChange={handleStationChange} disabled={!selectedLine} />;
};

export default StationSelector;
