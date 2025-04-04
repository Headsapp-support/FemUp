const mongoose = require('mongoose');

// Remplacez par votre chaîne de connexion MongoDB Atlas
const dbURI = 'mongodb+srv://nadaznegui:femup123@cluster0.x75yc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connexion à MongoDB réussie');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1); // Arrêter le serveur en cas d'échec de connexion
  }
};

module.exports = connectDB;
