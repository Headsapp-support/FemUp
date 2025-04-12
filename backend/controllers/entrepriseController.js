const Entreprise = require('../models/Entreprise');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary'); // le fichier de config Cloudinary


// Exemple de "base de données" simulée
let entreprises = [];

exports.addEntreprise = async (req, res) => {
  try {
    // Vérification des champs
    if (!req.body.nom || !req.body.secteur || !req.body.localisation || !req.body.description) {
      return res.status(400).send("Tous les champs sont requis.");
    }

    // Vérification de l'image
    if (!req.file) {
      return res.status(400).send('L\'image est requise.');
    }

    // Télécharger l'image vers Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    const newEntreprise = new Entreprise({
      nom: req.body.nom,
      secteur: req.body.secteur,
      localisation: req.body.localisation,
      description: req.body.description,
      image: result.secure_url, // URL de l'image Cloudinary
    });

    // Sauvegarder l'entreprise dans la base de données
    await newEntreprise.save();
    res.status(201).send('Entreprise ajoutée avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
    res.status(500).send(`Erreur serveur: ${error.message}`);
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
