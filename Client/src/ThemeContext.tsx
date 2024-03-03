import {createContext, useState} from "react";
import {createTheme, ThemeProvider} from "@mui/material";

export const ThemeContext = createContext({
    darkMode: true, setDarkMode: (_: boolean) => { }
});

export const CustomThemeProvider = ({children}: any) => {
    const [darkMode, setDarkMode] = useState(true);

    const theme = createTheme({
        typography: {
            h1: {
                fontSize: '3rem'
            }
        },
        palette: {
            mode: darkMode ? 'dark' : 'light'
        },
    });
    
    return (
        <ThemeContext.Provider value={{darkMode, setDarkMode}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}