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
        ORDER BY levels.level ASC;
    `;

    db.query(query, [subjectId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};


// exports.createLevels = (req, res) => {
//     const { name, subjectId, levelNum } = req.body;
//     if (!name || !subjectId || !levelNum) {
//         return res.status(400).json({ error: 'Name, subjectId, and levelNum are required' });
//     }
//     console.log(levelNum)
//     db.query(
//         'UPDATE levels SET level = level + 1 WHERE subject = ? AND level >= ?',
//         [subjectId, levelNum],
//         (err, result) => {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }

//             db.query(
//                 'INSERT INTO levels (lvl_name, subject, level) VALUES (?, ?, ?)',
//                 [name, subjectId, levelNum],
//                 (err, result) => {
//                     if (err) {
//                         return res.status(500).json({ error: err.message });
//                     }
//                     res.json({ id: result.insertId, name, subject: subjectId, level: levelNum, status: 1 });
//                 }
//             );
//         }
//     );
// };


exports.createLevels = (req, res) => {
    const { name, subjectId, levelNum } = req.body;
    if (!name || !subjectId || !levelNum) {
        return res.status(400).json({ error: 'Name, subjectId, and levelNum are required' });
    }

    db.query(
        'UPDATE levels SET level = level + 1 WHERE subject = ? AND level >= ?',
        [subjectId, levelNum],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            db.query(
                'INSERT INTO levels (lvl_name, subject, level) VALUES (?, ?, ?)',
                [name, subjectId, levelNum],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const levelId = result.insertId;
                    const workTypes = [1, 2, 3, 4];
                    const folders = [];

                    // Automatically create 10 folders for each work_type
                    workTypes.forEach((workType) => {
                        for (let i = 1; i <= 5; i++) {
                            const s_day = i;
                            const e_day = i; // You can modify this if you want multi-day folders
                            folders.push([s_day, e_day, levelId, workType]);
                        }
                    });

                    db.query(
                        'INSERT INTO folders (s_day, e_day, level, work_type) VALUES ?',
                        [folders],
                        (err, result) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }

                            res.json({
                                id: levelId,
                                name,
                                subject: subjectId,
                                level: levelNum,
                                status: 1,
                                foldersCreated: result.affectedRows
                            });
                        }
                    );
                }
            );
        }
    );
};


exports.updateLevels = (req, res) => {
    let { id } = req.params;
    const { lvl_name, subjectId, level } = req.body;

    id = parseInt(id, 10);
    const intSubjectId = parseInt(subjectId, 10);
    const intLevel = parseInt(level, 10);

    console.log(intLevel, id, lvl_name, intSubjectId);

    if (!lvl_name) {
        return res.status(400).json({ error: 'Level name is required' });
    }

    const query = 'UPDATE levels SET lvl_name = ? WHERE level = ? AND subject = ? AND id = ?';
    const values = [lvl_name, intLevel, intSubjectId, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating level:', err);
            return res.status(500).json({ error: 'Database update failed' });
        }

        res.json({ success: true, id: id, lvl_name: lvl_name });
    });
};

exports.deleteLevels = (req, res) => {
    const { id } = req.params;
    const { subjectId, level } = req.body;
    console.log(id, subjectId, level);

    // Mark the level as deleted by updating the status
    const updateStatusQuery = 'UPDATE levels SET status = "0" WHERE id = ?';
    db.query(updateStatusQuery, [id], (err, result) => {
        if (err) {
            console.error('Error updating level status:', err);
            return res.status(500).json({ error: 'Database update failed' });
        }

        // Decrement levels greater than the deleted level
        const decrementQuery = 'UPDATE levels SET level = level - 1 WHERE subject = ? AND level > ?';
        db.query(decrementQuery, [subjectId, level + 1], (err, result) => {
            if (err) {
                console.error('Error decrementing levels:', err);
                return res.status(500).json({ error: 'Failed to decrement levels' });
            }

            res.json({ success: true, id: id });
        });
    });
};

