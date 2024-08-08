const db = require('../config/db');

// exports.getDocument = (req, res) => {
//     db.query('SELECT * FROM subjects', (err, results) => {
//         if (err) throw err;
//         res.json(results);
//     });
// };



exports.createDocument = (req, res) => {
    const { subjectId, level, category, pdf, link, video } = req.body;

    if (!subjectId || !level || !category) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    const query = `
        INSERT INTO documents (level, work_type, pdf, link, video, status)
        VALUES (
        (SELECT levels.id FROM levels
        INNER JOIN subjects ON levels.subject = subjects.id
         WHERE levels.status = '1' AND levels.subject = ? AND levels.level = ?),
        ?, ?, ?, ?, '1'
);

    `;

    db.query(query, [subjectId,level, category, pdf, link, video], (err, result) => {
        if (err) {
            console.error('Error inserting document:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ id: result.insertId, level, category, pdf, link, video });
    });
};















































// exports.createDocument = (req, res) => {
//     const { subjectId, level, category, pdf, link, video } = req.body;

//     if (!subjectId || !level || !category) {
//         return res.status(400).json({ error: 'Required fields are missing' });
//     }

//     const query = `
//         INSERT INTO documents (subjectId, level, category, pdf, link, video)
//         VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     db.query(query, [subjectId, level, category, pdf, link, video], (err, result) => {
//         if (err) {
//             console.error('Error inserting document:', err);
//             return res.status(500).json({ error: 'Internal server error' });
//         }
//         res.json({ id: result.insertId, subjectId, level, category, pdf, link, video });
//     });
// };
