// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const { createImage, getAllImages } = require('../controllers/imageController');
const auth = require('../middleware/auth'); // Importer votre middleware d'authentification
const upload = require('../config/multer'); // Importer multer

// Utiliser le middleware upload.array('images') pour gérer l'envoi de plusieurs fichiers
router.post('/createImage', auth, upload.single('image'), createImage);
router.get('/Tous', getAllImages);

module.exports = router;
