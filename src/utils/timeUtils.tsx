import { RenderedTimetableData } from "../types";

export const getTimeInSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return (hours == 0 ? 24 : hours) * 3600 + minutes * 60 + seconds;
};

export const formatTime = (seconds: number, fromSchedule: boolean) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const formattedTime = min === 0 ? `${sec}초` : `${min}분 ${sec}초`;
    return fromSchedule ? `${formattedTime}*` : formattedTime;
};

export const getCurrentDaySchedule = (timetable: RenderedTimetableData) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    return currentDay === 0 ? timetable.holiday : currentDay === 6 ? timetable.saturday : timetable.weekday;
};
