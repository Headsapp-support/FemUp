const Entreprise = require('../models/Entreprise');
const path = require('path');
const fs = require('fs');

// Exemple de "base de données" simulée
let entreprises = [];

exports.addEntreprise = async (req, res) => {
  try {
    // Vérification des champs requis
    if (!req.body.nom || !req.body.secteur || !req.body.localisation || !req.body.description) {
      return res.status(400).send("Tous les champs sont requis.");
    }

    // Vérification de l'image
    if (!req.file) {
      return res.status(400).send('L\'image est requise.');
    }

    // Créer la nouvelle entreprise
    const newEntreprise = new Entreprise({
      nom: req.body.nom,
      secteur: req.body.secteur,
      localisation: req.body.localisation,
      description: req.body.description,
      image: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
    });

    // Sauvegarder l'entreprise dans la base de données
    await newEntreprise.save();
    res.status(201).send('Entreprise ajoutée avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
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
    const { nom, secteur, localisation, description, image } = req.body;

    const updatedEntreprise = await Entreprise.findByIdAndUpdate(
      req.params.id,
      { nom, secteur, localisation, description, image },
      { new: true }
    );

    if (!updatedEntreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    res.status(200).json({ message: 'Entreprise mise à jour avec succès', entreprise: updatedEntreprise });
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
