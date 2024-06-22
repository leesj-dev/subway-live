from dotenv import load_dotenv
from collections import defaultdict
import os
import csv
import json
import requests

load_dotenv()
SERVICE_KEY = os.getenv("SERVICE_KEY")
API_LINK = os.getenv("API_LINK")

csv_file_path = "./preprocessing/codes.csv"
stations_file_path = "./preprocessing/stations.json"
output_file_path = "./preprocessing/arrival_others.json"
day_type_dict = {"weekday": "8", "saturday": "7", "holiday": "9"}

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)

def fetch_json(link):
    response = requests.get(link)
    return response.json()

def adjust_time(time_str):
    return "00" + time_str[2:] if time_str.startswith("24") else time_str

def format_time(time_str):
    if not time_str: return
    return ":".join(time_str[i:i+2] for i in range(0, len(time_str), 2))  # hhmmss to hh:mm:ss

def convert_time(time_str):
    if not time_str: return
    hours = int(time_str[:2])
    minutes = int(time_str[3:5])
    seconds = int(time_str[6:8])
    return hours * 3600 + minutes * 60 + seconds
    

# output 구조 생성: 노선명 > 역명 > 요일 종류 > 진행 방향 > 열차번호 > [도착시간, 출발시간]
def nested_dict():
    return defaultdict(nested_dict)

output = defaultdict(nested_dict)  # recursive
stations = load_json(stations_file_path)
print("역\t\t방향\t요일\t열차번호[도착시각, 출발시각]\t차이")

# csv 로드
with open(csv_file_path, 'r', encoding='utf8') as csv_file:
    csv_reader = csv.reader(csv_file)
    next(csv_reader)  # header row 스킵

    for row in csv_reader:
        # 운영기관 코드, 운영기관명, 노선코드, 노선명, 역코드, 역명
        operator, _, line_code, line_name, station_code, station_name = row

        if line_name not in ["부산김해경전철", "동해선"]: continue  # 부산김해경전철과 동해선만 처리

        station_id = stations[line_name][station_name]
        data = fetch_json(f"{API_LINK}/subway/station/timetable.json?id={station_id}")
        directions = {direction: data["weekday"]["directions"][direction][0] for direction in ["up", "down"]}

        for day_type, day_code in day_type_dict.items():
            day_code_edit = "9" if day_type == "saturday" else day_code
            trains = data[day_type]["train_times"]
            kric = fetch_json(f"https://openapi.kric.go.kr/openapi/trainUseInfo/subwayTimetable?serviceKey={SERVICE_KEY}&format=JSON&dayCd={day_code_edit}&lnCd={line_code}&railOprIsttCd={operator}&stinCd={station_code}")["body"]

            for hourly_train in trains:
                for direction in ["up", "down"]:
                    for train in hourly_train[f"{direction}_times"]:
                        direction_station = directions[direction]
                        arrival_time = adjust_time(train.get("time_arrive", ""))
                        departure_time = adjust_time(train.get("time_departure", ""))
                        times = [arrival_time, departure_time]
                        train_number = ""

                        for kric_train in kric:
                            arrival_kric = format_time(kric_train["arvTm"])
                            departure_kric = format_time(kric_train["dptTm"])
                            
                            # 예외처리: 부산김해경전철의 1015, 1035, 2005, 2019, 2039 열차
                            if kric_train["trnNo"] in ["1015", "1035"] and direction_station == "사상" or kric_train["trnNo"] in ["2005", "2019", "2039"] and direction_station == "가야대":
                                arrival_time_sec = convert_time(arrival_time)
                                departure_time_sec = convert_time(departure_time)
                                if arrival_time and (arrival_kric_sec := convert_time(arrival_kric)) + 10 < arrival_time_sec < arrival_kric_sec + 35:
                                    train_number = kric_train["trnNo"]
                                    print(f"{station_name.ljust(7)}\t{direction_station}\t{day_type}\t{train_number}\t{times}\t{arrival_time_sec - arrival_kric_sec}초")
                                    break
                                elif departure_time and (departure_kric_sec := convert_time(departure_kric)) + 10 < departure_time_sec < departure_kric_sec + 35:
                                    train_number = kric_train["trnNo"]
                                    print(f"{station_name.ljust(7)}\t{direction_station}\t{day_type}\t{train_number}\t{times}\t{departure_time_sec - departure_kric_sec}초")
                                    break
                            else:
                                if arrival_time and arrival_kric == arrival_time:
                                    train_number = kric_train["trnNo"]
                                    break
                                elif departure_time and departure_kric == departure_time:
                                    train_number = kric_train["trnNo"]
                                    break

                        if not train_number:
                            print(f"열차번호 없음: {station_name.ljust(7)}\t{direction_station}\t{day_type}\t?\t{times}")

                        output[line_name][station_id][day_type][direction_station][train_number] = times

        print(f"{line_name} {station_name}역 처리 완료\n")

save_json(output_file_path, output)