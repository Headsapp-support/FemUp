const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');
const Entreprise = require('../models/Entreprise');
const multer = require('multer');

// Import du middleware multer (si tu l'utilises ici, sinon il est dans un autre fichier)
const upload = require('../config/multer');

exports.addEntreprise = async (req, res) => {
  console.log('🟡 [POST /add-entreprise] Requête reçue');
  console.log('➡️ Body:', req.body);
  console.log('📦 Fichier:', req.file ? req.file.originalname : 'Aucun fichier');

  try {
    const { nom, secteur, localisation, description } = req.body;

    // Vérification des champs requis
    if (!nom || !secteur || !localisation || !description) {
      console.warn('⚠️ Champs manquants:', { nom, secteur, localisation, description });
      return res.status(400).send("Tous les champs sont requis.");
    }

    // Si un fichier est présent, on l'upload vers Cloudinary
    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
          if (error) {
            console.error('🟥 Erreur Cloudinary:', error);
            return res.status(500).send('Erreur lors de l\'upload de l\'image');
          }

          console.log('✅ Upload Cloudinary réussi:', result.secure_url);

          const newEntreprise = new Entreprise({
            nom,
            secteur,
            localisation,
            description,
            image: result.secure_url
          });

          try {
            await newEntreprise.save();
            console.log('✅ Entreprise créée avec image:', newEntreprise);
            res.status(201).send('Entreprise ajoutée avec succès.');
          } catch (saveError) {
            console.error('🟥 Erreur MongoDB (avec image):', saveError);
            res.status(500).send('Erreur serveur lors de l\'enregistrement de l\'entreprise');
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } 
    // Si pas d'image
    else {
      const newEntreprise = new Entreprise({
        nom,
        secteur,
        localisation,
        description
        // image non incluse
      });

      try {
        await newEntreprise.save();
        console.log('✅ Entreprise créée sans image:', newEntreprise);
        res.status(201).send('Entreprise ajoutée avec succès (sans image).');
      } catch (saveError) {
        console.error('🟥 Erreur MongoDB (sans image):', saveError);
        res.status(500).send('Erreur serveur lors de l\'enregistrement de l\'entreprise');
      }
    }

  } catch (err) {
    console.error('🟥 Erreur générale dans addEntreprise:', err);
    res.status(500).send(`Erreur serveur: ${err.message}`);
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
