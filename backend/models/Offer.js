const mongoose = require('mongoose');

// Modèle pour l'offre
const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
 
});

const Offer = mongoose.model('Offer', offerSchema);