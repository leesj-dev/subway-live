import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SyncLoader from "react-spinners/SyncLoader";
import stations from "../data/stations";
import destinations from "../data/destinations";
import LineSelector from "../components/LineSelector";
import StationSelector from "../components/StationSelector";
import ArrivalTable from "../components/ArrivalTable";
import { getTimeInSeconds, formatTime, today } from "../utils/timeUtils";
import { ArrivalTimes, ArrivalInfo, RenderedTimetableData } from "../types";

const ArrivalInfoPage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useState<string>("");
    const [selectedStation, setSelectedStation] = useState<string>("");
    const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // 노선명 변경 시
    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(e.target.value);
        setSelectedStation("");
        setArrivalInfo(null);
    };

    // 역명 변경 시
    const handleStationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const station = e.target.value;
        const stationID = stations[selectedLine]?.find((s) => s.name === station)?.id;
        if (!stationID) return;
        setSelectedStation(station);
        setLoading(true);

        // 역명이 바뀔 때 시간표 정보를 가져옴
        const timetableResponse = await axios.get(`./timetable/${stationID}.json`);
        const timetableData = timetableResponse.data;

        await fetchArrivalInfo(stationID, timetableData);

        // interval clear 후 실시간 도착 정보를 10초마다 가져오기 위해 interval 설정
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => fetchArrivalInfo(stationID, timetableData), 10000);
    };

    // component unmount시 interval clear
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // 실시간 도착 정보 가져오기
    const fetchArrivalInfo = async (stationID: string, timetableData: RenderedTimetableData) => {
        // Fetch arrival data
        const response = await axios.get(`https://api.leesj.me/subway/station/arrivals.json?base_time=realtime&id=${stationID}`);
        let arrivalData = response.data;
        if (timetableData) arrivalData = fillTimetableData(arrivalData, timetableData, selectedLine);

        setArrivalInfo(arrivalData);
        setLoading(false);
    };

    // timetable 전처리
    const fillTimetableData = (arrivalData: ArrivalInfo, timetable: RenderedTimetableData, selectedLine: string) => {
        const currentTime = getTimeInSeconds(new Date().toTimeString().split(" ")[0]);
        const schedule = timetable[today()];

        // 시간표 정보 중 현재 시간 이후의 열차 정보를 가져옴
        const getUpcomingTrains = (direction: string) =>
            schedule
                .filter((train) => getTimeInSeconds(train.arrivalTime) > currentTime && train.direction === direction)
                .slice(0, 2) // next two trains
                .map((train) => ({
                    train_no: train.trainNumber,
                    end_station_name: train.endStation,
                    remain_sec: getTimeInSeconds(train.arrivalTime) - currentTime,
                    from_schedule: true,
                }));

        for (const key of ["up_info", "down_info"] as const) {
            const direction = destinations[selectedLine][key];
            let times = arrivalData[key].times ?? [];
            times = times.map((train) => {
                // 부산김해경전철의 빈 열차번호 채우기
                if (!train.train_no) {
                    const arrivalTimeInSeconds = currentTime + train.remain_sec;
                    const matchedTrain = schedule.find((scheduleTrain) => {
                        // 출발역인 경우, 출발 시간을 사용. 나머지는 도착 시간을 사용
                        const arrivalTime = scheduleTrain.arrivalTime ? scheduleTrain.arrivalTime : scheduleTrain.departureTime;
                        const scheduleArrivalTimeInSeconds = getTimeInSeconds(arrivalTime);
                        return (
                            // 시간표보다 80초 일찍 ~ 시간표보다 120초 늦게 도착하는 열차를 찾음 (곧 도착 열차의 경우, 최대 20초 일찍 ~ 60초 늦게 도착하는 열차)
                            scheduleTrain.direction === destinations[selectedLine][key] &&
                            scheduleArrivalTimeInSeconds >= arrivalTimeInSeconds - 120 &&
                            scheduleArrivalTimeInSeconds <= arrivalTimeInSeconds + 80
                        );
                    });
                    if (matchedTrain) {
                        train.train_no = matchedTrain.trainNumber;
                    }
                }
                // 시간표 정보가 아니기 때문에 from_schedule를 false로 설정
                return { ...train, from_schedule: false };
            });
            // 행 수가 2 미만인 경우, 시간표 정보로부터 (2 - 행 수)만큼의 다음 열차 정보를 가져와 추가
            if (times.length < 2) {
                times = [...times, ...getUpcomingTrains(direction).slice(times.length)];
            }
            arrivalData[key].times = times;
        }
        return arrivalData;
    };

    // 매 초마다 남은 시간 업데이트
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
                        <ArrivalTable direction={destinations[selectedLine]["up_info"]} times={arrivalInfo.up_info.times} formatTime={formatTime} />
                        <ArrivalTable direction={destinations[selectedLine]["down_info"]} times={arrivalInfo.down_info.times} formatTime={formatTime} />
                    </div>
                )
            )}
        </div>
    );
};

export default ArrivalInfoPage;
