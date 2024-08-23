const express = require('express');
const router = express.Router();
const { getFolders, createFolder, editFolder, deleteFolder, mergeFolders, unmergeFolder} = require('../controllers/FolderController');


router.get('/getfolders', getFolders);
router.post('/folders', createFolder);
router.put('/folders/:id', editFolder);
router.put('/folder/:id', deleteFolder);
router.post('/mergeFolders', mergeFolders);
router.post('/unmergeFolder', unmergeFolder);

module.exports = router;

