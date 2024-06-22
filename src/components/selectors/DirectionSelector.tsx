import React from "react";
import Selector from "./Selector";
import { DirectionSelectorProps } from "../../types";

const DirectionSelector: React.FC<DirectionSelectorProps> = ({ direction, setDirection, data }) => {
    const directionOptions = Array.from(new Set(data.weekday.map((train) => train.direction))).map((dir) => ({
        label: dir,
        value: dir,
    }));

    return <Selector label="Direction" value={direction} options={directionOptions} handleChange={(e) => setDirection(e.target.value)} />;
};

export default DirectionSelector;
