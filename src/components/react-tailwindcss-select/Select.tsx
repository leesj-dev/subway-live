import React, { useCallback, useEffect, useRef, useState } from "react";

import useOnClickOutside from "./use-onclick-outside";

import { ChevronIcon, CloseIcon } from "./Icons";
import Options, { containsKChar } from "./Options";
import SearchInput from "./SearchInput";
import SelectProvider from "./SelectProvider";
import { Option, Options as ListOption, SelectProps } from "./type";

const Select: React.FC<SelectProps> = ({
    options = [],
    value = null,
    onChange,
    onSearchInputChange,
    placeholder = "선택...",
    searchInputPlaceholder = "검색",
    isMultiple = false,
    isClearable = false,
    isSearchable = false,
    searchType = "text",
    isDisabled = false,
    menuIsOpen = false,
    noOptionsMessage = "검색결과가 없습니다",
}) => {
    const [open, setOpen] = useState<boolean>(menuIsOpen);
    const [list, setList] = useState<ListOption>(options);
    const [inputValue, setInputValue] = useState<string>("");
    const [isKDefault, setIsKDefault] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const searchBoxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const containsK = containsKChar(list);
        if (containsK) {
            setInputValue("K");
            setIsKDefault(true);
        } else {
            setInputValue("");
            setIsKDefault(false);
        }
    }, [list]);

    useEffect(() => {
        const formatItem = (item: Option) => {
            if ("disabled" in item) return item;
            return {
                ...item,
                disabled: false,
            };
        };

        setList(
            options.map((item) => {
                if ("options" in item) {
                    return {
                        label: item.label,
                        options: item.options.map(formatItem),
                    };
                } else {
                    return formatItem(item);
                }
            })
        );
    }, [options]);

    useEffect(() => {
        if (isSearchable) {
            if (open) {
                searchBoxRef.current?.select();
            } else {
                setInputValue("");
            }
        }
    }, [open, isSearchable]);

    const toggle = useCallback(() => {
        if (!isDisabled) {
            setOpen(!open);
        }
    }, [isDisabled, open]);

    const closeDropDown = useCallback(() => {
        if (open) setOpen(false);
    }, [open]);

    useOnClickOutside(ref, () => {
        closeDropDown();
    });

    const onPressEnterOrSpace = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            e.preventDefault();
            if ((e.code === "Enter" || e.code === "Space") && !isDisabled) {
                toggle();
            }
        },
        [isDisabled, toggle]
    );

    const handleValueChange = useCallback(
        (selected: Option) => {
            function update() {
                if (!isMultiple && !Array.isArray(value)) {
                    closeDropDown();
                    onChange(selected);
                }

                if (isMultiple && (Array.isArray(value) || value === null)) {
                    onChange(value === null ? [selected] : [...value, selected]);
                }
            }

            if (selected !== value) {
                update();
            }
        },
        [closeDropDown, isMultiple, onChange, value]
    );

    const clearValue = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            onChange(null);
        },
        [onChange]
    );

    const removeItem = useCallback(
        (e: React.MouseEvent<HTMLDivElement>, item: Option) => {
            if (isMultiple && Array.isArray(value) && value.length) {
                e.stopPropagation();
                const result = value.filter((current) => item.value !== current.value);
                onChange(result.length ? result : null);
            }
        },
        [isMultiple, onChange, value]
    );

    const divRef = useRef<HTMLDivElement>(null);

    // 검색 때문에 focus가 제대로 안되는 문제 해결
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (divRef.current) {
                divRef.current.focus();
            }
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [open]);

    return (
        <SelectProvider value={value} handleValueChange={handleValueChange}>
            <div className="relative w-full" ref={ref}>
                <div
                    aria-expanded={open}
                    onKeyDown={onPressEnterOrSpace}
                    onClick={toggle}
                    tabIndex={0}
                    ref={divRef}
                    className={`flex text-base text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-300 focus:outline-none ${
                        isDisabled
                            ? "bg-gray-200 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-700 hover:border-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                    }`}
                >
                    <div className="absolute inset-0 left-0 right-0 justify-center items-center px-4 flex flex-wrap gap-1">
                        {!isMultiple ? (
                            <p className="truncate cursor-default select-none">{value && !Array.isArray(value) ? value.label : placeholder}</p>
                        ) : (
                            <>
                                {value === null && placeholder}

                                {Array.isArray(value) &&
                                    value.map((item, index) => (
                                        <div className={`bg-gray-200 border rounded-lg flex space-x-1 ${isDisabled ? "border-gray-500 px-1" : "pl-1"}`} key={index}>
                                            <p className="text-gray-600 truncate cursor-default select-none">{item.label}</p>
                                            {!isDisabled && (
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={(e) => removeItem(e, item)}
                                                    className={"flex items-center px-1 cursor-pointer rounded-lg hover:bg-red-200 hover:text-red-600"}
                                                >
                                                    <CloseIcon className={"w-3 h-3 mt-0.5"} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>

                    <div className="flex flex-none items-center ml-auto py-1.5">
                        {isClearable && !isDisabled && value !== null && (
                            <div className="px-1.5 cursor-pointer" onClick={clearValue}>
                                <CloseIcon className={"w-5 h-5 p-0.5"} />
                            </div>
                        )}

                        <div className="pr-1.5">
                            <ChevronIcon className={`transition duration-300 w-6 h-6 p-0.5${open ? "transform rotate-90 text-gray-500" : "text-gray-300"}`} />
                        </div>
                    </div>
                </div>

                {open && !isDisabled && (
                    <div className={"absolute z-10 w-full bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-600 rounded-lg py-1.5 mt-1.5 text-sm text-gray-700 dark:text-gray-300"}>
                        {isSearchable && (
                            <SearchInput
                                ref={searchBoxRef}
                                value={inputValue}
                                searchType={searchType}
                                placeholder={searchInputPlaceholder}
                                onChange={(e) => {
                                    if (onSearchInputChange && typeof onSearchInputChange === "function") onSearchInputChange(e);
                                    let newValue = e.target.value;
                                    if (isKDefault && !newValue.startsWith("K")) {
                                        newValue = "K" + newValue.replace(/^K/, ""); // Ensure K is not removed
                                    }
                                    setInputValue(newValue);
                                }}
                            />
                        )}
                        <Options list={list} noOptionsMessage={noOptionsMessage} text={inputValue} isMultiple={isMultiple} value={value} />
                    </div>
                )}
            </div>
        </SelectProvider>
    );
};

export default Select;
