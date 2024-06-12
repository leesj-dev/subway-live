import { useState, useEffect } from "react";
import axios from "axios";
import stations from "./stations";

const SubwayInfo = () => {
    const [selectedLine, setSelectedLine] = useState("");
    const [selectedStation, setSelectedStation] = useState("");
    const [arrivalInfo, setArrivalInfo] = useState(null);

    const handleLineChange = (e) => {
        setSelectedLine(e.target.value);
        setSelectedStation("");
    };

    const handleStationChange = (e) => {
        setSelectedStation(e.target.value);
    };

    const fetchArrivalInfo = async () => {
        const stationID = stations[selectedLine].find((station) => station.name === selectedStation)?.id;
        if (stationID) {
            const response = await axios.get(
                `https://subway-live-ef069a488429.herokuapp.com/https://app.map.kakao.com/subway/station/arrivals.json?base_time=realtime&id=${stationID}`
            );
            setArrivalInfo(response.data);
        }
    };

    // 0분 0초 꼴로 변환
    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        if (min === 0) {
            return `${sec}초`;
        } else {
            return `${min}분 ${sec}초`;
        }
    };

    // 남은 시간 1초씩 감소
    useEffect(() => {
        let intervalId;
        if (arrivalInfo) {
            intervalId = setInterval(() => {
                setArrivalInfo((prevArrivalInfo) => ({
                    ...prevArrivalInfo,
                    up_info:
                        prevArrivalInfo.up_info && prevArrivalInfo.up_info.times
                            ? {
                                  ...prevArrivalInfo.up_info,
                                  times: prevArrivalInfo.up_info.times.map((train) => ({
                                      ...train,
                                      remain_sec: Math.max(0, train.remain_sec - 1),
                                  })),
                              }
                            : prevArrivalInfo.up_info,
                    down_info:
                        prevArrivalInfo.down_info && prevArrivalInfo.down_info.times
                            ? {
                                  ...prevArrivalInfo.down_info,
                                  times: prevArrivalInfo.down_info.times.map((train) => ({
                                      ...train,
                                      remain_sec: Math.max(0, train.remain_sec - 1),
                                  })),
                              }
                            : prevArrivalInfo.down_info,
                }));
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [arrivalInfo]);

    // 10초마다 새로 데이터 갱신
    useEffect(() => {
        const intervalId = setInterval(fetchArrivalInfo, 10000);
        return () => clearInterval(intervalId);
    });

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">부산 도시철도 실시간 도착정보</h1>
                <div className="mb-4">
                    <label htmlFor="line" className="block text-sm font-medium text-gray-700">
                        노선명
                    </label>
                    <select
                        id="line"
                        value={selectedLine}
                        onChange={handleLineChange}
                        className="mt-1 block w-full pl-3 py-2 text-center text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="">노선 선택</option>
                        {Object.keys(stations).map((line, index) => (
                            <option key={index} value={line}>
                                {line}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="station" className="block text-sm font-medium text-gray-700">
                        역명
                    </label>
                    <select
                        id="station"
                        value={selectedStation}
                        onChange={handleStationChange}
                        className="mt-1 block w-full pl-3 py-2 text-center text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        disabled={!selectedLine}
                    >
                        <option value="">역 선택</option>
                        {stations[selectedLine]?.map((station, index) => (
                            <option key={index} value={station.name}>
                                {station.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={fetchArrivalInfo}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!selectedStation}
                >
                    조회
                </button>
                {arrivalInfo && (
                    <div className="mt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-lg font-bold mb-2">상행</h2>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                열차번호
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                남은 시간
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {arrivalInfo.up_info.times &&
                                            arrivalInfo.up_info.times.map((upTrain, index) => (
                                                <tr key={`up-${index}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{upTrain.train_no}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap w-24">
                                                        {upTrain.remain_sec === 0 ? upTrain.display_txt : formatTime(upTrain.remain_sec)}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold mb-2">하행</h2>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                열차번호
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                남은 시간
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {arrivalInfo.down_info.times &&
                                            arrivalInfo.down_info.times.map((downTrain, index) => (
                                                <tr key={`down-${index}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{downTrain.train_no}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap w-24">
                                                        {downTrain.remain_sec === 0 ? downTrain.display_txt : formatTime(downTrain.remain_sec)}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubwayInfo;
