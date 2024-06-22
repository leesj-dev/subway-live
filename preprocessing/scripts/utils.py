import json
import requests
from collections import defaultdict

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)

def fetch_json(link):
    response = requests.get(link)
    return response.json()

def from_24_to_00(time_str):
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

def nested_dict():
    return defaultdict(nested_dict)