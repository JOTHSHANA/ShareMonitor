import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiHost from "../components/utils/api";
import levels_img from '../assets/levels.png';
import empty_folder from '../assets/empty_folder.png'
import { ToastContainer, toast } from 'react-toastify';
import { Assignment } from '@mui/icons-material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import 'react-toastify/dist/ReactToastify.css';
import requestApi from '../components/utils/axios';
import './styles.css';
import EditLevelPopup from './Dialogs/EditLevelPopup';
import AddFirstLevelPopup from './Dialogs/AddFirstLevelPopup';
import NewLevelPopup from './Dialogs/NewLevelPopup';
import ShareDocumentPopup from './Dialogs/ShareDocumentPopup';
import AddFolderPopup from './Dialogs/AddFolderPopup';
import DocumentPopup from './Dialogs/DocumentPopup';
import LevelCard from './Dialogs/LevelCard';
import Folders from './Dialogs/FoldersComponent';
import DocumentManager from './Dialogs/DocumentManager';


function Levels() {
    return <Body />;
}

function Body() {
    const { subjectId, subjectName } = useParams();
    const [levels, setLevels] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newLevel, setNewLevel] = useState("");
    // const [newFolder, NewFolder] = useState("");
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [activeTab, setActiveTab] = useState("ClassWorks");
    const [showDocumentPopup, setShowDocumentPopup] = useState(false);
    const [documentType, setDocumentType] = useState("");
    const [showEditDelete, setShowEditDelete] = useState(false);
    const [showDocumentEditDelete, setShowDocumentEditDelete] = useState(false);
    const [showNewFolderPopup, setShowNewFolderPopup] = useState(false);
    // const [showFolderEditDeletePopup, setShowFolderEditDeletePopup] = useState(false);
    const [pdf, setPdf] = useState(null);
    const [link, setLink] = useState("");
    const [video, setVideo] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [folders, setFolders] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [activeFolderId, setActiveFolderId] = useState(null);
    const [editLevel, setEditLevel] = useState("");
    // const [editFolder, setEditFolder] = useState("");
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [email, setEmail] = useState("");
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [levelNum, setLevelNum] = useState();
    const [showFirstLevelPopup, setShowFirstLevelPopup] = useState(false);
    const [showFolderEditDelete, setShowFolderEditDelete] = useState(false);
    const [generalDoc, setGeneralDoc] = useState(null)
    const [start_day, setStart_day] = useState();
    const [end_day, setEnd_day] = useState();
    const [levelUndo, setLevelUndo] = useState(null);
    const [folderUndo, setFolderUndo] = useState(null);
    const [docUndo, setDocUndo] = useState(null);
    const [showUndoAlert, setShowUndoAlert] = useState(false);
    const [showFolderUndoAlert, setShowFolderUndoAlert] = useState(false);
    const [showDocUndoAlert, setShowDocUndoAlert] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startMergeFolderId, setStartMergeFolderId] = useState(null);
    const [endMergeFolderId, setEndMergeFolderId] = useState(null);
    const [isUnmerging, setIsUnmerging] = useState(false);
    const [unmergeFolderId, setUnmergeFolderId] = useState(null);
    const [missingDays, setMissingDays] = useState([]);
    const actionsRef = useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = useState(true); // New loading state
    const [isLoading, setIsLoading] = useState(true);
    const [anchorElSecond, setAnchorElSecond] = React.useState(null);
    const openSecondMenu = Boolean(anchorElSecond);
    const containerRef = useRef(null);
    // const hoverEditDeleteRef = useRef(null);
    const documentEditDeleteRef = useRef(null);
    const docDivId = 'hoverEditDeleteDocuments'; // Assign a unique ID for the document div

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedElement = event.target;
            const documentDiv = document.querySelector(`#${docDivId}`);

            if (documentDiv && !documentDiv.contains(clickedElement)) {
                setShowDocumentEditDelete(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowDocumentEditDelete]);


    const handleCloseSecondMenu = () => {
        setAnchorElSecond(null);
    };

    const handleSecondMenuClick = (event) => {
        setAnchorElSecond(event.currentTarget);
    };



    const handleShowEditDelete = (e) => {
        handleCloseSecondMenu();
        e.stopPropagation();
        setShowEditDelete(prevState => !prevState);
    };

    const handleClickOutside = (e) => {
        if (actionsRef.current && !actionsRef.current.contains(e.target)) {
            setShowEditDelete(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMui = () => {
        setAnchorEl(null);
    };


    const toggleSelectMode = () => {
        setIsSelecting(!isSelecting);
        setIsUnmerging(false); // Disable unmerging mode if selecting
        setStartMergeFolderId(null);
        setEndMergeFolderId(null);
    };

    const toggleUnmergeMode = () => {
        setIsUnmerging(!isUnmerging);
        setIsSelecting(false); // Disable selecting mode if unmerging
        setUnmergeFolderId(null);
    };

    const handleCheckboxChangeForMerge = (folderId) => {
        if (folderId === startMergeFolderId) {
            setStartMergeFolderId(endMergeFolderId);
            setEndMergeFolderId(null);
        } else if (folderId === endMergeFolderId) {
            setEndMergeFolderId(null);
        } else if (!startMergeFolderId) {
            setStartMergeFolderId(folderId);
        } else if (!endMergeFolderId) {
            setEndMergeFolderId(folderId);
        } else {
            toast.error("You can only select 2 folders.");
        }
    };

    const handleCheckboxChangeForUnmerge = (folderId) => {
        if (!unmergeFolderId) {
            setUnmergeFolderId(folderId);
        } else if (unmergeFolderId === folderId) {
            setUnmergeFolderId(null); // Unselect if clicked again
        } else {
            toast.error("You can only select 1 folder.");
        }
    };

    const handleMergeClick = () => {
        if (startMergeFolderId && endMergeFolderId) {
            handleMergeFolders();
        } else {
            toast.error("Please select two folders to merge.");
        }
    };

    const handleUnmergeClick = () => {
        if (unmergeFolderId) {
            handleUnmergeFolder();
        } else {
            toast.error("Please select a folder to unmerge.");
        }
    };


    const handleCheckedSubmit = () => {
        if (selectedLevels.length === 0) {
            console.warn("No levels selected for sharing.");
            return;
        }
        requestApi("POST", `/api/shareLevels`, { levels: selectedLevels })
            .then(response => console.log('Levels shared:', response.data))
            .catch(error => console.error('Error sharing levels:', error));
    };

    const handleShareClose = () => {
        setShowSharePopup(false);
        setEmail("");
    };

    const handleShareSubmit = async () => {
        try {
            await requestApi("POST", `/api/share`, {
                documentId: selectedDocument.id,
                email: email
            });
            handleShareClose();
            alert('Document shared successfully!');
        } catch (error) {
            console.error('Error sharing document:', error);
        }
    };

    const documentCategoryMapping = {
        "ClassWorks": 1,
        "HomeWorks": 2,
        "Others": 3,
        "Assessment": 4,
    };

    useEffect(() => {
        fetchLevels();
    }, [subjectId, subjectName]);

    useEffect(() => {
        if (levels.length > 0 && !selectedLevel) {
            setSelectedLevel(levels[0]);
        }
    }, [levels]);

    useEffect(() => {
        if (selectedLevel) {
            fetchFolders();
        }
    }, [selectedLevel, activeTab]);

    useEffect(() => {
        if (selectedFolder) {
            fetchDocuments();
        }
    }, [selectedFolder]);

    const fetchLevels = async () => {
        setLoading(true);
        try {
            const response = await requestApi("GET", `/api/levels`, null, {
                sub_id: subjectId,
                sub_name: subjectName
            });

            setLevels(response.data);
            setSelectedLevel(response.data[0]);
            setLevelNum(response.data[0].level);
        } catch (error) {
            console.error('Error fetching levels:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };


    useEffect(() => {
        if (selectedFolder && selectedFolder.id !== undefined) {
            console.log("Selected Folder ID:", selectedFolder.id); // Debugging line
            fetchDocuments(selectedFolder.id);
        }
    }, [selectedFolder]);


    const fetchDocuments = async (folderId) => {
        try {
            const response = await requestApi("GET", `/api/getDocument/${folderId}`, {});
            setDocuments(response.data);
            setActiveFolderId(folderId);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const fetchFolders = async () => {
        try {
            setIsLoading(true); // Start loading

            const response = await requestApi("GET", `/api/getfolders`, null, {
                work_type: documentCategoryMapping[activeTab],
                level: selectedLevel.id
            });

            const folders = response.data;
            setFolders(folders);
            console.log(folders);

            if (folders.length > 0) {
                setActiveFolderId(folders[0].id);
                fetchDocuments(folders[0].id);
            } else {
                setDocuments([]);
                setActiveFolderId(null);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const findMissing = async () => {
        try {
            const response = await requestApi("GET", `/api/findMissing`, null, {

                work_type: documentCategoryMapping[activeTab],
                level: selectedLevel.id

            });
            setMissingDays(response.data.missingDays);

        } catch (error) {
            console.error('Cannot find missing days:', error);
        }
    };

    const handleAddClick = () => {
        setShowPopup(true);
    };

    const handleAddFirstLevelClick = () => {
        setLevelNum(0);
        setShowFirstLevelPopup(true);
    };

    const handleClose = () => {
        setShowPopup(false);

    };
    const handleFirstLevelClose = () => {
        setShowFirstLevelPopup(false);
    }

    const handleCreateLevel = async () => {

        setShowFirstLevelPopup(false)
        if (newLevel.trim() !== "") {
            const formattedLevel = newLevel.charAt(0).toUpperCase() + newLevel.slice(1);
            try {
                const response = await requestApi("POST", `/api/levels`, { name: formattedLevel, subjectId: subjectId, levelNum: levelNum + 1 });
                setLevels([...levels, response.data]);
                setNewLevel("");
                setShowPopup(false);
                fetchLevels();
            } catch (error) {
                console.error('Error creating level:', error);
            }
        }
    };

    const handleCreateFolder = async () => {
        try {
            const adjustedEndDay = end_day === undefined ? start_day : end_day;

            const response = await requestApi("POST", `/api/folders`, {
                s_day: start_day,
                e_day: adjustedEndDay,
                level_id: selectedLevel.id,
                work_type: documentCategoryMapping[activeTab]
            });

            setFolders([...folders, response.data]);
            setStart_day("");
            setEnd_day("");
            setShowNewFolderPopup(false);
            fetchFolders();
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    }

    const handleLevelClick = (id) => {
        const level = levels.find((lvl) => lvl.id === id);
        setSelectedLevel(level);
        setLevelNum(level.level);
    };


    useEffect(() => {
        if (selectedFolder) {
            fetchDocuments();
        }
    }, [selectedFolder]);


    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleDocumentPopupOpen = () => {
        setShowDocumentPopup(true);
    };

    const handleDocumentPopupClose = () => {
        setShowDocumentPopup(false);
        setDocumentType("");
        setPdf(null);
        setLink("");
        setVideo(null);
    };


    const handleNewFolderPopupClose = () => {
        setShowNewFolderPopup(false);
    };

    const handleDocumentTypeChange = (event) => {
        setDocumentType(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (documentType === "pdf") {
            setPdf(file);
        } else if (documentType === "video") {
            setVideo(file);
        } else if (documentType === "general") {
            setGeneralDoc(file);
        }
    };

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!selectedLevel) {
            alert('Please select a level before uploading a document.');
            return;
        }
        const formData = new FormData();
        formData.append('subjectId', subjectId);
        formData.append('folder', activeFolderId);
        formData.append('documentType', documentType);
        if (documentType === 'pdf' && pdf) {
            formData.append('file', pdf);
        } else if (documentType === 'video' && video) {
            formData.append('file', video);
        } else if (documentType === 'link' && link) {
            formData.append('link', link);
        } else if (documentType === 'general' && generalDoc) {
            formData.append('file', generalDoc);
        }
        for (const [key, value] of formData.entries()) {
            // console.log(`${key}:`, value);
        }

        try {
            const response = await requestApi("POST", `/api/uploadDocument`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchDocuments(activeFolderId);
        } catch (error) {
            console.error('Error uploading document:', error);

            if (error.response) {
                if (error.response.status === 401) {
                    toast.error("Fields are required");
                } else {
                    toast.error("An error occurred: " + error.response.data.message || "Unknown error");
                }
            } else if (error.request) {
                toast.error("No response from server");
            } else {
                toast.error("Error: " + error.message);
            }
        }
        handleDocumentPopupClose();
    };

    const handleEditClick = (level) => {
        setEditLevel(level.lvl_name);
        setSelectedLevel(level);
        setShowEditPopup(true);
    };

    const handleDocumentDelete = async (id) => {
        setShowDocumentEditDelete(prevState => !prevState);
        setActiveFolderId(folders[0].id);

        const confirmDelete = window.confirm("Are you sure, You want to delete this document?");
        if (confirmDelete) {
            setDocUndo(id);
            setActiveFolderId(folders[0].id);
            fetchFolders(activeFolderId);
            try {
                fetchFolders(activeFolderId);
                await requestApi("DELETE", `/api/deletedocument/${id}`, {
                });
                // console.log(id);
                setShowDocUndoAlert(true);
                setTimeout(() => {
                    setShowDocUndoAlert(false);
                }, 5000);
            } catch (error) {
                console.error('Error deleting level:', error);
            }
        }

        fetchDocuments();
    }

    const handleDocUndo = async () => {
        try {
            await requestApi("PUT", `/api/restoreDocument`, { id: docUndo });
            setShowDocUndoAlert(false);
            fetchDocuments();
            fetchFolders(activeFolderId);
        } catch (error) {
            console.error('Error restoring document:', error);
        }
    }

    const handleEditClose = () => {
        setShowEditPopup(false);
    };

    const handleEditSubmit = async () => {
        if (editLevel.trim() !== "") {
            try {
                const response = await requestApi("PUT", `/api/levels/${selectedLevel.id}`, {
                    lvl_name: editLevel,
                    subjectId: subjectId,
                    level: selectedLevel.level,
                });


                const updatedLevels = levels.map((lvl) =>
                    lvl.id === selectedLevel.id ? { ...lvl, lvl_name: editLevel } : lvl
                );
                setLevels(updatedLevels);
                setShowEditPopup(false);
            } catch (error) {
                console.error('Error updating level:', error);
            }
        }
    };

    const handleDelete = async (id, subjectId, level) => {
        const confirmDelete = window.confirm("Are you sure, you want to delete this level? You will lose all the documents inside this level!!");
        if (confirmDelete) {
            try {
                setLevelUndo(id);
                await requestApi("DELETE", `/api/levels?id=${id}&subjectId=${subjectId}&level=${level}`);
                setLevels(levels.filter((level) => level.id !== id));

                // Show undo alert
                setShowUndoAlert(true);

                // Hide alert after 5 seconds
                setTimeout(() => {
                    setShowUndoAlert(false);
                }, 5000);
            } catch (error) {
                console.error('Error deleting level:', error);
            }
        }
        fetchLevels();
    };
    const handleLevelUndo = async () => {
        try {
            await requestApi("PUT", `/api/restoreLevel`, { id: levelUndo });
            setShowUndoAlert(false);
            fetchLevels();
        } catch (error) {
            console.error('Error restoring level:', error);
        }
    };
    const handleFolderDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure, you want to delete this document?");
        if (confirmDelete) {
            setFolderUndo(id);
            setShowFolderEditDelete(false);
            try {
                await requestApi("PUT", `/api/folder/${id}`, {
                });
                setShowFolderUndoAlert(true);
                setTimeout(() => {
                    setShowFolderUndoAlert(false);
                }, 5000);
            } catch (error) {
                console.error('Error deleting level:', error);
            }
        } else {
            setShowFolderEditDelete(false);
        }
        fetchFolders();
    };

    const handleFolderUndo = async () => {
        try {
            await requestApi("PUT", `/api/restoreFolder`, { id: folderUndo });
            setShowFolderUndoAlert(false);
            fetchFolders();
        } catch (error) {
            console.error('Error restoring Folder:', error);
        }
    }

    const handleShowDocumentEditDelete = () => {
        setShowDocumentEditDelete(prevState => !prevState);
    };

    const handleShowFolderEditDelete = () => {
        setShowFolderEditDelete(prevState => !prevState);
    }
    const handleNewFolderPopupOpen = () => {
        findMissing();
        setStart_day();
        setEnd_day();
        setShowNewFolderPopup(true);
    }

    const handleFolderEditDeleteOpen = () => {
        setShowFolderEditDeletePopup(true);
    }
    const handleMoveUp = async (in1, in2, currI, adjI) => {
        await changeOrder(in1, in2, currI + 1, adjI + 1)
    }


    const handleMoveDown = async (in1, in2, currI, adjI) => {
        await changeOrder(in1, in2, currI + 1, adjI + 1);
    }

    const changeOrder = async (in1, in2, currI, adjI) => {
        // console.log(in1, in2);
        try {
            await requestApi("PUT", `/api/documentOrder/`, {
                in1,
                in2
            });

            await fetchDocuments(activeFolderId);
            toast.success(`Doc ${currI} moved as doc ${adjI}`);

        } catch (error) {
            console.error('Error changing document order:', error);
            toast.error(`Error moving doc ${currI}!`);
        }
    };

    const handleMergeFolders = async () => {
        console.log(`${startMergeFolderId}`);
        console.log(`${endMergeFolderId}`);
        try {
            const response = await requestApi("POST", `/api/mergeFolders`, {
                startFolderId: startMergeFolderId,
                endFolderId: endMergeFolderId,
                level: selectedLevel.id,
                work_type: documentCategoryMapping[activeTab]
            });
            fetchFolders()
            console.log('Folders merged successfully:', response.data);
            fetchDocuments(activeFolderId);
            setStartMergeFolderId(null);
            setEndMergeFolderId(null);
            setIsSelecting(false);
        } catch (error) {
            console.error('Error merging folders:', error);
        }
    };

    const handleUnmergeFolder = async () => {
        try {
            const response = await requestApi("POST", `/api/unmergeFolder`, {
                folderId: unmergeFolderId,
            });
            fetchFolders()
            fetchDocuments(activeFolderId);
            console.log('Folder unmerged successfully:', response.data);
            setUnmergeFolderId(null);
            setIsUnmerging(false);
        } catch (error) {
            console.error('Error unmerging folder:', error);
        }
    };

    const handleDayChange = (event) => {
        const selectedDay = event.target.value;
        setStart_day(selectedDay);
        setEnd_day(selectedDay);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((isSelecting || isUnmerging) && containerRef.current && !containerRef.current.contains(event.target)) {
                setIsSelecting(false);
                setIsUnmerging(false);
            }
        };

        if (isSelecting || isUnmerging) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSelecting, isUnmerging]);

    const divId = 'hoverEditDelete';

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedElement = event.target;
            const folderDiv = document.querySelector(`#${divId}`);
            if (folderDiv && !folderDiv.contains(clickedElement)) {
                setShowFolderEditDelete(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowFolderEditDelete]);

    return (
        <div className='levels-page'>
            <ToastContainer />
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            </div>
            <div className='levels-with-documents'>
                <LevelCard
                    subjectName={subjectName}
                    levels={levels}
                    levelNum={levelNum}
                    loading={loading}
                    showEditDelete={showEditDelete}
                    showCheckboxes={showCheckboxes}
                    showUndoAlert={showUndoAlert}
                    openSecondMenu={openSecondMenu}
                    anchorElSecond={anchorElSecond}
                    handleSecondMenuClick={handleSecondMenuClick}
                    handleCloseSecondMenu={handleCloseSecondMenu}
                    handleShowEditDelete={handleShowEditDelete}
                    handleAddFirstLevelClick={handleAddFirstLevelClick}
                    handleLevelClick={handleLevelClick}
                    handleEditClick={handleEditClick}
                    handleDelete={handleDelete}
                    handleAddClick={handleAddClick}
                    handleCheckedSubmit={handleCheckedSubmit}
                    handleLevelUndo={handleLevelUndo}
                    subjectId={subjectId}
                    actionsRef={actionsRef}
                    levels_img={levels_img}
                />
                <div className='container2'>
                    <div className='level-name'>
                        {selectedLevel ? (
                            <>
                                <div>
                                    <p style={{ fontWeight: "var(--f-weight)" }}>{selectedLevel.lvl_name}</p>
                                </div>
                            </>
                        ) : (
                            <div>
                                <p className='level-num'>Level 0</p>
                                <p>Select a level</p>
                            </div>
                        )}
                    </div>
                    <hr />
                    <div className='tabs'>
                        <ul className='tabs-list'>
                            {["ClassWorks", "HomeWorks", "Assessment", "Others"].map((tab) => (
                                <li
                                    key={tab}
                                    className={`each-tab ${activeTab === tab ? "active" : ""}`}
                                    onClick={() => handleTabClick(tab)}
                                >
                                    <span className="tab-icon">
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {tab === "ClassWorks" && <LibraryBooksIcon sx={{ fontSize: "20px", color: "#0079c5", margin: "0px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px" }} />}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {tab === "HomeWorks" && <HomeWorkIcon sx={{ fontSize: "20px", color: "#1b6b5f", margin: "0px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px" }} />}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {tab === "Assessment" && <Assignment sx={{ fontSize: "20px", color: "#c7566b", margin: "0px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px" }} />}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {tab === "Others" && <MenuOpenIcon sx={{ fontSize: "20px", color: "#b04dc2", margin: "0px", padding: "3px", backgroundColor: "var(--document)", borderRadius: "5px" }} />}
                                        </div>
                                    </span>
                                    <span className="full-tab-name">{tab}</span>
                                    <span className="short-tab-name">
                                        {tab === "ClassWorks" ? "CW" :
                                            tab === "HomeWorks" ? "HW" :
                                                tab === "Assessment" ? "TEST" :
                                                    "OTHERS"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='all-documents'>
                        <div className='sticky-add-button'>
                            <div style={{ display: "flex" }}>
                            </div>
                            <div className='documents-container'>
                                <div ref={containerRef} className='folders-div'>
                                    <Folders
                                        isSelecting={isSelecting}
                                        isUnmerging={isUnmerging}
                                        isLoading={isLoading}
                                        folders={folders}
                                        empty_folder="path_to_empty_folder_image" // Your empty folder image path
                                        activeFolderId={activeFolderId}
                                        showFolderEditDelete={showFolderEditDelete}
                                        showFolderUndoAlert={showFolderUndoAlert}
                                        handleMergeClick={handleMergeClick}
                                        handleUnmergeClick={handleUnmergeClick}
                                        handleClick={handleClick}
                                        anchorEl={anchorEl}
                                        open={open}
                                        handleCloseMui={handleCloseMui}
                                        handleShowFolderEditDelete={handleShowFolderEditDelete}
                                        handleNewFolderPopupOpen={handleNewFolderPopupOpen}
                                        toggleSelectMode={toggleSelectMode}
                                        toggleUnmergeMode={toggleUnmergeMode}
                                        fetchDocuments={fetchDocuments}
                                        handleFolderDelete={handleFolderDelete}
                                        handleFolderUndo={handleFolderUndo}
                                        handleCheckboxChangeForMerge={handleCheckboxChangeForMerge}
                                        handleCheckboxChangeForUnmerge={handleCheckboxChangeForUnmerge}
                                        startMergeFolderId={startMergeFolderId}
                                        endMergeFolderId={endMergeFolderId}
                                        unmergeFolderId={unmergeFolderId}
                                    />
                                </div>

                                <DocumentManager
                                    documentEditDeleteRef={documentEditDeleteRef}
                                    showDocumentEditDelete={showDocumentEditDelete}
                                    handleShowDocumentEditDelete={handleShowDocumentEditDelete}
                                    handleDocumentPopupOpen={handleDocumentPopupOpen}
                                    isLoading={isLoading}
                                    documents={documents}
                                    apiHost={apiHost}
                                    empty_folder={empty_folder}
                                    handleMoveUp={handleMoveUp}
                                    handleMoveDown={handleMoveDown}
                                    handleDocumentDelete={handleDocumentDelete}
                                    showDocUndoAlert={showDocUndoAlert}
                                    handleDocUndo={handleDocUndo}
                                />

                                <ShareDocumentPopup
                                    open={showSharePopup}
                                    onClose={handleShareClose}
                                    email={email}
                                    setEmail={setEmail}
                                    onSubmit={handleShareSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NewLevelPopup
                open={showPopup}
                onClose={handleClose}
                onCreate={handleCreateLevel}
                levelNum={levelNum}
                newLevel={newLevel}
                setNewLevel={setNewLevel}
            />
            <AddFirstLevelPopup
                open={showFirstLevelPopup}
                onClose={handleFirstLevelClose}
                onCreate={handleCreateLevel}
                newLevel={newLevel}
                setNewLevel={setNewLevel}
            />
            <EditLevelPopup
                open={showEditPopup}
                onClose={handleEditClose}
                onSave={handleEditSubmit}
                editLevel={editLevel}
                setEditLevel={setEditLevel}
            />
            <AddFolderPopup
                open={showNewFolderPopup}
                onClose={handleNewFolderPopupClose}
                startDay={start_day || ""}
                handleDayChange={handleDayChange}
                missingDays={missingDays}
                handleCreateFolder={handleCreateFolder}
            />
            <DocumentPopup
                showDocumentPopup={showDocumentPopup}
                handleDocumentPopupClose={handleDocumentPopupClose}
                documentType={documentType}
                handleDocumentTypeChange={handleDocumentTypeChange}
                handleFileChange={handleFileChange}
                handleLinkChange={handleLinkChange}
                link={link}
                handleFormSubmit={handleFormSubmit}
            />
        </div>
    );
}

export default Levels;