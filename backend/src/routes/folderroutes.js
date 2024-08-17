const express = require('express');
const router = express.Router();
const { getFolders, createFolder, editFolder, deleteFolder} = require('../controllers/FolderController');


router.get('/getfolders', getFolders);
router.post('/folders', createFolder);
router.put('/folders/:id', editFolder);
router.put('/folder/:id', deleteFolder);

module.exports = router;

