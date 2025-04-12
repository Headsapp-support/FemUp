const Entreprise = require('../models/Entreprise');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary'); // le fichier de config Cloudinary


// Exemple de "base de données" simulée
let entreprises = [];

exports.addEntreprise = async (req, res) => {
  try {
    const { nom, secteur, localisation, description } = req.body;

    if (!nom || !secteur || !localisation || !description) {
      return res.status(400).send("Tous les champs sont requis.");
    }

    if (!req.file) {
      return res.status(400).send('Le fichier (image ou PDF) est requis.');
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // important pour autoriser PDF
    });

    const newEntreprise = new Entreprise({
      nom,
      secteur,
      localisation,
      description,
      image: result.secure_url,
    });

    await newEntreprise.save();
    fs.unlinkSync(req.file.path); // nettoyer le fichier local après upload

    res.status(201).send('Entreprise ajoutée avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'ajout:', error);
    res.status(500).send('Erreur serveur.');
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
