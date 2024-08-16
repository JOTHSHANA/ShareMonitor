const db = require('../config/db');
const path = require('path');
const { sendEmail } = require('../emailService');

exports.getDocument = async (req, res) => {
    const { id } = req.params;
    // console.log(id);

    if (!id) {
        return res.status(400).json({ error: 'work_type and level are required' });
    }

    const query = 'SELECT * FROM documents WHERE folder = ? AND status = "1"';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching documents:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

exports.createDocument = (req, res) => {
    const { folder, link } = req.body;
    let pdfPath = null;
    let videoPath = null;
    let fileName = null;

    if (req.file) {
        fileName = req.file.originalname; // Extract the original name of the file
        if (req.body.documentType === 'pdf') {
            pdfPath = path.join('/uploads', req.file.filename);
        } else if (req.body.documentType === 'video') {
            videoPath = path.join('/uploads', req.file.filename);
        }
    }

    if (!folder) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    const query = `
        INSERT INTO documents (folder, pdf, link, video, file_name) 
        VALUES (?,?,?,?,?);
    `;

    db.query(query, [folder, pdfPath, link, videoPath, fileName], (err, result) => {
        if (err) {
            console.error('Error inserting document:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ id: result.insertId, folder, pdfPath, link, videoPath, fileName });
    });
};

exports.shareHistory = async (req, res) => {
    const { documentId, email } = req.body;

    try {
        const newShareHistory = await ShareHistory.create({
            document_id: documentId,
            email: email,
            timestamp: new Date(),
        });

        res.status(201).json(newShareHistory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to store share history' });
    }
};



const shareDocument = async (req, res) => {
    const { email, documentLink } = req.body;

    try {
        await sendEmail(
            email,
            'Shared Document',
            `You can download your document from the following link: ${documentLink}`
        );
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
};



exports.deleteDocument = (req, res) => {
    const { id } = req.params;
    console.log(id);
    db.query('UPDATE documents SET status = "0" WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting document:', err);
            return res.status(500).json({ error: 'Database update failed' });
        }

        res.json({ success: true, id: id });
    });
};

exports.changeOrder = (req, res) => {
    const { in1, in2 } = req.body;
    // console.log('Received IDs to swap/order:', in1, in2);

    // Use a temporary numeric ID that doesn't conflict with existing IDs
    const tempId = -9999;

    // Start by setting the first ID to the temporary value
    db.query('UPDATE documents SET id = ? WHERE id = ?', [tempId, in1], (err, result) => {
        if (err) {
            console.error('Error updating first document:', err);
            return res.status(500).json({ error: 'Database update failed' });
        }

        // Set the second ID to the first ID's value
        db.query('UPDATE documents SET id = ? WHERE id = ?', [in1, in2], (err, result) => {
            if (err) {
                console.error('Error updating second document:', err);
                return res.status(500).json({ error: 'Database update failed' });
            }

            // Finally, set the temporary ID value to the second ID's original value
            db.query('UPDATE documents SET id = ? WHERE id = ?', [in2, tempId], (err, result) => {
                if (err) {
                    console.error('Error updating temporary document:', err);
                    return res.status(500).json({ error: 'Database update failed' });
                }

                // If all queries were successful, send a success response
                res.json({ success: true, swappedIds: { in1, in2 } });
            });
        });
    });
};
