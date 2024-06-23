import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SyncLoader from "react-spinners/SyncLoader";
import stations from "../data/stations";
import destinations from "../data/destinations";
import LineSelector from "../components/selectors/LineSelector";
import StationSelector from "../components/selectors/StationSelector";
import ArrivalTable from "../components/ArrivalTable";
import { getTimeInSeconds, formatTime, dateFromToday } from "../utils/timeUtils";
import { ArrivalTimes, ArrivalInfo, RenderedTimetableData, RenderedTrainTime } from "../types";

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
        if (timetableData) arrivalData = fillTimetableData(arrivalData, timetableData, selectedLine, stationID);

        setArrivalInfo(arrivalData);
        setLoading(false);
    };

    // timetable 전처리
    const fillTimetableData = (arrivalData: ArrivalInfo, timetable: RenderedTimetableData, selectedLine: string, stationID: string) => {
        const currentTime = getTimeInSeconds(new Date().toTimeString().split(" ")[0]);
        function getSchedule(days: number, direction: string) {
            return timetable[dateFromToday(days)].filter((train) => train.direction === direction);
        }

        // 출발역인 경우, 출발 시간을 사용. 나머지는 도착 시간을 사용
        function getTrainTime(train: RenderedTrainTime) {
            return train.arrivalTime ? train.arrivalTime : train.departureTime;
        }

        // 열차의 도착(출발)시각과 현재시각 차이를 초로 반환
        function getRemainSec(train: RenderedTrainTime) {
            return getTimeInSeconds(getTrainTime(train)) - currentTime;
        }

        // 해당 열차가 종착역인지 구함
        function isEndingStation(direction: string) {
            return stationID === stations[selectedLine]?.find((s) => s.name === direction)?.id;
        }

        for (const key of ["up_info", "down_info"] as const) {
            const direction = destinations[selectedLine][key];
            const scheduleToday = getSchedule(0, direction);
            let times = arrivalData[key].times ?? [];

            times = times.map((train) => {
                // 1. 부산김해경전철의 빈 열차번호 채우기
                if (!train.train_no) {
                    const matchedTrain = scheduleToday.find((scheduleTrain) => {
                        return (
                            // 시간표보다 80초 일찍 ~ 시간표보다 120초 늦게 도착하는 열차를 찾음 (곧 도착 열차의 경우, 최대 20초 일찍 ~ 60초 늦게 도착하는 열차)
                            getRemainSec(scheduleTrain) >= train.remain_sec - 120 && getRemainSec(scheduleTrain) <= train.remain_sec + 80
                        );
                    });
                    if (matchedTrain) train.train_no = matchedTrain.trainNumber;
                }
                // 2. 시간표 정보가 아니기 때문에 from_schedule를 false로 설정
                return { ...train, from_schedule: false };
            });

            // 3. 시간표 정보 중 현재 시간 이후의 열차 정보 2개를 가져옴
            const upcomingTrains = scheduleToday
                .filter((train) => getRemainSec(train) > 0)
                .slice(0, 2)
                .map((train) => ({
                    train_no: train.trainNumber,
                    end_station_name: train.endStation,
                    remain_sec: getRemainSec(train),
                    from_schedule: true,
                }));

            // 4. 1) 'UpcomingTrains'가 null이면서 종착역이 아니거나, 2) 바로 다음 열차가 첫차와 같고 남은 시간이 20분 이상이라면, 첫차 운행 시작 시각을 띄워줌
            if (!isEndingStation(direction)) {
                if (!upcomingTrains.length || (upcomingTrains[0].train_no === scheduleToday[0].trainNumber && upcomingTrains[0].remain_sec >= 1200)) {
                    const firstTrain = !upcomingTrains.length ? getSchedule(1, direction)[0] : scheduleToday[0]; // 1)의 경우라면 익일 첫차를, 2)의 경우라면 당일 열차를 가져옴
                    times = [
                        {
                            train_no: firstTrain.trainNumber,
                            end_station_name: firstTrain.endStation,
                            remain_sec: 0, // remain_sec이 0이어야 display_txt를 남은 시간에 표시해주기 때문
                            display_txt: `${getTrainTime(firstTrain).slice(0, 5)} 운행시작`,
                            from_schedule: true,
                        },
                    ];
                }
            }
            // 5. 행 수가 2 미만인 경우, 시간표 정보로부터 (2 - 행 수)만큼의 다음 열차 정보를 가져와 추가
            else if (times.length < 2) {
                times = [...times, ...upcomingTrains.slice(times.length)];
            }
            // 6. 업데이트된 times를 arrivalData에 저장
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
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-[4vh]">
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
