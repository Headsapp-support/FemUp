// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const { createImage } = require('../controllers/imageController');
const auth = require('../middleware/auth'); // Importer votre middleware d'authentification
const upload = require('../config/multer'); // Importer multer

// Utiliser le middleware upload.single('images') pour gérer l'envoi d'un seul fichier
router.post('/createImage', auth, upload.array('images'), createImage);

module.exports = router;
