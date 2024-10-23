import React from 'react';
import {
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    MergeType as MergeTypeIcon,
    CallSplit as CallSplitIcon,
    DeleteForeverSharp as DeleteForeverSharpIcon,
    Add as AddIcon,
    ArrowForwardIosRounded as ArrowForwardIosRoundedIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
import folder_img from '../../assets/folder_img.png'
import empty_folder from '../../assets/empty_folder.png'

const Folders = ({
    isSelecting,
    isUnmerging,
    isLoading,
    folders,
    activeFolderId,
    showFolderEditDelete,
    showFolderUndoAlert,
    handleMergeClick,
    handleUnmergeClick,
    handleClick,
    anchorEl,
    open,
    handleCloseMui,
    handleShowFolderEditDelete,
    handleNewFolderPopupOpen,
    toggleSelectMode,
    toggleUnmergeMode,
    fetchDocuments,
    handleFolderDelete,
    handleFolderUndo,
    handleCheckboxChangeForMerge,
    handleCheckboxChangeForUnmerge,
    startMergeFolderId,
    endMergeFolderId,
    unmergeFolderId,
}) => {
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    {isSelecting && (
                        <button className='add-button' onClick={handleMergeClick}><MergeTypeIcon />Merge</button>
                    )}
                    {isUnmerging && (
                        <button className='add-button' onClick={handleUnmergeClick}><CallSplitIcon />Unmerge</button>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MenuIcon sx={{ color: "var(--text)" }} />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMui}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            style: { backgroundColor: "var(--background-1)", color: "var(--text)" }
                        }}
                    >
                        <MenuItem onClick={handleCloseMui}>
                            <div className='menu-icons-align' onClick={handleShowFolderEditDelete}>
                                <DeleteForeverSharpIcon style={{ color: "#e74c3c", marginRight: "5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px", fontSize: "18px" }} /><span>Delete</span>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMui}>
                            <div className='menu-icons-align' onClick={handleNewFolderPopupOpen}>
                                <AddIcon style={{ color: "#13a245", marginRight: "5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px", fontSize: "18px" }} /><span>Add Folders</span>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMui}>
                            <div className='menu-icons-align' onClick={toggleSelectMode}>
                                <MergeTypeIcon style={{ color: "#0079c5", marginRight: "5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px", fontSize: "18px" }} />{isSelecting ? 'Cancel merge' : 'Merge'}
                            </div>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMui}>
                            <div className='menu-icons-align' onClick={toggleUnmergeMode}>
                                <CallSplitIcon style={{ color: "#b861c8", marginRight: "5px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px", fontSize: "18px" }} />{isUnmerging ? 'Cancel Unmerge' : 'Unmerge'}
                            </div>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            <hr />
            {isLoading ? (
                <div className="no-subjects-text" style={{ height: "80%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0px" }}>
                        <img style={{ height: "120px" }} src={empty_folder} alt="No Folders" />
                        <p style={{ fontWeight: "600" }}>No folders added</p>
                    </div>
                </div>
            ) : folders.length > 0 ? (
                folders.reduce((acc, folder, index) => {
                    if (folder.status === "2") {
                        const lastGroup = acc[acc.length - 1];

                        if (lastGroup && lastGroup.status === "2" && lastGroup.merge_random === folder.merge_random) {
                            lastGroup.e_day = folder.s_day;
                        } else {
                            acc.push({
                                ...folder,
                                e_day: folder.s_day
                            });
                        }
                    } else {
                        acc.push(folder);
                    }

                    return acc;
                }, []).map((folder, index) => (
                    <div
                        key={index}
                        className={`document-item ${activeFolderId === folder.id ? 'active' : ''}`}
                        onClick={() => fetchDocuments(folder.id)}
                    >
                        <div
                            className="dummy"
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", width: "100%" }}
                            onClick={() => {
                                if (isSelecting) {
                                    handleCheckboxChangeForMerge(folder.id);
                                } else if (isUnmerging) {
                                    handleCheckboxChangeForUnmerge(folder.id);
                                }
                            }}
                        >
                            <div style={{ display: "flex" }}>
                                {(isSelecting || isUnmerging) && (
                                    <input
                                        type="checkbox"
                                        checked={isSelecting
                                            ? (folder.id === startMergeFolderId || folder.id === endMergeFolderId)
                                            : folder.id === unmergeFolderId}
                                        onChange={() => {
                                            isSelecting
                                                ? handleCheckboxChangeForMerge(folder.id)
                                                : handleCheckboxChangeForUnmerge(folder.id);
                                        }}
                                        style={{ marginLeft: '10px' }}
                                    />
                                )}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <img src={folder_img} alt="PDF" className="document-icon" />
                                    {folder.s_day === folder.e_day ? (
                                        <span>Day {folder.s_day}</span>
                                    ) : (
                                        <span>Day {folder.s_day} - Day {folder.e_day}</span>
                                    )}
                                </div>
                            </div>
                            <div className='open-icon'>
                                <ArrowForwardIosRoundedIcon />
                            </div>
                            <div
                                className="hover-edit-delete-folders"
                                style={{ display: showFolderEditDelete ? 'flex' : 'none' }}
                            >
                                <div
                                    className="delete-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFolderDelete(folder.id);
                                    }}
                                >
                                    <DeleteForeverSharpIcon sx={{ color: "#d12830" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No folders added.</p>
            )}
            {showFolderUndoAlert && (
                <div className="undo-alert">
                    <span>Folder deleted. </span>
                    <button onClick={handleFolderUndo}>Undo</button>
                </div>
            )}
        </div>
    );
};

export default Folders;
