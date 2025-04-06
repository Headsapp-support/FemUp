const Article = require('../models/Article');

// Créer un nouvel article
const createArticle = async (req, res) => {
  try {
    // Vérifier que l'image a bien été téléchargée
    if (!req.file) {
      console.error('Aucune image n\'a été téléchargée.');
      return res.status(400).json({ message: "Aucune image n'a été téléchargée." });
    }

    const { title, content, date, isFeatured } = req.body;

    // Vérifier que tous les champs obligatoires sont présents
    if (!title || !content || !date) {
      console.error('Le titre, le contenu et la date sont requis.');
      return res.status(400).json({ message: "Le titre, le contenu et la date sont requis." });
    }

    const newArticle = new Article({
      title,
      content,
      date,
      image: req.file.path, // Récupère le chemin du fichier téléchargé
      isFeatured,
    });

    console.log('Enregistrement de l\'article dans la base de données...');
    const savedArticle = await newArticle.save(); // Utiliser `newArticle.save()`, pas `newImage.save()`
    console.log('Article enregistré:', savedArticle);

    res.status(200).json(savedArticle); // Renvoie l'article enregistré
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'article:', err);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'article", error: err.message });
  }
};

module.exports = { createArticle };
