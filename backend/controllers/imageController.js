const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');
const Image = require('../models/Image');

const createImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image n'a été téléchargée." });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Le titre et la description sont requis." });
    }

    // Upload via streamifier
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'images',
            resource_type: 'image',
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

    const result = await streamUpload();

    const newImage = new Image({
      title,
      description,
      image: result.secure_url,
    });

    const savedImage = await newImage.save();
    res.status(200).json(savedImage);
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'image:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


const getAllImages = async (req, res) => {
  try {
    const images = await Image.find();

    if (images.length === 0) {
      return res.status(404).json({ message: "Aucune image trouvée." });
    }

    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des images", error: err.message });
  }
};

module.exports = { createImage, getAllImages };
