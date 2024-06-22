import { SelectorProps } from "../../types";

const Selector = <ValueType extends string | number>({ label, value, options, handleChange, disabled = false }: SelectorProps<ValueType>) => {
    return (
        <div className="mb-4">
            <label htmlFor={label} className="block text-base font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <select
                id={label}
                value={value}
                onChange={handleChange}
                className="mt-1 block w-36 pl-3 py-2 text-center text-base border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={disabled}
            >
                <option value="">{`${label} 선택`}</option>
                {options.map(({ label, value }, index) => (
                    <option key={index} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Selector;
