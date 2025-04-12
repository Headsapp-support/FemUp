const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createArticle, getAllArticles, getArticleById, getRelatedArticles } = require('../controllers/articleController');
const upload = require('../config/multer');

router.post('/createArticle', auth, upload.single('image'), createArticle);
router.get('/Tous', getAllArticles);
router.get('/similaires',getRelatedArticles);
router.get('/:id', getArticleById);


module.exports = router;
