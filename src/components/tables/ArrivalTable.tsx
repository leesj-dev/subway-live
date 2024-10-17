import React from "react";
import { ArrivalTimes } from "../../types";
import { formatTime } from "../../utils/timeUtils";
import { useNavigate } from "react-router-dom";

interface ArrivalTableProps {
    direction: string;
    times: ArrivalTimes[] | null;
    selectedLine?: string; // optional
    stationID?: string; // optional
}

const ArrivalTable: React.FC<ArrivalTableProps> = ({ direction, times }) => {
    const navigate = useNavigate();
    const handleTrainClick = (trainNo: string) => {
        sessionStorage.setItem("selectedTrain", trainNo);
        navigate("/train");
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">{direction} 방향</h2>
            <table className="table-fixed divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300">
                    <tr className="h-10 px-2 py-3 text-center text-xs font-medium tracking-wider">
                        <th className="w-20">열차번호</th>
                        <th className="w-40">행선지</th>
                        <th className="w-28">남은 시간</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-gray-100">
                    {times && (
                        <>
                            {times.map((train, index) => (
                                <tr key={`${direction}-${index}`} className="h-11 px-3 py-3 whitespace-nowrap">
                                    <td
                                        className="w-20 tabular-nums hover:cursor-pointer hover:underline hover:text-gray-500 dark:hover:text-gray-400"
                                        onClick={() => handleTrainClick(train.train_no)}
                                    >
                                        {train.train_no}
                                    </td>
                                    <td className="w-40">{train.end_station_name}</td>
                                    <td className="w-28 tabular-nums">
                                        {train.remain_sec === 0
                                            ? train.display_txt || "도착"
                                            : formatTime(train.remain_sec, train.from_schedule ?? false)}
                                    </td>
                                </tr>
                            ))}
                            {[...Array(2 - times.length)].map(() => (
                                <tr className="h-11 px-3 py-3 whitespace-nowrap">
                                    <td className="w-20"></td>
                                    <td className="w-40"></td>
                                    <td className="w-28"></td>
                                </tr>
                            ))}
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ArrivalTable;
