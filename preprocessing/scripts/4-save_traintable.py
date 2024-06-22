from collections import defaultdict
import os
from utils import load_json, save_json, nested_dict
from paths import arrival_path, traintable_path

train_data = defaultdict(nested_dict)
arrival = load_json(arrival_path)

for line in arrival:
    for station in arrival[line]:
        for day in arrival[line][station]:
            for direction in arrival[line][station][day]:
                for train_num in arrival[line][station][day][direction]:
                    train_data[line][train_num][day][direction][station] = arrival[line][station][day][direction][train_num]

for line, v in train_data.items():
    os.makedirs(os.path.join(traintable_path, line), exist_ok=True)
    for train_num, train_info in v.items():
        file_path = os.path.join(traintable_path, line, f"{train_num}.json")
        save_json(file_path, train_info)