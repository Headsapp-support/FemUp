const Article = require('../models/Article');

// Créer un nouvel article
const createArticle = async (req, res) => {
  const { title, content, date, image, isFeatured } = req.body;
  const newArticle = new Article({ title, content, date, image, isFeatured });
  try {
    const savedArticle = await newArticle.save();
    res.status(200).json(savedArticle);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de l'article", error: err });
  }
};

module.exports = { createArticle };
