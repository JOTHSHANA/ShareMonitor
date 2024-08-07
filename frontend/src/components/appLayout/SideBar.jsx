import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function SideBar(props) {
    const location = useLocation();

    return (
        <div
            className={props.open ? "app-sidebar sidebar-open" : "app-sidebar"}
        >
            <ul className="list-div">
                <li
                    className={`list-items ${location.pathname === '/dashboard' ? "active" : ""}`}
                >
                    <Link className="link" to="/dashboard">
                        <DashboardIcon sx={{ marginRight: "10px", color: "#00d25b", fontSize: "20px", padding: "7px", borderRadius: "50%", backgroundColor: "var(--icons-bg)" }} />
                        <p className="menu-names">Dashboard</p>
                    </Link>
                </li>
                <li
                    className={`list-items ${location.pathname === '/logout' ? "active" : ""}`}
                >
                    <Link className="link" to="/logout">
                        <ExitToAppIcon sx={{ marginRight: "10px", color: "#fc424a", fontSize: "20px", padding: "7px", borderRadius: "50%", backgroundColor: "var(--icons-bg)" }} />
                        <p className="menu-names">Logout</p>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default SideBar;
