import React from "react";
import Selector from "./Selector";
import { DaySelectorProps } from "../../types";

const DaySelector: React.FC<DaySelectorProps> = ({ day, setDay }) => {
    const dayOptions = [
        { label: "평일", value: "weekday" },
        { label: "토요일", value: "saturday" },
        { label: "휴일", value: "holiday" },
    ];

    return <Selector label="Day" value={day} options={dayOptions} handleChange={(e) => setDay(e.target.value as "weekday" | "saturday" | "holiday")} />;
};

export default DaySelector;
