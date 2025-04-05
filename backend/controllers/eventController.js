const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');

// Créer un événement avec des images
const createEvent = async (req, res) => {
  const { name, date } = req.body;
  const imagePaths = req.files ? req.files.map(file => file.path) : [];  // Récupérer les chemins des images téléchargées

  const newEvent = new Event({
    name,
    date,
    images: imagePaths  // Ajouter les images téléchargées à l'événement
  });

  try {
    const savedEvent = await newEvent.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de l'événement", error: err });
  }
};

module.exports = { createEvent};
