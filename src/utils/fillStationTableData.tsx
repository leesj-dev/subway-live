import stations from "../constants/stations";
import directions from "../constants/directions";
import { ArrivalInfo, StationTableData, TrainTime } from "../types";
import { getTimeInSeconds, dateFromToday } from "./timeUtils";

// timetable 전처리
const fillStationTableData = (selectedLine: string, stationID: string, arrivalData: ArrivalInfo, timetable: StationTableData) => {
    const currentTime = getTimeInSeconds(new Date().toTimeString().split(" ")[0]);

    function getSchedule(days: number, direction: string) {
        return timetable[dateFromToday(days)].filter((train) => train.direction === direction);
    }

    // 출발역인 경우, 출발 시간을 사용. 나머지는 도착 시간을 사용
    function getTrainTime(train: TrainTime) {
        return train.arrivalTime ? train.arrivalTime : train.departureTime;
    }

    // 열차의 도착(출발)시각과 현재시각 차이를 초로 반환
    function getRemainSec(train: TrainTime) {
        return getTimeInSeconds(getTrainTime(train)) - currentTime;
    }

    // 해당 열차가 종착역인지 구함
    function isEndingStation(direction: string) {
        return stationID === stations[selectedLine]?.find((s) => s.name === direction)?.id;
    }

    for (const key of ["up_info", "down_info"] as const) {
        const direction = directions[selectedLine][key];
        const opposite_direction = directions[selectedLine][key === "up_info" ? "down_info" : "up_info"];
        const scheduleToday = getSchedule(0, direction);
        let times = arrivalData[key].times ?? [];

        times = times.map((train) => {
            // 1. 부산김해경전철의 빈 열차번호 채우기
            if (!train.train_no) {
                const matchedTrain = scheduleToday.find((scheduleTrain) => {
                    return (
                        // 시간표보다 80초 일찍 ~ 시간표보다 120초 늦게 도착하는 열차를 찾음 (곧 도착 열차의 경우, 최대 20초 일찍 ~ 60초 늦게 도착하는 열차)
                        getRemainSec(scheduleTrain) >= train.remain_sec - 120 && getRemainSec(scheduleTrain) <= train.remain_sec + 80
                    );
                });
                if (matchedTrain) train.train_no = matchedTrain.trainNumber;
            }
            // 2. 출발역에서 출발하는 열차의 경우, 시간표 정보임을 표시
            if (isEndingStation(opposite_direction)) {
                return { ...train, from_schedule: true };
            } // 3. 나머지 일반적인 경우, 시간표 정보가 아니기 때문에 from_schedule를 false로 설정
            else {
                return { ...train, from_schedule: false };
            }
        });

        // 4. 시간표 정보 중 현재 시간 이후의 열차 정보 2개를 가져옴
        const upcomingTrains = scheduleToday
            .filter((train) => getRemainSec(train) > 0)
            .slice(0, 2)
            .map((train) => ({
                train_no: train.trainNumber,
                end_station_name: train.endStation,
                remain_sec: getRemainSec(train),
                from_schedule: true,
            }));

        // 5. 1) 'UpcomingTrains'가 null이면서 종착역이 아니거나, 2) 바로 다음 열차가 첫차와 같고 남은 시간이 20분 이상이라면, 첫차 운행 시작 시각을 띄워줌
        if (!isEndingStation(direction)) {
            if (!upcomingTrains.length || (upcomingTrains[0].train_no === scheduleToday[0].trainNumber && upcomingTrains[0].remain_sec >= 1200)) {
                const firstTrain = !upcomingTrains.length ? getSchedule(1, direction)[0] : scheduleToday[0]; // 1)의 경우라면 익일 첫차를, 2)의 경우라면 당일 열차를 가져옴
                times = [
                    {
                        train_no: firstTrain.trainNumber,
                        end_station_name: firstTrain.endStation,
                        remain_sec: 0, // remain_sec이 0이어야 display_txt를 남은 시간에 표시해주기 때문
                        display_txt: `${getTrainTime(firstTrain).slice(0, 5)} 운행시작`,
                        from_schedule: true,
                    },
                ];
            }
            // 6. 행 수가 2 미만인 경우, 시간표 정보로부터 (2 - 행 수)만큼의 다음 열차 정보를 가져와 추가
            else if (times.length < 2) {
                times = [...times, ...upcomingTrains.slice(times.length)];
            }
        }
        // 7. 업데이트된 times를 arrivalData에 저장
        arrivalData[key].times = times;
    }
    return arrivalData;
};

export default fillStationTableData;
