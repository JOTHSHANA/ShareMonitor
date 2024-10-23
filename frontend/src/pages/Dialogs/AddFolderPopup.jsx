// AddFolderPopup.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const AddFolderPopup = ({
    open,
    onClose,
    startDay,
    handleDayChange,
    missingDays,
    handleCreateFolder
}) => {
    return (
        <Dialog
            open={open}
            fullWidth={true}
            onClose={onClose}
            sx={{
                "& .MuiDialog-paper": {
                    backgroundColor: "var(--background-1)",
                    color: "var(--text)",
                    borderRadius: "8px",
                    width: "100%"
                }
            }}
        >
            <DialogTitle
                sx={{
                    backgroundColor: "var(--background-2)",
                    color: "var(--text)",
                    borderBottom: "1px solid var(--border-color)",
                    marginBottom: "10px"
                }}
            >
                Add Folder
            </DialogTitle>
            <DialogContent
                sx={{
                    backgroundColor: "var(--background-1)",
                    color: "var(--text)"
                }}
            >
                <select
                    className="missing-day-select"
                    value={startDay || ""}
                    onChange={handleDayChange}
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #179be7',
                        backgroundColor: 'var(--input-background)',
                        color: 'var(--text)'
                    }}
                >
                    <option value="">Select a missing day</option>
                    {missingDays.map(day => (
                        <option key={day} value={day}>
                            Day {day}
                        </option>
                    ))}
                </select>
            </DialogContent>
            <DialogActions
                sx={{
                    backgroundColor: "var(--background-2)"
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        color: "#179be7"
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleCreateFolder}
                    sx={{
                        color: "#179be7"
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFolderPopup;
