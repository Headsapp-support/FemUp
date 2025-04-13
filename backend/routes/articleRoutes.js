const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createArticle, getAllArticles, getArticleById, getRelatedArticles, deleteArticle, pinArticle, updateArticle } = require('../controllers/articleController');
const upload = require('../config/multer');

router.post('/createArticle', auth, upload.single('image'), createArticle);
router.get('/Tous', getAllArticles);
router.get('/similaires',getRelatedArticles);
router.get('/:id', getArticleById);
router.delete('/:id', auth, deleteArticle);
router.patch('/pin/:id', auth, pinArticle);
router.put('/:id', auth, upload.single('image'), updateArticle);


module.exports = router;
