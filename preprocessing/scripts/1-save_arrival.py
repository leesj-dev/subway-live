from collections import defaultdict
import csv
from utils import load_json, save_json, fetch_json, format_time, convert_time, add_time, nested_dict
from paths import codes_path, stations_path, arrival_original_path
from env_variables import API_LINK, SERVICE_KEY


output = defaultdict(nested_dict)  # recursive
stations = load_json(stations_path)
day_type_dict = {"weekday": "8", "saturday": "7", "holiday": "9"}
print("역\t\t방향\t요일\t열차번호[도착시각, 출발시각]\t차이")


def find_direction(line_name, train_number):
    if line_name in ["1호선", "2호선", "3호선", "4호선"]:
        return "up" if int(train_number) % 2 == 1 else "down"
    elif line_name == "부산김해경전철":
        return "up" if train_number[0] in ["1", "3"] else "down"
    elif line_name == "동해선":
        return "up" if int(train_number[1:]) % 2 == 0 else "down"


# csv 로드
with open(codes_path, "r", encoding="utf8") as csv_file:
    csv_reader = csv.reader(csv_file)
    next(csv_reader)  # header row 스킵

    for row in csv_reader:
        # 운영기관 코드, 운영기관명, 노선코드, 노선명, 역코드, 역명
        operator, _, line_code, line_name, station_code, station_name = row

        station_id = stations[line_name][station_name]
        data = fetch_json(f"{API_LINK}/subway/station/timetable.json?id={station_id}")
        directions = {direction: data["weekday"]["directions"][direction][0] for direction in ["up", "down"]}

        for day_type, day_code in day_type_dict.items():

            # 부산김해경전철과 동해선은 토요일을 휴일로 처리
            if line_name in ["부산김해경전철", "동해선"]:
                day_code_edit = "9" if day_type == "saturday" else day_code
            else:
                day_code_edit = day_code

            trains = data[day_type]["train_times"]
            kric = fetch_json(
                f"https://openapi.kric.go.kr/openapi/trainUseInfo/subwayTimetable?serviceKey={SERVICE_KEY}&format=JSON&dayCd={day_code_edit}&lnCd={line_code}&railOprIsttCd={operator}&stinCd={station_code}"
            )["body"]

            for hourly_train in trains:
                for direction in ["up", "down"]:
                    for train in hourly_train[f"{direction}_times"]:
                        train_number = ""
                        arrival_time = train.get("time_arrive", "")
                        departure_time = train.get("time_departure", "")
                        end_station_name = train.get("end_station_name", "")

                        times = [arrival_time, departure_time]
                        direction_station = directions[direction]

                        for kric_train in kric:
                            arrival_kric = format_time(kric_train["arvTm"])
                            departure_kric = format_time(kric_train["dptTm"])

                            # 예외처리 1: 부산김해경전철 1015, 1035, 2005, 2019, 2039 열차
                            if line_name == "부산김해경전철" and (
                                kric_train["trnNo"] in ["1015", "1035"] and direction_station == "사상" or kric_train["trnNo"] in ["2005", "2019", "2039"] and direction_station == "가야대"
                            ):
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
                                # 예외처리 2: 1호선 다대포항역 평일 7901 열차: kric 데이터에서 5초 뺌
                                if line_name == "1호선" and station_name == "다대포항" and day_type == "weekday" and kric_train["trnNo"] == "7901":
                                    arrival_kric = add_time(arrival_kric, -5)

                                # 예외처리 3: 2호선 호포발 양산행 모든 요일 2602 열차: kric 데이터에서 30초 뺌
                                elif line_name == "2호선" and direction_station == "양산" and kric_train["trnNo"] == "2602":
                                    arrival_kric = add_time(arrival_kric, -30)
                                    departure_kric = add_time(departure_kric, -30)

                                # 예외처리 4: 4호선 안평발 미남행 평일 4033~4045 홀수 열차: kric 데이터에서 30초 더함
                                elif line_name == "4호선" and direction_station == "미남" and day_type == "weekday" and int(kric_train["trnNo"]) in range(4033, 4047, 2):
                                    arrival_kric = add_time(arrival_kric, 30)
                                    departure_kric = add_time(departure_kric, 30)

                                # 예외처리 5: 4호선 안평역 미남행 모든 열차: kric 데이터에서 30초 뺌
                                if line_name == "4호선" and direction_station == "미남" and station_name == "안평":
                                    departure_kric = add_time(departure_kric, -30)

                                # 예외처리 6: 4호선 안평역 미남행 평일 4033~4045 홀수 열차: kric 데이터에서 30초 더 뺌
                                if line_name == "4호선" and direction_station == "미남" and station_name == "안평" and day_type == "weekday" and int(kric_train["trnNo"]) in range(4033, 4047, 2):
                                    departure_kric = add_time(departure_kric, -30)

                                # 나머지 일반적인 경우 처리
                                if arrival_time and arrival_kric == arrival_time and direction == find_direction(line_name, kric_train["trnNo"]):
                                    train_number = kric_train["trnNo"]
                                    break
                                elif departure_time and departure_kric == departure_time and not arrival_time and direction == find_direction(line_name, kric_train["trnNo"]):
                                    train_number = kric_train["trnNo"]
                                    break

                        if not train_number:
                            # 예외처리 6: 2호선 평일 2630 열차, 휴일 2452 열차
                            if line_name == "2호선" and day_type == "weekday":
                                train_number = "2630"
                            elif line_name == "2호선" and day_type == "holiday":
                                train_number = "2452"
                            elif line_name == "2호선" and station_name in ["부산대양산캠퍼스", "남양산"]:
                                train_number = "2602"
                            else:
                                print(f"열차번호 없음: {station_name.ljust(7)}\t{direction_station}\t{day_type}\t?\t{times}")

                        # output 구조: 노선명 > 열차번호 > 진행 방향 > 요일 종류 > 역명 > [도착시간, 출발시간]
                        output[line_name][train_number][direction_station][day_type][station_id] = times

        print(f"{line_name} {station_name}역 처리 완료\n")

# sort by arrival_time and departure_time
for line in output:
    for train in output[line]:
        for direction in output[line][train]:
            for day in output[line][train][direction]:
                output[line][train][direction][day] = dict(sorted(output[line][train][direction][day].items(), key=lambda x: (x[1][0], x[1][1])))

save_json(arrival_original_path, output)
