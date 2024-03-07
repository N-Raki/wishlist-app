import {createContext, useState} from "react";
import {createTheme, ThemeProvider} from "@mui/material";
import {deepOrange, deepPurple, grey} from "@mui/material/colors";

export const ThemeContext = createContext({
    darkMode: true, setDarkMode: (_: boolean) => {}
});

export const CustomThemeProvider = ({children}: any) => {
    const [darkMode, setDarkMode] = useState(true);

    const theme = createTheme({
        typography: {
            h1: {
                fontSize: '3rem'
            },
            h2: {
                fontSize: '2.5rem'
            }
        },
        palette: {
            mode: darkMode ? 'dark' : 'light',
            ...(darkMode ? {
                    // palette values for dark mode
                    primary: deepPurple,
                    background: {
                        default: '#191919',
                        paper: '#191919',
                    },
                    text: {
                        primary: '#fff',
                        secondary: grey[500],
                    }
                } :
                {
                    // palette values for light mode
                    primary: deepOrange,
                    background: {
                        default: '#f0f0f0',
                        paper: '#f0f0f0',
                    },
                    text: {
                        primary: grey[900],
                        secondary: grey[800],
                    },
                })
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