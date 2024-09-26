import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import stations from "../constants/stations";
import directions from "../constants/directions";
import PageTemplate from "./PageTemplate";
import StationSelector from "../components/selectors/StationSelector";
import DirectionSelector from "../components/selectors/DirectionSelector";
import DaySelector from "../components/selectors/DaySelector";
import StationTable from "../components/tables/StationTable";
import { dateFromToday } from "../utils/timeUtils";
import { fetchTimetableData } from "../utils/api";
import { StationTableData } from "../types";
import { useSessionState } from "../hooks/useSessionState";

const StationTablePage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useSessionState("selectedLine", "");
    const [selectedStation, setSelectedStation] = useSessionState("selectedStation", "");
    const [direction, setDirection] = useSessionState("direction", "");
    const [stationTableData, setStationTableData] = useState<StationTableData | null>(null);
    const [day, setDay] = useSessionState("day", dateFromToday(0));
    const [loading, setLoading] = useState<boolean>(false);
    const isFetchedRef = useRef<boolean>(false);

    // 노선명 변경 시
    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const line = e.target.value;
        setSelectedLine(line);
        setSelectedStation("");
        setStationTableData(null);
        setDirection(directions[line].up_info); // direction 기본값 설정
        sessionStorage.setItem("selectedTrain", ""); // for TrainTablePage
    };

    // 역명 변경 시
    const handleStationChange = useCallback(
        async (e: React.ChangeEvent<HTMLSelectElement>) => {
            const stationName = e.target.value;
            setSelectedStation(stationName);
            setLoading(true);
            const stationID = stations[selectedLine]?.find((s) => s.name === stationName)?.id;
            if (!stationID || loading) return;

            // timetable fetching
            const timetableData = await fetchTimetableData(stationID);
            setStationTableData(timetableData);
            setLoading(false);
        },
        [loading, selectedLine, setSelectedStation]
    );

    // session storage data 존재 시 mount 때 fetching
    useEffect(() => {
        if (!isFetchedRef.current && selectedLine && selectedStation) {
            isFetchedRef.current = true;
            handleStationChange({ target: { value: selectedStation } } as React.ChangeEvent<HTMLSelectElement>);
        }
    }, [selectedLine, selectedStation, handleStationChange]);

    const filteredTrainTimes = useMemo(() => {
        return stationTableData?.[day].filter((train) => train.direction === direction) || [];
    }, [stationTableData, day, direction]);

    const content =
        selectedStation && stationTableData ? (
            <div className="space-y-4">
                <div className="flex justify-center gap-4">
                    <DirectionSelector direction={direction} setDirection={setDirection} data={stationTableData} />
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
            entitySelector={
                <StationSelector selectedStation={selectedStation} handleStationChange={handleStationChange} selectedLine={selectedLine} />
            }
        />
    );
};

export default StationTablePage;
