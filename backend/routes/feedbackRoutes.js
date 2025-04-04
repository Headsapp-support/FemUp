const express = require('express');
const { submitFeedback, getAllfeedbacks } = require('../controllers/feedbackController');
const auth = require('../middleware/auth'); // Vérifier le token JWT

const router = express.Router();

// Route pour soumettre un avis
router.post('/submit-feedback', auth, submitFeedback);
router.get('/experiences', getAllfeedbacks);

module.exports = router;
