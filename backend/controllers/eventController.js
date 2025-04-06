const Event = require('../models/Event');

// Créer un événement avec des images
const createEvent = async (req, res) => {
  try {
    console.log('Requête reçue pour créer un événement');

    // Vérifier si le fichier image a été téléchargé
    if (!req.file) {
      console.error('Aucune image n\'a été téléchargée.');
      return res.status(400).json({ message: "Aucune image n'a été téléchargée." });
    }

    const { name, date } = req.body;
    console.log('name:', name);
    console.log('date:', date);

    // Vérifier que le nom et la date sont présents
    if (!name || !date) {
      console.error('Le nom et la date sont requis.');
      return res.status(400).json({ message: "Le nom et la date sont requis." });
    }

    // Créer l'événement
    const newEvent = new Event({
      name,
      date,
      image: req.file.path, // Récupère le chemin du fichier téléchargé
    });

    console.log('Enregistrement de l\'événement dans la base de données...');
    const savedEvent = await newEvent.save(); // Sauvegarde l'événement dans la base de données
    console.log('Événement enregistré:', savedEvent);

    res.status(200).json(savedEvent); // Renvoie l'événement enregistré
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'événement:', err);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'événement", error: err.message });
  }
};

module.exports = { createEvent };
