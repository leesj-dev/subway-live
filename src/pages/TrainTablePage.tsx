import React, { useState } from "react";
import axios from "axios";
import { dateFromToday } from "../utils/timeUtils";
import SyncLoader from "react-spinners/SyncLoader";
import stations from "../data/stations";
import trains from "../data/trains";
import destinations from "../data/destinations";
import LineSelector from "../components/selectors/LineSelector";
import TrainSelector from "../components/selectors/TrainSelector";
import DaySelector from "../components/selectors/DaySelector";
import Traintable from "../components/Traintable";
import { RenderedTraintableData } from "../types";

const TrainTablePage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useState<string>("");
    const [selectedTrain, setSelectedTrain] = useState<string>("");
    const [data, setData] = useState<RenderedTraintableData | null>(null);
    const [day, setDay] = useState<"weekday" | "saturday" | "holiday">(dateFromToday(0));
    const [availableDays, setAvailableDays] = useState<Array<"weekday" | "saturday" | "holiday">>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const isAvailableDay = (day: string): day is "weekday" | "saturday" | "holiday" => {
        return ["weekday", "saturday", "holiday"].includes(day);
    };

    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(e.target.value);
        setSelectedTrain("");
    };

    const handleTrainChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const train = e.target.value;
        setSelectedTrain(train);
        setLoading(true);

        const traintableResponse = await axios.get(`./traintable/${selectedLine}/${train}.json`);
        setAvailableDays(Object.keys(traintableResponse.data).filter(isAvailableDay));
        if (!isAvailableDay(day)) setDay(availableDays[0]);
        setData(traintableResponse.data);
        setLoading(false);
    };

    const dataOfDay = data?.[day] || [];

    return (
        <div className="px-4 py-6">
            <h1 className="text-2xl text-gray-900 dark:text-gray-100 font-bold mb-8 break-keep">열차 시간표</h1>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
                <LineSelector selectedLine={selectedLine} handleLineChange={handleLineChange} stations={stations} />
                <TrainSelector selectedTrain={selectedTrain} handleTrainChange={handleTrainChange} trains={trains} selectedLine={selectedLine} destinations={destinations} />
            </div>
            {loading ? (
                <div className="mt-[10vh]">
                    <SyncLoader color={"#718096"} size={20} />
                </div>
            ) : (
                selectedTrain &&
                data && (
                    <div className="space-y-4">
                        <div className="flex justify-center gap-4">
                            <DaySelector day={day} setDay={setDay} availableDays={availableDays} />
                        </div>
                        <Traintable stationTimes={dataOfDay} stations={stations} selectedLine={selectedLine} />
                    </div>
                )
            )}
        </div>
    );
};

export default TrainTablePage;
