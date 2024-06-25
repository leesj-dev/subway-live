import React, { useCallback, useMemo } from "react";

import DisabledItem from "./DisabledItem";
import GroupItem from "./GroupItem";
import Item from "./Item";
import { Option, Options as ListOption } from "./type";

interface OptionsProps {
    list: ListOption;
    noOptionsMessage: string;
    text: string;
    isMultiple: boolean;
    value: Option | Option[] | null;
}

const Options: React.FC<OptionsProps> = ({ list, noOptionsMessage, text, isMultiple, value }) => {
    const filterByText = useCallback(() => {
        const normalizeText = (text: string) => {
            // 한글 자모 분리 함수
            const chosung = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
            const jungsung = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
            const jongsung = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

            return text
                .split("")
                .map((char) => {
                    const code = char.charCodeAt(0) - 44032;
                    if (code >= 0 && code <= 11171) {
                        const chosungIndex = Math.floor(code / 588);
                        const jungsungIndex = Math.floor((code - chosungIndex * 588) / 28);
                        const jongsungIndex = code % 28;
                        return chosung[chosungIndex] + jungsung[jungsungIndex] + jongsung[jongsungIndex];
                    }
                    return char;
                })
                .join("");
        };

        const normalizedText = normalizeText(text.toLowerCase());

        const filterItem = (item: Option) => {
            const normalizedLabel = normalizeText(item.label.toLowerCase());
            return normalizedLabel.startsWith(normalizedText);
        };

        let result = list.map((item) => {
            if ("options" in item) {
                return {
                    label: item.label,
                    options: item.options.filter(filterItem),
                };
            }
            return item;
        });

        result = result.filter((item) => {
            if ("options" in item) {
                return item.options.length > 0;
            }
            return filterItem(item);
        });

        // 검색 결과를 정렬하여 '동'으로 시작하는 항목을 우선적으로 표시
        result = result.sort((a, b) => {
            const aLabel = "options" in a ? a.options[0].label : a.label;
            const bLabel = "options" in b ? b.options[0].label : b.label;
            const aStartsWith = normalizeText(aLabel.toLocaleLowerCase()).startsWith(normalizedText);
            const bStartsWith = normalizeText(bLabel.toLocaleLowerCase()).startsWith(normalizedText);

            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return 0;
        });

        return result;
    }, [text, list]);

    const removeValues = useCallback(
        (array: ListOption) => {
            if (!isMultiple) {
                return array;
            }

            if (Array.isArray(value)) {
                const valueId = value.map((item) => item.value);

                const filterItem = (item: Option) => !valueId.includes(item.value);

                let newArray = array.map((item) => {
                    if ("options" in item) {
                        return {
                            label: item.label,
                            options: item.options.filter(filterItem),
                        };
                    }
                    return item;
                });

                newArray = newArray.filter((item) => {
                    if ("options" in item) {
                        return item.options.length > 0;
                    } else {
                        return filterItem(item);
                    }
                });

                return newArray;
            }
            return array;
        },
        [isMultiple, value]
    );

    const filterResult = useMemo(() => {
        return removeValues(filterByText());
    }, [filterByText, removeValues]);

    return (
        <div role="options" className={"max-h-80 overflow-y-auto no-scrollbar"}>
            {filterResult.map((item, index) => (
                <React.Fragment key={index}>
                    {"options" in item ? (
                        <>
                            <div className="px-2.5 py-0.5">
                                <GroupItem item={item} />
                            </div>

                            {index + 1 < filterResult.length && <hr className="my-1" />}
                        </>
                    ) : (
                        <div className="px-2.5 py-0.5">
                            <Item item={item} />
                        </div>
                    )}
                </React.Fragment>
            ))}

            {filterResult.length === 0 && <DisabledItem>{noOptionsMessage}</DisabledItem>}
        </div>
    );
};

export const containsKChar = (list: ListOption) => {
    return list.some((item) => {
        if ("options" in item) {
            return item.options.some((subItem) => subItem.label.includes("K"));
        }
        return item.label.includes("K");
    });
};

export default Options;
