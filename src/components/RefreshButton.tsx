import { IoMdRefresh } from "react-icons/io";

interface RefreshButtonProps {
    onRefresh: () => void;
    remainingTime: number;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh, remainingTime }) => {
    return (
        <div className="justify-end flex items-center">
            <button
                onClick={onRefresh}
                className="p-1 rounded-lg border shadow-sm transition-all text-gray-700 dark:text-gray-200 border-gray-300 hover:border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
                <IoMdRefresh size={14} />
            </button>
            <span className="ml-1 w-7 text-right tabular-nums text-gray-700 dark:text-gray-200">{remainingTime}초</span>
        </div>
    );
};

export default RefreshButton;
