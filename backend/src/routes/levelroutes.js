const express = require('express');
const router = express.Router();
const { getLevels, createLevels, updateLevels, deleteLevels } = require('../controllers/levelController');

router.get('/levels', getLevels);
router.post('/levels', createLevels);
router.put('/levels/:id', updateLevels);
router.delete('/levels/:id', deleteLevels);

module.exports = router;
