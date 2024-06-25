from collections import defaultdict
import os
from utils import load_json, save_json, from_24_to_00
from paths import arrival_path, timetable_path, stations_path

station_data = defaultdict(lambda: defaultdict(list))
arrival = load_json(arrival_path)
stations_dict = load_json(stations_path)

for line in arrival:
    stations_id = list(stations_dict[line].keys())
    stations_name = list(stations_dict[line].values())
    for train in arrival[line]:
        for direction in arrival[line][train]:
            for day in arrival[line][train][direction]:
                stations = list(arrival[line][train][direction][day].keys())
                start_station, end_station = stations[0], stations[-1]
                for station in arrival[line][train][direction][day]:
                    station_data[station][day].append(
                        {
                            "trainNumber": train,
                            "startStation": stations_id[stations_name.index(start_station)],
                            "endStation": stations_id[stations_name.index(end_station)],
                            "arrivalTime": from_24_to_00(arrival[line][train][direction][day][station][0]),
                            "departureTime": from_24_to_00(arrival[line][train][direction][day][station][1]),
                            "direction": direction,
                        }
                    )

for station, station_info in station_data.items():
    file_path = os.path.join(timetable_path, f"{station}.json")
    save_json(file_path, station_info)
