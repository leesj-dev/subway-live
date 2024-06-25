import React from "react";

import Item from "./Item";
import { GroupOption } from "./type";

interface GroupItemProps {
    item: GroupOption;
}

const GroupItem: React.FC<GroupItemProps> = ({ item }) => {
    return (
        <>
            {item.options.length > 0 && (
                <>
                    <div className="py-2 cursor-default select-none truncate font-bold text-gray-700 dark:text-gray-300">
                        {item.label}
                    </div>
                    {item.options.map((item, index) => (
                        <Item key={index} item={item} />
                    ))}
                </>
            )}
        </>
    );
};

export default GroupItem;
