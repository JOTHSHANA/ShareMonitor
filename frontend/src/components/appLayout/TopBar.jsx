import React, { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CustomizedSwitches from "./toggleTheme";


function TopBar(props) {

    return (
        <div
            className="app-topbar"
            style={{
                backgroundColor: "var(--background-1)",
                display: "flex",
                padding: "7px 7px",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%"
                }}
            >
                <div onClick={props.sidebar} className="sidebar-menu">
                    <MenuIcon />
                </div>
                <div className="app-name gradient-text" ><b>ShareManager</b></div>
                <div className="top-bar-menus">
                    <CustomizedSwitches />
                    <AccountCircleIcon sx={{ marginRight: "10px", color: "#6c7293", fontSize: "35px" }} />

                </div>
            </div>
        </div>
    );
}

export default TopBar;
