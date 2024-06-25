import React, { useEffect } from "react";
import Select from "../react-tailwindcss-select/Select";
import { SelectValue } from "../react-tailwindcss-select/type";
import { DaySelectorProps } from "../../types";

interface DayOption {
    label: string;
    value: "weekday" | "saturday" | "holiday";
}

const DaySelector: React.FC<DaySelectorProps> = ({ day, setDay, availableDays }) => {
    const defaultDayOptions: DayOption[] = [
        { label: "평일", value: "weekday" },
        { label: "토요일", value: "saturday" },
        { label: "휴일", value: "holiday" },
    ];

    const dayOptions = availableDays ? defaultDayOptions.filter((option) => availableDays.includes(option.value)) : defaultDayOptions;

    useEffect(() => {
        if (!availableDays) return;
        if (!availableDays.includes(day)) {
            setDay(availableDays[0]);
        }
    }, [availableDays, day, setDay]);

    const handleChange = (value: SelectValue | null) => {
        if (value && !Array.isArray(value) && typeof value !== "string") {
            setDay(value.value as "weekday" | "saturday" | "holiday");
        } else {
            setDay("" as "weekday" | "saturday" | "holiday");
        }
    };

    return (
        <div className="mb-4">
            <label htmlFor="day-select" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                날짜
            </label>
            <div className="mt-1 block min-w-28">
                <Select
                    value={dayOptions.find((option) => option.value === day) || null}
                    onChange={handleChange}
                    options={dayOptions}
                    noOptionsMessage={"검색결과가 없습니다"}
                    placeholder={"날짜 선택"}
                />
            </div>
        </div>
    );
};

export default DaySelector;
