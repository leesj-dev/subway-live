import React from "react";
import { ButtonProps } from "../types";

const ArrivalInfoButton: React.FC<ButtonProps> = ({ onClick, selectedStation }) => {
    return (
        <button
            onClick={onClick}
            className="w-20 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={!selectedStation}
        >
            조회
        </button>
    );
};

export default ArrivalInfoButton;
