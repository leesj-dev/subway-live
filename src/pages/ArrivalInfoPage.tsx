import React, { useState, useEffect, useRef, useCallback } from "react";
import useStore from "../store";
import directions from "../constants/directions";
import PageTemplate from "./PageTemplate";
import StationSelector from "../components/selectors/StationSelector";
import ArrivalTable from "../components/tables/ArrivalTable";
import RefreshButton from "../components/RefreshButton";
import { ArrivalTimes } from "../types";

const REFRESH_INTERVAL = 10; // 새로고침 간격 (초)
const REFRESH_LIMIT = 30; // 자동 새로고침 횟수 한도

const ArrivalInfoPage: React.FC = () => {
    const { selectedLine, selectedStation, arrivalInfo, loading, fetchStationTableData, fetchArrivalInfo, processArrivalInfo } = useStore();
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const fetchCount = useRef<number>(0);

    // 데이터 받아오기
    const handleRefresh = useCallback(async () => {
        fetchArrivalInfo();
        processArrivalInfo();

        // REFRESH_INTERVAL초마다 다시 fetch
        setRemainingTime(REFRESH_INTERVAL - 1);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setRemainingTime((prev) => {
                // 0초 되기 전까지 1초씩 차감
                if (prev > 0) return prev - 1;

                // 0초가 되었고 REFRESH_LIMIT 횟수 미만일 때 refetching
                if (fetchCount.current < REFRESH_LIMIT) {
                    useStore.setState({ manualRefresh: false });
                    fetchArrivalInfo();
                    processArrivalInfo();
                    fetchCount.current += 1;
                    return REFRESH_INTERVAL - 1; // 1~10초 대신 0~9초 사용하기 위함
                }

                // 0초가 되었고 REFRESH_LIMIT 횟수 도달 시 refetching 중지, fetchCount 초기화
                if (intervalRef.current) clearInterval(intervalRef.current);
                fetchCount.current = 0;
                return 0;
            });
        }, 1000);
    }, [fetchArrivalInfo, processArrivalInfo]);

    // 수동 새로고침
    const handleManualRefresh = () => {
        useStore.setState({ manualRefresh: true });
        handleRefresh();
    };

    // 선택한 역이 변경되면 데이터 받아오기
    useEffect(() => {
        if (selectedLine && selectedStation) {
            fetchStationTableData();
            handleRefresh();
        }
    }, [selectedLine, selectedStation, fetchStationTableData, handleRefresh]);

    // component unmount 시 interval clear
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // 매 초마다 남은 시간 업데이트 (1초씩 차감)
    useEffect(() => {
        if (arrivalInfo) {
            const updateTimes = (times: ArrivalTimes[] | null) =>
                times ? times.map((train) => ({ ...train, remain_sec: Math.max(0, train.remain_sec - 1) })) : null;
            const intervalId = setInterval(() => {
                useStore.setState({
                    arrivalInfo: {
                        ...arrivalInfo,
                        up_info: { ...arrivalInfo.up_info, times: updateTimes(arrivalInfo.up_info?.times) },
                        down_info: { ...arrivalInfo.down_info, times: updateTimes(arrivalInfo.down_info?.times) },
                    },
                });
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

    return <PageTemplate title="실시간 도착정보" content={content} loading={loading} entitySelector={<StationSelector />} />;
};

export default ArrivalInfoPage;
