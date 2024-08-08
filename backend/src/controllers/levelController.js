const db = require('../config/db');
exports.getLevels = (req, res) => {
    const subjectId = req.query.sub_id;

    if (!subjectId) {
        return res.status(400).json({ error: 'Subject ID is required' });
    }

    const query = `
        SELECT levels.id, subjects.name, levels.level, levels.lvl_name, levels.status
        FROM levels
        INNER JOIN subjects ON levels.subject = subjects.id
        WHERE levels.status = '1' AND levels.subject = ?
    `;

    db.query(query, [subjectId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};


exports.createLevels = (req, res) => {
    const { name, subjectId } = req.body;
    if (!name || !subjectId) {
        return res.status(400).json({ error: 'Name and subjectId are required' });
    }

    db.query('SELECT MAX(level) AS maxLevel FROM levels WHERE subject = ?', [subjectId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const newLevel = (result[0].maxLevel || 0) + 1;

        db.query('INSERT INTO levels (lvl_name, subject, level) VALUES (?, ?, ?)', [name, subjectId, newLevel], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: result.insertId, name, subject: subjectId, level: newLevel, status: 1 });
        });
    });
};
