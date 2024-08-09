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
import apiHost from "../components/utils/api";
import pdf_img from '../assets/pdf_img.png';
import video_img from '../assets/video_img.png';
import link_img from '../assets/link_img.png';
import './styles.css';

function Levels() {
    return <Layout rId={2} body={<Body />} />;
}

function Body() {
    const { subjectId, subjectName } = useParams();

    const [levels, setLevels] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newLevel, setNewLevel] = useState("");
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [activeTab, setActiveTab] = useState("Class Works");
    const [showDocumentPopup, setShowDocumentPopup] = useState(false);
    const [documentType, setDocumentType] = useState("");
    const [showEditDelete, setShowEditDelete] = useState(false);
    const [pdf, setPdf] = useState(null);
    const [link, setLink] = useState("");
    const [video, setVideo] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false); // State for edit popup
    const [editLevel, setEditLevel] = useState(""); // State for the level name in edit popup

    const documentCategoryMapping = {
        "Class Works": 1,
        "Home Works": 2,
        "Others": 3,
    };

    useEffect(() => {
        fetchLevels();
    }, [subjectId, subjectName]);

    useEffect(() => {
        if (levels.length > 0 && !selectedLevel) {
            setSelectedLevel(levels[0]); // Set the default level to the first one (Level 1)
        }
    }, [levels]);

    useEffect(() => {
        if (selectedLevel) {
            fetchDocuments();
        }
    }, [selectedLevel, activeTab]);

    const fetchLevels = async () => {
        try {
            const response = await axios.get(`${apiHost}/api/levels`, {
                params: {
                    sub_id: subjectId,
                    sub_name: subjectName
                }
            });
            setLevels(response.data);
        } catch (error) {
            console.error('Error fetching levels:', error);
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${apiHost}/api/getDocument`, {
                params: {
                    work_type: documentCategoryMapping[activeTab],
                    level: selectedLevel.id
                }
            });
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleAddClick = () => {
        setShowPopup(true);
    };

    const handleClose = () => {
        setShowPopup(false);
    };

    const handleCreateLevel = async () => {
        if (newLevel.trim() !== "") {
            try {
                const response = await axios.post(`${apiHost}/api/levels`, { name: newLevel, subjectId: subjectId });
                setLevels([...levels, response.data]);
                setNewLevel("");
                setShowPopup(false);
                fetchLevels();
            } catch (error) {
                console.error('Error creating level:', error);
            }
        }
    };

    const handleLevelClick = (id) => {
        const level = levels.find((lvl) => lvl.id === id);
        setSelectedLevel(level);
    };

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

    const handleDocumentTypeChange = (event) => {
        setDocumentType(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (documentType === "pdf") {
            setPdf(file);
        } else if (documentType === "video") {
            setVideo(file);
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
        formData.append('level', selectedLevel.id);
        formData.append('category', documentCategoryMapping[activeTab]);
        formData.append('documentType', documentType);

        if (documentType === 'pdf' && pdf) {
            formData.append('file', pdf);
        } else if (documentType === 'video' && video) {
            formData.append('file', video);
        } else if (documentType === 'link' && link) {
            formData.append('link', link);
        }

        try {
            const response = await axios.post(`${apiHost}/api/uploadDocument`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchDocuments();
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
                // console.log(selectedLevel.id, editLevel, subjectId, selectedLevel.level);

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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure, You want to delete this level? You will loose all the documents inside this level!!");
        if (confirmDelete) {
            try {
                await axios.delete(`${apiHost}/api/levels/${id}`, {
                });
                console.log(id, subjectId)
                setLevels(levels.filter((level) => level.id !== id));
            } catch (error) {
                console.error('Error deleting level:', error);
            }
        }
    };


    const handleShowEditDelete = () => {
        setShowEditDelete(prevState => !prevState);
    };

    return (
        <>
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className='subject-name'><ArrowForwardIosIcon sx={{ fontSize: "14px", margin: "0px" }} />{subjectName}</p>
                <div style={{ display: "flex" }}>
                    <button className="add-button" onClick={handleShowEditDelete}>
                        <AutoFixHighIcon sx={{ marginRight: "5px", fontSize: "20px" }} />Modify
                    </button>
                    <button className="add-button" onClick={handleAddClick}>
                        <AddIcon />Add Level
                    </button>
                </div>
            </div>

            <div className='levels-with-documents'>
                <div className="container1">
                    {levels.map((level, index) => (
                        <div key={index} className="card1" onClick={() => handleLevelClick(level.id)}>
                            <div
                                className="hover-edit-delete-levels"
                                style={{ display: showEditDelete ? 'flex' : 'none' }}
                            >
                                <div
                                    className="edit-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(level); // Open the edit popup
                                    }}
                                >
                                    <CreateSharpIcon sx={{ color: "#588dc0" }} />
                                </div>
                                <div
                                    className="delete-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(level.id);
                                    }}
                                >
                                    <DeleteForeverSharpIcon sx={{ color: "#d12830" }} />
                                </div>
                            </div>
                            <div>
                                <div className='level-num'>Level {level.level}</div>
                                {level.lvl_name}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='container2'>
                    <div className='level-name'>
                        {selectedLevel ? (
                            <>
                                <div>
                                    <p className='level-num'>Level {selectedLevel.level}</p>
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
                            {["Class Works", "Home Works", "Others"].map((tab) => (
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
                            <button className='add-button' onClick={handleDocumentPopupOpen}>
                                <AddIcon />Add Documents
                            </button>
                            <div className='documents-container'>
                                {documents.length > 0 ? (
                                    documents.map((doc, index) => (
                                        <div key={index} className='document-item'>
                                            {doc.pdf && <div className='flex-align'><img src={pdf_img} alt="PDF" className="document-icon" /><a href={`${apiHost}${doc.pdf}`} target="_blank" rel="noopener noreferrer"> {doc.file_name}</a></div>}
                                            {doc.video && <div className='flex-align'><img src={video_img} alt="PDF" className="document-icon" /><a href={`${apiHost}${doc.video}`} target="_blank" rel="noopener noreferrer"> {doc.file_name}</a></div>}
                                            {doc.link && <div className='flex-align'><img src={link_img} alt="PDF" className="document-icon" /><a href={doc.link} target="_blank" rel="noopener noreferrer"> {doc.link}</a></div>}
                                        </div>
                                    ))
                                ) : (
                                    <p>No documents found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

            {/* Add Document Popup */}
            <Dialog open={showDocumentPopup} onClose={handleDocumentPopupClose}>
                <DialogTitle>Add New Document</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select the type of document and upload it.
                    </DialogContentText>
                    <form onSubmit={handleFormSubmit}>
                        <div className="document-type-select">
                            <label>
                                <input
                                    type="radio"
                                    value="pdf"
                                    checked={documentType === "pdf"}
                                    onChange={handleDocumentTypeChange}
                                />
                                PDF
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="link"
                                    checked={documentType === "link"}
                                    onChange={handleDocumentTypeChange}
                                />
                                Link
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="video"
                                    checked={documentType === "video"}
                                    onChange={handleDocumentTypeChange}
                                />
                                Video
                            </label>
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

                        <DialogActions>
                            <Button onClick={handleDocumentPopupClose}>Cancel</Button>
                            <Button type="submit">Upload</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Levels;