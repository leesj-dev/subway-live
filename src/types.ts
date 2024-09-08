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

// timetable
export interface TrainTime {
    trainNumber: string;
    startStation: string;
    endStation: string;
    arrivalTime: string;
    departureTime: string;
    direction: string;
}

export interface StationTableData {
    [day: string]: TrainTime[];
}

// traintable
export interface StationTime {
    station: string;
    arrivalTime: string;
    departureTime: string;
    direction: string;
}

export interface TrainTableData {
    [day: string]: StationTime[];
}
