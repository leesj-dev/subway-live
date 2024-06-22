import React from "react";
import Selector from "./Selector";
import { LineSelectorProps } from "../../types";

const LineSelector: React.FC<LineSelectorProps> = ({ selectedLine, handleLineChange, stations }) => {
    const lineOptions = Object.keys(stations).map((line) => ({
        label: line,
        value: line,
    }));

    return <Selector label="노선명" value={selectedLine} options={lineOptions} handleChange={handleLineChange} />;
};

export default LineSelector;
