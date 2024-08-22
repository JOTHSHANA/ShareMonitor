const express = require('express');
const router = express.Router();
const { getSubjects, getLevels, getFolders, getDocuments, restoreSubject, subjectDelete , restoreLevel, levelDelete, restoreFolder, folderDelete, restoreDocument, documentDelete} = require('../controllers/TrashController');

router.get('/trashSubjects', getSubjects);
router.get('/trashLevels', getLevels);
router.get('/trashFolders', getFolders);
router.get('/trashDocuments', getDocuments);
router.put('/restoreSubject', restoreSubject);
router.put('/subjectDelete', subjectDelete);
router.put('/restoreLevel', restoreLevel)
router.put('/levelDelete', levelDelete)
router.put('/restoreFolder', restoreFolder)
router.put('/folderDelete', folderDelete)
router.put('/restoreDocument', restoreDocument)
router.put('/documentDelete', documentDelete)

module.exports = router;
