import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios';
import Layout from "../components/appLayout/Layout";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import apiHost from "../components/utils/api";
import AddIcon from '@mui/icons-material/Add';
import CreateSharpIcon from '@mui/icons-material/CreateSharp';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Skeleton from '@mui/material/Skeleton';
import subjects_image from '../assets/subjects.png'
import Stack from '@mui/material/Stack';
import Cookies from 'js-cookie';
import CryptoJS from "crypto-js";
import './styles.css';
import requestApi from "../components/utils/axios";

const secretKey = "your-secret-key";

function Subjects() {
    return <Body />
}

function Body() {
    const [showPopup, setShowPopup] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState("");
    const [editSubjectId, setEditSubjectId] = useState(null);
    const [editSubjectName, setEditSubjectName] = useState("");
    const [showEditDelete, setShowEditDelete] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const response = await requestApi("GET",`/api/subjects`);
            setSubjects(response.data);
            console.log(response.data);
            setTimeout(() => {
                setSubjects(response.data);
                setLoading(false); // Stop loading after 2 seconds
            }, 1);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setNewSubject("");
        setEditSubjectId(null);
        setShowPopup(true);
    };

    const handleClose = () => {
        setShowPopup(false);
    };

    const handleCreateSubject = async () => {
        if (newSubject.trim() !== "") {
            // Capitalize the first letter of the new subject's name
            const formattedSubject = newSubject.charAt(0).toUpperCase() + newSubject.slice(1);

            try {
                if (editSubjectId) {
                    // Update existing subject
                    await requestApi("PUT", `/api/subjects/${editSubjectId}`, { newName: formattedSubject });
                    setSubjects(subjects.map(subject =>
                        subject.id === editSubjectId ? { ...subject, name: formattedSubject } : subject
                    ));
                } else {
                    // Create new subject
                    const response = await requestApi("POST", `/api/subjects`, { name: formattedSubject });
                    setSubjects([...subjects, response.data]);
                }
                setNewSubject("");
                setShowPopup(false);
                handleShowEditDelete();
            } catch (error) {
                console.error('Error saving subject:', error);
            }
        }

    };
    const getDecryptedCookie = (cookieName) => {
        const encryptedCookie = Cookies.get(cookieName);
        if (encryptedCookie) {
            const bytes = CryptoJS.AES.decrypt(encryptedCookie, secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        return null;
    };


    const secretKey = "your-secret-key";

    const handleSubjectClick = (id, name) => {
        console.log(name, id);
        Cookies.set('subId', id, { expires: 1 });
        Cookies.set('subName', name, { expires: 1 });

        const encryptedRoutes = Cookies.get('allowedRoutes');
        if (encryptedRoutes) {
            const decryptedRoutes = JSON.parse(CryptoJS.AES.decrypt(encryptedRoutes, secretKey).toString(CryptoJS.enc.Utf8));

            const updatedRoutes = decryptedRoutes.map(route => {
                if (route.includes('/materials/levels')) {
                    return `/materials/levels/${id}/${name}`;
                }
                return route;
            });

            // console.log("Updated routes:", updatedRoutes);

            const encryptedUpdatedRoutes = CryptoJS.AES.encrypt(JSON.stringify(updatedRoutes), secretKey).toString();
            Cookies.set('allowedRoutes', encryptedUpdatedRoutes, { expires: 1 });
        }

        navigate(`/materials/levels/${id}/${name}`);
    };


    const handleEdit = (subjectId, subjectName) => {
        setEditSubjectId(subjectId);
        setNewSubject(subjectName);
        setShowPopup(true);
    };

    const handleDelete = async (subjectId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this subject? You will loose all the levels and documents inside it!!");
        handleShowEditDelete();
        if (confirmDelete) {
            try {
                await requestApi("DELETE", `/api/subjects/${subjectId}`);
                setSubjects(subjects.filter(subject => subject.id !== subjectId));
            } catch (error) {
                console.error('Error deleting subject:', error);
            }
        }
    };


    const handleShowEditDelete = () => {
        setShowEditDelete(prevState => !prevState);
    };

    return (
        <>
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className='subject-name'>SUBJECTS</p>
                <div style={{ display: "flex" }}>
                    <button className="add-button" onClick={handleShowEditDelete}>
                        <AutoFixHighIcon sx={{ marginRight: "5px", fontSize: "20px" }} />Modify
                    </button>
                    <button className="add-button" onClick={handleAddClick}>
                        <AddIcon />Add Subject
                    </button>
                </div>
            </div>
            <div className="container">
                {loading ? (
                    <div style={{ height: "80vh", width: "88vw", display: "flex", alignItems: "center", justifyContent: "center" }}><span class="loader"></span></div>
                ) : subjects.length === 0 ? (
                    <div className="no-subjects-text" style={{ height: "80vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <img style={{ height: "160px" }} src={subjects_image} alt="" />
                        <p style={{ fontWeight: "600" }}>No Subjects Added</p>
                        <button className="add-button" onClick={handleAddClick}>
                            <AddIcon />Add Subject
                        </button>
                    </div>

                ) : (
                    subjects.map((subject, index) => {
                        const colors = ["#c7566b", "#1b6b5f", "#2b4257", "orange", "#2b4257", "#0079c5"];

                        const getColorByIndex = (index) => {
                            return colors[index % colors.length];
                        };

                        return (
                            <div
                                key={index}
                                className="card"
                                onClick={() => handleSubjectClick(subject.id, subject.name)}
                            >
                                <div
                                    className="hover-edit-delete"
                                    style={{ display: showEditDelete ? 'flex' : 'none' }}
                                >
                                    <div
                                        className="edit-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(subject.id, subject.name);
                                        }}
                                    >
                                        <CreateSharpIcon sx={{ color: "#588dc0" }} />
                                    </div>
                                    <div
                                        className="delete-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(subject.id);
                                        }}
                                    >
                                        <DeleteForeverSharpIcon sx={{ color: "#d12830" }} />
                                    </div>
                                </div>
                                <p
                                    className="level-count"
                                    style={{ backgroundColor: getColorByIndex(index) }}
                                >
                                    {subject.levelCount} Levels
                                </p>
                                <div style={{ fontSize: "17px", letterSpacing: "0.5px" }}>{subject.name}</div>
                            </div>
                        );
                    })
                )}
                <Dialog fullWidth={true} open={showPopup} onClose={handleClose} sx={{ "& .MuiDialog-paper": { backgroundColor: "var(--background-1)", color: "var(--text)" } }}>
                    <DialogTitle sx={{ backgroundColor: "var(--background-1)", color: "var(--text)", borderBottom: "1px solid var(--border-color)" }}>
                        {editSubjectId ? "Edit Subject Name" : "Enter Subject Name"}
                    </DialogTitle>
                    <DialogContent sx={{ backgroundColor: "var(--background-1)", color: "var(--text)" }}>
                        <TextField autoFocus margin="dense" id="name" label="Subject Name" type="text" fullWidth variant="standard" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} InputProps={{ style: { color: "var(--text)" }, disableUnderline: false, sx: { "&:before": { borderBottomColor: "#179be7", borderBottomWidth: "2px" }, "&:after": { borderBottomColor: "#179be7", borderBottomWidth: "2px" } } }} InputLabelProps={{ style: { color: "#179be7" } }} />
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                        <Button onClick={handleClose} sx={{ color: "#179be7" }}>
                            Cancel
                        </Button>
                        <Button onClick={() => { handleCreateSubject(); handleShowEditDelete(); }} sx={{ color: "#179be7" }}>
                            {editSubjectId ? "Update Subject" : "Create Subject"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </div >
        </>
    );
}

export default Subjects;
