const multer = require('multer');
const cloudinary = require('../utils/cloudinary'); // Ton fichier config cloudinary
const streamifier = require('streamifier');

// Utilisation du stockage en mémoire pour envoyer le fichier directement à Cloudinary
const storage = multer.memoryStorage();

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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de taille à 10 Mo max
});

// ➕ Fonction utilitaire pour uploader un fichier en mémoire vers Cloudinary
const uploadCvToCloudinary = (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'cvs', // Le dossier dans Cloudinary
        public_id: filename,
        resource_type: 'raw' // Pour PDF, DOC, etc.
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = {
  upload,
  uploadCvToCloudinary
};
