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
import './styles.css'; // Import the CSS file

function Subjects() {
    return <Layout rId={2} body={<Body />} />;
}

function Body() {
    const [showPopup, setShowPopup] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`${apiHost}/api/subjects`);
            setSubjects(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleAddClick = () => {
        setShowPopup(true);
    };

    const handleClose = () => {
        setShowPopup(false);
    };

    const handleCreateSubject = async () => {
        if (newSubject.trim() !== "") {
            try {
                const response = await axios.post(`${apiHost}/api/subjects`, { name: newSubject });
                setSubjects([...subjects, response.data]);
                setNewSubject("");
                setShowPopup(false);
            } catch (error) {
                console.error('Error creating subject:', error);
            }
        }
    };

    const handleSubjectClick = (id, name) => {
        console.log(name, id)
        navigate(`/levels/${id}/${name}`); 
    };

    return (
        <>
            <div style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <p className='subject-name'>SUBJECTS</p>
                <button className="add-button" onClick={handleAddClick}>
                    <AddIcon />Add Subject
                </button>
            </div>
            <div className="container">
                {subjects.map((subject, index) => (
                    <div 
                        key={index} 
                        className="card"
                        onClick={() => handleSubjectClick(subject.id, subject.name)}
                    >
                        {subject.name}
                    </div>
                ))}
                <Dialog open={showPopup} onClose={handleClose}>
                    <DialogTitle sx={{width:"400px"}}>Enter Subject Name</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Subject Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleCreateSubject}>Create Subject</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}

export default Subjects;