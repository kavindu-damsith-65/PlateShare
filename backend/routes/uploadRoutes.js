const express = require('express');
const router = express.Router();
const { uploadSingle } = require('../middleware/multer');
const { handleUpload } = require('../controllers/fileController');

// @route   POST /api/upload
// @desc    Upload a file
// @access  Public
router.post('/', uploadSingle('file'), handleUpload);

module.exports = router;
