import React, { useEffect } from "react";
import Select from "react-tailwindcss-select";
import useSelect from "../../hooks/useSelect";

interface DaySelectorProps {
    day: string;
    setDay: (day: string) => void;
    availableDays?: string[];
}

const DaySelector: React.FC<DaySelectorProps> = ({ day, setDay, availableDays }) => {
    const defaultDayOptions = [
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

    const { selectedOption, handleChange } = useSelect({
        options: dayOptions,
        selectedValue: day,
        handleChangeCallback: (value) => setDay(value),
    });

    return (
        <div className="mb-4">
            <label htmlFor="day-select" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                날짜
            </label>
            <div className="mt-1 block min-w-32">
                <Select value={selectedOption} onChange={handleChange} options={dayOptions} noOptionsMessage={"검색결과가 없습니다"} placeholder={"날짜 선택"} />
            </div>
        </div>
    );
};

export default DaySelector;
