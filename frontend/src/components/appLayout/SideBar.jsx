import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';import RecyclingSharpIcon from '@mui/icons-material/RecyclingSharp';
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
                        <DashboardIcon className="custom-sidebar-icon" />
                        <p className="menu-names">Subjects</p>
                    </Link>
                </li>
                <li
                    className={`list-items ${location.pathname === '/trash'? "active" : ""}`}
                >
                    <Link className="link" to="/trash">
                        <RecyclingSharpIcon className="custom-sidebar-icon2" />
                        <p className="menu-names">Trash</p>
                    </Link>
                </li>

                <li
                    className={`list-items ${location.pathname === '/history' ? "active" : ""}`}
                >
                    <Link className="link" to="/history">
                        <ScheduleSendIcon className="custom-sidebar-icon1"/>
                        <p className="menu-names">History</p>
                    </Link>
                </li>
            </ul>
        </div>
        
    );
}

export default SideBar;
