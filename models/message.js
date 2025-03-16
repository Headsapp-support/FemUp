const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true }); // Ajoute des timestamps pour la création et mise à jour

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
