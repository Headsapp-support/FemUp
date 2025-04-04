// controllers/contactController.js

const Message = require('../models/message');

// Ajouter un message
const createMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message envoyé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi du message.' });
  }
};

// Récupérer tous les messages (pour l'admin)
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les messages.' });
  }
};

// Supprimer un message
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }
    res.status(200).json({ message: 'Message supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du message.' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
};
