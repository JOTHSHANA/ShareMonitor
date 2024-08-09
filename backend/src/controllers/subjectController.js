const db = require('../config/db');

exports.getSubjects = (req, res) => {
    db.query('SELECT * FROM subjects WHERE status = "1"', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

exports.createSubject = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    db.query('INSERT INTO subjects (name) VALUES (?)', [name], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, name });
    });
};

exports.editSubject = (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ error: 'Name is required' });
    }

    db.query('UPDATE subjects SET name = ? WHERE id = ?', [newName, id], (err, result) => {
        if (err) {
            console.error('Error updating subject:', err);
            return res.status(500).json({ error: 'Database update failed' });
        }

        res.json({ success: true, id: id, name: newName });
    });
};

exports.deleteSubject = (req, res) => {
    const { id } = req.params;

    db.query('UPDATE subjects SET status = "0" WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error updating subject:', err);
            return res.status(500).json({ error: 'Database update failed' });
        }

        res.json({ success: true, id: id });
    });
}

