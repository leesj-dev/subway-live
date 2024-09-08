import { useState, useEffect } from "react";

export const useSessionState = (key: string, initialValue: string) => {
    const [value, setValue] = useState<string>(sessionStorage.getItem(key) || initialValue);

    useEffect(() => {
        sessionStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue] as const;
};
