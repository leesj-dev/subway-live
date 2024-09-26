import axios from "axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import stations from "./constants/stations";
import { dateFromToday } from "./utils/timeUtils";
import { ArrivalInfo, StationTableData, TrainTableData } from "./types";
import fillStationTableData from "./utils/fillStationTableData";

interface GlobalState {
    selectedLine: string;
    selectedStation: string;
    selectedTrain: string;
    day: string;
    direction: string;
    loading: boolean;
    manualRefresh: boolean;
    arrivalInfo: ArrivalInfo | null;
    stationTableData: StationTableData | null;
    trainTableData: TrainTableData | null;
    fetchArrivalInfo: () => void;
    processArrivalInfo: () => void;
    fetchStationTableData: () => void;
    fetchTrainTableData: () => void;
}

const useStore = create<GlobalState>()(
    persist(
        devtools(
            (set) => ({
                selectedLine: "",
                selectedStation: "",
                selectedTrain: "",
                day: dateFromToday(0),
                direction: "",
                loading: false,
                manualRefresh: false,
                arrivalInfo: null,
                stationTableData: null,
                trainTableData: null,

                fetchArrivalInfo: async () => {
                    const state = useStore.getState();
                    const stationID = stations[state.selectedLine]?.find((s) => s.name === state.selectedStation)?.id;
                    if (!state.arrivalInfo || state.manualRefresh) set({ loading: true });
                    const response = await axios.get(`https://api.leesj.me/subway/station/arrivals.json?base_time=realtime&id=${stationID}`);
                    set({ arrivalInfo: await response.data });
                },

                processArrivalInfo: () => {
                    const state = useStore.getState();
                    if (!state.arrivalInfo || !state.stationTableData) return;
                    set({
                        arrivalInfo: fillStationTableData(state.selectedLine, state.selectedStation, state.arrivalInfo, state.stationTableData),
                        loading: false,
                    });
                },

                fetchStationTableData: async () => {
                    const state = useStore.getState();
                    const stationID = stations[state.selectedLine]?.find((s) => s.name === state.selectedStation)?.id;
                    if (!state.arrivalInfo || state.manualRefresh) set({ loading: true });
                    const response = await axios.get(`./timetable/${stationID}.json`);
                    set({ stationTableData: await response.data, loading: false });
                },

                fetchTrainTableData: async () => {
                    const state = useStore.getState();
                    if (!state.arrivalInfo || state.manualRefresh) set({ loading: true });
                    const response = await axios.get(`./traintable/${state.selectedLine}/${state.selectedTrain}.json`);
                    set({ trainTableData: response.data, loading: false });
                },
            }),
            {
                name: "globalStore",
            }
        ),
        {
            name: "globalStore",
            getStorage: () => sessionStorage,
        }
    )
);

export default useStore;
