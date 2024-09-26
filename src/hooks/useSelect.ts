import { useState, useEffect } from "react";
import { Option, SelectValue } from "react-tailwindcss-select/dist/types";

interface UseSelectArgs {
    options: Option[];
    selectedValue: string;
    handleChangeCallback: (value: string) => void;
}

const useSelect = ({ options, selectedValue, handleChangeCallback }: UseSelectArgs) => {
    const [currentValue, setCurrentValue] = useState(selectedValue);

    useEffect(() => {
        setCurrentValue(selectedValue);
    }, [selectedValue]);

    const handleChange = (value: SelectValue | null) => {
        if (value && !Array.isArray(value) && typeof value !== "string") {
            setCurrentValue(value.value);
            handleChangeCallback(value.value);
        } else {
            setCurrentValue("");
            handleChangeCallback("");
        }
    };

    const selectedOption = options.find((option) => option.value === currentValue) || null;

    return {
        currentValue,
        handleChange,
        selectedOption,
        options,
    };
};

export default useSelect;
