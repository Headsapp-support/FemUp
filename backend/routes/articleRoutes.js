const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createArticle } = require('../controllers/articleController');
const upload = require('../config/multer');

router.post('/createArticle', auth, upload.single('image'), createArticle);

module.exports = router;
