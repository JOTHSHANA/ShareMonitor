import React, { useState, useEffect } from "react";
import Layout from "../components/appLayout/Layout";
import './styles.css';
import axios from "axios";
import apiHost from "../components/utils/api";
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pdf_img from '../assets/pdf_img.png';
import video_img from '../assets/video_img.png';
import link_img from '../assets/link_img.png';
import folder_img from '../assets/folder_img.png';
import general_doc_img from '../assets/general_doc_img.png';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Trash() {
    return <Layout rId={2} body={<Body />} />;
}

function Body() {
    const [activeTab, setActiveTab] = useState("subjects");

    const renderContent = () => {
        switch (activeTab) {
            case "subjects":
                return <Subjects />;
            case "levels":
                return <Levels />;
            case "folders":
                return <Folders />;
            case "documents":
                return <Documents />;
            default:
                return <Subjects />;
        }
    };

    return (
        <div className="trash-container">
            <div className="tabss">
                <button
                    className={activeTab === "subjects" ? "active" : ""}
                    onClick={() => setActiveTab("subjects")}
                >
                    Subjects
                </button>
                <button
                    className={activeTab === "levels" ? "active" : ""}
                    onClick={() => setActiveTab("levels")}
                >
                    Levels
                </button>
                <button
                    className={activeTab === "folders" ? "active" : ""}
                    onClick={() => setActiveTab("folders")}
                >
                    Folders
                </button>
                <button
                    className={activeTab === "documents" ? "active" : ""}
                    onClick={() => setActiveTab("documents")}
                >
                    Documents
                </button>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
}

function Subjects() {
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiHost}/api/trashSubjects`);
            setLoading(false);
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleRestoreClick = (subject) => {
        setSelectedSubject(subject);
        setOpenRestoreDialog(true);
    };

    const handleDeleteClick = (subject) => {
        setSelectedSubject(subject);
        setOpenDeleteDialog(true);
    };

    const handleClose = () => {
        setOpenRestoreDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleRestore = async () => {
        try {
            await axios.put(`${apiHost}/api/restoreSubject`, { id: selectedSubject.id });
            handleClose();
            fetchSubjects();
            toast.success(`Restored successfully!`);
        } catch (error) {
            console.error('Error restoring subject:', error);
            toast.error(`Failed to restore!`);
        }
    };

    const handleDelete = async () => {
        console.log(selectedSubject.id)
        try {
            await axios.put(`${apiHost}/api/subjectDelete`, { id: selectedSubject.id });
            handleClose();
            fetchSubjects();
            toast.success(`Deleted successfully!`);
        } catch (error) {
            console.error('Error deleting subject:', error);
            toast.error(`Failed to delete!`);
        }
    };


    return (
        <div>
            <ToastContainer />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="flex">
                    {subjects.map(subject => (
                        <div className="trash-box" key={subject.id}>
                            <b>
                                <p>{subject.name}</p>
                            </b>
                            <hr style={{ width: "100%" }} />
                            <div className="trash-details">
                                <div className="counts clr1">
                                    <p>Levels :</p>
                                    <p>{subject.levelCount}</p>
                                </div>
                                <div className="counts clr2">
                                    <p>Folders :</p>
                                    <p>{subject.folderCount}</p>
                                </div>
                                <div className="counts clr3">
                                    <p>Documents :</p>
                                    <p>{subject.documentCount}</p>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className="button" onClick={() => handleRestoreClick(subject)}>
                                        <RestoreIcon sx={{
                                            padding: "2px",
                                            backgroundColor: "#ada20a56",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "#cfa002",
                                            fontSize: "20px"
                                        }} />
                                        Restore
                                    </button>
                                    <button className="button" onClick={() => handleDeleteClick(subject)}>
                                        <DeleteForeverIcon sx={{
                                            padding: "2px",
                                            backgroundColor: "rgba(255, 0, 0, 0.16)",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "red",
                                            fontSize: "20px"
                                        }} /> Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Restore Dialog */}
            <Dialog
                open={openRestoreDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Restore this subject?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to restore the subject "{selectedSubject?.name}" ?
                        {selectedSubject?.levelCount} levels, {selectedSubject?.folderCount} folders and {selectedSubject?.documentCount} documents will be restored.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleRestore}>Yes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={openDeleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete this subject?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete the subject "{selectedSubject?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
function Levels() {
    const [loading, setLoading] = useState(false);
    const [levels, setLevels] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const fetchLevels = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiHost}/api/trashLevels`);
            setLoading(false);
            setLevels(response.data);
        } catch (error) {
            console.error('Error fetching levels:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, []);

    const handleRestoreClick = (level) => {
        setSelectedLevel(level);
        setOpenRestoreDialog(true);
    };

    const handleDeleteClick = (level) => {
        setSelectedLevel(level);
        setOpenDeleteDialog(true);
    };

    const handleClose = () => {
        setOpenRestoreDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleRestore = async () => {
        console.log(selectedLevel.id)
        try {
            await axios.put(`${apiHost}/api/restoreLevel`, { id: selectedLevel.id });
            handleClose();
            fetchLevels();
            toast.success(`Restored successfully!`);
        } catch (error) {
            console.error('Error restoring level:', error);
            toast.error(`Failed to restore!`);
        }
    };

    const handleDelete = async () => {
        console.log(selectedLevel.id)
        try {
            await axios.put(`${apiHost}/api/levelDelete`, { id: selectedLevel.id });
            handleClose();
            fetchLevels();
            toast.success(`Deleted successfully!`);
        } catch (error) {
            console.error('Error deleting level:', error);
            toast.error(`Failed to delete!`);
        }
    };

    return (
        <div>
            <ToastContainer />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="flex">
                    {levels.map(level => (
                        <div className="trash-box">
                            <b>
                                <p key={level.id}>{level.lvl_name}</p>
                            </b>
                            <hr style={{ width: "100%" }} />
                            <div className="trash-details">
                                <div className="counts clr1">
                                    <p>Folders : </p>
                                    <p>{level.folderCount}</p>
                                </div>
                                <div className="counts clr2">
                                    <p>documents :</p>
                                    <p>{level.documentCount}</p>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className="button" onClick={() => handleRestoreClick(level)}>
                                        <RestoreIcon sx={{
                                            padding: "2px",
                                            backgroundColor: "#ada20a56",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "#cfa002",
                                            fontSize: "20px"
                                        }} />
                                        Restore
                                    </button>
                                    <button className="button" onClick={() => handleDeleteClick(level)}>
                                        <DeleteForeverIcon sx={{
                                            padding: "2px",
                                            backgroundColor: "rgba(255, 0, 0, 0.16)",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "red",
                                            fontSize: "20px"
                                        }} /> Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Dialog
                open={openRestoreDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Restore this subject?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to restore the level "{selectedLevel?.lvl_name}" ?
                        {selectedLevel?.levelCount} levels, {selectedLevel?.folderCount} folders and {selectedLevel?.documentCount} documents will be restored.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleRestore}>Yes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={openDeleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"⚠️Delete this subject?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete the level "{selectedLevel?.lvl_name}" permanently? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function Folders() {
    const [loading, setLoading] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openRestoreDialog, setOpenRestoreDialog] = useState(false);



    const fetchFolders = async () => {

        setLoading(true);
        try {
            const response = await axios.get(`${apiHost}/api/trashFolders`);
            setLoading(false);
            setFolders(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching folders:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    const handleRestoreClick = (folder) => {
        setSelectedFolder(folder);
        setOpenRestoreDialog(true);
    };

    const handleDeleteClick = (folder) => {
        setSelectedFolder(folder);
        setOpenDeleteDialog(true);
    };

    const handleClose = () => {
        setOpenRestoreDialog(false);
        setOpenDeleteDialog(false);
    };


    const handleRestore = async () => {
        console.log(selectedFolder.id)
        try {
            await axios.put(`${apiHost}/api/restoreFolder`, { id: selectedFolder.id });
            handleClose();
            fetchFolders();
            toast.success(`Restored successfully!`);
        } catch (error) {
            console.error('Error restoring folder:', error);
            toast.error(`Failed to restore!`);
        }
    };

    const handleDelete = async () => {
        console.log(selectedFolder.id)
        try {
            await axios.put(`${apiHost}/api/folderDelete`, { id: selectedFolder.id });
            handleClose();
            fetchFolders();
            toast.success(`Deleted successfully!`);
        } catch (error) {
            console.error('Error deleting folder:', error);
            toast.error(`Failed to delete!`);
        }
    };



    return (
        <div>
            <ToastContainer />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="flex">
                    {folders.map(folder => (
                        <div className="trash-box">
                            <b>
                                <p key={folder.id}>Day{folder.s_day} - Day{folder.e_day}</p>
                            </b>
                            <hr style={{ width: "100%" }} />
                            <div className="trash-details">
                                <div className="counts clr1">
                                    <p>Folders : </p>
                                    <p>{folder.documentCount}</p>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className="button" onClick={() => handleRestoreClick(folder)}>
                                        <RestoreIcon sx={{
                                            padding: "2px",
                                            backgroundColor: "#ada20a56",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "#cfa002",
                                            fontSize: "20px"
                                        }} />
                                        Restore
                                    </button>
                                    <button className="button" onClick={() => handleDeleteClick(folder)}>
                                        <DeleteForeverIcon sx={{
                                            padding: "2px",
                                            backgroundColor: "rgba(255, 0, 0, 0.16)",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "red",
                                            fontSize: "20px"
                                        }} /> Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Dialog
                open={openRestoreDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Restore this subject?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to restore this folder ?
                        {selectedFolder?.documentCount} documents will be restored.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleRestore}>Yes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={openDeleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"⚠️Delete this subject?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to delete this folder permanently? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function Documents() {
    const [loading, setLoading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openRestoreDialog, setOpenRestoreDialog] = useState(false);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiHost}/api/trashDocuments`);
            setLoading(false);
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleRestoreClick = (document) => {
        setSelectedDocument(document);
        setOpenRestoreDialog(true);
    };

    const handleDeleteClick = (document) => {
        setSelectedDocument(document);
        setOpenDeleteDialog(true);
    };

    const handleClose = () => {
        setOpenRestoreDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleRestore = async () => {
        console.log(selectedDocument.id)
        try {
            await axios.put(`${apiHost}/api/restoreDocument`, { id: selectedDocument.id });
            handleClose();
            fetchDocuments();
            toast.success(`Restored successfully!`);
        } catch (error) {
            console.error('Error restoring document:', error);
            toast.error(`Failed to restore!`);
        }
    };

    const handleDelete = async () => {
        console.log(selectedDocument.id)
        try {
            await axios.put(`${apiHost}/api/documentDelete`, { id: selectedDocument.id });
            handleClose();
            fetchDocuments();
            toast.success(`Deleted successfully!`);
        } catch (error) {
            console.error('Error deleting document:', error);
            toast.error(`Failed to delete!`);
        }
    };


    return (
        <div>
            <ToastContainer />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="flex">
                    {/* {documents.map(document => (
                        <div className="trash-box">
                            <p key={document.id}>{document.file_name}</p>
                        </div>
                    ))} */}

                    {documents.map((document, index) => (
                        <div className="trash-box">
                            <div key={index} className='trash-document-item' style={{ flex: "1" }}>
                                {document.pdf && <div className='flex-align'>
                                    <img src={pdf_img} alt="PDF" className="document-icon" />
                                    <a href={`${apiHost}${document.pdf}`} target="_blank" rel="noopener noreferrer"> {document.file_name}</a>
                                </div>}
                                {document.video && <div className='flex-align'><img src={video_img} alt="PDF" className="document-icon" /><a href={`${apiHost}${document.video}`} target="_blank" rel="noopener noreferrer"> {document.file_name}</a></div>}
                                {document.link && <div className='flex-align'><img src={link_img} alt="PDF" className="document-icon" /><a href={document.link} target="_blank" rel="noopener noreferrer"> {document.link}</a></div>}
                                {document.general_doc && (
                                    <div className='flex-align'>
                                        <img src={general_doc_img} alt="General Document" className="document-icon" />
                                        <a href={`${apiHost}${document.general_doc}`} target="_blank" rel="noopener noreferrer">
                                            {document.file_name}
                                        </a>
                                    </div>
                                )}

                            </div>
                            <hr style={{ width: "100%" }} />
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <button className="button" onClick={() => handleRestoreClick(document)}>
                                    <RestoreIcon sx={{
                                        padding: "2px",
                                        backgroundColor: "#ada20a56",
                                        borderRadius: "5px",
                                        marginRight: "5px",
                                        color: "#cfa002",
                                        fontSize: "20px"
                                    }} />
                                    Restore
                                </button>
                                <button className="button" onClick={() => handleDeleteClick(document)}>
                                    <DeleteForeverIcon sx={{
                                        padding: "2px",
                                        backgroundColor: "rgba(255, 0, 0, 0.16)",
                                        borderRadius: "5px",
                                        marginRight: "5px",
                                        color: "red",
                                        fontSize: "20px"
                                    }} /> Delete</button>
                            </div>
                        </div>
                    ))
                    }
                    <Dialog
                        open={openRestoreDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>{"Restore this subject?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Are you sure you want to restore this file ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleRestore}>Yes</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog
                        open={openDeleteDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>{"⚠️Delete this subject?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Are you sure you want to delete this file permanently? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleDelete}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </div>
    );
}

export default Trash;
