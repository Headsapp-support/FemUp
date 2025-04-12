const mongoose = require('mongoose');

const entrepriseSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  secteur: {
    type: String,
    required: true
  },
  localisation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,  // image est maintenant optionnelle
    default: ''
  }
});

module.exports = mongoose.model('Entreprise', entrepriseSchema);
