const express = require('express');
const { registerCondidat, loginCondidat, getCondidatProfile, updateCondidatProfile, uploadCV, postuler,getCandidatures, getAllCondidats, getCondidatById, updateCandidatStatus } = require('../controllers/CondidatController');
const auth = require('../middleware/auth');
const upload = require('../config/multer'); // Importer multer
const router = express.Router();

// Routes
router.post('/condidats/register', registerCondidat);
router.post('/login', loginCondidat);
router.get('/profile', auth, getCondidatProfile); // Utilisez le middleware auth
router.put('/profile', auth, upload.single('profileImage'), updateCondidatProfile);
router.post('/uploads', auth, upload.single('cv'), uploadCV);
router.post('/postuler', auth, upload.single('cv'), postuler);
router.get('/candidatures', auth, getCandidatures);
router.get('/condidats', getAllCondidats);
router.get('/condidats/:id', getCondidatById);
router.patch('/:candidatId/status', auth, updateCandidatStatus);

module.exports = router;