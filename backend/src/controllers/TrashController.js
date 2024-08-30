const db = require('../config/db');


exports.getSubjects = async (req, res) => {
    const getSubjectsQuery = 'SELECT * FROM subjects WHERE status = "0"';
    const getLevelCountQuery = 'SELECT COUNT(*) as levelCount FROM levels WHERE subject = ? AND status = "1"';
    const getFolderCountQuery = `
        SELECT COUNT(*) as folderCount 
        FROM folders 
        WHERE level IN (SELECT id FROM levels WHERE subject = ?) 
        AND status = "1"
    `;
    const getDocumentCountQuery = `
        SELECT COUNT(*) as documentCount 
        FROM documents 
        WHERE folder IN (
            SELECT id FROM folders 
            WHERE level IN (
                SELECT id FROM levels 
                WHERE subject = ?
            )
        ) 
        AND status = "1"
    `;

    db.query(getSubjectsQuery, (err, subjects) => {
        if (err) {
            console.error('Error fetching deleted subjects:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const subjectsWithCounts = subjects.map(subject => {
            return new Promise((resolve, reject) => {
                // First, get the level count
                db.query(getLevelCountQuery, [subject.id], (err, levelResult) => {
                    if (err) {
                        console.error('Error counting levels:', err);
                        reject(err);
                    } else {
                        subject.levelCount = levelResult[0].levelCount;

                        // Then, get the folder count
                        db.query(getFolderCountQuery, [subject.id], (err, folderResult) => {
                            if (err) {
                                console.error('Error counting folders:', err);
                                reject(err);
                            } else {
                                subject.folderCount = folderResult[0].folderCount;

                                // Finally, get the document count
                                db.query(getDocumentCountQuery, [subject.id], (err, documentResult) => {
                                    if (err) {
                                        console.error('Error counting documents:', err);
                                        reject(err);
                                    } else {
                                        subject.documentCount = documentResult[0].documentCount;
                                        resolve(subject);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });

        Promise.all(subjectsWithCounts)
            .then(results => res.json(results))
            .catch(err => res.status(500).json({ error: 'Internal server error' }));
    });
};



// exports.getLevels = async (req, res) => {
//     const getLevelsQuery = 'SELECT * FROM levels WHERE status = "0"';
//     const getFolderCountQuery = `
//         SELECT COUNT(*) as folderCount 
//         FROM folders 
//         WHERE level = ? 
//         AND status = "1"
//     `;
//     const getDocumentCountQuery = `
//         SELECT COUNT(*) as documentCount 
//         FROM documents 
//         WHERE folder IN (
//             SELECT id FROM folders 
//             WHERE level = ?
//         ) 
//         AND status = "1"
//     `;

//     db.query(getLevelsQuery, (err, levels) => {
//         if (err) {
//             console.error('Error fetching levels:', err);
//             return res.status(500).json({ error: 'Internal server error' });
//         }

//         const levelsWithCounts = levels.map(level => {
//             return new Promise((resolve, reject) => {
//                 // Get the folder count for the level
//                 db.query(getFolderCountQuery, [level.id], (err, folderResult) => {
//                     if (err) {
//                         console.error('Error counting folders:', err);
//                         reject(err);
//                     } else {
//                         level.folderCount = folderResult[0].folderCount;

//                         // Get the document count for the level
//                         db.query(getDocumentCountQuery, [level.id], (err, documentResult) => {
//                             if (err) {
//                                 console.error('Error counting documents:', err);
//                                 reject(err);
//                             } else {
//                                 level.documentCount = documentResult[0].documentCount;
//                                 resolve(level);
//                             }
//                         });
//                     }
//                 });
//             });
//         });

//         Promise.all(levelsWithCounts)
//             .then(results => res.json(results))
//             .catch(err => res.status(500).json({ error: 'Internal server error' }));
//     });
// };

exports.getLevels = async (req, res) => {
    const getLevelsQuery = `
        SELECT levels.*, subjects.name as subjectName 
        FROM levels 
        JOIN subjects ON levels.subject = subjects.id 
        WHERE levels.status = "0"
    `;

    const getFolderCountQuery = `
        SELECT COUNT(*) as folderCount 
        FROM folders 
        WHERE level = ? 
        AND status = "1"
    `;

    const getDocumentCountQuery = `
        SELECT COUNT(*) as documentCount 
        FROM documents 
        WHERE folder IN (
            SELECT id FROM folders 
            WHERE level = ?
        ) 
        AND status = "1"
    `;

    db.query(getLevelsQuery, (err, levels) => {
        if (err) {
            console.error('Error fetching levels:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const levelsWithCounts = levels.map(level => {
            return new Promise((resolve, reject) => {
                // Get the folder count for the level
                db.query(getFolderCountQuery, [level.id], (err, folderResult) => {
                    if (err) {
                        console.error('Error counting folders:', err);
                        reject(err);
                    } else {
                        level.folderCount = folderResult[0].folderCount;

                        // Get the document count for the level
                        db.query(getDocumentCountQuery, [level.id], (err, documentResult) => {
                            if (err) {
                                console.error('Error counting documents:', err);
                                reject(err);
                            } else {
                                level.documentCount = documentResult[0].documentCount;
                                resolve(level);
                            }
                        });
                    }
                });
            });
        });

        Promise.all(levelsWithCounts)
            .then(results => res.json(results))
            .catch(err => res.status(500).json({ error: 'Internal server error' }));
    });
};





// select f.s_day , f.e_day, w.type as workTypeName ,l.lvl_name as level_name,s.name as subject_name,  d.* from
// documents d
// inner join folders f
// on d.folder = f.id
// inner join levels l
// on f.level = l.id
// join subjects s
// on l.subject = s.id
// join work_type w
// on f.work_type = w.id
// where d.status = '3'

exports.getFolders = async (req, res) => {
    const getFoldersQuery = `
        SELECT 
        MIN(d.id) AS document_id,
        f.s_day, 
        f.e_day, 
        w.type AS workTypeName, 
        l.lvl_name AS level_name, 
        s.name AS subject_name, 
        d.folder, 
        MIN(d.file_name) AS file_name,
        MIN(d.pdf) AS pdf,
        MIN(d.video) AS video,
        MIN(d.link) AS link,
        MIN(d.general_doc) AS general_doc,
        MIN(d.status) AS status
    FROM documents d
    INNER JOIN folders f ON d.folder = f.id
    INNER JOIN levels l ON f.level = l.id
    JOIN subjects s ON l.subject = s.id
    JOIN work_type w ON f.work_type = w.id
    WHERE d.status = '3'
    GROUP BY d.folder, f.s_day, f.e_day, w.type, l.lvl_name, s.name
    `;

    const getDocumentCountQuery = `
        SELECT COUNT(*) as documentCount 
        FROM documents 
        WHERE folder = ? 
        AND status = "3"
    `;

    db.query(getFoldersQuery, (err, folders) => {
        if (err) {
            console.error('Error fetching deleted folders:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const foldersWithDocumentCounts = folders.map(folder => {
            return new Promise((resolve, reject) => {
                db.query(getDocumentCountQuery, [folder.folder], (err, documentResult) => {
                    if (err) {
                        console.error('Error counting documents:', err);
                        reject(err);
                    } else {
                        folder.documentCount = documentResult[0].documentCount;
                        resolve(folder);
                    }
                });
            });
        });

        Promise.all(foldersWithDocumentCounts)
            .then(results => res.json(results))
            .catch(err => res.status(500).json({ error: 'Internal server error' }));
    });
};



// exports.getDocuments = async (req, res) => {

//     const query = 'SELECT * FROM documents WHERE status = "0"';

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching deleted documents:', err);
//             return res.status(500).json({ error: 'Internal server error' });
//         }
//         res.json(results);
//     });
// };



exports.getDocuments = async (req, res) => {
    const query = `
        SELECT 
            documents.*, 
            folders.s_day, 
            folders.e_day, 
            levels.level AS level, 
            work_type.type AS workTypeName, 
            subjects.name AS subjectName
        FROM documents
        JOIN folders ON documents.folder = folders.id
        JOIN levels ON folders.level = levels.id
        JOIN work_type ON folders.work_type = work_type.id
        JOIN subjects ON levels.subject = subjects.id
        WHERE documents.status = "0"
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching deleted documents:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};


exports.restoreSubject = (req, res) => {
    const subjectId = req.body.id;

    if (!subjectId) {
        return res.status(400).json({ error: 'Subject ID is required' });
    }

    // Update the status of the subject to '1' to restore it
    db.query('UPDATE subjects SET status = "1" WHERE id = ?', [subjectId], (err, result) => {
        if (err) {
            console.error('Error restoring subject:', err);
            return res.status(500).json({ error: 'An error occurred while restoring the subject' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        res.json({ message: 'Subject restored successfully' });
    });
};

exports.subjectDelete = (req, res) => {
    const subjectId = req.body.id;
    console.log(req.body.id);

    if (!subjectId) {
        return res.status(400).json({ error: 'Subject ID is required' });
    }

    db.query('UPDATE subjects SET status = "-1" WHERE id = ?', [subjectId], (err, result) => {
        if (err) {
            console.error('Error deleting subject:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the subject' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        res.json({ message: 'Subject deleted successfully' });
    });
};



exports.restoreLevel = (req, res) => {
    const levelId = req.body.id;
    console.log(`id from frontend : ${levelId}`);

    if (!levelId) {
        return res.status(400).json({ error: 'Level ID is required' });
    }

    const getLevelAndSubjectQuery = 'SELECT level, subject FROM levels WHERE id = ?';

    db.query(getLevelAndSubjectQuery, [levelId], (err, result) => {
        if (err) {
            console.error('Error fetching level:', err);
            return res.status(500).json({ error: 'An error occurred while fetching the level' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Level not found' });
        }

        const restoredLevelValue = result[0].level;
        const subjectId = result[0].subject;
        console.log(restoredLevelValue);
        console.log(subjectId);

        const incrementLevelsQuery = 'UPDATE levels SET level = level + 1 WHERE subject = ? AND level >= ?';

        db.query(incrementLevelsQuery, [subjectId, restoredLevelValue], (err, result) => {
            if (err) {
                console.error('Error incrementing levels:', err);
                return res.status(500).json({ error: 'An error occurred while incrementing levels' });
            }

            const restoreLevelQuery = 'UPDATE levels SET level = ?, status = "1" WHERE id = ?';

            db.query(restoreLevelQuery, [restoredLevelValue, levelId], (err, result) => {
                if (err) {
                    console.error('Error restoring level:', err);
                    return res.status(500).json({ error: 'An error occurred while restoring the level' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Level not found' });
                }

                res.json({ message: 'Level restored and levels incremented successfully' });
            });
        });

    });
};


exports.levelDelete = (req, res) => {
    const levelId = req.body.id;
    console.log(req.body.id);

    if (!levelId) {
        return res.status(400).json({ error: 'Subject ID is required' });
    }

    db.query('UPDATE levels SET status = "-1" WHERE id = ?', [levelId], (err, result) => {
        if (err) {
            console.error('Error deleting subject:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the subject' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        res.json({ message: 'Subject deleted successfully' });
    });
}


exports.restoreFolder = (req, res) => {
    const folderId = req.body.id;

    if (!folderId) {
        return res.status(400).json({ error: 'Folder ID is required' });
    }

    // Start with restoring the folder
    db.query('UPDATE folders SET status = "1" WHERE id = ?', [folderId], (err, result) => {
        if (err) {
            console.error('Error restoring folder:', err);
            return res.status(500).json({ error: 'An error occurred while restoring the folder' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        // Now restore the documents within the folder
        db.query('UPDATE documents SET status = "1" WHERE folder = ?', [folderId], (err, result) => {
            if (err) {
                console.error('Error restoring documents:', err);
                return res.status(500).json({ error: 'An error occurred while restoring the documents' });
            }

            // It's possible that no documents are associated with the folder, so no need for a 404 check here
            res.json({ message: 'Folder and associated documents restored successfully' });
        });
    });
};


exports.folderDelete = (req, res) => {
    const folderId = req.body.id;
    console.log(req.body.id);

    if (!folderId) {
        return res.status(400).json({ error: 'Subject ID is required' });
    }

    db.query('UPDATE folders SET status = "-1" WHERE id = ?', [folderId], (err, result) => {
        if (err) {
            console.error('Error deleting subject:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the subject' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        res.json({ message: 'Folder deleted successfully' });
    });
};




exports.restoreDocument = (req, res) => {
    const documentId = req.body.id;

    if (!documentId) {
        return res.status(400).json({ error: 'Document ID is required' });
    }

    db.query('UPDATE documents SET status = "1" WHERE id = ?', [documentId], (err, result) => {
        if (err) {
            console.error('Error restoring document:', err);
            return res.status(500).json({ error: 'An error occurred while restoring the subject' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json({ message: 'Document restored successfully' });
    });
};

exports.documentDelete = (req, res) => {
    const documentId = req.body.id;
    console.log(req.body.id);

    if (!documentId) {
        return res.status(400).json({ error: 'Document ID is required' });
    }

    db.query('UPDATE documents SET status = "-1" WHERE id = ?', [documentId], (err, result) => {
        if (err) {
            console.error('Error deleting document:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the document' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json({ message: 'Document deleted successfully' });
    });
};
