import {FunctionComponent, useState} from "react";
import {IconType} from "react-icons";

type MenuItem = {
    key: string;
    icon: IconType | FunctionComponent;
    label: string;
}

interface SidebarProps {
    items: MenuItem[];
    onChange?: (key: string) => void;
    defaultSelected?: string;
}

function ModelSettingSidebar({items, onChange, defaultSelected}: SidebarProps) {
    const [selected, setSelected] = useState(defaultSelected ?? items[0]?.key);

    const handleClick = (key: string) => {
        setSelected(key);
        onChange?.(key);
    }

    return (
        <div className="border-r border-gray-200 h-full">
            <ul className="space-y-1 p-2">
                {items.map((item) => (
                    <li key={item.key}>
                        <button
                            title={item.label}
                            onClick={() => handleClick(item.key)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
                                ${selected === item.key 
                                    ? 'bg-primary text-white' 
                                    : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <item.icon className="h-5 w-5"/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ModelSettingSidebar;
