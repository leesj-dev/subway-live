import { StationTime } from "../../types";
import stations from "../../constants/stations";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface TrainTableProps {
    stationTimes: StationTime[];
    selectedLine: string;
}

const TrainTable: React.FC<TrainTableProps> = ({ stationTimes, selectedLine }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const handleStationClick = (station: string) => {
        sessionStorage.setItem("selectedStation", station);
        setShowPopup(true);
    };
    const handlePopupSelect = (option: "arrival" | "station") => {
        setShowPopup(false); // 팝업 닫기
        navigate(`/${option}`); // 선택한 옵션에 따라 페이지 이동
    };

    return (
        <div className="overflow-aut flex justify-center">
            <div
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 shadow-sm overflow-y-auto max-h-[min(calc(98vh-360px),calc(85vh-270px))]
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-zinc-100
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-zinc-300
                dark:[&::-webkit-scrollbar-track]:bg-zinc-700
                dark:[&::-webkit-scrollbar-thumb]:bg-zinc-500"
            >
                <table className="border-collapse divide-y divide-zinc-200 dark:divide-zinc-700">
                    <thead className="bg-zinc-50 dark:bg-zinc-800 sticky top-0">
                        <tr className="h-9">
                            <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-300">
                                역
                            </th>
                            <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-300">
                                도착시각
                            </th>
                            <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-300">
                                출발시각
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700 text-zinc-900 dark:text-zinc-100 -z-10">
                        {stationTimes.map((station, index) => (
                            <tr key={index}>
                                <td
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums hover:cursor-pointer hover:underline hover:text-zinc-500 dark:hover:text-zinc-400"
                                    onClick={() => handleStationClick(stations[selectedLine]?.find((s) => s.id === station.station)?.name || "")}
                                >
                                    {stations[selectedLine]?.find((s) => s.id === station.station)?.name}
                                </td>
                                <td className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{station.arrivalTime}</td>
                                <td className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{station.departureTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 팝업 */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-zinc-200 rounded-xl p-5 pb-4 shadow-lg dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-600">
                        <h2 className="text-xl font-medium mb-4 text-zinc-900 dark:text-zinc-100">옵션 선택</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handlePopupSelect("arrival")}
                                className="w-36 bg-gradient-to-r from-cyan-500 to-blue-500 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_150%] transition-all duration-300 delay-100 ease-in-out focus:ring-2 outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-zinc-200 font-semibold px-4 py-2 rounded-lg shadow-sm tracking-tight"
                            >
                                실시간 도착정보
                            </button>
                            <button
                                onClick={() => handlePopupSelect("station")}
                                className="w-36 bg-gradient-to-r from-pink-500 to-purple-500 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_150%] transition-all duration-300 delay-100 ease-in-out focus:ring-2 outline-none focus:ring-purple-300 dark:focus:ring-purple-800 text-zinc-200 font-semibold px-4 py-2 rounded-lg shadow-sm tracking-tight"
                            >
                                역 시간표
                            </button>
                        </div>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-8 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainTable;
