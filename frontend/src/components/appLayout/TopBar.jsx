import React, { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CustomizedSwitches from "./toggleTheme";
import Cookies from "js-cookie";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

function TopBar(props) {
    const name = Cookies.get("name");
    const capitalizedName = name ? name.toUpperCase() : "";

    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setAnchorEl(null);
    };

    const handleLogout = () => {

        Cookies.remove("token");

        window.location.href = "/login";
    };

    const confirmLogout = () => {
        handleLogout();
        handleCloseDialog();
    };

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
                border: "1px solid var(--border-color)",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
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
                <div className="app-name gradient-text"><b>ShareManager</b></div>
                <div className="top-bar-menus">
                    <CustomizedSwitches />
                    <div
                        className="box"
                        style={{
                            backgroundColor: "var(--document)",
                            borderRadius: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "3px 10px 3px 7px",
                            border: "1px solid var(--border-color)",
                            cursor: "pointer"
                        }}
                        onClick={handleClick}
                    >
                        <AccountCircleIcon sx={{ marginRight: "3px", color: "#6c7293", fontSize: "35px" }} />
                        {capitalizedName}
                    </div>
                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleLogoutClick}>
                            <ExitToAppIcon sx={{ marginRight: "5px" }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">{"Logout Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmLogout} color="primary" autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TopBar;
