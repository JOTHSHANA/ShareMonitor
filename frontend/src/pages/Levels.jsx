import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from "../components/appLayout/Layout";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import apiHost from "../components/utils/api";
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
    const [activeTab, setActiveTab] = useState("Class Works"); // Default active tab

    useEffect(() => {
        fetchLevels();
    }, [subjectId, subjectName]);

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

    const handleLevelClick = (level) => {
        setSelectedLevel(level);
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
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
                        <div key={index} className="card1" onClick={() => handleLevelClick(level)}>
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
                            {["Class Works", "Home Works", "Others", "View All"].map((tab) => (
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
                        <div></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Levels;
