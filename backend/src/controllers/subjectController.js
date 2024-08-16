const db = require('../config/db');

exports.getSubjects = (req, res) => {
    db.query('SELECT * FROM subjects WHERE status = "1"', (err, subjects) => {
        if (err) throw err;

        const subjectPromises = subjects.map(subject => {
            return new Promise((resolve, reject) => {
                db.query('SELECT COUNT(*) as levelCount FROM levels WHERE subject = ? AND status = "1"', [subject.id], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        subject.levelCount = result[0].levelCount; // Add the count to the subject object
                        resolve(subject);
                    }
                });
            });
        });

        Promise.all(subjectPromises)
            .then(subjectsWithCount => {
                res.json(subjectsWithCount);
            })
            .catch(error => {
                console.error('Error fetching levels count:', error);
                res.status(500).json({ error: 'An error occurred while fetching subjects and levels count' });
            });
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

