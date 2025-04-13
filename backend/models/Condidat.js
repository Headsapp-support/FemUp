const mongoose = require('mongoose');

const condidatSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  civilite: { type: String, required: true },
  password: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  gouvernorat: { type: String, required: true },
  specialite: { type: String, required: true },
  experience: { type: String, required: false }, 
  profileImage: String,
  cv: String,
  applications: [{
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruteur'},
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruteur.postedOffers' }, // Correction ici pour faire référence à l'offre
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['En attente', 'Accepté', 'Refusé', 'Préselectionné'], default: 'En attente' },
    cvUploaded: { type: String },
  }],
 
  resetPasswordToken: String,   // Token pour la réinitialisation du mot de passe
  resetPasswordExpire: Date    // Date d'expiration du token

});

module.exports = mongoose.model('Condidat', condidatSchema);