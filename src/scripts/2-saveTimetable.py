import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()
API_LINK = os.getenv("API_LINK")

stations_file_path = './src/data/stations.json'
arrival_file_path = './src/data/arrival.json'
timetable_file_path = './public/timetable'

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)

def fetch_timetable(station_id):
    response = requests.get(f"{API_LINK}/subway/station/timetable.json?id={station_id}")
    return response.json()

def transform_data(data, directions):
    return [
        {
            "trainNumber": "",
            "startStation": train["start_station_name"],
            "endStation": train["end_station_name"],
            "arrivalTime": train.get("time_arrive", ""),
            "departureTime": train.get("time_departure", ""),
            "direction": directions[direction],
        }
        for hourly_train in data["train_times"]
        for direction in ["up", "down"]
        for train in hourly_train[f"{direction}_times"]
    ]

def adjust_time(time_str):
    if time_str and time_str.startswith("24"):
        return "00" + time_str[2:]
    return time_str


stations = load_json(stations_file_path)
arrival = load_json(arrival_file_path)

for line in stations:
    for station in stations[line].keys():
        response = requests.get(f"{API_LINK}/subway/station/timetable.json?id={station}")
        data = response.json()
        directions = {direction: data["weekday"]["directions"][direction][0] for direction in ["up", "down"]}

        rendered_table = {}
        for day in ["weekday", "saturday", "holiday"]:
            transformed_data = transform_data(data[day], directions)
            
            # 부산교통공사 소속 노선 열차번호 찾기
            if line in ["1호선", "2호선", "3호선", "4호선"]:
                for entry in transformed_data:
                    trains = arrival[line][station][day][entry["direction"]]
                    for train_num, times in trains.items():
                        arrival_time = adjust_time(entry["arrivalTime"][:5]) if entry["arrivalTime"] else ""
                        departure_time = adjust_time(entry["departureTime"][:5]) if entry["departureTime"] else ""
                            
                        if arrival_time and times[0] == arrival_time:
                            entry["trainNumber"] = train_num
                            trains[train_num][0] = entry["arrivalTime"]

                        if departure_time and times[1] == departure_time:
                            entry["trainNumber"] = train_num
                            trains[train_num][1] = entry["departureTime"]
                    
                    if not entry["trainNumber"]:
                        # 오류 난 경우 (아래), csv 파일 직접 수정 후 재실행
                        # 4033~4045 홀수 / 평일 / 출발, 도착 / 007
                        # 4003~4031, 4047~4309 홀수 / 평일 / 출발 / 001
                        # 4003~4295 홀수 / 토요일 / 출발 / 001
                        # 4003~4277 홀수 / 공휴일 / 출발 / 001
                        print(f"{station}역 {entry['direction']} 방향의 {day} {entry['arrivalTime']} 도착 / {entry['departureTime']} 출발 열차번호를 찾을 수 없습니다.")

            rendered_table[day] = transformed_data

        save_path = os.path.join(timetable_file_path, f"{station}.json")
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        save_json(save_path, rendered_table)
        print(f"{line} {station} 저장 완료")

save_json(arrival_file_path, arrival)
