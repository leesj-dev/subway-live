import { TrainTableProps } from "../types";

const Traintable: React.FC<TrainTableProps> = ({ stationTimes, stations, selectedLine }) => {
    return (
        <div className="overflow-auto">
            <table className="mx-auto divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">역</th>
                        <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">도착시각</th>
                        <th className="px-3 sm:px-4 py-2 text-medium text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">출발시각</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-gray-100">
                    {stationTimes.map((station, index) => (
                        <tr key={index}>
                            <td className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{stations[selectedLine]?.find((s) => s.id === station.station)?.name}</td>
                            <td className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{station.arrivalTime}</td>
                            <td className="px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap tabular-nums">{station.departureTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Traintable;
