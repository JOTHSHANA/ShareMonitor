import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MenuIcon from '@mui/icons-material/Menu';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AddIcon from '@mui/icons-material/Add';
import CreateSharpIcon from '@mui/icons-material/CreateSharp';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ShareIcon from '@mui/icons-material/Share';

const LevelCard = ({
    subjectName,
    levels,
    levelNum,
    loading,
    showEditDelete,
    showCheckboxes,
    showUndoAlert,
    openSecondMenu,
    anchorElSecond,
    handleSecondMenuClick,
    handleCloseSecondMenu,
    handleShowEditDelete,
    handleAddFirstLevelClick,
    handleLevelClick,
    handleEditClick,
    handleDelete,
    handleAddClick,
    handleCheckedSubmit,
    handleLevelUndo,
    subjectId,
    actionsRef,
    levels_img
}) => {
    return (
        <div className="container1">
            <div className='card1-fake' style={{ display: "flex" }}>
                <p className='subject-name'>
                    <ArrowForwardIosIcon sx={{ fontSize: "14px", margin: "0px" }} />
                    {subjectName}
                </p>
                <div>
                    <Button
                        id="second-button"
                        aria-controls={openSecondMenu ? 'second-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openSecondMenu ? 'true' : undefined}
                        onClick={handleSecondMenuClick}
                    >
                        <MenuIcon sx={{ color: "var(--text)" }} />
                    </Button>
                    <Menu
                        id="second-menu"
                        anchorEl={anchorElSecond}
                        open={openSecondMenu}
                        onClose={handleCloseSecondMenu}
                        MenuListProps={{
                            'aria-labelledby': 'second-button',
                            style: { backgroundColor: "var(--background-1)", color: "var(--text)" }
                        }}
                    >
                        <MenuItem onClick={handleCloseSecondMenu}>
                            <div className='menu-icons-align' onClick={handleShowEditDelete}>
                                <AutoFixHighIcon style={{ color: "#ff9800", marginRight: "5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px", fontSize: "18px" }} />
                                <span>Modify</span>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={handleCloseSecondMenu}>
                            <div className='menu-icons-align' onClick={handleAddFirstLevelClick}>
                                <AddIcon style={{ color: "#4caf50", marginRight: "5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px", fontSize: "18px" }} />
                                <span>Add Level</span>
                            </div>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            {loading ? (
                <div style={{ height: "73vh", width: "100%", backgroundColor: "var(--background-1)", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span class="loader"></span>
                </div>
            ) : levels.length === 0 ? (
                <div className="no-levels-text" style={{ height: "73vh", backgroundColor: "var(--background-1)", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <img style={{ height: "120px" }} src={levels_img} alt="" />
                    <p style={{ fontWeight: "600" }}>No levels added</p>
                    <button className="add-button" onClick={handleAddFirstLevelClick}>
                        <AddIcon /><span>Add Level</span>
                    </button>
                </div>
            ) : (
                levels.map((level, index) => (
                    <div key={index} className={`card1 ${levelNum === level.level ? 'active' : ''}`} onClick={() => handleLevelClick(level.id)}>
                        <div
                            className="hover-edit-delete-levels"
                            style={{ display: showEditDelete ? 'flex' : 'none' }}
                            ref={actionsRef}
                        >
                            <div
                                className="edit-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(level);
                                }}
                            >
                                <CreateSharpIcon sx={{ color: "#588dc0" }} />
                            </div>
                            <div
                                className="delete-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(level.id, subjectId, index);
                                }}
                            >
                                <DeleteForeverSharpIcon sx={{ color: "#d12830" }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div className='level-num'>Level {level.level}</div>
                                <div className='level-name'>{level.lvl_name}</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <button className="add-button-level" onClick={handleAddClick}>
                                    <PlaylistAddIcon style={{ color: "var(--text)" }} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {showCheckboxes && (
                <div style={{ marginTop: "20px" }}>
                    <button className="add-button" style={{ float: "right" }} onClick={handleCheckedSubmit}>
                        <ShareIcon />Share
                    </button>
                </div>
            )}

            {showUndoAlert && (
                <div className="undo-alert">
                    <span>Level deleted. </span>
                    <button onClick={handleLevelUndo}>Undo</button>
                </div>
            )}
        </div>
    );
};

export default LevelCard;
