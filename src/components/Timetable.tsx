import React, { useEffect, useState } from "react";
import axios from "axios";
import { RenderedTrainTime, RenderedTimetableData } from "../types";
import SyncLoader from "react-spinners/SyncLoader";

const Timetable: React.FC<{ stationId: string }> = ({ stationId }) => {
    const [data, setData] = useState<RenderedTimetableData | null>(null);
    const [direction, setDirection] = useState<string>("");
    const [day, setDay] = useState<"weekday" | "saturday" | "holiday">(() => {
        const today = new Date().getDay();
        if (today === 0 || today === 6) {
            return "holiday";
        } else if (today === 5) {
            return "saturday";
        } else {
            return "weekday";
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!stationId) return;
            const response = await axios.get<RenderedTimetableData>(`./timetable/${stationId}.json`);
            setData(response.data);
            setDirection(response.data.weekday.length > 0 ? response.data.weekday[0].direction : "");
        };
        fetchData();
    }, [stationId]);

    const filteredTrainTimes = data?.[day].filter((train) => train.direction === direction) || [];

    if (!data || !stationId) return <SyncLoader color={"#718096"} size={20} />;

    const renderTable = (trainTimes: RenderedTrainTime[]) => (
        <table className="mx-auto divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">열차번호</th>
                    <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">출발지 &gt; 행선지</th>
                    <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">도착시각</th>
                    <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">출발시각</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-gray-100">
                {trainTimes.map((train, index) => (
                    <tr key={index}>
                        <td className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{train.trainNumber}</td>
                        <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                            {train.startStation} &gt; {train.endStation}
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{train.arrivalTime}</td>
                        <td className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{train.departureTime}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-center gap-4">
                <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                        방향
                        <select
                            className="mt-1 block w-full py-2 px-3 text-center border border-gray-300 bg-white rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                        >
                            {Array.from(new Set(data.weekday.map((train) => train.direction))).map((dir) => (
                                <option key={dir} value={dir}>
                                    {dir}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                        날짜
                        <select
                            className="mt-1 block w-full py-2 px-3 border text-center border-gray-300 bg-white rounded-md  dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={day}
                            onChange={(e) => setDay(e.target.value as "weekday" | "saturday" | "holiday")}
                        >
                            <option value="weekday">평일</option>
                            <option value="saturday">토요일</option>
                            <option value="holiday">휴일</option>
                        </select>
                    </label>
                </div>
            </div>
            {renderTable(filteredTrainTimes)}
        </div>
    );
};

export default Timetable;
