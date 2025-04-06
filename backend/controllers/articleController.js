const Article = require('../models/Article');

// Créer un nouvel article
const createArticle = async (req, res) => {
  const { title, content, date, image, isFeatured } = req.body;
  const newArticle = new Article({ title, content, date, image: req.file.path, // Récupère le chemin du fichier téléchargé
  });

  try {
    const savedImage = await newImage.save();
    res.status(200).json(savedImage);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'image", error: err });
  }
};

module.exports = { createArticle };
