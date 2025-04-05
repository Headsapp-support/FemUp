const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createArticle } = require('../controllers/articleController');

router.post('/createArticle', auth, createArticle);

module.exports = router;
