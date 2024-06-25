from collections import defaultdict
import os
from utils import load_json, save_json, from_24_to_00
from paths import arrival_path, traintable_path

train_data = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
arrival = load_json(arrival_path)

for line in arrival:
    for train in arrival[line]:
        for direction in arrival[line][train]:
            for day in arrival[line][train][direction]:
                for station in arrival[line][train][direction][day]:
                    train_data[line][train][day].append(
                        {
                            "station": station,
                            "arrivalTime": from_24_to_00(arrival[line][train][direction][day][station][0]),
                            "departureTime": from_24_to_00(arrival[line][train][direction][day][station][1]),
                            "direction": direction,
                        }
                    )

for line, v in train_data.items():
    os.makedirs(os.path.join(traintable_path, line), exist_ok=True)
    for train, train_info in v.items():
        file_path = os.path.join(traintable_path, line, f"{train}.json")
        save_json(file_path, train_info)
