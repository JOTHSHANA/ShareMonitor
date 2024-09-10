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
import empty_folder from '../assets/empty_folder.png'
import empty_subjects from '../assets/empty_subjects.png'
import empty_levels from '../assets/empty_levels.png'
import empty_doc from '../assets/empty_doc.png'
import general_doc_img from '../assets/general_doc_img.png';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const secretKey = "your-secret-key";

const Encryptedrole = Cookies.get("role");
console.log("Encryptedrole:", Encryptedrole); // Log the encrypted role
if (!Encryptedrole) {
  console.error("No encrypted role found in cookies");
} else {
  const bytes = CryptoJS.AES.decrypt(Encryptedrole, secretKey);
  const role = bytes.toString(CryptoJS.enc.Utf8);
  console.log("Decrypted role:", role);
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Trash() {
    return<Body />;
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
    const [subjectClick, setSubjectClick] = useState(null)
    const navigate = useNavigate()
    const [role, setRole] = useState(null); // Add role as a state

    // Fetch role when the component mounts
    useEffect(() => {
        const EncryptedRole = Cookies.get("role");
        const bytes = CryptoJS.AES.decrypt(EncryptedRole, "your-secret-key");
        const userRole = bytes.toString(CryptoJS.enc.Utf8);
        setRole(userRole); // Set role in state
    }, []);

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
        if (role !== "1") {
            toast.warning("Only admin can delete");
        } else {
            setSelectedSubject(subject);
            setOpenDeleteDialog(true);
        }
    };

    const handleClose = () => {
        setOpenRestoreDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSubClick = (subjectId, subName) => {
        navigate(`/levels/${subjectId}/${subName}`)
    }

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
                <div style={{ height: "80vh", width: "88vw", display: "flex", alignItems: "center", justifyContent: "center" }}><span class="loader"></span></div>

            ) : subjects.length === 0 ? (
                <div className="no-subjects-text" style={{ height: "80vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                        <img style={{ height: "120px" }} src={empty_subjects} alt="no subjects" />
                        <p>No Subjects in Trash</p>
                    </div>
                </div>
            ) : (
                <div className="flex">
                    {subjects.map(subject => (
                        <div className="trash-box" key={subject.id} >
                            <b style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <p> {subject.name}</p>
                                {/* <p>
                                    <button className="button" onClick={() => handleSubClick(subject.id, subject.name)}>
                                        <UnfoldMoreIcon style={{ transform: 'rotate(45deg)' }} />
                                    </button>
                                </p> */}
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
                                            backgroundColor: "var(--background-1)",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "#cfa002",
                                            fontSize: "20px"
                                        }} />
                                        Restore
                                    </button>
                                    {role === "1" && <button
                                        className="button"
                                        onClick={() => handleDeleteClick(subject)}
                                        style={{
                                            color: "var(--text)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <DeleteForeverIcon
                                            sx={{
                                                padding: "2px",
                                                backgroundColor: "var(--background-1)",
                                                borderRadius: "5px",
                                                marginRight: "5px",
                                                color: "red",
                                                fontSize: "20px",
                                            }}
                                        />
                                        Delete
                                    </button>}

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
                fullWidth={true}
                sx={{ "& .MuiDialog-paper": { backgroundColor: "var(--background-1)", color: "var(--text)" } }}
            >
                <DialogTitle sx={{ backgroundColor: "var(--background-1)", color: "var(--text)", borderBottom: "1px solid var(--border-color)", width: 'auto', marginBottom: "10px" }}>
                    Restore this subject?
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                    <DialogContentText id="alert-dialog-slide-description" sx={{ color: "var(--text)" }}>
                        Are you sure you want to restore the subject "{selectedSubject?.name}"?
                        {selectedSubject?.levelCount} levels, {selectedSubject?.folderCount} folders, and {selectedSubject?.documentCount} documents will be restored.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                    <Button onClick={handleClose} sx={{ color: "#179be7" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleRestore} sx={{ color: "#2ecc71" }}>
                        Restore
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Delete Dialog */}
            <Dialog
                open={openDeleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                sx={{ "& .MuiDialog-paper": { backgroundColor: "var(--background-1)", color: "var(--text)" } }}
            >
                <DialogTitle sx={{ backgroundColor: "var(--background-1)", color: "var(--text)", borderBottom: "1px solid var(--border-color)", width: 'auto', marginBottom: "10px" }}>
                    Delete this subject?
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                    <DialogContentText id="alert-dialog-slide-description" sx={{ color: "var(--text)" }}>
                        Are you sure you want to delete the subject "{selectedSubject?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                    <Button onClick={handleClose} sx={{ color: "#179be7" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} sx={{ color: "#d12830" }}>
                        Delete
                    </Button>
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
    const [openEmptyDialog, setOpenEmptyDialog] = useState(false); // State for the empty dialog
    const [role, setRole] = useState(null); // Add role as a state

    // Fetch role when the component mounts
    useEffect(() => {
        const EncryptedRole = Cookies.get("role");
        const bytes = CryptoJS.AES.decrypt(EncryptedRole, "your-secret-key");
        const userRole = bytes.toString(CryptoJS.enc.Utf8);
        setRole(userRole); // Set role in state
    }, []);


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
        if (role !== "1") {
            toast.warning("Only admin can delete");
        } else {
            setSelectedLevel(level);
            setOpenDeleteDialog(true);
        }
    };

    const handleClose = () => {
        setOpenRestoreDialog(false);
        setOpenDeleteDialog(false);
        setOpenEmptyDialog(false); // Close the empty dialog
    };

    const handleRestore = async () => {
        console.log(selectedLevel.id);
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
        console.log(selectedLevel.id);
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

    const handleLvlClick = async (level, work_type) => {
        console.log(level, work_type);
        setOpenEmptyDialog(true); // Open the empty dialog
    };

    return (
        <div>
            <ToastContainer />
            {loading ? (
                <div style={{ height: "80vh", width: "88vw", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="loader"></span></div>
            ) : levels.length === 0 ? (
                <div className="no-subjects-text" style={{ height: "80vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                        <img style={{ height: "120px" }} src={empty_levels} alt="" />
                        No Levels in Trash
                    </div>
                </div>
            ) : (
                <div className="flex">
                    {levels.map(level => (
                        <div className="trash-box" key={level.id}>
                            <b style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <p>{level.lvl_name}</p>
                                {/* <p>
                                    <button className="button" onClick={() => handleLvlClick(level.id, level.work_type)}>
                                        <UnfoldMoreIcon style={{ transform: 'rotate(45deg)' }} />
                                    </button>
                                </p> */}
                            </b>
                            <hr style={{ width: "100%" }} />
                            <div className="trash-details">
                                <div className="counts clr1">
                                    <p>Folders :</p>
                                    <p>{level.folderCount}</p>
                                </div>
                                <div className="counts clr2">
                                    <p>Documents :</p>
                                    <p>{level.documentCount}</p>
                                </div>
                                <div style={{ padding: "7px", backgroundColor: "var(--document)", borderRadius: "5px" }}>
                                    <p>{level.subjectName} /</p>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className="button" onClick={() => handleRestoreClick(level)}>
                                        <RestoreIcon sx={{
                                            padding: "2px",
                                            backgroundColor: "var(--background-1)",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "#cfa002",
                                            fontSize: "20px"
                                        }} />
                                        Restore
                                    </button>
                                    {role === "1" && <button
                                        className="button"
                                        onClick={() => handleDeleteClick(level)}
                                        style={{
                                            color: "var(--text)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <DeleteForeverIcon
                                            sx={{
                                                padding: "2px",
                                                backgroundColor: "var(--background-1)",
                                                borderRadius: "5px",
                                                marginRight: "5px",
                                                color: "red",
                                                fontSize: "20px",
                                            }}
                                        />
                                        Delete
                                    </button>}
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
                fullWidth={true}
                sx={{ "& .MuiDialog-paper": { backgroundColor: "var(--background-1)", color: "var(--text)" } }}
            >
                <DialogTitle sx={{ backgroundColor: "var(--background-1)", color: "var(--text)", borderBottom: "1px solid var(--border-color)", width: 'auto', marginBottom: "10px" }}>
                    Restore this level?
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                    <DialogContentText id="alert-dialog-slide-description" sx={{ color: "var(--text)" }}>
                        Are you sure you want to restore the level "{selectedLevel?.lvl_name}"? {selectedLevel?.folderCount} folders and {selectedLevel?.documentCount} documents will be restored.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                    <Button onClick={handleClose} sx={{ color: "#179be7" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleRestore} sx={{ color: "#2ecc71" }}>
                        Restore
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={openDeleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                sx={{ "& .MuiDialog-paper": { backgroundColor: "var(--background-1)", color: "var(--text)" } }}
            >
                <DialogTitle sx={{ backgroundColor: "var(--background-1)", color: "var(--text)", borderBottom: "1px solid var(--border-color)", width: 'auto', marginBottom: "10px" }}>
                    ⚠️ Delete this level?
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                    <DialogContentText id="alert-dialog-slide-description" sx={{ color: "var(--text)" }}>
                        Are you sure you want to delete the level "{selectedLevel?.lvl_name}" permanently? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                    <Button onClick={handleClose} sx={{ color: "#179be7" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} sx={{ color: "#d12830" }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Empty Dialog */}
            {/* <Dialog
                open={openEmptyDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Empty Popup"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog> */}
        </div>
    );
}
function Folders() {
    const [loading, setLoading] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
    const [role, setRole] = useState(null); // Add role as a state

    // Fetch role when the component mounts
    useEffect(() => {
        const EncryptedRole = Cookies.get("role");
        const bytes = CryptoJS.AES.decrypt(EncryptedRole, "your-secret-key");
        const userRole = bytes.toString(CryptoJS.enc.Utf8);
        setRole(userRole); // Set role in state
    }, []);



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
        if (role !== "1") {
            toast.warning("Only admin can delete");
        } else {
            setSelectedFolder(folder);
            setOpenDeleteDialog(true);
        }
    };

    const handleClose = () => {
        setOpenRestoreDialog(false);
        setOpenDeleteDialog(false);
    };


    const handleRestore = async () => {
        console.log(selectedFolder.folder)
        try {
            await axios.put(`${apiHost}/api/restoreFolder`, { id: selectedFolder.folder });
            handleClose();
            fetchFolders();
            toast.success(`Restored successfully!`);
        } catch (error) {
            console.error('Error restoring folder:', error);
            toast.error(`Failed to restore!`);
        }
    };

    const handleDelete = async () => {
        console.log(selectedFolder.folder)
        try {
            await axios.put(`${apiHost}/api/folderDelete`, { id: selectedFolder.folder });
            handleClose();
            fetchFolders();
            toast.success(`Deleted successfully!`);
        } catch (error) {
            console.error('Error deleting folder:', error);
            toast.error(`Failed to delete!`);
        }
    };


    const handleCopyText = (event) => {
        // Get the text content of the div
        const textToCopy = event.currentTarget.innerText;

        // Create a temporary textarea element to hold the text
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);

        // Select the text and copy it to the clipboard
        textarea.select();
        document.execCommand('copy');

        // Remove the temporary textarea element
        document.body.removeChild(textarea);

        // Optionally provide feedback to the user
        alert('Text copied to clipboard!');
    };

    return (
        <div>
            <ToastContainer />
            {loading ? (
                <div style={{ height: "80vh", width: "88vw", display: "flex", alignItems: "center", justifyContent: "center" }}><span class="loader"></span></div>

            ) : folders.length === 0 ? (
                <div className="no-subjects-text" style={{ height: "80vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                        <img style={{ height: "120px" }} src={empty_folder} alt="No Folders" />
                        <p>No folders in Trash</p>
                    </div>
                </div>
            ) : (
                <div className="flex">
                    {folders.map(folder => (
                        <div className="trash-box">
                            <b>
                                <p key={folder.id} style={{ margin: 0 }}>
                                    {folder.s_day === folder.e_day
                                        ? `Day ${folder.s_day}`
                                        : `Day ${folder.s_day} - Day ${folder.e_day}`}
                                </p>
                            </b>

                            <hr style={{ width: "100%" }} />
                            <div className="trash-details">
                                <div className="counts clr1">
                                    <p>Documents : </p>
                                    <p>{folder.documentCount}</p>
                                </div>

                                <div
                                    style={{
                                        padding: "7px",
                                        backgroundColor: "var(--document)",
                                        borderRadius: "5px",
                                        maxWidth: "100%",
                                        overflowX: "auto",
                                        whiteSpace: "nowrap",
                                        cursor: "pointer" // Optional: Change the cursor to indicate clickable content
                                    }}
                                    onClick={handleCopyText}
                                >
                                    <p style={{ margin: 0 }}>
                                        {folder.subject_name} / {folder.level_name} / {folder.workTypeName} /
                                    </p>
                                </div>


                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className="button" onClick={() => handleRestoreClick(folder)}>
                                        <RestoreIcon sx={{
                                            padding: "2px",
                                            backgroundColor: "var(--background-1)",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "#cfa002",
                                            fontSize: "20px"
                                        }} />
                                        Restore
                                    </button>

                                    {role === "1" && <button
                                        className="button"
                                        onClick={() => handleDeleteClick(folder)}
                                        style={{
                                            color: "var(--text)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <DeleteForeverIcon
                                            sx={{
                                                padding: "2px",
                                                backgroundColor: "var(--background-1)",
                                                borderRadius: "5px",
                                                marginRight: "5px",
                                                color: "red",
                                                fontSize: "20px",
                                            }}
                                        />
                                        Delete
                                    </button>}

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
                fullWidth={true}
                sx={{ "& .MuiDialog-paper": { backgroundColor: "var(--background-1)", color: "var(--text)" } }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "var(--background-1)",
                        color: "var(--text)",
                        borderBottom: "1px solid var(--border-color)",
                        width: 'auto',
                        marginBottom: "10px"
                    }}
                >
                    Restore this folder?
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                    <DialogContentText id="alert-dialog-slide-description" sx={{ color: "var(--text)" }}>
                        Are you sure you want to restore this folder? <br />
                        {selectedFolder?.documentCount} documents will be restored.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                    <Button onClick={handleClose} sx={{ color: "#179be7" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleRestore} sx={{ color: "#2ecc71" }}>
                        Restore
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Delete Dialog */}
            <Dialog
                open={openDeleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                fullWidth={true}
                sx={{ "& .MuiDialog-paper": { backgroundColor: "var(--background-1)", color: "var(--text)" } }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "var(--background-1)",
                        color: "var(--text)",
                        borderBottom: "1px solid var(--border-color)",
                        width: 'auto',
                        marginBottom: "10px"
                    }}
                >
                    ⚠️ Delete this folder?
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                    <DialogContentText id="alert-dialog-slide-description" sx={{ color: "var(--text)" }}>
                        Are you sure you want to delete this folder permanently? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                    <Button onClick={handleClose} sx={{ color: "#179be7" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} sx={{ color: "#e74c3c" }}>
                        Delete
                    </Button>
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
    const [role, setRole] = useState(null); // Add role as a state

    // Fetch role when the component mounts
    useEffect(() => {
        const EncryptedRole = Cookies.get("role");
        const bytes = CryptoJS.AES.decrypt(EncryptedRole, "your-secret-key");
        const userRole = bytes.toString(CryptoJS.enc.Utf8);
        setRole(userRole); // Set role in state
    }, []);


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
        if (role !== "1") {
            toast.warning("Only admin can delete");
        } else {
            setSelectedDocument(document);
            setOpenDeleteDialog(true);
        }
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

    const handleCopyText = (event) => {
        // Get the text content of the div
        const textToCopy = event.currentTarget.innerText;

        // Create a temporary textarea element to hold the text
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);

        // Select the text and copy it to the clipboard
        textarea.select();
        document.execCommand('copy');

        // Remove the temporary textarea element
        document.body.removeChild(textarea);

        // Optionally provide feedback to the user
        alert('Text copied to clipboard!');
    };


    return (
        <div>
            <ToastContainer />
            {loading ? (
                <div style={{ height: "80vh", width: "88vw", display: "flex", alignItems: "center", justifyContent: "center" }}><span class="loader"></span></div>

            ) : documents.length === 0 ? (
                <div className="no-subjects-text" style={{ height: "80vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                        <img style={{ height: "120px" }} src={empty_doc} alt="" />
                        <div>No Documents in trash</div>
                    </div>
                </div>
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
                            <div
                                style={{
                                    padding: "7px",
                                    backgroundColor: "var(--document)",
                                    borderRadius: "5px",
                                    maxWidth: "100%",
                                    overflowX: "auto",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer" // Optional: Change the cursor to indicate clickable content
                                }}
                                onClick={handleCopyText}
                            >
                                <p style={{ margin: 0 }}>
                                    {document.subjectName}/Level {document.level}/{document.workTypeName}/
                                    {document.s_day === document.e_day
                                        ? `Day ${document.s_day}`
                                        : `Day ${document.s_day} - Day ${document.e_day}`}
                                </p>
                            </div>


                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "5px" }}>
                                <button className="button" onClick={() => handleRestoreClick(document)}>
                                    <RestoreIcon sx={{
                                        padding: "2px",
                                        backgroundColor: "var(--background-1)",
                                        borderRadius: "5px",
                                        marginRight: "5px",
                                        color: "#cfa002",
                                        fontSize: "20px"
                                    }} />
                                    Restore
                                </button>
                                {role === "1" && <button
                                    className="button"
                                    onClick={() => handleDeleteClick(document)}
                                    style={{
                                        color: "var(--text)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <DeleteForeverIcon
                                        sx={{
                                            padding: "2px",
                                            backgroundColor: "var(--background-1)",
                                            borderRadius: "5px",
                                            marginRight: "5px",
                                            color: "red",
                                            fontSize: "20px",
                                        }}
                                    />
                                    Delete
                                </button>}
                            </div>
                        </div>
                    ))
                    }
                    <Dialog
                        open={openRestoreDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        fullWidth={true}
                        sx={{ "& .MuiDialog-paper": { backgroundColor: "var(--background-1)", color: "var(--text)" } }}
                    >
                        <DialogTitle
                            sx={{
                                backgroundColor: "var(--background-1)",
                                color: "var(--text)",
                                borderBottom: "1px solid var(--border-color)",
                                width: 'auto',
                                marginBottom: "10px"
                            }}
                        >
                            Restore this file?
                        </DialogTitle>
                        <DialogContent sx={{ backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                            <DialogContentText id="alert-dialog-slide-description" sx={{ color: "var(--text)" }}>
                                Are you sure you want to restore this file?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                            <Button onClick={handleClose} sx={{ color: "#179be7" }}>
                                Cancel
                            </Button>
                            <Button onClick={handleRestore} sx={{ color: "#2ecc71" }}>
                                Restore
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog
                        open={openDeleteDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        fullWidth={true}
                        sx={{ "& .MuiDialog-paper": { backgroundColor: "var(--background-1)", color: "var(--text)" } }}
                    >
                        <DialogTitle
                            sx={{
                                backgroundColor: "var(--background-1)",
                                color: "var(--text)",
                                borderBottom: "1px solid var(--border-color)",
                                width: 'auto',
                                marginBottom: "10px"
                            }}
                        >
                            ⚠️ Delete this file?
                        </DialogTitle>
                        <DialogContent sx={{ backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                            <DialogContentText id="alert-dialog-slide-description" sx={{ color: "var(--text)" }}>
                                Are you sure you want to delete this file permanently? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                            <Button onClick={handleClose} sx={{ color: "#179be7" }}>
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} sx={{ color: "#d12830" }}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>
            )}
        </div>
    );
}

export default Trash;
