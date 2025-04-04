const express = require('express');
const { getStats, verifyToken, getOffresEnAttente, acceptOffre, rejectOffre, getGlobalCandidatureStatistics } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const router = express.Router();

// Route pour récupérer les statistiques
router.get('/stats', auth, getStats);

// Route pour récupérer les offres en attente
router.get('/en-attente', auth, getOffresEnAttente);

// Route pour accepter une offre
router.put('/:id/accepter', auth, acceptOffre);

// Route pour rejeter une offre
router.put('/:id/rejeter', auth, rejectOffre);

// Route pour récupérer les statistiques globales des candidatures
router.get('/statistiques-globales', auth, getGlobalCandidatureStatistics);

module.exports = router;
