const db = require('../config/db');

exports.getSubjects = (req, res) => {
    db.query('SELECT * FROM subjects', (err, results) => {
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
