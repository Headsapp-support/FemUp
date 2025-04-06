const Event = require('../models/Event');

// Créer un événement avec des images
const createEvent = async (req, res) => {
    const { name, date } = req.body;
    const imagePaths = req.files ? req.files.map(file => file.path) : [];  // Vérification des fichiers
  
    if (imagePaths.length === 0) {
      return res.status(400).json({ message: "Aucune image n'a été téléchargée pour l'événement." });
    }
  
    const newEvent = new Event({
      name,
      date,
      image: req.file.path, // Récupère le chemin du fichier téléchargé
    });
  
    try {
      const savedImage = await newImage.save();
      res.status(200).json(savedImage);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de l'ajout de l'image", error: err });
    }
  };

module.exports = { createEvent};
