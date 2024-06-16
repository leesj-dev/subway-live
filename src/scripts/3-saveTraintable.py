from collections import defaultdict
import json
import os

arrival_file_path = './src/data/arrival.json'
timetable_file_path = './public/traintable'

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)

arrival = load_json(arrival_file_path)
train_data = defaultdict(lambda:defaultdict(lambda: defaultdict(lambda: defaultdict(dict))))

for line in arrival:
    for station in arrival[line]:
        for day in arrival[line][station]:
            for direction in arrival[line][station][day]:
                for train_num in arrival[line][station][day][direction]:
                    train_data[line][train_num][day][direction][station] = arrival[line][station][day][direction][train_num]

for line, v in train_data.items():
    os.makedirs(os.path.join(timetable_file_path, line), exist_ok=True)
    for train_num, train_info in v.items():
        file_path = os.path.join(timetable_file_path, line, f"{train_num}.json")
        save_json(file_path, train_info)