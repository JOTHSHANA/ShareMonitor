import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';

const DocumentPopup = ({
    showDocumentPopup,
    handleDocumentPopupClose,
    documentType,
    handleDocumentTypeChange,
    handleFileChange,
    handleLinkChange,
    link,
    handleFormSubmit
}) => {
    return (
        <Dialog
            open={showDocumentPopup}
            onClose={handleDocumentPopupClose}
            fullWidth
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
                Add New Document
            </DialogTitle>
            <DialogContent
                sx={{
                    backgroundColor: "var(--background-1)",
                    color: "var(--text)"
                }}
            >
                <DialogContentText
                    sx={{
                        color: "var(--text)"
                    }}
                ></DialogContentText>
                <form onSubmit={handleFormSubmit}>
                    <div
                        className="document-type-select"
                        style={{
                            marginBottom: '5px',
                        }}
                    >
                        <label htmlFor="documentType">Select Document Type:</label>
                        <select
                            id="documentType"
                            className="missing-day-select"
                            value={documentType}
                            onChange={handleDocumentTypeChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #179be7',
                                backgroundColor: 'var(--input-background)',
                                color: 'var(--text)'
                            }}
                        >
                            <option value="" disabled>Select the type of document</option>
                            <option value="pdf">PDF</option>
                            <option value="link">Link</option>
                            <option value="video">Video</option>
                            <option value="general">General Document</option>
                        </select>
                    </div>

                    {documentType === "pdf" && (
                        <label htmlFor="images" className="drop-container" id="dropcontainer">
                            <span className="drop-title">Drop files here</span>
                            <p>or</p>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf"
                                style={{
                                    marginBottom: '16px',
                                    width: '98%',
                                }}
                            />
                        </label>
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
                            sx={{
                                marginBottom: '16px',
                                "& .MuiInputBase-input": {
                                    color: "var(--text)"
                                },
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: "#179be7"
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: "#179be7"
                                }
                            }}
                            InputLabelProps={{ style: { color: "#179be7" } }}
                        />
                    )}

                    {documentType === "video" && (
                        <label htmlFor="images" className="drop-container" id="dropcontainer">
                            <span className="drop-title">Drop files here</span>
                            <p>or</p>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="video/*"
                                style={{
                                    marginBottom: '16px',
                                    width: '98%',
                                }}
                            />
                        </label>
                    )}

                    {documentType === "general" && (
                        <label htmlFor="images" className="drop-container" id="dropcontainer">
                            <span className="drop-title">Drop files here</span>
                            <p>or</p>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{
                                    marginBottom: '16px',
                                    width: '100%',
                                }}
                            />
                        </label>
                    )}

                    <DialogActions
                        sx={{
                            backgroundColor: "var(--background-2)"
                        }}
                    >
                        <Button
                            onClick={handleDocumentPopupClose}
                            sx={{
                                color: "#179be7"
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            sx={{
                                color: "#179be7"
                            }}
                        >
                            Upload
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentPopup;
