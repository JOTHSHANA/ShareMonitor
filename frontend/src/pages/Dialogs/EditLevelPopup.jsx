// EditLevelPopup.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EditLevelPopup = ({ open, onClose, onSave, editLevel, setEditLevel }) => {
    return (
        <Dialog 
            open={open} 
            fullWidth={true} 
            onClose={onClose}
            sx={{
                "& .MuiDialog-paper": {
                    backgroundColor: "var(--background-1)",
                    color: "var(--text)",
                },
            }}
        >
            <DialogTitle 
                sx={{
                    backgroundColor: "var(--background-1)",
                    color: "var(--text)",
                    fontWeight: "bold",
                    borderBottom: "1px solid var(--border-color)", 
                    marginBottom: "10px"
                }}
            >
                Edit Level Name
            </DialogTitle>
            <DialogContent 
                sx={{
                    backgroundColor: "var(--background-1)",
                    color: "var(--text)",
                }}
            >
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
                    InputProps={{
                        style: { color: "var(--text)" },
                        disableUnderline: false,
                        sx: {
                            "&:before": {
                                borderBottomColor: "#179be7",
                                borderBottomWidth: "2px",
                            },
                            "&:after": {
                                borderBottomColor: "#179be7",
                                borderBottomWidth: "2px",
                            },
                        },
                    }}
                    InputLabelProps={{
                        style: { color: "#179be7" },
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "var(--background-1)" }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: "#179be7",
                        "&:hover": {
                            backgroundColor: "rgba(68, 107, 212, 0.1)",
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSave}
                    sx={{
                        color: "#179be7",
                        "&:hover": {
                            backgroundColor: "rgba(68, 107, 212, 0.1)",
                        },
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditLevelPopup;
