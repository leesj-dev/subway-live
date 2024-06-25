import React, { useState } from "react";
import axios from "axios";
import { dateFromToday } from "../utils/timeUtils";
import SyncLoader from "react-spinners/SyncLoader";
import stations from "../data/stations";
import LineSelector from "../components/selectors/LineSelector";
import StationSelector from "../components/selectors/StationSelector";
import DirectionSelector from "../components/selectors/DirectionSelector";
import DaySelector from "../components/selectors/DaySelector";
import Timetable from "../components/Timetable";
import { RenderedTimetableData } from "../types";

const StationTablePage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useState<string>("");
    const [selectedStation, setSelectedStation] = useState<string>("");
    const [data, setData] = useState<RenderedTimetableData | null>(null);
    const [direction, setDirection] = useState<string>("");
    const [day, setDay] = useState<"weekday" | "saturday" | "holiday">(dateFromToday(0));
    const [loading, setLoading] = useState<boolean>(false);

    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(e.target.value);
        setSelectedStation("");
    };

    const handleStationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const station = e.target.value;
        const stationID = stations[selectedLine]?.find((s) => s.name === station)?.id;
        if (!stationID) return;
        setSelectedStation(station);
        setLoading(true);

        // 역명이 바뀔 때 시간표 정보를 가져옴
        const timetableResponse = await axios.get(`./timetable/${stationID}.json`);
        setData(timetableResponse.data);
        setDirection(timetableResponse.data.weekday.length > 0 ? timetableResponse.data.weekday[0].direction : "");
        setLoading(false);
    };

    const filteredTrainTimes = data?.[day].filter((train) => train.direction === direction) || [];

    return (
        <div className="px-2 py-6">
            <h1 className="text-2xl text-gray-900 dark:text-gray-100 font-bold mb-8 break-keep">역 시간표</h1>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
                <LineSelector selectedLine={selectedLine} handleLineChange={handleLineChange} stations={stations} />
                <StationSelector selectedStation={selectedStation} handleStationChange={handleStationChange} stations={stations} selectedLine={selectedLine} />
            </div>
            {loading ? (
                <div className="mt-[10vh]">
                    <SyncLoader color={"#718096"} size={20} />
                </div>
            ) : (
                selectedStation &&
                data && (
                    <div className="space-y-4">
                        <div className="flex justify-center gap-4">
                            <DirectionSelector direction={direction} setDirection={setDirection} data={data} />
                            <DaySelector day={day} setDay={setDay} />
                        </div>
                        {Timetable(filteredTrainTimes)}
                    </div>
                )
            )}
        </div>
    );
};

export default StationTablePage;
