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
        <div className="overflow-auto flex justify-center">
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
                            <th className="pl-3 pr-2 sm:px-4 py-2 text-medium text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-300">
                                열차번호
                            </th>
                            <th className="pl-2 pr-2.5 sm:px-4 py-2 text-medium text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-300">
                                출발지 &gt; 행선지
                            </th>
                            <th className="pl-2.5 pr-2 sm:px-4 py-2 text-medium text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-300">
                                도착시각
                            </th>
                            <th className="pl-2 pr-3 sm:px-4 py-2 text-medium text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-300">
                                출발시각
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700 text-zinc-900 dark:text-zinc-100 -z-10">
                        {trainTimes.map((train, index) => (
                            <tr key={index}>
                                <td
                                    className="pl-3 pr-2 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums hover:cursor-pointer hover:underline hover:text-zinc-500 dark:hover:text-zinc-400"
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
        </div>
    );
};

export default StationTable;
