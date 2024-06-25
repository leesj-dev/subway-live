import csv
from utils import load_json, fetch_json, save_json, format_time, add_time
from paths import codes_path, stations_path, arrival_path, arrival_original_path
from env_variables import SERVICE_KEY

arrival = load_json(arrival_original_path)
stations = load_json(stations_path)
cache = {}  # fetched data 캐싱

with open(codes_path, "r", encoding="utf8") as csv_file:
    csv_reader = csv.reader(csv_file)
    csv_data = list(csv_reader)

    for line in arrival:
        stations_name = list(stations[line].keys())
        stations_id = list(stations[line].values())
        for train in arrival[line]:
            for direction in arrival[line][train]:
                for day in arrival[line][train][direction]:
                    # day_code 찾기
                    if line in ["부산김해경전철", "동해선"]:
                        day_code = "8" if day == "weekday" else "9"
                    else:
                        day_code = {"weekday": "8", "saturday": "7", "holiday": "9"}[day]

                    # 종착역 ID, 이름 찾기
                    passing_stations = list(arrival[line][train][direction][day].keys())
                    start_station_idx, end_station_idx = stations_id.index(passing_stations[0]), stations_id.index(passing_stations[-1])
                    if start_station_idx < end_station_idx:
                        new_end_station_idx = end_station_idx + 1
                    else:
                        new_end_station_idx = end_station_idx - 1
                    new_end_station_id = stations_id[new_end_station_idx]  # 실제 종착역
                    new_end_station_name = stations_name[new_end_station_idx]
                    end_station_id = stations_id[end_station_idx]  # 실제 종착역 전 역 / 기존 데이터에서 종착역

                    for row in csv_data:
                        operator, _, line_code, line_name, station_code, station_name = row
                        if line_name == line and station_name == new_end_station_name:
                            cache_key = (day_code, line_code, station_code)
                            if cache_key not in cache:
                                cache[cache_key] = fetch_json(
                                    f"https://openapi.kric.go.kr/openapi/trainUseInfo/subwayTimetable?serviceKey={SERVICE_KEY}&format=JSON&dayCd={day_code}&lnCd={line_code}&railOprIsttCd={operator}&stinCd={station_code}"
                                )["body"]

                            kric = cache[cache_key]  # 캐시된 데이터 사용

                            for kric_train in kric:
                                if kric_train["trnNo"] == train:
                                    end_station_arrival_time = arrival[line][train][direction][day][end_station_id][0]

                                    # 예외처리 1: 부산김해경전철 1015, 1035 열차: 전역 도착 시간에서 115초 더함
                                    if line == "부산김해경전철" and train in ["1015", "1035"]:
                                        arrival_kric = add_time(end_station_arrival_time, 115)

                                    # 예외처리 2: 부산김해경전철 2005, 2019, 2039 열차: 전역 도착 시간에서 171초 더함
                                    elif line == "부산김해경전철" and train in ["2005", "2019", "2039"]:
                                        arrival_kric = add_time(end_station_arrival_time, 171)

                                    # 예외처리 3: 2호선 호포발 양산행 모든 요일 2602 열차: kric 데이터에서 30초 뺌
                                    elif line == "2호선" and train == "2602":
                                        arrival_kric = add_time(arrival_kric, -30)

                                    # 예외처리 4: 4호선 안평발 미남행 평일 4033~4045 홀수 열차: kric 데이터에서 30초 더함
                                    elif line == "4호선" and day == "weekday" and int(train) in range(4033, 4047, 2):
                                        arrival_kric = add_time(arrival_kric, 30)

                                    # 예외처리 5: 2호선 양산행 2452, 2630 열차: 전역 도착 시간에서 155초 더함
                                    elif line == "2호선" and train in ["2452", "2630"]:
                                        end_station_arrival_time = arrival[line][train][direction][day][end_station_id][0]
                                        arrival_kric = add_time(end_station_arrival_time, 155)
                                        print(line, train, day, new_end_station_id, arrival_kric)

                                    # 예외처리 6: 2호선 양산행 2320~2336 짝수 열차: 전역 도착 시간에서 155초 더함
                                    elif line == "2호선" and int(train) in range(2320, 2337, 2):
                                        arrival_kric = add_time(end_station_arrival_time, 155)
                                        print(line, train, day, new_end_station_id, arrival_kric)

                                    else:
                                        arrival_kric = format_time(kric_train["arvTm"])

                                    arrival[line][train][direction][day][new_end_station_id] = [arrival_kric, ""]
                                    break

                    print(f"{line} {train}번 {day}에 {new_end_station_name}역 추가 완료 (도착 시각 {arrival_kric})")

save_json(arrival_path, arrival)
