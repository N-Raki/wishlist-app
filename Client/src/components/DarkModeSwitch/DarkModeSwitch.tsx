import {useContext} from 'react';
import './DarkModeSwitch.css';
import {IconButton, useTheme} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {ThemeContext} from "../../Theme.tsx";

export default function DarkModeSwitch() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const theme = useTheme();
    const handleToggle = () => {
        setDarkMode(!darkMode);
    };
    return (
        <IconButton sx={{ ml: 1 }} onClick={handleToggle} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
}
