const Article = require('../models/Article');

// Créer un nouvel article
const createArticle = async (req, res) => {
    try {
      // Vérifier si l'image a bien été téléchargée
      if (!req.file) {
        console.error('Aucune image n\'a été téléchargée.');
        return res.status(400).json({ message: "Aucune image n'a été téléchargée." });
      }
  
      const { title, content, date, isFeatured } = req.body;
  
      // Vérification des champs requis
      if (!title || !content || !date) {
        console.error('Le titre, le contenu et la date sont requis.');
        return res.status(400).json({ message: "Le titre, le contenu et la date sont requis." });
      }
  
      // Création du nouvel article
      const newArticle = new Article({
        title,
        content,
        date,
        image: req.file.path, // Récupère le chemin du fichier téléchargé
        isFeatured,
      });
  
      // Sauvegarde de l'article dans la base de données
      const savedArticle = await newArticle.save();
      console.log('Article enregistré:', savedArticle);
  
      // Réponse avec l'article enregistré
      res.status(200).json(savedArticle);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'article:', err);
      res.status(500).json({ message: "Erreur lors de l'ajout de l'article", error: err.message });
    }
  };

  const getAllArticles = async (req, res) => {
    try {
      console.log('Requête reçue pour récupérer tous les articles');
  
      // Récupère tous les articles de la base de données
      const articles = await Article.find();
  
      // Vérifier si des articles existent
      if (articles.length === 0) {
        return res.status(404).json({ message: "Aucun article trouvé." });
      }
  
      console.log('Articles récupérés:', articles);
      return res.status(200).json(articles);
    } catch (err) {
      console.error('Erreur lors de la récupération des articles:', err);
      res.status(500).json({ message: "Erreur lors de la récupération des articles", error: err.message });
    }
  };
  
module.exports = { createArticle, getAllArticles };
