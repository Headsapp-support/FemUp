const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); 
const { addEntreprise, getEntreprises, getEntrepriseById, updateEntreprise, deleteEntreprise } = require('../controllers/entrepriseController');

// Route pour ajouter une entreprise
router.post('/add-entreprise', upload.single('image'), addEntreprise);
// Route pour récupérer toutes les entreprises
router.get('/entreprises', getEntreprises);

// Route pour récupérer une entreprise par son ID
router.get('/entreprises/:id',getEntrepriseById);

// Route pour mettre à jour une entreprise
router.put('/entreprises/:id', upload.single('image'), updateEntreprise);

// Route pour supprimer une entreprise
router.delete('/entreprises/:id',deleteEntreprise);

module.exports = router;