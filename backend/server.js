require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const cors = require('cors');  // Importer le middleware CORS
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const CondidatRoutes = require('./routes/CondidatRoutes');
const recruteurRoutes = require('./routes/recruteurRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');
const articleRoutes = require('./routes/articleRoutes');
const eventRoutes = require('./routes/eventRoutes');
const imageRoutes = require('./routes/imageRoutes');
const bcrypt = require('bcryptjs');
const authRoutes = require('./routes/authRoutes'); 
const multer = require('./config/multer');
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: ['https://fem-up.vercel.app', 'http://localhost:3000'],  // Liste des origines autorisées
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],  // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization', 'credentials'],  // Ajoutez 'credentials'
  credentials: true,  // Permet d'envoyer des cookies ou autres informations d'identification
}));

app.options('*', cors());

app.use(express.json());

// Middleware pour analyser les données JSON
app.use(bodyParser.json());

// Connexion à la base de données MongoDB
connectDB();

// Utiliser les routes des utilisateurs
app.use('/api/Condidat', CondidatRoutes);
app.use('/api', CondidatRoutes);
app.use('/api/recruteur', recruteurRoutes);
app.use('/api/condidat', feedbackRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', adminRoutes);
app.use('/api', entrepriseRoutes);
app.use('/api/messages', contactRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/images', imageRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur Node.js démarré sur le port ${PORT}`);
});