import React, { useState, useEffect, useRef, useCallback } from "react";
import stations from "../constants/stations";
import directions from "../constants/directions";
import PageTemplate from "./PageTemplate";
import StationSelector from "../components/selectors/StationSelector";
import ArrivalTable from "../components/tables/ArrivalTable";
import fillStationTableData from "../utils/fillStationTableData";
import { fetchTimetableData, fetchArrivalInfo } from "../utils/api";
import { ArrivalTimes, ArrivalInfo, StationTableData } from "../types";
import { useSessionState } from "../hooks/useSessionState";
import RefreshButton from "../components/RefreshButton";

const REFRESH_INTERVAL = 10; // 새로고침 간격 (초)
const REFRESH_LIMIT = 30; // 자동 새로고침 횟수 한도

const ArrivalInfoPage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useSessionState("selectedLine", "");
    const [selectedStation, setSelectedStation] = useSessionState("selectedStation", "");
    const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isFetched = useRef<boolean>(false);
    const fetchCount = useRef<number>(0);

    const fetchAndSetArrivalInfo = useCallback(
        async (stationID: string, timetableData: StationTableData) => {
            const arrivalData = await fetchArrivalInfo(stationID);
            if (timetableData) setArrivalInfo(fillStationTableData(selectedLine, selectedStation, arrivalData, timetableData));
            setLoading(false);
        },
        [selectedLine, selectedStation]
    );

    // 노선명 변경 시
    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const line = e.target.value;
        setSelectedLine(line);
        setSelectedStation("");
        sessionStorage.setItem("direction", directions[line].up_info); // for StationTablePage
        sessionStorage.setItem("selectedTrain", ""); // for TrainTablePage
    };

    useEffect(() => {
        setArrivalInfo(null);
    }, [selectedLine]);

    // 역명 변경 시
    const handleStationChange = useCallback(
        async (e: React.ChangeEvent<HTMLSelectElement>) => {
            const stationName = e.target.value;
            setSelectedStation(stationName);
            setLoading(true);
            const stationID = stations[selectedLine]?.find((s) => s.name === stationName)?.id;
            if (!stationID) return;

            // timetable fetching
            const timetableData = await fetchTimetableData(stationID);

            // arrivalInfo fetching
            fetchAndSetArrivalInfo(stationID, timetableData);

            // REFRESH_INTERVAL초마다 다시 fetch
            setRemainingTime(REFRESH_INTERVAL - 1);
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setRemainingTime((prev) => {
                    // 0초 되기 전까지 1초씩 차감
                    if (prev > 0) return prev - 1;

                    // 0초가 되었고 REFRESH_LIMIT 횟수 미만일 때 refetching
                    if (fetchCount.current < REFRESH_LIMIT) {
                        fetchAndSetArrivalInfo(stationID, timetableData);
                        fetchCount.current += 1;
                        return REFRESH_INTERVAL - 1; // 1~10초 대신 0~9초 사용하기 위함
                    }

                    // 0초가 되었고 REFRESH_LIMIT 횟수 도달 시 refetching 중지, fetchCount 초기화
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    fetchCount.current = 0;
                    return 0;
                });
            }, 1000);
        },
        [selectedLine, setSelectedStation, fetchAndSetArrivalInfo]
    );

    // component unmount 시 interval clear
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // 수동 새로고침
    const handleManualRefresh = useCallback(async () => {
        handleStationChange({ target: { value: selectedStation } } as React.ChangeEvent<HTMLSelectElement>);
    }, [handleStationChange, selectedStation]);

    // session storage data 존재 시 mount 때 fetching
    useEffect(() => {
        if (!isFetched.current && selectedLine && selectedStation) {
            isFetched.current = true;
            handleManualRefresh();
        }
    }, [selectedLine, selectedStation, handleManualRefresh]);

    // 매 초마다 남은 시간 업데이트 (1초씩 차감)
    useEffect(() => {
        if (arrivalInfo) {
            const updateTimes = (times: ArrivalTimes[] | null) =>
                times?.map((train) => ({ ...train, remain_sec: Math.max(0, train.remain_sec - 1) })) ?? [];
            const intervalId = setInterval(() => {
                setArrivalInfo((prev) =>
                    prev
                        ? {
                              ...prev,
                              up_info: { ...prev.up_info, times: updateTimes(prev.up_info.times) },
                              down_info: { ...prev.down_info, times: updateTimes(prev.down_info.times) },
                          }
                        : null
                );
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [arrivalInfo]);

    const content = arrivalInfo ? (
        <div>
            <div className="mb-3 mr-[calc(50%-11rem)] md:mr-[calc(50%-22.75rem)]">
                <RefreshButton onRefresh={handleManualRefresh} remainingTime={remainingTime} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <ArrivalTable direction={directions[selectedLine].up_info} times={arrivalInfo.up_info.times} />
                <ArrivalTable direction={directions[selectedLine].down_info} times={arrivalInfo.down_info.times} />
            </div>
        </div>
    ) : null;

    return (
        <PageTemplate
            title="실시간 도착정보"
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

export default ArrivalInfoPage;
