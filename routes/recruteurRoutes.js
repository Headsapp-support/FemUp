const express = require('express');
const { registerRecruteur, getRecruteurProfile, updaterecruteurProfile, createOffer, getPostedOffers, updateOffer, deleteOffer, getAllPostedOffers, getOfferDetails,postulerOffre, getCandidatureCount, getCandidatsForOffer , getAllRecruteurs,getRecruteurById, updateCandidatStatus } = require('../controllers/RecruteurController');  // Assure-toi que le contrôleur est correctement importé
const router = express.Router();
const upload = require('../config/multer'); // Importer la configuration de multer
const auth = require('../middleware/auth');

// Route pour enregistrer un recruteur
router.post('/register', upload.single('logo'), registerRecruteur);
router.get('/profile', auth, getRecruteurProfile); 
router.get('/recruiters', getAllRecruteurs);
router.get('/recruteurs/:id', getRecruteurById);
router.put('/profile', auth, upload.single('profileImage'), updaterecruteurProfile);
router.post('/offres', auth, createOffer);
router.get('/offres', auth, getPostedOffers);
router.put('/offres/:offerId', auth, updateOffer);
router.delete('/offres/:offerId', auth, deleteOffer);
router.get('/all-offers', getAllPostedOffers);
router.get('/offer/:offerId', getOfferDetails);
router.post('/offre/:offerId/postuler', auth, postulerOffre); 
router.get('/offres/:offerId/candidatures/count', getCandidatureCount);
router.get('/offres/:offerId/candidats', auth, getCandidatsForOffer);
router.patch('/offres/:offerId/candidats/status', auth, updateCandidatStatus);

module.exports = router;
