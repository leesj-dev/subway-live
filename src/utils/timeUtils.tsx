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

export const dateFromToday = (days: number) => {
    const holidays = ["0101", "0209", "0210", "0211", "0212", "0301", "0410", "0505", "0506", "0515", "0606", "0815", "0916", "0917", "0918", "1003", "1009", "1225"].map((date) => "2024" + date);
    const now = new Date();
    const dateToCheck = new Date(now);
    if (now.getHours() === 0) dateToCheck.setDate(now.getDate() - 1); // 자정을 넘은 직후면 전날로 처리
    dateToCheck.setDate(dateToCheck.getDate()) + days; // 오늘로부터 days일 후
    const todayDate = dateToCheck.toISOString().split("T")[0].replace(/-/g, ""); // 20240622
    if (holidays.some((holiday) => holiday === todayDate)) return "holiday";
    const currentDay = dateToCheck.getDay();
    return currentDay === 0 ? "holiday" : currentDay === 6 ? "saturday" : "weekday";
};

export const isAvailableDay = (day: string) => {
    return ["weekday", "saturday", "holiday"].includes(day);
};
