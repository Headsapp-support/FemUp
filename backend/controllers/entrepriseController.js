const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');
const Entreprise = require('../models/Entreprise');
const multer = require('multer');

// Import du middleware multer (si tu l'utilises ici, sinon il est dans un autre fichier)
const upload = require('../config/multer');

exports.addEntreprise = async (req, res) => {
  console.log('📥 [POST /add-entreprise] Requête reçue');
  console.log('📄 Body:', req.body);
  console.log('🖼 File:', req.file ? req.file.originalname : 'Aucun fichier');

  const { nom, secteur, localisation, description } = req.body;

  // Validation des champs requis
  if (!nom || !secteur || !localisation || !description) {
    console.warn('⚠️ Champs manquants:', { nom, secteur, localisation, description });
    return res.status(400).send("Tous les champs sont requis.");
  }

  try {
    let imageUrl = '';

    // Upload vers Cloudinary si image présente
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      imageUrl = result.secure_url;
      console.log('✅ Image uploadée:', imageUrl);
    }

    // Création de l'entreprise
    const newEntreprise = new Entreprise({
      nom,
      secteur,
      localisation,
      description,
      image: imageUrl // vide si pas d'image
    });

    await newEntreprise.save();
    console.log('✅ Entreprise enregistrée :', newEntreprise);
    res.status(201).send('Entreprise ajoutée avec succès.');
  } catch (err) {
    console.error('🟥 Erreur interne:', err);
    res.status(500).send(`Erreur serveur: ${err.message || 'Erreur inconnue'}`);
  }
};


// Récupérer toutes les entreprises
exports.getEntreprises = async (req, res) => {
  try {
    const entreprises = await Entreprise.find();
    res.status(200).json(entreprises);
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer une entreprise par son ID
exports.getEntrepriseById = async (req, res) => {
  try {
    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    res.status(200).json(entreprise);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entreprise:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une entreprise
exports.updateEntreprise = async (req, res) => {
  try {
    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Mise à jour des champs
    entreprise.nom = req.body.nom || entreprise.nom;
    entreprise.secteur = req.body.secteur || entreprise.secteur;
    entreprise.localisation = req.body.localisation || entreprise.localisation;
    entreprise.description = req.body.description || entreprise.description;

    // Mise à jour de l'image si une nouvelle est envoyée
    if (req.file) {
      entreprise.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await entreprise.save();
    res.status(200).json({ message: 'Entreprise mise à jour avec succès', entreprise });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Supprimer une entreprise
exports.deleteEntreprise = async (req, res) => {
  try {
    const deletedEntreprise = await Entreprise.findByIdAndDelete(req.params.id);

    if (!deletedEntreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Supprimer l'image du serveur
    const imagePath = path.join(__dirname, '..', 'uploads', deletedEntreprise.image.split('/').pop());
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: 'Entreprise supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entreprise:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
