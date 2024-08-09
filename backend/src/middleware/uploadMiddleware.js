const multer = require('multer');
const path = require('path');

// Storage configuration for PDF files
const storagePdf = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Storage configuration for Video files
const storageVideo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer upload instances
const uploadPdf = multer({ storage: storagePdf });
const uploadVideo = multer({ storage: storageVideo });

module.exports = {
    uploadPdf,
    uploadVideo
};
