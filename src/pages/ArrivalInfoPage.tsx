import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import stations from "../data/stations";
import LineSelector from "../components/LineSelector";
import StationSelector from "../components/StationSelector";
import Button from "../components/Button";
import ArrivalTable from "../components/ArrivalTable";
import { ArrivalInfo } from "../types";

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
    const [currentLine, setCurrentLine] = useState<string>("");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(e.target.value);
        setSelectedStation("");
    };

    const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStation(e.target.value);
    };

    const fetchArrivalInfo = async () => {
        const stationID = stations[selectedLine].find((station) => station.name === selectedStation)?.id;
        if (stationID) {
            const response = await axios.get(
                `https://subway-live-ef069a488429.herokuapp.com/https://app.map.kakao.com/subway/station/arrivals.json?base_time=realtime&id=${stationID}`
            );
            setArrivalInfo(response.data);
        }
        setCurrentLine(selectedLine);

        // clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(fetchArrivalInfo, 10000); // set new interval to fetch data every 10 seconds
    };

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return min === 0 ? `${sec}초` : `${min}분 ${sec}초`;
    };

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        if (arrivalInfo) {
            intervalId = setInterval(() => {
                setArrivalInfo((prevArrivalInfo) => {
                    if (!prevArrivalInfo) return prevArrivalInfo;

                    return {
                        ...prevArrivalInfo,
                        up_info: prevArrivalInfo.up_info
                            ? {
                                  ...prevArrivalInfo.up_info,
                                  times: prevArrivalInfo.up_info.times
                                      ? prevArrivalInfo.up_info.times.map((train) => ({
                                            ...train,
                                            remain_sec: Math.max(0, train.remain_sec - 1),
                                        }))
                                      : [],
                              }
                            : prevArrivalInfo.up_info,
                        down_info: prevArrivalInfo.down_info
                            ? {
                                  ...prevArrivalInfo.down_info,
                                  times: prevArrivalInfo.down_info.times
                                      ? prevArrivalInfo.down_info.times.map((train) => ({
                                            ...train,
                                            remain_sec: Math.max(0, train.remain_sec - 1),
                                        }))
                                      : [],
                              }
                            : prevArrivalInfo.down_info,
                    };
                });
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [arrivalInfo]);

    useEffect(() => {
        // clear interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <>
            <h1 className="text-2xl text-gray-900 dark:text-gray-100 font-bold mb-8 break-keep">실시간 도착정보</h1>
            <div className="flex flex-wrap justify-center gap-6 mb-4">
                <LineSelector selectedLine={selectedLine} handleLineChange={handleLineChange} stations={stations} />
                <StationSelector selectedStation={selectedStation} handleStationChange={handleStationChange} stations={stations} selectedLine={selectedLine} />
            </div>
            <Button onClick={fetchArrivalInfo} selectedStation={selectedStation} />
            {arrivalInfo && (
                <div className="flex flex-wrap justify-center gap-6 mt-14">
                    <ArrivalTable direction={destinations[currentLine][0]} times={arrivalInfo.up_info.times} formatTime={formatTime} />
                    <ArrivalTable direction={destinations[currentLine][1]} times={arrivalInfo.down_info.times} formatTime={formatTime} />
                </div>
            )}
        </>
    );
};

export default ArrivalInfoPage;
