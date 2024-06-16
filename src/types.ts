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
    display_txt: string;
}

export interface ArrivalInfo {
    up_info: { times: ArrivalTimes[] | null };
    down_info: { times: ArrivalTimes[] | null };
}

// props
export interface ArrivalTableProps {
    direction: string;
    times: ArrivalTimes[] | null;
    formatTime: (seconds: number) => string;
}

export interface LineSelectorProps {
    selectedLine: string;
    handleLineChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    stations: {
        [key: string]: Array<{ name: string; id: string }>;
    };
}

export interface StationSelectorProps {
    selectedStation: string;
    handleStationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    stations: {
        [key: string]: Array<{ name: string; id: string }>;
    };
    selectedLine: string;
}

export interface ButtonProps {
    onClick: () => void;
    selectedStation: string;
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
