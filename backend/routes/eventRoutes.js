const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createEvent } = require('../controllers/eventController');

router.post('/createEvent', auth, createEvent);

module.exports = router;
