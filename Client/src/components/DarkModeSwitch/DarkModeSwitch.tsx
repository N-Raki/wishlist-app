import {useContext} from 'react';
import './DarkModeSwitch.css';
import {darkTheme, lightTheme, ThemeContext} from "../../ThemeContext.tsx";
import {MoonIcon, SunIcon} from "@heroicons/react/24/outline";

export default function DarkModeSwitch() {
    const { theme, setTheme } = useContext(ThemeContext);
    
    const handleToggle = () => {
        const newTheme = theme === darkTheme ? lightTheme : darkTheme;
        setTheme(newTheme);
    };
    return (
        <button onClick={handleToggle}>
            { theme === darkTheme
                ? <MoonIcon className="w-6 h-6" />
                : <SunIcon className="w-6 h-6" />
            }
        </button>
    );
}
