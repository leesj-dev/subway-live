import { useState, useEffect } from "react";
import { Option, SelectValue } from "react-tailwindcss-select/dist/types";

interface UseSelectArgs {
    options: Option[];
    selectedValue: string;
    handleChangeCallback: (value: string) => void;
}

const useSelect = ({ options, selectedValue, handleChangeCallback }: UseSelectArgs) => {
    const [currentValue, setCurrentValue] = useState<string>(selectedValue);

    useEffect(() => {
        setCurrentValue(selectedValue);
    }, [selectedValue]);

    const handleChange = (value: SelectValue | null) => {
        if (value && !Array.isArray(value) && typeof value !== "string") {
            handleChangeCallback(value.value);
        } else {
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
