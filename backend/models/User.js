const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Assurez-vous que bcrypt est installé

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // Ajoutez un rôle par exemple
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Pour hasher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
