// controllers/imageController.js
const Image = require('../models/Image');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Configuration de multer
const createImage = async (req, res) => {
    console.log('Requête reçue pour créer une image');
  
    if (!req.file) {
      console.error('Aucune image n\'a été téléchargée.');
      return res.status(400).json({ message: "Aucune image n'a été téléchargée." });
    }
  
    const { title, description } = req.body;
    console.log('Titre:', title);
    console.log('Description:', description);
  
    if (!title || !description) {
      console.error('Le titre et la description sont requis.');
      return res.status(400).json({ message: "Le titre et la description sont requis." });
    }
  
    try {
      const newImage = new Image({
        title,
        description,
        image: req.file.path,
      });
  
      console.log('Enregistrement de l\'image dans la base de données...');
      const savedImage = await newImage.save();
      console.log('Image enregistrée:', savedImage);
  
      res.status(200).json(savedImage);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'image:', err);
      res.status(500).json({ message: "Erreur lors de l'ajout de l'image", error: err.message });
    }
  };
  
  const getAllImages = async (req, res) => {
    try {
      console.log('Requête reçue pour récupérer toutes les images');
  
      // Récupère toutes les images de la base de données
      const images = await Image.find();
  
      // Vérifier si des images existent
      if (images.length === 0) {
        return res.status(404).json({ message: "Aucune image trouvée." });
      }
  
      console.log('Images récupérées:', images);
      return res.status(200).json(images);
    } catch (err) {
      console.error('Erreur lors de la récupération des images:', err);
      res.status(500).json({ message: "Erreur lors de la récupération des images", error: err.message });
    }
  };
  
module.exports = { createImage, getAllImages };
