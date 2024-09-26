import { TrainTime } from "../../types";
import { useNavigate } from "react-router-dom";

interface StationTableProps {
    trainTimes: TrainTime[];
}

const StationTable: React.FC<StationTableProps> = ({ trainTimes }) => {
    const navigate = useNavigate();
    const handleTrainClick = (trainNo: string) => {
        sessionStorage.setItem("selectedTrain", trainNo);
        navigate("/train");
    };

    return (
        <div className="overflow-auto">
            <table className="mx-auto divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="pl-3 pr-2 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            열차번호
                        </th>
                        <th className="pl-2 pr-2.5 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            출발지 &gt; 행선지
                        </th>
                        <th className="pl-2.5 pr-2 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            도착시각
                        </th>
                        <th className="pl-2 pr-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            출발시각
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-gray-100">
                    {trainTimes.map((train, index) => (
                        <tr key={index}>
                            <td
                                className="pl-3 pr-2 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums hover:cursor-pointer hover:underline hover:text-gray-500 dark:hover:text-gray-400"
                                onClick={() => handleTrainClick(train.trainNumber)}
                            >
                                {train.trainNumber}
                            </td>
                            <td className="pl-2 pr-2.5 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                                {train.startStation} &gt; {train.endStation}
                            </td>
                            <td className="pl-2.5 pr-2 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{train.arrivalTime}</td>
                            <td className="pl-2 pr-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{train.departureTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StationTable;
