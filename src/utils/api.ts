import axios from "axios";
import { ArrivalInfo, StationTableData, TrainTableData } from "../types";

export const fetchArrivalInfo = async (stationID: string): Promise<ArrivalInfo> => {
    const response = await axios.get(`https://api.leesj.me/subway/station/arrivals.json?base_time=realtime&id=${stationID}`);
    return response.data;
};

export const fetchTimetableData = async (stationID: string): Promise<StationTableData> => {
    const response = await axios.get(`./timetable/${stationID}.json`);
    return response.data;
};

export const fetchTrainTableData = async (line: string, train: string): Promise<TrainTableData> => {
    const response = await axios.get(`./traintable/${line}/${train}.json`);
    return response.data;
};
