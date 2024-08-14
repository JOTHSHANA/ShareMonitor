const express = require('express');
const router = express.Router();
const { getFolders, createFolder} = require('../controllers/FolderController');


router.get('/getfolders', getFolders);
router.post('/folders', createFolder)

module.exports = router;

