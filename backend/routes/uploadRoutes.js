const express = require("express");
const { profilePictureUpload,imageUpload} = require("../controllers/fileController");
const multer = require('multer');

// Multer Config for Image Uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const router = express.Router();
router.post("/image",upload.single('image'),imageUpload);
router.post("/profile",upload.single('image'),profilePictureUpload);

module.exports = router;
