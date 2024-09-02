import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import IconButton from '@mui/material/IconButton';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
// Define the theme
const theme = createTheme({
    palette: {
        mode: "light", // Initially set to light mode
    },
});

const lightModeProperties = {
    "--background": "f5f6f7",
    "--background-1": "#ffffff",
    "--icons": "#025a63",
    "--document": "#ecebf3",
    "--border-color": "rgb(216, 216, 216)",
    "--icons-bg": "#e5e3f3",
    "--text": "#191c24",
    "--f-weight": "700",
    "--gray-text": "rgb(79, 79, 79)",
    "--shadow": "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
    "--card-hover": "#ededf0",
    "--light-hover": "#c8dddf",
    "--menu-hover": "#ecebf3",
    "--card": "#ffff",
    "--wb": "#191c24",

};

const darkModeProperties = {
    "--background": "#0f1015",
    "--background-1": "#191c24",
    "--icons": "#12c5d1",
    "--document": "#0f1015",
    "--border-color": "rgb(39, 39, 39)",
    "--icons-bg": "#2a2d3b",
    "--text": "#e6e6e6",
    "--f-weight": "500",
    "--gray-text": "rgb(255, 255, 255)",
    "--shadow": "0px 0px 0px solid black",
    "--card-hover": "#202436",
    "--light-hover": "#c8dddf",
    "--menu-hover": "#0f1015",
    "--wb": "white",
    "--card": "#313342",

};

// Set custom properties based on theme mode
const setCustomProperties = (mode) => {
    const root = document.documentElement;
    root.style.cssText = Object.entries(
        mode === "dark" ? darkModeProperties : lightModeProperties
    )
        .map(([key, value]) => `${key}:${value};`)
        .join("");
};

// Styled switch

export default function CustomizedSwitches() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check if the user has a preference for theme stored in local storage
        const preferredTheme = localStorage.getItem("preferredTheme");
        if (preferredTheme) {
            setDarkMode(preferredTheme === "dark");
            setCustomProperties(preferredTheme);
        }
        // If not, set initial mode to light and update custom properties
        else {
            setCustomProperties("light");
        }
    }, []); // Run only on initial render

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        const mode = newMode ? "dark" : "light";
        setCustomProperties(mode); // Update custom properties based on theme mode
        localStorage.setItem("preferredTheme", mode); // Store user preference for theme
    };

    return (
        <ThemeProvider theme={theme}>
            <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
                {darkMode ? <WbSunnyIcon sx={{ color: "#6c7293" }} /> : <NightsStayIcon sx={{ color: "#6c7293" }} />}
            </IconButton>
        </ThemeProvider>
    );
}
