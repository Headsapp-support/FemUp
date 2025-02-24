const express = require('express');
const { login, forgotPassword, resetPassword } = require('../controllers/authController');  // Assure-toi que le chemin est correct
const { loginCondidat } = require('../controllers/CondidatController'); 
const { loginrecruteur } = require('../controllers/RecruteurController'); 
const router = express.Router();

// Route de connexion
router.post('/login', login);
router.post('/login', loginCondidat);
router.post('/login', loginrecruteur);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;
