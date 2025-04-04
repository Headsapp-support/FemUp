const Recruteur = require('../models/Recruteur');
const Condidat = require('../models/Condidat');
const Entreprise = require('../models/Entreprise');
const jwt = require('jsonwebtoken');

// Fonction pour obtenir les statistiques pour l'administrateur
const getStats = async (req, res) => {
  try {
    const totalCandidates = await Condidat.countDocuments();
    const totalRecruiters = await Recruteur.countDocuments();
    const totalCompanies = await Entreprise.countDocuments();

    // Comptage des offres en attente
    const pendingOffers = await Recruteur.aggregate([
      { $unwind: "$postedOffers" },
      { $match: { "postedOffers.status": "pending" } },
      { $count: "pendingOffers" }
    ]);

    // Comptage des offres rejetées
    const rejectedOffers = await Recruteur.aggregate([
      { $unwind: "$postedOffers" },
      { $match: { "postedOffers.status": "rejected" } },
      { $count: "rejectedOffers" }
    ]);

    // Comptage des offres approuvées
    const totalOffers = await Recruteur.aggregate([
      { $unwind: "$postedOffers" },
      { $match: { "postedOffers.status": "approved" } },
      { $count: "approvedOffers" }
    ]);

    res.json({
      totalCandidates,
      totalRecruiters,
      totalCompanies,
      totalOffers: totalOffers[0] ? totalOffers[0].approvedOffers : 0,
      pendingOffers: pendingOffers[0] ? pendingOffers[0].pendingOffers : 0,
      rejectedOffers: rejectedOffers[0] ? rejectedOffers[0].rejectedOffers : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur interne du serveur');
  }
};

// Fonction pour vérifier le token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

// Récupérer toutes les offres en attente
const getOffresEnAttente = async (req, res) => {
  try {
    const recruteurs = await Recruteur.find({ "postedOffers.status": "pending" });
    const pendingOffers = recruteurs.flatMap(r => r.postedOffers.filter(offer => offer.status === "pending"));

    if (pendingOffers.length === 0) {
      return res.status(404).json({ message: 'Aucune offre en attente trouvée' });
    }

    res.status(200).json(pendingOffers);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des offres en attente', error: error.message });
  }
};

// Accepter une offre
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

    const updatedOffer = recruteur.postedOffers.find(offer => offer._id.toString() === id);
    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'acceptation de l\'offre' });
  }
};

// Rejeter une offre
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

    const updatedOffer = recruteur.postedOffers.find(offer => offer._id.toString() === id);
    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du rejet de l\'offre' });
  }
};

// Fonction pour obtenir les statistiques globales des candidatures
const getGlobalCandidatureStatistics = async (req, res) => {
  try {
    // Calculer le nombre total de candidatures dans toutes les offres
    const totalCandidates = await Condidat.countDocuments();

    // Calculer le nombre de candidatures acceptées, rejetées et pré-sélectionnées
    const acceptedApplications = await Condidat.aggregate([
      { $unwind: { path: "$applications", preserveNullAndEmptyArrays: true } },
      { $match: { "applications.status": "Accepté" } },
      { $count: "acceptedApplications" }
    ]);

    const rejectedApplications = await Condidat.aggregate([
      { $unwind: { path: "$applications", preserveNullAndEmptyArrays: true } },
      { $match: { "applications.status": "Refusé" } },
      { $count: "rejectedApplications" }
    ]);

    const preselectedApplications = await Condidat.aggregate([
      { $unwind: { path: "$applications", preserveNullAndEmptyArrays: true } },
      { $match: { "applications.status": "Préselectionné" } },
      { $count: "preselectedApplications" }
    ]);

    res.json({
      totalCandidates,
      acceptedApplications: acceptedApplications[0] ? acceptedApplications[0].acceptedApplications : 0,
      rejectedApplications: rejectedApplications[0] ? rejectedApplications[0].rejectedApplications : 0,
      preselectedApplications: preselectedApplications[0] ? preselectedApplications[0].preselectedApplications : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques globales' });
  }
};

module.exports = { getStats, verifyToken, getOffresEnAttente, acceptOffre, rejectOffre, getGlobalCandidatureStatistics };
