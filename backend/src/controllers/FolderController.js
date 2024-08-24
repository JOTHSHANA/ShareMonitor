const db = require('../config/db');
const path = require('path');



exports.getFolders = async (req, res) => {
    const { work_type, level } = req.query;

    if (!work_type || !level) {
        return res.status(400).json({ error: 'work_type and level are required' });
    }

    const query = 'SELECT * FROM folders WHERE work_type = ? AND level = ? AND status = "1" ORDER BY s_day';

    db.query(query, [work_type, level], (err, results) => {
        if (err) {
            console.error('Error fetching folders:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
        console.log(results);
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
exports.editFolder = (req, res) => {
    const { id } = req.params;
    const { s_day, e_day } = req.body;

    console.log(id, s_day, e_day);

    const query = 'UPDATE folders SET s_day = ?, e_day = ? WHERE id = ?';

    db.query(query, [s_day, e_day, id], (err, result) => {
        if (err) {
            console.error('Error updating folder:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Folder updated successfully' });
    });
};


exports.deleteFolder = (req, res) => {
    const { id } = req.params;
    console.log(id);

    const query = 'UPDATE folders SET status = "0" WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting folder:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Folder deleted successfully' });
    });
}






//sample
exports.mergeFolders = (req, res) => {
    const { startFolderId, endFolderId } = req.body;

    if (!startFolderId || !endFolderId) {
        return res.status(400).json({ error: 'startFolderId and endFolderId are required' });
    }

    db.query(
        'SELECT MIN(s_day) AS min_s_day, MAX(e_day) AS max_e_day FROM folders WHERE id BETWEEN ? AND ?',
        [startFolderId, endFolderId],
        (err, result) => {
            if (err) {
                console.error('Error fetching folders:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const { min_s_day, max_e_day } = result[0];

            db.query(
                'UPDATE documents SET folder = ? WHERE folder IN (SELECT id FROM folders WHERE id BETWEEN ? AND ?)',
                [startFolderId, startFolderId, endFolderId],
                (err) => {
                    if (err) {
                        console.error('Error updating documents:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    db.query(
                        'DELETE FROM folders WHERE id > ? AND id <= ?',
                        [startFolderId, endFolderId],
                        (err) => {
                            if (err) {
                                console.error('Error deleting folders:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }

                            db.query(
                                'UPDATE folders SET s_day = ?, e_day = ? WHERE id = ?',
                                [min_s_day, max_e_day, startFolderId],
                                (err) => {
                                    if (err) {
                                        console.error('Error updating folder:', err);
                                        return res.status(500).json({ error: 'Internal server error' });
                                    }

                                    res.json({ message: 'Folders merged successfully' });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};


exports.unmergeFolder = (req, res) => {
    const { folderId } = req.body;

    // Fetch the folder to be unmerged
    db.query('SELECT * FROM folders WHERE id = ?', [folderId], (err, folderResult) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }

        if (folderResult.length === 0) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        const { s_day, e_day, level, work_type } = folderResult[0];
        console.log(folderResult[0])

        // Create separate folders for each day in the range
        let firstUnmergedFolderId;
        console.log(s_day, e_day)

        for (let day = s_day; day <= e_day; day++) {
            db.query('INSERT INTO folders (s_day, e_day, level, work_type) VALUES (?, ?, ?, ?)',
                [day, day, level, work_type], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error creating unmerged folder' });
                    }

                    // Capture the ID of the first unmerged folder
                    if (day === s_day) {
                        firstUnmergedFolderId = result.insertId;
                    }

                    // Once all folders are created, move documents to the first folder
                    if (day === e_day) {
                        db.query('UPDATE documents SET folder = ? WHERE folder = ?',
                            [firstUnmergedFolderId, folderId], (err, result) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Error updating documents' });
                                }

                                // Optionally delete the original merged folder
                                db.query('DELETE FROM folders WHERE id = ?', [folderId], (err, result) => {
                                    if (err) {
                                        return res.status(500).json({ error: 'Error deleting original folder' });
                                    }

                                    res.status(200).json({ message: 'Folder unmerged successfully, documents retained in the first folder.' });
                                });
                            });
                    }
                });
        }
    });
};


exports.findMissingFolders = async (req, res) => {
    const { level, work_type } = req.query;
    console.log(level, work_type);

    const query = `
        SELECT s_day, e_day 
        FROM folders 
        WHERE level = ? 
        AND work_type = ? 
        AND status = "1"
    `;

    db.query(query, [level, work_type], (err, results) => {
        if (err) {
            console.error('Error fetching folders:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.json({ missingDays: [] });
        }

        const daysSet = new Set();
        let minDay = Number.MAX_VALUE;
        let maxDay = Number.MIN_VALUE;
        results.forEach(row => {
            const { s_day, e_day } = row;
            minDay = Math.min(minDay, s_day);
            maxDay = Math.max(maxDay, e_day);
            console.log(s_day, e_day)
            for (let day = s_day; day <= e_day; day++) {
                daysSet.add(day);
            }
        });

        const missingDays = [];
        for (let day = minDay; day <= maxDay; day++) {
            if (!daysSet.has(day)) {
                missingDays.push(day);
            }
        }

        missingDays.push(maxDay + 1);

        return res.json({ missingDays });
    });
};
