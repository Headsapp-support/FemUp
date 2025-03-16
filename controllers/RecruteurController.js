const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Recruteur = require('../models/Recruteur');
const Condidat = require('../models/Condidat');


const registerRecruteur = async (req, res) => {
  console.log('Données reçues (req.body):', req.body);
  console.log('Fichier reçu (req.file):', req.file);

  const { email, fullName, password, confirmPassword, companyName, phone, address, description, uniqueId, sector } = req.body;
  const logo = req.file ? req.file.path : null;

  try {
    // Validation des champs obligatoires
    if (!email || !fullName || !password || !confirmPassword || !companyName || !phone || !address || !description || !uniqueId || !sector) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    const emailExist = await Recruteur.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: 'L\'email existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRecruteur = new Recruteur({
      email,
      fullName,
      password: hashedPassword,
      companyName,
      phone,
      address,
      logo,
      description,
      uniqueId,
      sector
    });

    await newRecruteur.save();
    res.status(201).json({ message: 'Recruteur enregistré avec succès' });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du recruteur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};


// Connexion
const loginrecruteur = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const recruteur = await recruteur.findOne({ email });
  
      if (!recruteur) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
      }
  
      const validPassword = await bcrypt.compare(password, recruteur.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }
  
      // Créer un token JWT
      const token = jwt.sign(
        { id: recruteur._id, role: 'recruteur' }, // Payload
        process.env.JWT_SECRET, // Clé secrète
        { expiresIn: '1h' } // Durée de validité
      );
  
      console.log('Token généré :', token); // Ajoutez ce log pour déboguer
  
      // Renvoyer le token dans la réponse
      res.status(200).json({
        success: true,
        token, // Assurez-vous que le token est inclus ici
        role: 'recruteur',
        redirect: '/Dashboard_Emploiyeur',
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
const getRecruteurProfile = async (req, res) => {
  try {
    const recruteurId = req.recruteurId;  // L'ID du recruteur vient du middleware 'auth'
    const recruteur = await Recruteur.findById(recruteurId);

    if (!recruteur) {
      return res.status(404).json({ message: 'Recruteur non trouvé' });
    }

    // Renvoie les informations du recruteur
    res.json({
      name: recruteur.fullName,
      email: recruteur.email,
      companyName: recruteur.companyName,
      phone: recruteur.phone,
      address: recruteur.address,
      description: recruteur.description,
      logo: recruteur.logo,
      sector: recruteur.sector,
      postedOffers: recruteur.postedOffers,  // Liste des offres publiées
      discussions: recruteur.discussions,    // Discussions avec les candidats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil du recruteur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le profil du recruteur
const updaterecruteurProfile = async (req, res) => {
  const { email, fullName, password, confirmPassword, companyName, address, logo, description, uniqueId, sector } = req.body;
  const profileImage = req.file ? req.file.path : null;

  // Assurez-vous que vous utilisez le bon modèle (Recruteur ici)
  const recruteur = await Recruteur.findById(req.user.id); // Renommé de 'recruteur' à 'Recruteur'
  if (!recruteur) {
      return res.status(404).json({ message: 'Recruteur non trouvé' });
  }

  // Mise à jour des champs
  recruteur.email = email || recruteur.email;
  recruteur.fullName = fullName || recruteur.fullName;
  recruteur.password = password || recruteur.password;
  recruteur.confirmPassword = confirmPassword || recruteur.confirmPassword;
  recruteur.companyName = companyName || recruteur.companyName;
  recruteur.address = address || recruteur.address;
  recruteur.logo = logo || recruteur.logo;
  recruteur.description = description || recruteur.description;
  recruteur.uniqueId = uniqueId || recruteur.uniqueId;
  recruteur.sector = sector || recruteur.sector;

  // Mise à jour de l'image de profil
  if (profileImage) {
      recruteur.profileImage = profileImage;
  }

  // Si un mot de passe est défini, le hacher
  if (password) {
      const salt = await bcrypt.genSalt(10);
      recruteur.password = await bcrypt.hash(password, salt);
  }

  // Sauvegarder les données mises à jour
  await recruteur.save();

  return res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: recruteur // Retourner l'objet 'recruteur' mis à jour
  });
};

const createOffer = async (req, res) => {
  console.log('Données reçues pour la création de l\'offre:', req.body);

  try {
    const { title, location, category, description, client, requirements, budget, contact } = req.body;

    if (!title || !location || !category || !description || !client || !requirements || !budget || !contact) {
      console.log('Données manquantes');
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    const postedOffer = {
      title,
      location,
      category,
      description,
      client,
      requirements,
      budget,
      contact,
      cvReceived: 0,
      status: 'pending',
      date: new Date(),  // Ajouter la date de publication ici
    };

    const recruteur = await Recruteur.findById(req.recruteurId);
    if (!recruteur) {
      console.log('Recruteur introuvable');
      return res.status(404).json({ message: 'Recruteur introuvable' });
    }

    console.log('Offre avant ajout:', postedOffer);
    recruteur.postedOffers.push(postedOffer);
    await recruteur.save();

    console.log('Offre créée avec succès', postedOffer);
    res.status(201).json({ offer: postedOffer });
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message, stack: error.stack });
  }
};

const postulerOffre = async (req, res) => {
  const { offerId } = req.params;  // ID de l'offre dans l'URL
  const recruteurId = req.recruteurId;  // ID du recruteur provenant du middleware auth

  try {
    // Vérifier que l'offre existe
    const recruteur = await Recruteur.findById(recruteurId);
    if (!recruteur) {
      return res.status(404).json({ message: 'Recruteur non trouvé' });
    }

    // Trouver l'offre à mettre à jour
    const offer = recruteur.postedOffers.id(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Ajouter la date de postulation
    offer.appliedAt = new Date();

    // Incrémenter le nombre de candidatures (cvReceived)
    offer.cvReceived += 1; // Ici, on incrémente correctement

    // Sauvegarder les modifications
    await recruteur.save();

    // Vérifier si la sauvegarde a bien eu lieu
    const updatedOffer = recruteur.postedOffers.id(offerId); // Récupérer l'offre mise à jour
    console.log('Offre mise à jour:', updatedOffer);

    res.status(200).json({
      message: 'Postulation effectuée avec succès',
      appliedAt: offer.appliedAt,
      cvReceived: updatedOffer.cvReceived, // Retourner le nombre de candidatures actualisé
    });
  } catch (error) {
    console.error('Erreur lors de la postulation:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getPostedOffers = async (req, res) => {
  try {
    const recruteur = await Recruteur.findById(req.recruteurId); // Trouver le recruteur par son ID

    if (!recruteur) {
      return res.status(404).json({ message: 'Recruteur non trouvé' });
    }

    // Récupérer toutes les offres du recruteur
    const offers = recruteur.postedOffers.map(offer => ({
      title: offer.title,
      date: offer.date,
      cvReceived: offer.cvReceived, // Inclure le nombre de candidatures ici
    }));

    // Retourner ces informations au frontend
    res.json({ offers });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 

const updateOffer = async (req, res) => {
  const { title, location, category, description, client, requirements, budget, contact } = req.body;
  const offerId = req.params.offerId;

  // Vérification si l'ID de l'offre est valide
  if (!offerId) {
    return res.status(400).json({ message: 'L\'ID de l\'offre est requis' });
  }

  // Vérification des champs obligatoires
  if (!title || !location || !category || !description || !client || !requirements || !budget || !contact) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  console.log("ID du recruteur (auth):", req.recruteurId); // Debug : vérifier si l'ID du recruteur est défini
  try {
    const recruteur = await Recruteur.findById(req.recruteurId).populate('postedOffers');
    if (!recruteur) {
      return res.status(404).json({ message: 'Recruteur introuvable' });
    }

    console.log('Offres du recruteur:', recruteur.postedOffers);
    console.log('Offre à modifier ID:', offerId);

    // Recherche de l'offre spécifique avec l'ID dans les offres du recruteur
    const offer = recruteur.postedOffers.id(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    console.log('Offre trouvée:', offer);

    // Mise à jour des informations de l'offre
    offer.title = title || offer.title;
    offer.location = location || offer.location;
    offer.category = category || offer.category;
    offer.description = description || offer.description;
    offer.client = client || offer.client;
    offer.requirements = requirements || offer.requirements;
    offer.budget = budget || offer.budget;
    offer.contact = contact || offer.contact;

    // Sauvegarde des modifications dans le recruteur
    await recruteur.save();

    res.status(200).json({ message: 'Offre mise à jour avec succès', offer });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'offre:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};

const deleteOffer = async (req, res) => {
  const { offerId } = req.params;  // Récupérer l'ID depuis les paramètres de l'URL

  try {
    const recruteur = await Recruteur.findById(req.recruteurId); // Récupère le recruteur connecté
    if (!recruteur) {
      return res.status(404).json({ message: 'Recruteur introuvable' });
    }

    const offer = recruteur.postedOffers.id(offerId);  // Récupère l'offre à supprimer
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Supprime l'offre
    recruteur.postedOffers.pull(offerId);  // Enlève l'offre de la liste des offres

    await recruteur.save(); // Sauvegarder les modifications

    res.status(200).json({ message: 'Offre supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'offre:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonction pour récupérer toutes les offres publiées par tous les recruteurs
const getAllPostedOffers = async (req, res) => {
  try {
    const { category, location } = req.query;

    let filters = {};

    if (category) {
      filters.category = category;
    }

    if (location) {
      filters.location = location;
    }

    const recruteurs = await Recruteur.find().populate('postedOffers');

    if (!recruteurs) {
      return res.status(404).json({ message: 'Aucun recruteur trouvé' });
    }

    let allOffers = recruteurs.flatMap(recruteur => recruteur.postedOffers);

    if (category || location) {
      allOffers = allOffers.filter(offer => {
        return (
          (category ? offer.category.toLowerCase().includes(category.toLowerCase()) : true) &&
          (location ? offer.location.toLowerCase().includes(location.toLowerCase()) : true)
        );
      });
    }

    if (allOffers.length === 0) {
      return res.status(404).json({ message: 'Aucune offre trouvée' });
    }

    // Trier les offres par date, du plus récent au plus ancien
    allOffers = allOffers.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Enrichir la réponse pour inclure les détails du recruteur pour chaque offre
    allOffers = allOffers.map(offer => {
      const recruteur = recruteurs.find(r => r.postedOffers.includes(offer));
      return {
        ...offer._doc,  // Utiliser '_doc' pour éviter de renvoyer les données de Mongoose
        recruteur: {
          id: recruteur._id,
          name: recruteur.fullName,
          companyName: recruteur.companyName,
        }
      };
    });

    res.json({ offers: allOffers });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres de tous les recruteurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
;


const getOfferDetails = async (req, res) => {
  const { offerId } = req.params;  // Récupérer l'ID de l'offre dans les paramètres de l'URL

  try {
    // Rechercher l'offre dans les offres publiées par le recruteur
    const recruteur = await Recruteur.findOne({ "postedOffers._id": offerId }).populate('postedOffers');

    if (!recruteur) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Trouver l'offre spécifique dans le tableau "postedOffers" du recruteur
    const offer = recruteur.postedOffers.id(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Renvoyer les détails de l'offre
    res.json({ offer });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'offre:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer le nombre de candidatures pour une offre donnée
const getCandidatureCount = async (req, res) => {
  try {
    const { offerId } = req.params; // L'ID de l'offre passé dans l'URL
    
    // Compter le nombre de candidatures pour cette offre
    const count = await Condidat.countDocuments({
      'applications.jobId': offerId, // Cherche les candidatures où jobId correspond à l'ID de l'offre
    });
    
    res.json({ candidatureCount: count }); // Retourne le nombre de candidatures
  } catch (error) {
    console.error('Erreur lors du comptage des candidatures:', error);
    res.status(500).json({ message: 'Erreur lors du comptage des candidatures' });
  }
};

const getCandidatsForOffer = async (req, res) => {
  const { offerId } = req.params;  // L'ID de l'offre vient des paramètres de l'URL

  try {
    // Récupérer le recruteur via son ID (assurez-vous que le middleware 'auth' ajoute 'recruteurId')
    const recruteur = await Recruteur.findById(req.recruteurId);
    if (!recruteur) {
      return res.status(404).json({ message: 'Recruteur non trouvé' });
    }

    // Chercher l'offre dans les offres publiées par le recruteur
    const offer = recruteur.postedOffers.id(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Récupérer les candidats qui ont postulé à cette offre
    const candidats = await Condidat.find({ 'applications.jobId': offerId });

    // Si aucun candidat n'a postulé à l'offre
    if (!candidats || candidats.length === 0) {
      return res.status(404).json({ message: 'Aucun candidat pour cette offre' });
    }

    // Retourner la liste des candidats
    res.json({ candidats });
  } catch (error) {
    console.error('Erreur lors de la récupération des candidats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getAllRecruteurs = async (req, res) => {
  try {
    const recruteurs = await Recruteur.find();
    if (recruteurs.length === 0) {
      return res.status(404).json({ message: 'Aucun recruteur trouvé' });
    }

    const recruteursDetails = recruteurs.map(recruteur => ({
      _id: recruteur._id,
      fullName: recruteur.fullName,
      companyName: recruteur.companyName,
      phone: recruteur.phone,
      address: recruteur.address,
      logo: recruteur.logo,
      sector: recruteur.sector,
      postedOffers: recruteur.postedOffers.length,
    }));

    res.json(recruteursDetails);
  } catch (error) {
    console.error('Erreur lors de la récupération des recruteurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getRecruteurById = async (req, res) => {
  const recruteurId = req.params.id; // Utilise le paramètre 'id' dans l'URL
  try {
    // Recherche du recruteur par _id
    const recruteur = await Recruteur.findById(recruteurId);
    if (!recruteur) {
      return res.status(404).json({ message: 'Recruteur non trouvé' });
    }

    // Renvoie le recruteur avec tous les champs, y compris '_id'
    res.json(recruteur);  // Mongoose renvoie par défaut '_id' avec l'objet
  } catch (error) {
    console.error('Erreur lors de la récupération du recruteur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateCandidatStatus = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { candidatId, status } = req.body;

    console.log('offerId:', offerId);
    console.log('candidatId:', candidatId);
    console.log('status:', status);

    // Vérification de l'existence du recruteur
    const recruteur = await Recruteur.findById(req.recruteurId);
    if (!recruteur) {
      console.error('Recruteur non trouvé');
      return res.status(404).json({ error: 'Recruteur non trouvé' });
    }

    // Chercher l'offre correspondant à l'ID de l'offre dans les offres du recruteur
    const offer = recruteur.postedOffers.id(offerId);
    if (!offer) {
      console.error('Offre non trouvée');
      return res.status(404).json({ error: 'Offre non trouvée' });
    }

    // Trouver le candidat qui a postulé à cette offre
    const candidat = await Condidat.findOne({
      _id: candidatId,
      'applications.jobId': offerId
    });

    if (!candidat) {
      console.error('Candidat non trouvé dans cette offre');
      return res.status(404).json({ error: 'Candidat non trouvé dans cette offre' });
    }

    // Trouver l'application spécifique dans le tableau applications du candidat
    console.log('Applications du candidat:', candidat.applications); // Log des applications du candidat
    const application = candidat.applications.find(app => app.jobId && app.jobId.toString() === offerId);


    if (!application) {
      console.error('Application du candidat non trouvée pour cette offre');
      return res.status(404).json({ error: 'Application du candidat non trouvée pour cette offre' });
    }

    // Mettre à jour le statut de l'application
    application.status = status;

    // Sauvegarder le candidat avec le statut mis à jour
    await candidat.save();

    console.log('Statut mis à jour avec succès');
    return res.status(200).json({ success: true, message: 'Statut mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { registerRecruteur,loginrecruteur, getRecruteurProfile, updaterecruteurProfile, createOffer,getPostedOffers,updateOffer, deleteOffer, getAllPostedOffers, getOfferDetails, postulerOffre, getCandidatureCount, getCandidatsForOffer , getAllRecruteurs, getRecruteurById, updateCandidatStatus  };