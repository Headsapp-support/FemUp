// controllers/imageController.js
const Image = require('../models/Image');
const path = require('path');

// Créer un enregistrement pour les images
const createImage = async (req, res) => {
  const { title, description } = req.body;

  // Vérifier si les fichiers sont bien envoyés
  if (!req.files) {
    return res.status(400).json({ message: "Aucune image n'a été téléchargée." });
  }

  // Mapper les fichiers pour enregistrer leurs chemins
  const imageFiles = req.files.map(file => file.path);

  // Créer un nouvel enregistrement pour les images
  const newImage = new Image({ title, description, images: imageFiles });

  try {
    const savedImage = await newImage.save();
    res.status(200).json(savedImage);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout des images", error: err });
  }
};

module.exports = { createImage };
