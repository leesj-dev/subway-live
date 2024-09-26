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
        <div className="overflow-auto">
            <table className="mx-auto divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            역
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            도착시각
                        </th>
                        <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            출발시각
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-gray-100">
                    {stationTimes.map((station, index) => (
                        <tr key={index}>
                            <td
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums hover:cursor-pointer hover:underline hover:text-gray-500 dark:hover:text-gray-400"
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

            {/* 팝업 */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-200 rounded-xl p-5 pb-4 shadow-lg dark:bg-gray-800 border border-gray-400 dark:border-gray-600">
                        <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-gray-100">옵션 선택</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handlePopupSelect("arrival")}
                                className="w-36 bg-gradient-to-r from-cyan-500 to-blue-500 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_150%] transition-all duration-300 delay-100 ease-in-out focus:ring-2 outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-gray-200 font-semibold px-4 py-2 rounded-lg shadow-sm tracking-tight"
                            >
                                실시간 도착정보
                            </button>
                            <button
                                onClick={() => handlePopupSelect("station")}
                                className="w-36 bg-gradient-to-r from-pink-500 to-purple-500 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_150%] transition-all duration-300 delay-100 ease-in-out focus:ring-2 outline-none focus:ring-purple-300 dark:focus:ring-purple-800 text-gray-200 font-semibold px-4 py-2 rounded-lg shadow-sm tracking-tight"
                            >
                                역 시간표
                            </button>
                        </div>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-8 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
