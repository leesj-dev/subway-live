from collections import defaultdict
import csv
import json

csv_file_path = './src/data/부산교통공사_운행정보.csv'
stations_file_path = './src/data/stations.json'
output_file_path = './src/data/arrival.json'

# stations.json 로드
with open(stations_file_path, 'r', encoding='utf8') as json_file:
    json_data = json.load(json_file)

# output 구조 생성: 노선명 > 역명 > 요일 종류 > 진행 방향 > 열차번호 > [도착시간, 출발시간]
output = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: defaultdict(dict))))

# csv 로드
with open(csv_file_path, 'r', encoding='utf8') as csv_file:
    csv_reader = csv.reader(csv_file)
    next(csv_reader)  # header row 스킵

    for row in csv_reader:
        # 열차번호, 노선명, 출발역, 종착역, 요일 종류, 도착시간, 출발시간
        train_number, line, start_station, end_station, day, arrival_times, departure_times = row

        stations_id = list(json_data[line].keys())  # ['PSS1M164', 'PSS1M163', ...]
        stations_name = list(json_data[line].values())  # ['다대포해수욕장', '다대포항', ...]

        ## 1. day 전처리
        day = {'평일': 'weekday', '토요일': 'saturday', '공휴일': 'holiday'}[day]

        ## 2. direction: 열차 진행 방향 (노선의 두 끝 역 중 하나)
        # stations_id_subset: 해당 열차의 출발역부터 종착역까지의 역 목록
        start_station_idx = stations_name.index(start_station)
        end_station_idx = stations_name.index(end_station)
        if start_station_idx < end_station_idx:
            direction = json_data[line][stations_id[-1]]
            stations_id_subset = stations_id[start_station_idx:end_station_idx + 1] 
        else:
            direction = json_data[line][stations_id[0]]
            stations_id_subset = stations_id[end_station_idx:start_station_idx + 1][::-1]
        
        ## 3. 역별 arrival_times, departure_times 처리
        # arrival_times: "001-05:51+002-05:53+003-05:55" 형태
        # arrival_list = ["05:51", "05:53", "05:55"] 형태
        arrival_list = [entry.split('-')[1] for entry in arrival_times.split('+')]
        departure_list = [entry.split('-')[1] for entry in departure_times.split('+')]

        # 출발역 도착시간 삭제 + 종착역 칸 추가
        arrival_list[0] = ""
        departure_list.append("")

        # {station: [arrival_time, departure_time]} 꼴의 dictionary 생성
        time_dict = {}
        for station, times in zip(stations_id_subset, zip(arrival_list, departure_list)):
            time_dict[station] = list(times)
        
        ## 4. 최종 output 생성
        for station, times in time_dict.items():
            output[line][station][day][direction][train_number] = times

# JSON 파일로 저장
with open(output_file_path, 'w', encoding='utf8') as f:
    f.write(json.dumps(output, ensure_ascii=False))