import React, { useState, useEffect } from "react";
import "./Layout.css";
import { Link, useLocation } from "react-router-dom";

import Cookies from "js-cookie";
import apiHost from "../utils/api";
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';
import BookmarkAddedTwoToneIcon from '@mui/icons-material/BookmarkAddedTwoTone';
import TravelExploreTwoToneIcon from '@mui/icons-material/TravelExploreTwoTone';
import ExploreTwoToneIcon from '@mui/icons-material/ExploreTwoTone';
import DangerousTwoToneIcon from '@mui/icons-material/DangerousTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RecyclingSharpIcon from '@mui/icons-material/RecyclingSharp';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import axios from "axios";

function getIconComponent(iconPath) {
    switch (iconPath) {
        case 'AutoStoriesIcon':
            return <AutoStoriesIcon style={{ color: '#2ecc71'}} className="custom-sidebar-icon" />;
        case 'RecyclingSharpIcon':
            return <RecyclingSharpIcon style={{ color: '#e74c3c' }} className="custom-sidebar-icon1" />;
        case 'ScheduleSendIcon':
            return <ScheduleSendIcon style={{ color: '#f1c40f' }} className="custom-sidebar-icon2" />;
        default:
            return null;
    }
}

function SideBar(props) {
    const [activeItem, setActiveItem] = useState("");
    const [sidebarItems, setSidebarItems] = useState([]);


    const location = useLocation();

    useEffect(() => {
        const fetchSidebarItems = async () => {
            try {
                const role = Cookies.get('role');
                const response = await axios.get(`${apiHost}/api/resources?role=${role}`);
                if (response.status === 200) {
                    setSidebarItems(response.data);
                    console.log(response.data);
                } else {
                    console.error("Error fetching sidebar items:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching sidebar items:", error);
            }
        };

        fetchSidebarItems();
    }, []);

    useEffect(() => {
        const pathname = location.pathname;
        const activeItem = sidebarItems.find(item => item.path === pathname);
        if (activeItem) {
            setActiveItem(activeItem.name);
        }
    }, [location, sidebarItems]);

    return (
        <div
            className={props.open ? "app-sidebar sidebar-open" : "app-sidebar"}
        >
            <ul className="list-div">
                {sidebarItems.map(item => (
                    <li
                        key={item.path}
                        className={`list-items ${location.pathname.startsWith(item.path) ? "active" : ""}`}

                        onClick={() => setActiveItem(item.name)}
                    >
                        <Link className="link" to={item.path}>
                            {getIconComponent(item.icon_path)}
                            <p className="menu-names">{item.name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SideBar;
