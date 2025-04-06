const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createEvent, getAllEvents } = require('../controllers/eventController');
const upload = require('../config/multer');

router.post('/createEvent', auth, upload.single('image'), createEvent);
router.get('/', getAllEvents);

module.exports = router;
