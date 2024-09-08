import { IoMdRefresh } from "react-icons/io";

interface RefreshButtonProps {
    onRefresh: () => void;
    remainingTime: number;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh, remainingTime }) => {
    return (
        <div className="justify-end flex items-center">
            <button onClick={onRefresh} className="p-1 bg-gray-700 dark:bg-gray-700 text-white rounded-full">
                <IoMdRefresh size={14} />
            </button>
            <span className="ml-0.5 w-8 text-right tabular-nums text-gray-700 dark:text-white">{remainingTime}초</span>
        </div>
    );
};

export default RefreshButton;
