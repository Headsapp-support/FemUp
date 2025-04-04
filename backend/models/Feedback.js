const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  condidat: { type: mongoose.Schema.Types.ObjectId, ref: 'Condidat', required: true },  // Référence au candidat
  text: { type: String, required: true }, // Texte de l'avis
  createdAt: { type: Date, default: Date.now }, // Date de création
});

module.exports = mongoose.model('Feedback', feedbackSchema);
