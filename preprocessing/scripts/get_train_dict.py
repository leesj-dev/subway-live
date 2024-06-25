import os
import json

def get_direction_info(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    key = next(iter(data.keys()))
    direction = list(data[key].keys())[0]  
    return direction

def organize_train_info(base_folder):
    directions = {
        "1호선": {"up_info": "다대포해수욕장", "down_info": "노포"},
        "2호선": {"up_info": "장산", "down_info": "양산"},
        "3호선": {"up_info": "수영", "down_info": "대저"},
        "4호선": {"up_info": "미남", "down_info": "안평"},
        "부산김해경전철": {"up_info": "사상", "down_info": "가야대"},
        "동해선": {"up_info": "부전", "down_info": "태화강"},
    }

    result = {line: {"up_info": [], "down_info": []} for line in directions}

    for folder in os.listdir(base_folder):
        folder_path = os.path.join(base_folder, folder)
        if os.path.isdir(folder_path):
            for file_name in os.listdir(folder_path):
                if file_name.endswith('.json'):
                    file_path = os.path.join(folder_path, file_name)
                    direction = get_direction_info(file_path)
                    line_name = folder.split()[0] 
                    if direction == directions[line_name]["up_info"]:
                        result[line_name]["up_info"].append(file_name.split('.')[0])
                    elif direction == directions[line_name]["down_info"]:
                        result[line_name]["down_info"].append(file_name.split('.')[0])
    return result

base_folder = "./public/traintable"
train_info = organize_train_info(base_folder)
print(train_info)