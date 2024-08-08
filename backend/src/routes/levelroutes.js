const express = require('express');
const router = express.Router();
const { getLevels, createLevels } = require('../controllers/levelController');

router.get('/levels', getLevels);
router.post('/levels', createLevels);

module.exports = router;
