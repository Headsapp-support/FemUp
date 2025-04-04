const express = require('express');
const router = express.Router();
const { createMessage, getMessages, deleteMessage } = require('../controllers/contactController');

// Route pour créer un message
router.post('/', createMessage);

// Route pour récupérer tous les messages (pour l'admin)
router.get('/', getMessages);

// Route pour supprimer un message (pour l'admin)
router.delete('/:id', deleteMessage);

module.exports = router;
