const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/DocumentsController');
const { uploadPdf, uploadVideo } = require('../middleware/uploadMiddleware');


router.get('/getDocument',DocumentController.getDocument)

router.post('/uploadDocument', (req, res, next) => {
    // Determine which multer instance to use
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
