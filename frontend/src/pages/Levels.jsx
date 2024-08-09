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
    const [pdf, setPdf] = useState(null);
    const [link, setLink] = useState("");
    const [video, setVideo] = useState(null);
    const [documents, setDocuments] = useState([]); // State for documents

    const documentCategoryMapping = {
        "Class Works": 1,
        "Home Works": 2,
        "Others": 3,

    };

    useEffect(() => {
        fetchLevels();
    }, [subjectId, subjectName]);

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
            console.log(response.data);
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
            setDocuments(response.data); // Store fetched documents in state
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
            console.log('Document uploaded successfully', response.data);
            fetchDocuments(); // Refresh documents after upload
        } catch (error) {
            console.error('Error uploading document:', error);
        }

        handleDocumentPopupClose();
    };

    return (
        <>
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className='subject-name'><ArrowForwardIosIcon sx={{ fontSize: "14px", margin: "0px" }} />{subjectName}</p>
                <button className="add-button" onClick={handleAddClick}>
                    <AddIcon />Add Level
                </button>
            </div>

            <div className='levels-with-documents'>
                <div className="container1">
                    {levels.map((level, index) => (
                        <div key={index} className="card1" onClick={() => handleLevelClick(level.id)}>
                            <div className='level-num'>Level {level.level}</div>
                            {level.lvl_name}
                        </div>
                    ))}
                    <Dialog open={showPopup} onClose={handleClose}>
                        <DialogTitle sx={{ width: "400px" }}>Enter Level Name</DialogTitle>
                        <DialogContent>
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
                            <Button onClick={handleCreateLevel}>Create Level</Button>
                        </DialogActions>
                    </Dialog>
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
            <Dialog
                open={showDocumentPopup}
                onClose={handleDocumentPopupClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleFormSubmit,
                    sx: { width: '900px', backgroundColor: "var(--background-1)", color: "var(--text)" }
                }}
            >
                <DialogTitle>Add Document</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText sx={{ width: '500px', backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                        Select the type of document to upload.
                    </DialogContentText>
                    <TextField
                        select
                        value={documentType}
                        onChange={handleDocumentTypeChange}
                        fullWidth
                        SelectProps={{
                            native: true,
                        }}
                        variant="standard"
                        sx={{
                            '& option': {
                                color: 'rgba(0, 0, 0, 0.87)',
                            },
                            '& option:disabled': {
                                color: '#888',
                            }
                        }}
                    >
                        <option value="" disabled>Document type</option>
                        <option value="pdf">PDF</option>
                        <option value="link">Link</option>
                        <option value="video">Video</option>
                    </TextField>

                    {documentType === "pdf" && (
                        <label className="drop-container">
                            <span className="drop-title">Drop files here</span>
                            or
                            <input type="file" accept="application/pdf" onChange={handleFileChange} required />
                        </label>
                    )}
                    {documentType === "link" && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="link"
                            label="Link"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={link}
                            onChange={handleLinkChange}
                        />
                    )}
                    {documentType === "video" && (
                        <label className="drop-container">
                            <span className="drop-title">Drop files here</span>
                            or
                            <input type="file" accept="video/*" onChange={handleFileChange} required />
                        </label>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDocumentPopupClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">Upload</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Levels;
