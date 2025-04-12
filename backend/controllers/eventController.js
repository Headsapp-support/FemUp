const Event = require('../models/Event');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');

const createEvent = async (req, res) => {
  try {
    console.log('Requête reçue pour créer un événement');

    if (!req.file) {
      console.error("Aucune image n'a été téléchargée.");
      return res.status(400).json({ message: "Aucune image n'a été téléchargée." });
    }

    const { name, date } = req.body;
    if (!name || !date) {
      console.error("Le nom et la date sont requis.");
      return res.status(400).json({ message: "Le nom et la date sont requis." });
    }

    console.log("Nom :", name);
    console.log("Date :", date);

    // Stream upload vers Cloudinary
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'events',
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

    const newEvent = new Event({
      name,
      date,
      image: result.secure_url, // ✅ lien vers Cloudinary
    });

    const savedEvent = await newEvent.save();
    console.log('Événement enregistré:', savedEvent);

    res.status(200).json(savedEvent);
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'événement:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

  
  const getAllEvents = async (req, res) => {
    try {
      console.log('Requête reçue pour récupérer tous les événements');
  
      // Récupère tous les événements, indépendamment de la date
      const events = await Event.find();
  
      // Vérifier si des événements existent
      if (events.length === 0) {
        return res.status(404).json({ message: "Aucun événement trouvé." });
      }
  
      console.log('Événements récupérés:', events);
      return res.status(200).json(events);
    } catch (err) {
      console.error('Erreur lors de la récupération des événements:', err);
      res.status(500).json({ message: "Erreur lors de la récupération des événements", error: err.message });
    }
  };

module.exports = { createEvent, getAllEvents };
