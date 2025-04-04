const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dossier pour les fichiers téléchargés
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);  // Crée le dossier s'il n'existe pas
}

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Configuration du stockage pour multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Dossier où les fichiers seront enregistrés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique basé sur timestamp
  }
});

// Filtre des types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images (JPEG, PNG, JPG) et les fichiers (PDF, DOC, DOCX) sont autorisés'), false);
  }
};

// Initialisation de multer avec la configuration
const upload = multer({ storage: storage, fileFilter });

module.exports = upload;
