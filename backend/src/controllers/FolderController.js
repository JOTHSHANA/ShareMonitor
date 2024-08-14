const db = require('../config/db');
const path = require('path');



exports.getFolders = async (req, res) => {
    const { work_type, level } = req.query;

    if (!work_type || !level) {
        return res.status(400).json({ error: 'work_type and level are required' });
    }

    const query = 'SELECT * FROM folders WHERE work_type = ? AND level = ? AND status = "1"';

    db.query(query, [work_type, level], (err, results) => {
        if (err) {
            console.error('Error fetching folders:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
        console.log(results)
    });
};


exports.createFolder = (req, res) => {
    const { s_day, e_day, level_id, work_type } = req.body;
    if (!s_day || !e_day || !level_id || !work_type) {
        return res.status(400).json({ error: 'all fields are required' });
    }
    try {
        db.query('INSERT INTO folders (s_day, e_day, level, work_type) VALUES(?, ?, ?, ?)', [s_day, e_day, level_id, work_type], (err, result) => {
            if (err) {
                console.log("Invalid Input..");
                res.status(400).send({ message: "invalid input" });
            }
            else {
                res.json({
                    id: result.insertId,
                    s_day,
                    e_day,
                    level_id,
                    work_type
                });
            }

        });
    }
    catch {
        res.status(400).send({ message: "invalid input" });
    }

};