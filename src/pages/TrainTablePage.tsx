import React, { useState, useEffect, useRef, useCallback } from "react";
import directions from "../constants/directions";
import PageTemplate from "./PageTemplate";
import TrainSelector from "../components/selectors/TrainSelector";
import DaySelector from "../components/selectors/DaySelector";
import TrainTable from "../components/tables/TrainTable";
import { dateFromToday, isAvailableDay } from "../utils/timeUtils";
import { fetchTrainTableData } from "../utils/api";
import { TrainTableData } from "../types";
import { useSessionState } from "../hooks/useSessionState";

const TrainTablePage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useSessionState("selectedLine", "");
    const [selectedTrain, setSelectedTrain] = useSessionState("selectedTrain", "");
    const [trainTableData, setTrainTableData] = useState<TrainTableData | null>(null);
    const [day, setDay] = useState<string>(dateFromToday(0));
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const isFetchedRef = useRef<boolean>(false);

    // 노선명 변경 시
    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const line = e.target.value;
        setSelectedLine(line);
        setSelectedTrain("");
        sessionStorage.setItem("selectedStation", ""); // for ArrivalInfoPage & StationTablePage
        sessionStorage.setItem("direction", directions[line].up_info); // for StationTablePage
    };

    useEffect(() => {
        setTrainTableData(null);
        setAvailableDays([]);
    }, [selectedLine]);

    // 열차번호 변경 시
    const handleTrainChange = useCallback(
        async (e: React.ChangeEvent<HTMLSelectElement>) => {
            const train = e.target.value;
            setSelectedTrain(train);
            setLoading(true);

            // traintable fetching
            const traintableData = await fetchTrainTableData(selectedLine, train);
            const availableDays = Object.keys(traintableData).filter(isAvailableDay);
            setAvailableDays(availableDays);
            if (!isAvailableDay(day)) setDay(availableDays[0]);
            setTrainTableData(traintableData);
            setLoading(false);
        },
        [selectedLine, day, setSelectedTrain]
    );

    // session storage data 존재 시 mount 때 fetching
    useEffect(() => {
        if (!isFetchedRef.current && selectedLine && selectedTrain) {
            isFetchedRef.current = true;
            handleTrainChange({ target: { value: selectedTrain } } as React.ChangeEvent<HTMLSelectElement>);
        }
    }, [selectedLine, selectedTrain, handleTrainChange]);

    const content =
        selectedTrain && trainTableData ? (
            <div className="space-y-4">
                <div className="flex justify-center gap-4">
                    <DaySelector day={day} setDay={setDay} availableDays={availableDays} />
                </div>
                <TrainTable stationTimes={trainTableData?.[day] || []} selectedLine={selectedLine} />
            </div>
        ) : null;

    return (
        <PageTemplate
            title="열차 시간표"
            selectedLine={selectedLine}
            handleLineChange={handleLineChange}
            loading={loading}
            content={content}
            entitySelector={<TrainSelector selectedTrain={selectedTrain} handleTrainChange={handleTrainChange} selectedLine={selectedLine} />}
        />
    );
};

export default TrainTablePage;
