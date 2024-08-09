const express = require('express');
const router = express.Router();
const { getSubjects, createSubject, editSubject, deleteSubject } = require('../controllers/subjectController');

router.get('/subjects', getSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', editSubject);
router.delete('/subjects/:id', deleteSubject);

module.exports = router;
