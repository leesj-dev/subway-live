import React from "react";

interface ArrivalInfo {
    train_no: string;
    end_station_name: string;
    remain_sec: number;
    display_txt: string;
}

interface ArrivalTableProps {
    upInfo: { times: ArrivalInfo[] | null };
    downInfo: { times: ArrivalInfo[] | null };
    formatTime: (seconds: number) => string;
    destinations: { [key: string]: string[] };
    currentLine: string;
}

const Table: React.FC<ArrivalTableProps> = ({ upInfo, downInfo, formatTime, destinations, currentLine }) => {
    return (
        <div className="mt-14">
            <div className="grid grid-rows-2 gap-8 md:grid-rows-1 md:grid-cols-2 md:gap-6">
                <div>
                    <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">{destinations[currentLine][0]}</h2>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr className="h-10">
                                <th scope="col" className="w-10 h-10 px-2 py-3 text-center text-xs font-medium text-gray-500 tracking-wider dark:text-gray-300">
                                     열차번호
                                </th>
                                <th scope="col" className="w-24 h-10 px-2 py-3 text-center text-xs font-medium text-gray-500 tracking-wider dark:text-gray-300">
                                    행선지
                                </th>
                                <th scope="col" className="w-16 h-10 px-2 py-3 text-center text-xs font-medium text-gray-500 tracking-wider dark:text-gray-300">
                                    남은 시간
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-slate-900 dark:text-slate-100">
                            {upInfo.times ?
                                upInfo.times.map((upTrain, index) => (
                                    <tr key={`up-${index}`}>
                                        <td className="w-20 h-10 px-3 py-3 whitespace-nowrap">{upTrain.train_no}</td>
                                        <td className="w-40 h-10 px-3 py-3 whitespace-nowrap">{upTrain.end_station_name}</td>
                                        <td className="w-24 h-10 px-3 py-3 whitespace-nowrap tabular-nums">
                                            {upTrain.remain_sec === 0 ? upTrain.display_txt : formatTime(upTrain.remain_sec)}
                                        </td>
                                    </tr>
                                )) : 
                                <tr>
                                    <td className="w-20 h-10 px-3 py-3 whitespace-nowrap"></td>
                                    <td className="w-40 h-10 px-3 py-3 whitespace-nowrap"></td>
                                    <td className="w-24 h-10 px-3 py-3 whitespace-nowrap"></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">{destinations[currentLine][1]}</h2>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="w-10 h-10 px-2 py-3 text-center text-xs font-medium text-gray-500 tracking-wider dark:text-gray-300">
                                    열차번호
                                </th>
                                <th scope="col" className="w-24 h-10 px-2 py-3 text-center text-xs font-medium text-gray-500 tracking-wider dark:text-gray-300">
                                    행선지
                                </th>
                                <th scope="col" className="w-16 h-10 px-2 py-3 text-center text-xs font-medium text-gray-500 tracking-wider dark:text-gray-300">
                                    남은 시간
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-slate-900 dark:text-slate-100">
                            {downInfo.times ?
                                downInfo.times.map((downTrain, index) => (
                                    <tr key={`down-${index}`}>
                                        <td className="w-20 h-10 px-3 py-3 whitespace-nowrap">{downTrain.train_no}</td>
                                        <td className="w-40 h-10 px-3 py-3 whitespace-nowrap">{downTrain.end_station_name}</td>
                                        <td className="w-24 h-10 px-3 py-3 whitespace-nowrap tabular-nums">
                                            {downTrain.remain_sec === 0 ? downTrain.display_txt : formatTime(downTrain.remain_sec)}
                                        </td>
                                    </tr>
                                )) :
                                <tr>
                                    <td className="w-20 h-10 px-3 py-3 whitespace-nowrap"></td>
                                    <td className="w-40 h-10 px-3 py-3 whitespace-nowrap"></td>
                                    <td className="w-24 h-10 px-3 py-3 whitespace-nowrap"></td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Table;