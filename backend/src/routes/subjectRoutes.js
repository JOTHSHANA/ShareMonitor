const express = require('express');
const router = express.Router();
const { getSubjects, createSubject } = require('../controllers/subjectController');

router.get('/subjects', getSubjects);
router.post('/subjects', createSubject);

module.exports = router;
