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

export const today = () => {
    const now = new Date();
    let currentDay;
    if (now.getHours() === 0) {
        // 자정을 넘은 직후인 경우, 어제로 간주
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        currentDay = yesterday.getDay();
    } else {
        currentDay = now.getDay();
    }
    return currentDay === 0 ? "holiday" : currentDay === 6 ? "saturday" : "weekday";
};
