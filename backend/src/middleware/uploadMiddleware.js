const multer = require('multer');
const path = require('path');

const storagePdf = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const storageVideo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const uploadPdf = multer({ storage: storagePdf });
const uploadVideo = multer({ storage: storageVideo });

module.exports = {
    uploadPdf,
    uploadVideo
};
