import React, { useState, useEffect } from "react";
import axios from "axios";
import stations from "./stations";
import LineSelector from "./LineSelector";
import StationSelector from "./StationSelector";
import Button from "./Button";
import Table from "./Table";

interface ArrivalTimes {
    train_no: string;
    end_station_name: string;
    remain_sec: number;
    display_txt: string;
}

interface ArrivalInfo {
    up_info: { times: ArrivalTimes[] | null };
    down_info: { times: ArrivalTimes[] | null };
}

const destinations: { [key: string]: string[] } = {
    "1호선": ["다대포해수욕장/신평행", "노포행"],
    "2호선": ["장산행", "양산/호포행"],
    "3호선": ["수영행", "대저행"],
    "4호선": ["미남행", "안평행"],
    부산김해경전철: ["사상행", "가야대행"],
    동해선: ["부전행", "태화강/망양행"],
};

const SubwayInfo: React.FC = () => {
    const [selectedLine, setSelectedLine] = useState<string>("");
    const [selectedStation, setSelectedStation] = useState<string>("");
    const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo | null>(null);
    const [currentLine, setCurrentLine] = useState<string>(""); // 노선 변경 시 조회 이전에 행선지 바뀌는 것 방지

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
    };

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        if (min === 0) {
            return `${sec}초`;
        } else {
            return `${min}분 ${sec}초`;
        }
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (arrivalInfo) {
            intervalId = setInterval(() => {
                setArrivalInfo((prevArrivalInfo) => ({
                    ...prevArrivalInfo,
                    up_info: {
                        times: prevArrivalInfo?.up_info?.times?.map((train) => ({
                            ...train,
                            remain_sec: Math.max(0, train.remain_sec - 1),
                        })) ?? null,
                    },
                    down_info: {
                        times: prevArrivalInfo?.down_info?.times?.map((train) => ({
                            ...train,
                            remain_sec: Math.max(0, train.remain_sec - 1),
                        })) ?? null,
                    },
                }));
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [arrivalInfo]);

    useEffect(() => {
        const intervalId = setInterval(fetchArrivalInfo, 10000);
        return () => clearInterval(intervalId);
    });

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="w-[45rem] mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-8 text-center">부산 도시철도 실시간 도착정보</h1>
                <div className="grid grid-cols-2 gap-5 mb-4">
                    <LineSelector selectedLine={selectedLine} handleLineChange={handleLineChange} stations={stations} />
                    <StationSelector
                        selectedStation={selectedStation}
                        handleStationChange={handleStationChange}
                        stations={stations}
                        selectedLine={selectedLine}
                    />
                </div>
                <Button fetchArrivalInfo={fetchArrivalInfo} selectedStation={selectedStation} />
                {arrivalInfo && (
                    <Table
                        upInfo={arrivalInfo.up_info}
                        downInfo={arrivalInfo.down_info}
                        formatTime={formatTime}
                        destinations={destinations}
                        currentLine={currentLine}
                    />
                )}
            </div>
        </div>
    );
};

export default SubwayInfo;