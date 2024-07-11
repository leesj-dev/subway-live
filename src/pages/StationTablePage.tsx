import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { dateFromToday } from "../utils/timeUtils";
import stations from "../constants/stations";
import PageTemplate from "./PageTemplate";
import StationSelector from "../components/selectors/StationSelector";
import DirectionSelector from "../components/selectors/DirectionSelector";
import DaySelector from "../components/selectors/DaySelector";
import StationTable from "../components/tables/StationTable";
import { StationTableData } from "../types";

const StationTablePage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useState<string>(sessionStorage.getItem("selectedLine") || "");
    const [selectedStation, setSelectedStation] = useState<string>(sessionStorage.getItem("selectedStation") || "");
    const [data, setData] = useState<StationTableData | null>(null);
    const [direction, setDirection] = useState<string>(sessionStorage.getItem("direction") || "");
    const [day, setDay] = useState<string>(dateFromToday(0));
    const [loading, setLoading] = useState<boolean>(false);
    const isFetchedRef = useRef<boolean>(false);

    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const line = e.target.value;
        setSelectedLine(line);
        setSelectedStation("");
        setDirection("");
    };

    const handleStationChange = useCallback(
        async (e: React.ChangeEvent<HTMLSelectElement>) => {
            const station = e.target.value;
            const stationID = stations[selectedLine]?.find((s) => s.name === station)?.id;
            if (!stationID || loading) return;
            setSelectedStation(station);
            setLoading(true);

            // 역명이 바뀔 때 시간표 정보를 가져옴
            const timetableResponse = await axios.get(`./timetable/${stationID}.json`);
            setData(timetableResponse.data);
            setDirection(direction || timetableResponse.data.weekday[0]?.direction);
            setLoading(false);
        },
        [selectedLine, direction, loading]
    );

    // handle session storage data on mount
    useEffect(() => {
        if (!isFetchedRef.current && selectedLine && selectedStation) {
            isFetchedRef.current = true;
            handleStationChange({ target: { value: selectedStation } } as React.ChangeEvent<HTMLSelectElement>);
        }
    }, [selectedLine, selectedStation, handleStationChange]);

    // save to session storage
    useEffect(() => {
        sessionStorage.setItem("selectedLine", selectedLine);
    }, [selectedLine]);

    useEffect(() => {
        sessionStorage.setItem("selectedStation", selectedStation);
    }, [selectedStation]);

    useEffect(() => {
        sessionStorage.setItem("direction", direction);
    }, [direction]);

    const filteredTrainTimes = data?.[day].filter((train) => train.direction === direction) || [];

    const content =
        selectedStation && data ? (
            <div className="space-y-4">
                <div className="flex justify-center gap-4">
                    <DirectionSelector direction={direction} setDirection={setDirection} data={data} />
                    <DaySelector day={day} setDay={setDay} />
                </div>
                <StationTable trainTimes={filteredTrainTimes} />
            </div>
        ) : null;

    return (
        <PageTemplate
            title="역 시간표"
            selectedLine={selectedLine}
            handleLineChange={handleLineChange}
            loading={loading}
            content={content}
            entitySelector={<StationSelector selectedStation={selectedStation} handleStationChange={handleStationChange} selectedLine={selectedLine} />}
        />
    );
};

export default StationTablePage;
