// stations
export interface Stations {
    [line: string]: {
        id: string;
        name: string;
    }[];
}

// arrival information
export interface ArrivalTimes {
    train_no: string;
    end_station_name: string;
    remain_sec: number;
    display_txt?: string; // optional
    from_schedule?: boolean; // optional
}

export interface ArrivalInfo {
    up_info: { times: ArrivalTimes[] | null };
    down_info: { times: ArrivalTimes[] | null };
}

// props
export interface ArrivalTableProps {
    direction: string;
    times: ArrivalTimes[] | null;
    formatTime: (seconds: number, fromSchedule: boolean) => string;
    selectedLine?: string; // optional
    stationID?: string; // optional
}

export interface SelectorProps<ValueType> {
    label: string;
    value: ValueType;
    options: { label: string; value: ValueType }[];
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
}

export interface LineSelectorProps {
    selectedLine: string;
    handleLineChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    stations: { [key: string]: Array<{ name: string; id: string }> };
}

export interface StationSelectorProps {
    selectedStation: string;
    handleStationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    stations: { [key: string]: Array<{ name: string; id: string }> };
    selectedLine: string;
}

export interface DirectionSelectorProps {
    direction: string;
    setDirection: (value: string) => void;
    data: { weekday: { direction: string }[] };
}

export interface DaySelectorProps {
    day: "weekday" | "saturday" | "holiday";
    setDay: (value: "weekday" | "saturday" | "holiday") => void;
}

// timetable
export interface TrainTime {
    time_arrive: string;
    time_departure: string;
    start_station_name: string;
    start_station_id: string;
    end_station_name: string;
    end_station_id: string;
}

export interface DayData {
    train_times: {
        hour: number;
        up_times: TrainTime[];
        down_times: TrainTime[];
    }[];
    directions: {
        up: string[];
        down: string[];
    };
}

export interface TimetableData {
    weekday: DayData;
    saturday: DayData;
    holiday: DayData;
}

// timetable rendering
export interface RenderedTrainTime {
    trainNumber: string;
    startStation: string;
    endStation: string;
    arrivalTime: string;
    departureTime: string;
    direction: string;
}

export interface RenderedTimetableData {
    weekday: RenderedTrainTime[];
    saturday: RenderedTrainTime[];
    holiday: RenderedTrainTime[];
}
