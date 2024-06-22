from utils import load_json, save_json
from paths import arrival_BTC_path, arrival_others_path, arrival_path

def merge_json_files(file_path1, file_path2, output_file_path):
    data1 = load_json(file_path1)
    data2 = load_json(file_path2)
    merged_data = {**data1, **data2}
    save_json(output_file_path, merged_data)

merge_json_files(arrival_BTC_path, arrival_others_path, arrival_path)