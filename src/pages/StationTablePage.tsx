import React, { useState, useEffect } from "react";
import stations from "../data/stations";
import LineSelector from "../components/LineSelector";
import StationSelector from "../components/StationSelector";
import Timetable from "../components/Timetable";

const StationTablePage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useState<string>("");
    const [selectedStation, setSelectedStation] = useState<string>("");
    const [stationId, setStationId] = useState<string>("");

    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(e.target.value);
        setSelectedStation("");
        setStationId("");
    };

    const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStation(e.target.value);
    };

    useEffect(() => {
        if (selectedLine && selectedStation) {
            const id = stations[selectedLine].find((station) => station.name === selectedStation)?.id || "";
            setStationId(id);
        }
    }, [selectedLine, selectedStation]);

    return (
        <div className="py-6">
            <h1 className="text-2xl text-gray-900 dark:text-gray-100 font-bold mb-8 break-keep">역 시간표</h1>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
                <LineSelector selectedLine={selectedLine} handleLineChange={handleLineChange} stations={stations} />
                <StationSelector selectedStation={selectedStation} handleStationChange={handleStationChange} stations={stations} selectedLine={selectedLine} />
            </div>
            {stationId && <Timetable stationId={stationId} />}
        </div>
    );
};

export default StationTablePage;
