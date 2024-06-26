import React, { useState } from "react";
import axios from "axios";
import { dateFromToday } from "../utils/timeUtils";
import PageTemplate from "./PageTemplate";
import TrainSelector from "../components/selectors/TrainSelector";
import DaySelector from "../components/selectors/DaySelector";
import Traintable from "../components/tables/TrainTable";
import { TraintableData } from "../types";

const TrainTablePage: React.FC = () => {
    const [selectedLine, setSelectedLine] = useState<string>("");
    const [selectedTrain, setSelectedTrain] = useState<string>("");
    const [data, setData] = useState<TraintableData | null>(null);
    const [day, setDay] = useState<string>(dateFromToday(0));
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const isAvailableDay = (day: string) => {
        return ["weekday", "saturday", "holiday"].includes(day);
    };

    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(e.target.value);
        setSelectedTrain("");
        setData(null);
        setAvailableDays([]);
    };

    const handleTrainChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const train = e.target.value;
        setSelectedTrain(train);
        setLoading(true);
        const traintableResponse = await axios.get(`./traintable/${selectedLine}/${train}.json`);
        const availableDays = Object.keys(traintableResponse.data).filter(isAvailableDay);
        setAvailableDays(availableDays);
        if (!isAvailableDay(day)) setDay(availableDays[0]);
        setData(traintableResponse.data);
        setLoading(false);
    };

    const handleSetDay = (newDay: string) => {
        if (["holiday", "saturday", "weekday"].includes(newDay)) {
            setDay(newDay as "holiday" | "saturday" | "weekday");
        }
    };

    const dataOfDay = data?.[day] || [];

    const content =
        selectedTrain && data ? (
            <div className="space-y-4">
                <div className="flex justify-center gap-4">
                    <DaySelector day={day} setDay={handleSetDay} availableDays={availableDays} />
                </div>
                <Traintable stationTimes={dataOfDay} selectedLine={selectedLine} />
            </div>
        ) : null;

    return (
        <PageTemplate
            title="열차 시간표"
            selectedLine={selectedLine}
            handleLineChange={handleLineChange}
            loading={loading}
            content={content}
            entitySelector={<TrainSelector selectedTrain={selectedTrain} handleTrainChange={handleTrainChange} selectedLine={selectedLine} />}
        />
    );
};

export default TrainTablePage;
