const db = require('../config/db');
const path = require('path');

exports.getDocument = async (req, res) => {
    const { work_type, level } = req.query;

    if (!work_type || !level) {
        return res.status(400).json({ error: 'work_type and level are required' });
    }

    const query = 'SELECT * FROM documents WHERE work_type = ? AND level = ?';

    db.query(query, [work_type, level], (err, results) => {
        if (err) {
            console.error('Error fetching documents:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

exports.createDocument = (req, res) => {
    const { level, category, link } = req.body;
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

    if (!level || !category) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    const query = `
        INSERT INTO documents (level, work_type, pdf, link, video, file_name) 
        VALUES (?,?,?,?,?,?);
    `;

    db.query(query, [level, category, pdfPath, link, videoPath, fileName], (err, result) => {
        if (err) {
            console.error('Error inserting document:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ id: result.insertId, level, category, pdfPath, link, videoPath, fileName });
    });
};
