import React from "react";

export interface Option {
    value: string;
    label: string;
    disabled?: boolean;
    isSelected?: boolean;
}

export interface GroupOption {
    label: string;
    options: Option[];
}

export type Options = Array<Option | GroupOption>;

export type SelectValue = Option | Option[] | null;

export interface SelectProps {
    options: Options;
    value: SelectValue;
    onChange: (value: SelectValue) => void;
    onSearchInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    isMultiple?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
    searchType?: "text" | "numeric";
    isDisabled?: boolean;
    loading?: boolean;
    menuIsOpen?: boolean;
    searchInputPlaceholder?: string;
    noOptionsMessage?: string;
}
