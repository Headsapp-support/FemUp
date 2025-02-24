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
    type: String,
    required: true // Ce champ est requis, donc l'erreur se produit si on ne le fournit pas
  }
});

module.exports = mongoose.model('Entreprise', entrepriseSchema);
