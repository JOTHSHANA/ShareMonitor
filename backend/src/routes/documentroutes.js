const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/DocumentsController');
const { uploadPdf, uploadVideo } = require('../middleware/uploadMiddleware');


router.post('/share', DocumentController.shareHistory);


router.get('/getDocument/:id', DocumentController.getDocument)
router.delete('/deletedocument/:id', DocumentController.deleteDocument)

router.post('/uploadDocument', (req, res, next) => {
    const upload = req.body.documentType === 'pdf' ? uploadPdf.single('file') : uploadVideo.single('file');

    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        // Log to debug
        console.log('Request body:', req.body);
        console.log(req.body.documentType)
        console.log('Request file:', req.file);
        next();
    });
}, DocumentController.createDocument);

module.exports = router;

