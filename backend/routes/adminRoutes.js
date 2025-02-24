const express = require('express');
const { getStats, verifyToken, getOffresEnAttente, acceptOffre, rejectOffre  } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const router = express.Router();

// Route pour récupérer les statistiques
router.get('/stats', auth, getStats); 
//router.get('/stats', auth, verifyToken); 

router.get('/en-attente', auth, getOffresEnAttente);

// Route pour accepter une offre
router.put('/:id/accepter', auth, acceptOffre);

// Route pour rejeter une offre
router.put('/:id/rejeter', auth,rejectOffre);

module.exports = router;
