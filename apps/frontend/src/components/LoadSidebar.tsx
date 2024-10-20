import { Bars3Icon } from "@heroicons/react/24/solid";
import { useDarkMode } from "./theme-provider";

export function LoadSidebar(){
    const { isDarkMode } = useDarkMode();
    return (
        <>
            <Bars3Icon
                    className={`h-6 w-6 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}
            />
        </>
    )
}