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

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.status(200).json({ message: "Article supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const pinArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    // 🔁 Toggle l'état d’épinglage
    article.isPinned = !article.isPinned;
    await article.save();

    res.status(200).json({ 
      message: `Article ${article.isPinned ? 'épinglé' : 'désépinglé'} avec succès`, 
      isPinned: article.isPinned 
    });
  } catch (error) {
    console.error("Erreur lors de l'épinglage:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const articleId = req.params.id;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    // Mettre à jour les champs texte
    if (title) article.title = title;
    if (content) article.content = content;
    if (date) article.date = date;

    // Gestion de l'image si une nouvelle est envoyée
    if (req.file) {
      // Supprimer l'ancienne image (optionnel si tu veux nettoyer)
      if (article.image) {
        const oldImagePath = path.join('uploads', path.basename(article.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      article.image = `/uploads/${req.file.filename}`;
    }

    const updatedArticle = await article.save();
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { createArticle, getAllArticles, getRelatedArticles, getArticleById, deleteArticle, pinArticle, updateArticle };
