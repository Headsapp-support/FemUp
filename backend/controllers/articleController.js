const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');
const Article = require('../models/Article');

// ✅ Middleware multer déjà appliqué au routeur avant
const createArticle = async (req, res) => {
  try {
    const { title, content, date, isFeatured } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Aucune image n'a été téléchargée." });
    }

    // ✅ Streamifier pour uploader sur Cloudinary
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "articles", // facultatif
            resource_type: "image"
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(); // ⬅️ On attend l’upload

    const newArticle = new Article({
      title,
      content,
      date,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      image: result.secure_url, // ✅ Lien cloudinary ici
    });

    const savedArticle = await newArticle.save();
    res.status(200).json(savedArticle);
  } catch (err) {
    console.error("Erreur lors de la création de l'article :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


// Récupérer tous les articles
const getAllArticles = async (req, res) => {
  try {
    console.log('Requête reçue pour récupérer tous les articles');

    // Récupère tous les articles de la base de données
    const articles = await Article.find();

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

// Récupérer un article par ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'article", error });
  }
};

// Récupérer des articles similaires
const getRelatedArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).limit(5); // Récupère les 5 articles les plus récents
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des articles similaires", error });
  }
};

module.exports = { createArticle, getAllArticles, getRelatedArticles, getArticleById };
