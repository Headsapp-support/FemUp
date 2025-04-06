const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createEvent } = require('../controllers/eventController');
const upload = require('../config/multer');

router.post('/createEvent', auth, upload.single('image'), createEvent);

module.exports = router;
