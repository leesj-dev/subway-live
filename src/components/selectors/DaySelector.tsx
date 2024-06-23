import React from "react";
import Select from "react-tailwindcss-select";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import { DaySelectorProps } from "../../types";

const DaySelector: React.FC<DaySelectorProps> = ({ day, setDay }) => {
    const dayOptions = [
        { label: "평일", value: "weekday" },
        { label: "토요일", value: "saturday" },
        { label: "휴일", value: "holiday" },
    ];

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
