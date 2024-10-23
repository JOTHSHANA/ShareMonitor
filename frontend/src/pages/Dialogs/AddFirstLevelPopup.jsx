// AddLevelPopup.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Button } from '@mui/material';

const AddFirstLevelPopup = ({ open, onClose, onCreate, newLevel, setNewLevel }) => {
    return (
        <Dialog
            open={open}
            fullWidth={true}
            onClose={onClose}
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
                Add New Level
            </DialogTitle>
            <DialogContent
                sx={{
                    backgroundColor: "var(--background-1)",
                    color: "var(--text)"
                }}
            >
                <DialogContentText sx={{ color: "var(--text)" }}>
                    Enter the name of the new level.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="level-number"
                    label="Level Number"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={1}
                    disabled
                    InputProps={{
                        style: { color: "var(--text)" },
                        disableUnderline: false,
                        sx: {
                            "&:before": { borderBottomColor: "#179be7", borderBottomWidth: "1px" },
                            "&:after": { borderBottomColor: "#179be7", borderBottomWidth: "1px" },
                        }
                    }}
                    InputLabelProps={{ style: { color: "#179be7" } }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="level-name"
                    label="Level Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    InputProps={{
                        style: { color: "var(--text)" },
                        disableUnderline: false,
                        sx: {
                            "&:before": { borderBottomColor: "#179be7", borderBottomWidth: "2px" },
                            "&:after": { borderBottomColor: "#179be7", borderBottomWidth: "2px" }
                        }
                    }}
                    InputLabelProps={{ style: { color: "#179be7" } }}
                />
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                <Button onClick={onClose} sx={{ color: "#179be7" }}>
                    Cancel
                </Button>
                <Button onClick={onCreate} sx={{ color: "#179be7" }}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFirstLevelPopup;
