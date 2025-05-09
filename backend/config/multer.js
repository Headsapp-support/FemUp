const multer = require('multer');
const cloudinary = require('../utils/cloudinary'); // Ton fichier config Cloudinary
const streamifier = require('streamifier');

// Utilisation du stockage en mémoire pour envoyer le fichier directement à Cloudinary
const storage = multer.memoryStorage();

// Fonction de filtrage pour autoriser certains types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté'), false);
  }
};

// Limites de taille des fichiers : 10 Mo max
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limite à 10 Mo max
});

// ➕ Fonction utilitaire pour uploader un fichier vers Cloudinary
const uploadCvToCloudinary = (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    console.log("Upload Cloudinary - Fichier reçu:", filename); // Débogage

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'cvs', // Dossier Cloudinary
        public_id: filename, // Nom unique du fichier
        resource_type: 'raw', // Spécial pour les fichiers non-images (PDF, DOC, etc.)
      },
      (error, result) => {
        if (error) {
          console.error('Erreur d\'upload Cloudinary:', error); // Log d'erreur
          reject(new Error(`Erreur Cloudinary: ${error.message}`));
        } else if (result && result.secure_url) {
          console.log("Upload Cloudinary - Résultat:", result); // Débogage
          resolve(result.secure_url); // Renvoi de l'URL sécurisée
        } else {
          reject(new Error('Aucune URL sécurisée renvoyée par Cloudinary.'));
        }
      }
    );

    // Convertir le buffer en stream pour Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
module.exports = {
  upload,
  uploadCvToCloudinary
};
