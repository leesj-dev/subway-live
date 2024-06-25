import React from "react";
import { useMemo } from "react";
import DisabledItem from "./DisabledItem";
import { useSelectContext } from "./SelectProvider";
import { Option } from "./type";

interface Props {
    item: Option;
}

const Item: React.FC<Props> = ({ item }) => {
    const { value, handleValueChange } = useSelectContext();

    const isSelected = useMemo(() => {
        return value !== null && !Array.isArray(value) && value.value === item.value;
    }, [item.value, value]);

    return (
        <>
            {item.disabled ? (
                <DisabledItem>{item.label}</DisabledItem>
            ) : (
                <li
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => {
                        if (e.key === " " || e.key === "Enter") {
                            handleValueChange(item);
                        }
                    }}
                    aria-selected={isSelected}
                    role={"option"}
                    onClick={() => handleValueChange(item)}
                    className={`block transition duration-200 px-2 py-2 cursor-pointer select-none whitespace-nowrap rounded-lg ${
                        isSelected
                            ? "text-white bg-blue-500"
                            : "text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-white"
                    }`}
                >
                    {item.label}
                </li>
            )}
        </>
    );
};

export default Item;
