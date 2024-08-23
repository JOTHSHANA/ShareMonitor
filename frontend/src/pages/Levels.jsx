import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from "../components/appLayout/Layout";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CreateSharpIcon from '@mui/icons-material/CreateSharp';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import RuleIcon from '@mui/icons-material/Rule';
import ShareIcon from '@mui/icons-material/Share';
import apiHost from "../components/utils/api";
import pdf_img from '../assets/pdf_img.png';
import video_img from '../assets/video_img.png';
import link_img from '../assets/link_img.png';
import folder_img from '../assets/folder_img.png';
import general_doc_img from '../assets/general_doc_img.png';
import NavigateNextSharpIcon from '@mui/icons-material/NavigateNextSharp';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { ToastContainer, toast } from 'react-toastify';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

function Levels() {
    return <Layout rId={2} body={<Body />} />;
}

function Body() {
    const { subjectId, subjectName } = useParams();

    const [levels, setLevels] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newLevel, setNewLevel] = useState("");
    const [newFolder, NewFolder] = useState("");
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [activeTab, setActiveTab] = useState("Class Works");
    const [showDocumentPopup, setShowDocumentPopup] = useState(false);
    const [documentType, setDocumentType] = useState("");
    const [showEditDelete, setShowEditDelete] = useState(false);
    const [showDocumentEditDelete, setShowDocumentEditDelete] = useState(false);
    const [showNewFolderPopup, setShowNewFolderPopup] = useState(false);
    const [showFolderEditDeletePopup, setShowFolderEditDeletePopup] = useState(false);
    const [pdf, setPdf] = useState(null);
    const [link, setLink] = useState("");
    const [video, setVideo] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [folders, setFolders] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [activeFolderId, setActiveFolderId] = useState(null);
    const [editLevel, setEditLevel] = useState("");
    const [editFolder, setEditFolder] = useState("");
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
        if (!startMergeFolderId) {
            setStartMergeFolderId(folderId);
        } else if (!endMergeFolderId) {
            if (folderId !== startMergeFolderId) {
                setEndMergeFolderId(folderId);
            } else {
                toast.error("You cannot select the same folder twice.");
            }
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

    const handleWholeShareClick = () => {
        setShowCheckboxes(prevState => !prevState);
        if (!showCheckboxes) setSelectedLevels([]);
    };

    // const handleCheckboxChange = (levelId) => {
    //     setSelectedLevels(prevSelectedLevels => {
    //         if (prevSelectedLevels.includes(levelId)) {
    //             return prevSelectedLevels.filter(id => id !== levelId);
    //         } else {
    //             return [...prevSelectedLevels, levelId];
    //         }
    //     });
    // };



    const handleCheckedSubmit = () => {
        if (selectedLevels.length === 0) {
            console.warn("No levels selected for sharing.");
            return;
        }
        console.log('Data sent to backend:', { levels: selectedLevels });
        axios.post(`${apiHost}/api/shareLevels`, { levels: selectedLevels })
            .then(response => console.log('Levels shared:', response.data))
            .catch(error => console.error('Error sharing levels:', error));
    };

    const handleShareClick = (document) => {
        setSelectedDocument(document);
        setShowSharePopup(true);
    };

    const handleShareClose = () => {
        setShowSharePopup(false);
        setEmail("");
    };

    const handleShareSubmit = async () => {
        try {
            await axios.post(`${apiHost}/api/share`, {
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
        "Class Works": 1,
        "Home Works": 2,
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

    // useEffect(() => {
    //     if (selectedLevel) {
    //         fetchDocuments();
    //     }
    // }, [selectedLevel, activeTab]);

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
        try {
            const response = await axios.get(`${apiHost}/api/levels`, {
                params: {
                    sub_id: subjectId,
                    sub_name: subjectName
                }
            });
            setLevels(response.data);
            setSelectedLevel(levels[0]);
            setLevelNum(response.data[0].level)

        } catch (error) {
            console.error('Error fetching levels:', error);
        }
    };

    useEffect(() => {
        if (selectedFolder && selectedFolder.id !== undefined) {
            console.log("Selected Folder ID:", selectedFolder.id); // Debugging line
            fetchDocuments(selectedFolder.id);
        }
    }, [selectedFolder]);


    const fetchDocuments = async (folderId) => {
        // setSelectedFolder(folderId)
        console.log("Fetching documents for folder ID:", folderId);
        try {
            const response = await axios.get(`${apiHost}/api/getDocument/${folderId}`, {});
            setDocuments(response.data);
            setActiveFolderId(folderId);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const fetchFolders = async () => {

        try {
            const response = await axios.get(`${apiHost}/api/getfolders`, {
                params: {
                    work_type: documentCategoryMapping[activeTab],
                    level: selectedLevel.id
                }
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
        if (newLevel.trim() !== "") {
            try {
                const response = await axios.post(`${apiHost}/api/levels`, { name: newLevel, subjectId: subjectId, levelNum: levelNum + 1 });
                setLevels([...levels, response.data]);
                setNewLevel("");
                setShowPopup(false);
                fetchLevels();
            } catch (error) {
                console.error('Error creating level:', error);
            }
        }
    };

    // const handleCreateFolder = async () => {
    //     try {
    //         const response = await axios.post(`${apiHost}/api/folders`, { s_day: start_day, e_day: end_day, level_id: selectedLevel.id, work_type: documentCategoryMapping[activeTab] });

    //         setFolders([...folders, response.data]);
    //         setStart_day("");
    //         setEnd_day("");
    //         setShowNewFolderPopup(false);
    //         fetchFolders();
    //     } catch (error) {
    //         console.error('Error creating folder:', error);
    //     }

    // }
    const handleCreateFolder = async () => {
        try {
            const adjustedEndDay = end_day === undefined ? start_day : end_day;

            const response = await axios.post(`${apiHost}/api/folders`, {
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


    const handleEditFolder = async () => {
        try {
            const response = await axios.put(`${apiHost}/api/folders/${selectedFolder.id}`, {
                s_day: start_day,
                e_day: end_day
            });
            console.log(selectedFolder.id, start_day, end_day);
            fetchFolders();

        } catch (error) {
            console.error('Error updating folder:', error);
        }
        setShowFolderEditDeletePopup(false)
    }

    const handleLevelClick = (id) => {
        const level = levels.find((lvl) => lvl.id === id);
        setSelectedLevel(level);
        // console.log("kjsdnhv0")
        // console.log(selectedLevel.id)
        setLevelNum(level.level);
    };



    const handleFolderClick = (id) => {
        console.log(id);
        const folder = folders.find((fldr) => fldr.id === id);
        setSelectedFolder(folder);

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

    const handleFolderEditDeletePopupClose = () => {
        setShowFolderEditDeletePopup(false);
    }

    const handleDocumentTypeChange = (event) => {
        setDocumentType(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file)
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
        console.log(documentType)
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
            console.log(`${key}:`, value);
        }


        try {
            const response = await axios.post(`${apiHost}/api/uploadDocument`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response)
            fetchDocuments(activeFolderId);
        } catch (error) {
            console.error('Error uploading document:', error);
        }

        handleDocumentPopupClose();
    };


    const handleEditClick = (level) => {
        setEditLevel(level.lvl_name);
        setSelectedLevel(level);
        setShowEditPopup(true);
    };

    const handleFolderEditClick = (folder, s_day, e_day) => {

        setSelectedFolder(folder)
        setEditFolder(folder.id);
        setStart_day(s_day);
        setEnd_day(e_day);
        setShowFolderEditDeletePopup(true);
    };

    const handleDocumentDelete = async (id) => {

        const confirmDelete = window.confirm("Are you sure, You want to delete this document?");
        if (confirmDelete) {
            setDocUndo(id);
            fetchFolders(activeFolderId);
            try {
                fetchFolders(activeFolderId);
                await axios.delete(`${apiHost}/api/deletedocument/${id}`, {
                });
                console.log(id);
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
            await axios.put(`${apiHost}/api/restoreDocument`, { id: docUndo });
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
                const response = await axios.put(`${apiHost}/api/levels/${selectedLevel.id}`, {
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
                await axios.delete(`${apiHost}/api/levels/${id}`, {
                    data: { subjectId, level }
                });
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
            await axios.put(`${apiHost}/api/restoreLevel`, { id: levelUndo });
            setShowUndoAlert(false);
            fetchLevels();
        } catch (error) {
            console.error('Error restoring level:', error);
        }
    };
    const handleFolderDelete = async (id) => {
        console.log(id);
        const confirmDelete = window.confirm("Are you sure, you want to delete this document?");
        if (confirmDelete) {
            setFolderUndo(id);
            try {
                await axios.put(`${apiHost}/api/folder/${id}`, {
                });
                console.log(id);
                setShowFolderUndoAlert(true);
                setTimeout(() => {
                    setShowFolderUndoAlert(false);
                }, 5000);
            } catch (error) {
                console.error('Error deleting level:', error);
            }
        }
        fetchFolders();
    };

    const handleFolderUndo = async () => {
        try {
            await axios.put(`${apiHost}/api/restoreFolder`, { id: folderUndo });
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

    const handleShowEditDelete = () => {
        setShowEditDelete(prevState => !prevState);
    };

    const handleNewFolderPopupOpen = () => {
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
        console.log(in1, in2);
        try {
            await axios.put(`${apiHost}/api/documentOrder/`, {
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
        try {
            const response = await axios.post(`${apiHost}/api/mergeFolders`, {
                startFolderId: startMergeFolderId,
                endFolderId: endMergeFolderId,
            });
            fetchFolders()
            console.log('Folders merged successfully:', response.data);
            fetchDocuments(activeFolderId);
            setStartMergeFolderId(null);
            setEndMergeFolderId(null);
            setIsSelecting(false);
            // Refresh the folder list or handle the response as needed
        } catch (error) {
            console.error('Error merging folders:', error);
        }
    };


    const handleUnmergeFolder = async () => {
        try {
            const response = await axios.post(`${apiHost}/api/unmergeFolder`, {
                folderId: unmergeFolderId,  // ID of the merged folder to unmerge
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




    return (
        <div className='levels-page'>
            <ToastContainer />
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className='subject-name'><ArrowForwardIosIcon sx={{ fontSize: "14px", margin: "0px" }} />{subjectName}</p>
                {/* <div style={{ display: "flex" }}>
                    <button className="add-button" onClick={handleShowEditDelete}>
                        <AutoFixHighIcon sx={{ marginRight: "5px", fontSize: "20px" }} />Modify
                    </button>
                    <button className="add-button" onClick={handleWholeShareClick}>
                        <RuleIcon />Select
                    </button>
                    <button className="add-button" onClick={handleAddFirstLevelClick}>
                        <AddIcon />Add Level
                    </button>
                </div> */}
            </div>

            <div className='levels-with-documents'>
                <div className="container1">
                    <div className='card1-fake' style={{ display: "flex" }}>
                        <button style={{ flex: "1" }} className="add-button" onClick={handleShowEditDelete}>
                            <AutoFixHighIcon sx={{ marginRight: "5px", fontSize: "20px" }} /><span>Modify</span>
                        </button>
                        <button style={{ flex: "1" }} className="add-button" onClick={handleWholeShareClick}>
                            <RuleIcon /><span>Select</span>
                        </button>
                        <button style={{ flex: "1" }} className="add-button" onClick={handleAddFirstLevelClick}>
                            <AddIcon /><span>Add Level</span>
                        </button>
                    </div>
                    {levels.map((level, index) => (
                        <div key={index} className={`card1 ${levelNum === level.level ? 'active' : ''}`} onClick={() => handleLevelClick(level.id)}>
                            <div
                                className="hover-edit-delete-levels"
                                style={{ display: showEditDelete ? 'flex' : 'none' }}
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
                                        <AddIcon style={{ color: "var(--text)" }} />
                                    </button>
                                    {/* {showCheckboxes && (
                                   <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange(level.id)}
                                            checked={selectedLevels.includes(level.id)}
                                        />
                                    )} */}
                                </div>
                            </div>
                        </div>
                    ))}
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


                <div className='container2'>
                    <div className='level-name'>
                        {selectedLevel ? (
                            <>
                                <div>
                                    {/* <p className='level-num'>Level {selectedLevel.level}</p> */}
                                    <p>{selectedLevel.lvl_name}</p>
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
                            {["Class Works", "Home Works", "Assessment", "Others"].map((tab) => (
                                <li
                                    key={tab}
                                    className={`each-tab ${activeTab === tab ? "active" : ""}`}
                                    onClick={() => handleTabClick(tab)}
                                >
                                    {tab}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='all-documents'>
                        <div className='sticky-add-button'>
                            <div style={{ display: "flex" }}>
                                {/* <button className='add-button' onClick={handleNewFolderPopupOpen}>
                                    <AddIcon />Add Folders
                                </button> */}
                                {/* <button className="add-button" onClick={handleShowDocumentEditDelete}>
                                    <AutoFixHighIcon sx={{ marginRight: "5px", fontSize: "20px" }} />Modify
                                </button> */}
                            </div>
                            <div className='documents-container'>
                                <div className='folders-div'>
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        {/* <button className="add-button-folders" onClick={handleShowFolderEditDelete}>
                                            <AutoFixHighIcon sx={{ marginRight: "5px", fontSize: "20px" }} /><span>Modify</span>
                                        </button>
                                        <button className='add-button-folders' onClick={handleNewFolderPopupOpen}>
                                            <AddIcon /><span>Add Folders</span>
                                        </button> */}
                                        <button className='add-button' onClick={toggleSelectMode}>
                                            <MergeTypeIcon />{isSelecting ? 'Cancel merge' : 'Merge'}
                                        </button>
                                        <button className='add-button' onClick={toggleUnmergeMode}>
                                            <CallSplitIcon />{isUnmerging ? 'Cancel Unmerge' : 'Unmerge'}
                                        </button>
                                    </div>
                                    <hr />

                                    {folders.length > 0 ? (
                                        folders.map((folder, index) => (
                                            <div
                                                key={index}
                                                className={`document-item ${activeFolderId === folder.id ? 'active' : ''}`}
                                                onClick={() => fetchDocuments(folder.id)}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", width: "100%" }}>
                                                    <div style={{display:"flex", }}>
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
                                                            className="edit-icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleFolderEditClick(folder, folder.s_day, folder.e_day);
                                                            }}
                                                        >
                                                            <CreateSharpIcon sx={{ color: "#588dc0" }} />
                                                        </div>
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
                                                    {/* {(isSelecting || isUnmerging) && (
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
                                                    )} */}
                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <p>No folders added.</p>
                                    )}
                                    {isSelecting && (
                                        <button className='add-button' onClick={handleMergeClick}><MergeTypeIcon/>Merge</button>
                                    )}
                                    {isUnmerging && (
                                        <button className='add-button' onClick={handleUnmergeClick}><CallSplitIcon/>Unmerge</button>
                                    )}
                                    {showFolderUndoAlert && (
                                        <div className="undo-alert">
                                            <span>Folder deleted. </span>
                                            <button onClick={handleFolderUndo}>Undo</button>
                                        </div>
                                    )}

                                </div>
                                <div className='documents-div'>
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <button className="add-button" onClick={handleShowDocumentEditDelete}>
                                            <AutoFixHighIcon sx={{ marginRight: "5px", fontSize: "20px" }} /><span>Modify</span>
                                        </button>
                                        <button className='add-button' onClick={handleDocumentPopupOpen}>
                                            <AddIcon /><span>Add Document</span>
                                        </button>
                                    </div>
                                    <hr />
                                    {documents.length > 0 ? (
                                        documents.map((doc, index) => (

                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <div className='index-box' style={{ padding: "12px" }}>{index + 1}</div>
                                                <div key={index} className='document-item' style={{ flex: "1" }}>
                                                    {doc.pdf && <div className='flex-align'>
                                                        <img src={pdf_img} alt="PDF" className="document-icon" />
                                                        <a href={`${apiHost}${doc.pdf}`} target="_blank" rel="noopener noreferrer"> {doc.file_name}</a>
                                                    </div>}
                                                    {doc.video && <div className='flex-align'><img src={video_img} alt="PDF" className="document-icon" /><a href={`${apiHost}${doc.video}`} target="_blank" rel="noopener noreferrer"> {doc.file_name}</a></div>}
                                                    {doc.link && <div className='flex-align'><img src={link_img} alt="PDF" className="document-icon" /><a href={doc.link} target="_blank" rel="noopener noreferrer"> {doc.link}</a></div>}
                                                    {doc.general_doc && (
                                                        <div className='flex-align'>
                                                            <img src={general_doc_img} alt="General Document" className="document-icon" />
                                                            <a href={`${apiHost}${doc.general_doc}`} target="_blank" rel="noopener noreferrer">
                                                                {doc.file_name}
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div style={{ display: "flex", gap: "5px" }}>

                                                        <div style={{ display: "flex", gap: "5px" }}>
                                                            <button
                                                                className='add-button-document'
                                                                onClick={() => handleMoveUp(doc.id, documents[index - 1]?.id, index, index - 1)}
                                                                disabled={index === 0}
                                                            >
                                                                <KeyboardDoubleArrowUpIcon sx={{ color: "var(--text)" }} />
                                                            </button>
                                                            <button
                                                                className='add-button-document'
                                                                onClick={() => handleMoveDown(doc.id, documents[index + 1]?.id, index, index + 1)}
                                                                disabled={index === documents.length - 1}
                                                            >
                                                                <KeyboardDoubleArrowDownIcon sx={{ color: "var(--text)" }} />
                                                            </button>
                                                        </div>
                                                        <div
                                                            className="hover-edit-delete-documents"
                                                            style={{ display: showDocumentEditDelete ? 'flex' : 'none' }}
                                                        >
                                                            <div
                                                                className="delete-icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDocumentDelete(doc.id);
                                                                }}
                                                            >
                                                                <DeleteForeverSharpIcon sx={{ color: "#d12830" }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No documents added.</p>
                                    )}
                                    {showDocUndoAlert && (
                                        <div className="undo-alert">
                                            <span>Document deleted. </span>
                                            <button onClick={handleDocUndo}>Undo</button>
                                        </div>
                                    )}
                                </div>

                                <Dialog open={showSharePopup} onClose={handleShareClose}>
                                    <DialogTitle>Share Document</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            label="Recipient Email"
                                            type="email"
                                            fullWidth
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleShareClose}>Cancel</Button>
                                        <Button onClick={handleShareSubmit}>Share</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <button onClick={handleMergeFolders}>Merge</button>
            <button onClick={handleUnmergeFolder}>UnMerge</button> */}

            <Dialog open={showPopup} onClose={handleClose}>
                <DialogTitle>Add New Level</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name of the new level.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Level Number"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={levelNum + 1}
                        onChange={(e) => setLevelNum(e.target.value)}
                        disabled={true}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Level Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateLevel}>Create</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showFirstLevelPopup} onClose={handleFirstLevelClose}>
                <DialogTitle>Add New Level</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name of the new level.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Level Number"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={1}
                        disabled={true}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Level Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFirstLevelClose}>Cancel</Button>
                    <Button onClick={handleCreateLevel}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Level Popup */}
            <Dialog open={showEditPopup} onClose={handleEditClose}>
                <DialogTitle>Edit Level Name</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editLevel"
                        label="Level Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editLevel}
                        onChange={(e) => setEditLevel(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEditSubmit}>Save</Button>
                </DialogActions>
            </Dialog>

            {/*popup for adding folders */}
            <Dialog open={showNewFolderPopup} onClose={handleNewFolderPopupClose}>
                <DialogTitle>Add Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editLevel"
                        label="Start"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={start_day}
                        onChange={(e) => setStart_day(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editLevel"
                        label="End"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={end_day}
                        onChange={(e) => setEnd_day(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNewFolderPopupClose}>Cancel</Button>
                    <Button onClick={handleCreateFolder}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* popup for folder edit and delete */}
            <Dialog open={showFolderEditDeletePopup} onClose={handleFolderEditDeletePopupClose}>
                <DialogTitle>Edit Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editLevel"
                        label="Start"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={start_day}
                        onChange={(e) => setStart_day(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editLevel"
                        label="End"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={end_day}
                        onChange={(e) => setEnd_day(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFolderEditDeletePopupClose}>Cancel</Button>
                    <Button onClick={handleEditFolder}>SAVE</Button>
                </DialogActions>
            </Dialog>

            {/* Add Document Popup */}
            <Dialog open={showDocumentPopup} onClose={handleDocumentPopupClose}>
                <DialogTitle>Add New Document</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select the type of document and upload it.
                    </DialogContentText>
                    <form onSubmit={handleFormSubmit}>
                        <div className="document-type-select">
                            <label htmlFor="documentType">Select Document Type:</label>
                            <select
                                id="documentType"
                                value={documentType}
                                onChange={handleDocumentTypeChange}
                            >
                                <option value="pdf">PDF</option>
                                <option value="link">Link</option>
                                <option value="video">Video</option>
                                <option value="general">General Document</option>
                            </select>
                        </div>

                        {documentType === "pdf" && (
                            <input type="file" onChange={handleFileChange} accept=".pdf" />
                        )}

                        {documentType === "link" && (
                            <TextField
                                margin="dense"
                                id="link"
                                label="Document Link"
                                type="url"
                                fullWidth
                                variant="standard"
                                value={link}
                                onChange={handleLinkChange}
                            />
                        )}

                        {documentType === "video" && (
                            <input type="file" onChange={handleFileChange} accept="video/*" />
                        )}

                        {documentType === "general" && (
                            <input type="file" onChange={handleFileChange} />
                        )}

                        <DialogActions>
                            <Button onClick={handleDocumentPopupClose}>Cancel</Button>
                            <Button type="submit">Upload</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Levels;