interface Directions {
    [line: string]: {
        up_info: string;
        down_info: string;
    };
}

const directions: Directions = {
    "1호선": { up_info: "다대포해수욕장", down_info: "노포" },
    "2호선": { up_info: "장산", down_info: "양산" },
    "3호선": { up_info: "수영", down_info: "대저" },
    "4호선": { up_info: "미남", down_info: "안평" },
    부산김해경전철: { up_info: "사상", down_info: "가야대" },
    동해선: { up_info: "부전", down_info: "태화강" },
};

export default directions;
