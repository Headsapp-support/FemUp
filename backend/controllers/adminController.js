const Recruteur = require('../models/Recruteur');
const Condidat = require('../models/Condidat');
const Entreprise = require('../models/Entreprise');

// Fonction pour obtenir les statistiques pour l'administrateur
const getStats = async (req, res) => {
  try {
    const totalCandidates = await Condidat.countDocuments(); // Remplacez par votre modèle de données
    const totalRecruiters = await Recruteur.countDocuments();
    const totalCompanies = await Entreprise.countDocuments(); 
  // Comptage des offres en attente
  const pendingOffers = await Recruteur.aggregate([
    { $unwind: "$postedOffers" }, 
    { $match: { "postedOffers.status": "pending" } }, 
    { $count: "pendingOffers" } // Nom de champ différent pour les offres en attente
  ]);

  // Comptage des offres rejetées
  const rejectedOffers = await Recruteur.aggregate([
    { $unwind: "$postedOffers" }, 
    { $match: { "postedOffers.status": "rejected" } },
    { $count: "rejectedOffers" } // Nom de champ différent pour les offres rejetées
  ]);

  // Comptage des offres approuvées
  const totalOffers = await Recruteur.aggregate([
    { $unwind: "$postedOffers" },
    { $match: { "postedOffers.status": "approved" } },
    { $count: "approvedOffers" } // Nom de champ pour les offres approuvées
  ]);
    
    res.json({
      totalCandidates,
      totalRecruiters,
      totalCompanies,
      totalOffers: totalOffers[0] ? totalOffers[0].approvedOffers : 0, // Si aucune offre approuvée, renvoyer 0
      pendingOffers: pendingOffers[0] ? pendingOffers[0].pendingOffers : 0, // Si aucune offre en attente, renvoyer 0
      rejectedOffers: rejectedOffers[0] ? rejectedOffers[0].rejectedOffers : 0, // Si aucune offre rejetée, renvoyer 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur interne du serveur');
  }
};

// Fonction pour vérifier le token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Récupérer le token depuis les en-têtes

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifier le token
    req.user = decoded; // Ajouter les informations utilisateur au request
    next(); // Passer à l'action suivante
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

// Récupérer toutes les offres en attente
const getOffresEnAttente = async (req, res) => {
  try {
    const recruteurs = await Recruteur.find({ "postedOffers.status": "pending" });
    const pendingOffers = recruteurs.flatMap(r => r.postedOffers.filter(offer => offer.status === "pending"));

    console.log('Offres en attente:', pendingOffers);  // Ajouter ce log pour déboguer

    if (pendingOffers.length === 0) {
      return res.status(404).json({ message: 'Aucune offre en attente trouvée' });
    }

    res.status(200).json(pendingOffers);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des offres en attente', error: error.message });
  }
};


// Routes protégées avec l'authentification
const acceptOffre = async (req, res) => {
  const { id } = req.params;
  try {
    const recruteur = await Recruteur.findOneAndUpdate(
      { "postedOffers._id": id },
      { $set: { "postedOffers.$.status": "approved" } },
      { new: true }
    );

    if (!recruteur) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Retourne l'offre mise à jour pour que le front-end puisse l'afficher
    const updatedOffer = recruteur.postedOffers.find(offer => offer._id.toString() === id);
    res.status(200).json(updatedOffer);  // Retourne l'offre mise à jour
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'acceptation de l\'offre' });
  }
};

const rejectOffre = async (req, res) => {
  const { id } = req.params;
  try {
    const recruteur = await Recruteur.findOneAndUpdate(
      { "postedOffers._id": id },
      { $set: { "postedOffers.$.status": "rejected" } },
      { new: true }
    );

    if (!recruteur) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Retourne l'offre mise à jour pour que le front-end puisse l'afficher
    const updatedOffer = recruteur.postedOffers.find(offer => offer._id.toString() === id);
    res.status(200).json(updatedOffer);  // Retourne l'offre mise à jour
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du rejet de l\'offre' });
  }
};

module.exports = { getStats,verifyToken, getOffresEnAttente, acceptOffre, rejectOffre };