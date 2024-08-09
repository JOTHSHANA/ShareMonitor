import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function SideBar(props) {
    const location = useLocation();

    // Function to determine if the path should be active for "Subjects"
    const isSubjectsActive = () => {
        return (
            location.pathname.startsWith('/subjects') || 
            location.pathname.startsWith('/levels')
        );
    };

    return (
        <div
            className={props.open ? "app-sidebar sidebar-open" : "app-sidebar"}
        >
            <ul className="list-div">
                <li
                    className={`list-items ${isSubjectsActive() ? "active" : ""}`}
                >
                    <Link className="link" to="/subjects">
                        <DashboardIcon sx={{ marginRight: "10px", color: "#00d25b", fontSize: "20px", padding: "7px", borderRadius: "50%", backgroundColor: "var(--icons-bg)" }} />
                        <p className="menu-names">Subjects</p>
                    </Link>
                </li>

                <li
                    className={`list-items ${location.pathname === '/history' ? "active" : ""}`}
                >
                    <Link className="link" to="/history">
                        <ExitToAppIcon sx={{ marginRight: "10px", color: "#fc424a", fontSize: "20px", padding: "7px", borderRadius: "50%", backgroundColor: "var(--icons-bg)" }} />
                        <p className="menu-names">History</p>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default SideBar;
