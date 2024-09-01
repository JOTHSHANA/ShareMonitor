const db = require('../config/db');
const path = require('path');



exports.getFolders = async (req, res) => {
    const { work_type, level } = req.query;

    if (!work_type || !level) {
        return res.status(400).json({ error: 'work_type and level are required' });
    }

    const query = 'SELECT * FROM folders WHERE work_type = ? AND level = ? AND (status = "1"|| status = "2") ORDER BY s_day';

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
    console.log(s_day,e_day, level_id, work_type)
    if (!s_day || !e_day || !level_id || !work_type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Step 1: Check if a folder with the same s_day and status 0 exists
        db.query(
            'SELECT id FROM folders WHERE s_day = ? AND level = ? AND work_type = ? AND status = "0"',
            [s_day, level_id, work_type],

            (err, results) => {
                if (err) {
                    console.error('Error checking for existing folder:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (results.length > 0) {
                    const folderId = results[0].id;
                    console.log(`dssdds: ${folderId}`)
                    db.query(
                        'UPDATE folders SET status = "1", e_day = ? WHERE id = ?',
                        [e_day, folderId],
                        (err) => {
                            if (err) {
                                console.error('Error updating folder status:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }

                            res.json({
                                id: folderId,
                                s_day,
                                e_day,
                                level_id,
                                work_type
                            });
                        }
                    );
                } else {
                    // Step 3: If not found, insert a new record
                    db.query(
                        'INSERT INTO folders (s_day, e_day, level, work_type) VALUES(?, ?, ?, ?)',
                        [s_day, e_day, level_id, work_type],
                        (err, result) => {
                            if (err) {
                                console.error('Invalid Input:', err);
                                return res.status(400).send({ message: 'Invalid input' });
                            }

                            res.json({
                                id: result.insertId,
                                s_day,
                                e_day,
                                level_id,
                                work_type
                            });
                        }
                    );
                }
            }
        );
    } catch (err) {
        console.error('Error during folder creation:', err);
        res.status(400).send({ message: 'Invalid input' });
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
    const query1 = 'UPDATE documents SET status = "3" WHERE folder = ?'
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting folder:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        // res.status(200).json({ message: 'Folder deleted successfully' });
        db.query(query1, [id], (err, result) => {
            if (err) {
                console.error('Error changing document status:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'Folder deleted successfully' });
        });
    });
}





exports.mergeFolders = (req, res) => {
    const { startFolderId, endFolderId, level, work_type } = req.body;

    if (!startFolderId || !endFolderId) {
        return res.status(400).json({ error: 'startFolderId and endFolderId are required' });
    }

    const mergeRandom = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    // Step 1: Retrieve the merge_random value for the endFolderId
    db.query(
        'SELECT merge_random FROM folders WHERE id = ?',
        [endFolderId],
        (err, result) => {
            if (err) {
                console.error('Error fetching merge_random value:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const mergeRandomFromEndFolder = result[0]?.merge_random;

            // Step 2: Check for any folder with the same merge_random value
            db.query(
                'SELECT id FROM folders WHERE merge_random = ? ORDER BY id DESC LIMIT 1',
                [mergeRandomFromEndFolder],
                (err, result) => {
                    if (err) {
                        console.error('Error checking for matching merge_random value:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    let finalEndFolderId = endFolderId;

                    if (result.length > 0 && result[0].id > endFolderId) {
                        // Found a folder with a greater id, use it as the new endFolderId
                        finalEndFolderId = result[0].id;
                    }

                    // Step 3: Proceed with the merge logic using the updated endFolderId
                    db.query(
                        'SELECT MIN(s_day) AS min_s_day, MAX(e_day) AS max_e_day FROM folders WHERE id BETWEEN ? AND ?',
                        [startFolderId, finalEndFolderId],
                        (err, result) => {
                            if (err) {
                                console.error('Error fetching folders:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }

                            const { min_s_day, max_e_day } = result[0];

                            db.query(
                                'UPDATE documents SET folder = ? WHERE folder IN (SELECT id FROM folders WHERE id BETWEEN ? AND ?)',
                                [startFolderId, startFolderId, finalEndFolderId],
                                (err) => {
                                    if (err) {
                                        console.error('Error updating documents:', err);
                                        return res.status(500).json({ error: 'Internal server error' });
                                    }

                                    db.query(
                                        `UPDATE folders SET status = '2', merge_random = ? WHERE id >= ? AND id <= ? AND level = ? AND work_type = ?`,
                                        [mergeRandom, startFolderId, finalEndFolderId, level, work_type],
                                        (err) => {
                                            if (err) {
                                                console.error('Error updating folder status:', err);
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
        }
    );
};

// exports.unmergeFolder = (req, res) => {
//     const { folderId } = req.body;

//     // Fetch the folder to be unmerged
//     db.query('SELECT * FROM folders WHERE id = ?', [folderId], (err, folderResult) => {
//         if (err) {
//             return res.status(500).json({ error: 'Database query error' });
//         }

//         if (folderResult.length === 0) {
//             return res.status(404).json({ error: 'Folder not found' });
//         }

//         const { s_day, e_day, level, work_type } = folderResult[0];
//         console.log(folderResult[0])

//         // Create separate folders for each day in the range
//         let firstUnmergedFolderId;
//         console.log(s_day, e_day)

//         for (let day = s_day; day <= e_day; day++) {
//             db.query('INSERT INTO folders (s_day, e_day, level, work_type) VALUES (?, ?, ?, ?)',
//                 [day, day, level, work_type], (err, result) => {
//                     if (err) {
//                         return res.status(500).json({ error: 'Error creating unmerged folder' });
//                     }

//                     // Capture the ID of the first unmerged folder
//                     if (day === s_day) {
//                         firstUnmergedFolderId = result.insertId;
//                     }

//                     // Once all folders are created, move documents to the first folder
//                     if (day === e_day) {
//                         db.query('UPDATE documents SET folder = ? WHERE folder = ?',
//                             [firstUnmergedFolderId, folderId], (err, result) => {
//                                 if (err) {
//                                     return res.status(500).json({ error: 'Error updating documents' });
//                                 }

//                                 // Optionally delete the original merged folder
//                                 db.query('DELETE FROM folders WHERE id = ?', [folderId], (err, result) => {
//                                     if (err) {
//                                         return res.status(500).json({ error: 'Error deleting original folder' });
//                                     }

//                                     res.status(200).json({ message: 'Folder unmerged successfully, documents retained in the first folder.' });
//                                 });
//                             });
//                     }
//                 });
//         }
//     });
// };


exports.unmergeFolder = (req, res) => {
    const { folderId } = req.body;

    // First, retrieve the merge_random value for the given folder ID
    db.query(`SELECT merge_random FROM folders WHERE id = ?`, [folderId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        const mergeRandomNumber = result[0].merge_random;

        // Retrieve all records with status 2 and the matching merge_random number
        db.query(`SELECT id FROM folders WHERE merge_random = ? AND status = '2'`, [mergeRandomNumber], (err, records) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error' });
            }

            if (records.length === 0) {
                return res.status(200).json({ message: 'No matching records found' });
            }

            // Update the status to 1 for all matching records
            const ids = records.map(record => record.id);
            db.query(`UPDATE folders SET status = '1', merge_random = NULL WHERE id IN (?)`, [ids], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating folder status and merge_random value' });
                }

                return res.status(200).json({ message: 'Status updated successfully' });
            });
        });
    });
};

exports.findMissingFolders = async (req, res) => {
    const { level, work_type } = req.query;
    console.log(level, work_type);

    // Query to select only s_day
    const query = `
        SELECT s_day 
        FROM folders 
        WHERE level = ? 
        AND work_type = ? 
        AND (status = "1"||status = "2")
        ORDER BY s_day
    `;

    db.query(query, [level, work_type], (err, results) => {
        if (err) {
            console.error('Error fetching folders:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.json({ missingDays: [] });
        }

        const days = results.map(row => row.s_day);
        const missingDays = [];

        let previousDay = 0;

        days.forEach(day => {
            for (let i = previousDay + 1; i < day; i++) {
                missingDays.push(i);
            }
            previousDay = day;
        });

        missingDays.push(previousDay + 1);

        return res.json({ missingDays });
    });
};
