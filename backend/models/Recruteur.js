const mongoose = require('mongoose');

const recruteurSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  logo: { type: String },
  description: { type: String, required: true },
  uniqueId: { type: String, required: true },
  sector: { type: String, required: true },
  postedOffers: [{
    title: String,
    location: String,
    category: String,
    description: String,
    client: String,
    requirements: String,
    budget: String,
    contact: String,
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now }, // Définir la date dans le modèle
    cvReceived: { type: Number, default: 0 },
    appliedAt: { type: Date },
    candidats: [{
      candidatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Condidat' },
      status: { type: String, enum: ['En attente', 'Accepté', 'Refusé'], default: 'En attente' }
    }]
  }],

  resetPasswordToken: String,   // Token pour la réinitialisation du mot de passe
  resetPasswordExpire: Date    // Date d'expiration du token
});

module.exports = mongoose.model('Recruteur', recruteurSchema);
