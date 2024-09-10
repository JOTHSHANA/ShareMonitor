import React, { useState } from "react";
import TopBar from './TopBar';
import SideBar from './SideBar';
import './Layout.css'


function AppLayout(props) {
    const [sidebarState, setSideBarState] = useState(false);
    const handleSideBar = (() => {
        setSideBarState(!sidebarState)
    })



    return (
        <div style={{
            backgroundColor: "#ecebf3",
            height: '100vh',
            width: '100vw',
            position: 'fixed'
        }}>
            <TopBar sidebar={handleSideBar} />
            <div style={{ height: '100%', display: 'flex' }}>
                <SideBar open={sidebarState} resource={props.rId} handleSideBar={handleSideBar}/>
                <div className={"app-body"} style={{ width: '100%' }} >{props.body}</div>
            </div>
        </div>
    )
}


export default AppLayout

