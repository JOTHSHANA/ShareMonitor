// ShareDocumentPopup.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const ShareDocumentPopup = ({ open, onClose, email, setEmail, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Share Document</DialogTitle>
            <DialogContent>
                <TextField
                    label="Recipient Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSubmit}>Share</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareDocumentPopup;
