const express = require('express');
const router = express.Router();
const { getDocument, createDocument } = require('../controllers/DocumentsController');

// router.get('/uploadDocument', getDocument);
router.post('/uploadDocument', createDocument);

module.exports = router;
