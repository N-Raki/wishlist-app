import {createContext, useEffect, useState} from "react";
import {getLocalStorageItem, setLocalStorageItem} from "./helpers/localStorage.helper.ts";

const themeLocalStorageKey = 'theme';
export const darkTheme = 'dark';
export const lightTheme = 'light';

export const ThemeContext = createContext({
    theme: darkTheme, setTheme: (_: string) => {}
});

export const CustomThemeProvider = ({children}: any) => {
    const [theme, setTheme] = useState(getLocalStorageItem<string>(themeLocalStorageKey) ?? lightTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        const oldTheme = theme === darkTheme ? lightTheme : darkTheme;
        root.classList.remove(oldTheme);
        root.classList.add(theme);
        setLocalStorageItem(themeLocalStorageKey, theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}