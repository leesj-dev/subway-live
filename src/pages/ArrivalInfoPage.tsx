import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import stations from "../data/stations";
import LineSelector from "../components/LineSelector";
import StationSelector from "../components/StationSelector";
import ArrivalTable from "../components/ArrivalTable";
import SyncLoader from "react-spinners/SyncLoader";
import { ArrivalTimes, ArrivalInfo } from "../types";

const destinations: { [key: string]: string[] } = {
    "1호선": ["다대포해수욕장", "노포"],
    "2호선": ["장산", "양산"],
    "3호선": ["수영", "대저"],
    "4호선": ["미남", "안평"],
    부산김해경전철: ["사상", "가야대"],
    동해선: ["부전", "태화강"],
};

const ArrivalInfoPage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useState<string>("");
    const [selectedStation, setSelectedStation] = useState<string>("");
    const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // handle line selection change
    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(e.target.value);
        setSelectedStation("");
        setArrivalInfo(null);
    };

    // handle station selection change
    const handleStationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const station = e.target.value;
        setSelectedStation(station);
        setLoading(true);
        await fetchArrivalInfo(station);
    };

    // fetch arrival information for a given station
    const fetchArrivalInfo = async (station: string) => {
        const stationID = stations[selectedLine]?.find((s) => s.name === station)?.id;
        if (stationID) {
            try {
                const response = await axios.get(
                    `https://subway-live-ef069a488429.herokuapp.com/https://app.map.kakao.com/subway/station/arrivals.json?base_time=realtime&id=${stationID}`
                );
                setArrivalInfo(response.data);
            } catch (error) {
                console.error("Failed to fetch arrival info:", error);
            } finally {
                setLoading(false);
            }
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => fetchArrivalInfo(station), 10000);
        }
    };

    // cleanup interval on component unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // format time from seconds to minutes and seconds
    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return min === 0 ? `${sec}초` : `${min}분 ${sec}초`;
    };

    // update the remaining time every second
    useEffect(() => {
        if (arrivalInfo) {
            const intervalId = setInterval(() => {
                setArrivalInfo((prev) => {
                    if (!prev) return prev;
                    const updateTimes = (times: ArrivalTimes[] | null) => times?.map((train) => ({ ...train, remain_sec: Math.max(0, train.remain_sec - 1) })) ?? [];
                    return {
                        ...prev,
                        up_info: { ...prev.up_info, times: updateTimes(prev.up_info.times) },
                        down_info: { ...prev.down_info, times: updateTimes(prev.down_info.times) },
                    };
                });
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [arrivalInfo]);

    return (
        <div className="p-6">
            <h1 className="text-2xl text-gray-900 dark:text-gray-100 font-bold mb-8 break-keep">실시간 도착정보</h1>
            <div className="flex flex-wrap justify-center gap-6 mb-[4vh]">
                <LineSelector selectedLine={selectedLine} handleLineChange={handleLineChange} stations={stations} />
                <StationSelector selectedStation={selectedStation} handleStationChange={handleStationChange} stations={stations} selectedLine={selectedLine} />
            </div>
            {loading ? (
                <div className="mt-[10vh]">
                    <SyncLoader color={"#718096"} size={20} />
                </div>
            ) : (
                arrivalInfo && (
                    <div className="flex flex-wrap justify-center gap-6">
                        <ArrivalTable direction={destinations[selectedLine][0]} times={arrivalInfo.up_info.times} formatTime={formatTime} />
                        <ArrivalTable direction={destinations[selectedLine][1]} times={arrivalInfo.down_info.times} formatTime={formatTime} />
                    </div>
                )
            )}
        </div>
    );
};

export default ArrivalInfoPage;
