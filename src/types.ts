// data types
export interface Stations {
    [line: string]: {
        id: string;
        name: string;
    }[];
}

export interface Trains {
    [line: string]: {
        up_info: string[];
        down_info: string[];
    };
}

export interface Directions {
    [line: string]: {
        up_info: string;
        down_info: string;
    };
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

// page props
export interface PageTemplateProps {
    title: string;
    selectedLine: string;
    handleLineChange: React.ChangeEventHandler<HTMLSelectElement>;
    entitySelector: JSX.Element;
    loading: boolean;
    content: JSX.Element | null;
}

// table props
export interface ArrivalTableProps {
    direction: string;
    times: ArrivalTimes[] | null;
    selectedLine?: string; // optional
    stationID?: string; // optional
}

export interface TimetableProps {
    trainTimes: RenderedTrainTime[];
}
export interface TraintableProps {
    stationTimes: RenderedStationTime[];
    selectedLine: string;
}

// selector props
export interface LineSelectorProps {
    selectedLine: string;
    handleLineChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface StationSelectorProps {
    selectedStation: string;
    handleStationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedLine: string;
}

export interface TrainSelectorProps {
    selectedTrain: string;
    handleTrainChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedLine: string;
}

export interface DirectionSelectorProps {
    direction: string;
    setDirection: (value: string) => void;
    data: { [day: string]: { direction: string }[] };
}

export interface DaySelectorProps {
    day: string;
    setDay: (day: string) => void;
    availableDays?: string[];
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
    [day: string]: DayData;
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
    [day: string]: RenderedTrainTime[];
}

// traintable rendering
export interface RenderedStationTime {
    station: string;
    arrivalTime: string;
    departureTime: string;
    direction: string;
}

export interface RenderedTraintableData {
    [day: string]: RenderedStationTime[];
}
