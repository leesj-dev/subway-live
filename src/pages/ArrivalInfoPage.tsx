import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SyncLoader from "react-spinners/SyncLoader";
import stations from "../data/stations";
import destinations from "../data/destinations";
import LineSelector from "../components/LineSelector";
import StationSelector from "../components/StationSelector";
import ArrivalTable from "../components/ArrivalTable";
import { getTimeInSeconds, formatTime, getCurrentDaySchedule } from "../utils/timeUtils";
import { ArrivalTimes, ArrivalInfo, RenderedTimetableData } from "../types";

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
        const stationID = stations[selectedLine]?.find((s) => s.name === station)?.id;
        if (!stationID) return;
        setSelectedStation(station);
        setLoading(true);
        await fetchArrivalInfo(stationID);

        // clear the interval and set a new one to fetch arrival info every 10 seconds
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => fetchArrivalInfo(stationID), 10000);
    };

    // cleanup interval on component unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // fetch arrival information for a given station
    const fetchArrivalInfo = async (stationID: string) => {
        // get timetable data first
        const timetableResponse = await axios.get(`./timetable/${stationID}.json`);
        const timetableData = timetableResponse.data;

        // then get arrival data
        const response = await axios.get(`https://api.leesj.me/subway/station/arrivals.json?base_time=realtime&id=${stationID}`);
        let arrivalData = response.data;
        if (timetableData) arrivalData = fillTimetableData(arrivalData, timetableData, selectedLine);
        setArrivalInfo(arrivalData);
        setLoading(false);
    };

    // fill the missing timetable data
    const fillTimetableData = (arrivalData: ArrivalInfo, timetable: RenderedTimetableData, selectedLine: string) => {
        const currentTime = getTimeInSeconds(new Date().toTimeString().split(" ")[0]);
        const schedule = getCurrentDaySchedule(timetable);

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
            times = times.map((train) => ({ ...train, from_schedule: false }));
            if (times.length < 2) {
                times = [...times, ...getUpcomingTrains(direction).slice(times.length)];
            }
            arrivalData[key].times = times;
        }

        return arrivalData;
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
                        <ArrivalTable direction={destinations[selectedLine]["up_info"]} times={arrivalInfo.up_info.times} formatTime={formatTime} />
                        <ArrivalTable direction={destinations[selectedLine]["down_info"]} times={arrivalInfo.down_info.times} formatTime={formatTime} />
                    </div>
                )
            )}
        </div>
    );
};

export default ArrivalInfoPage;
