const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Condidat = require('../models/Condidat');
const Recruteur = require('../models/Recruteur');
const mongoose = require('mongoose');
const cloudinary = require('../utils/cloudinary'); // Assure-toi que ce fichier existe
const streamifier = require('streamifier');

// Inscription
const registerCondidat = async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      civilite,
      password,
      confirmPassword,
      dateNaissance,
      gouvernorat,
      specialite,
      experience
    } = req.body;
  
    console.log('Données reçues (req.body):', req.body); // Ajoutez ce log
  
    try {
      // Vérifiez que tous les champs obligatoires sont présents
      if (!firstName || !lastName || !email || !civilite || !password || !confirmPassword || !dateNaissance || !gouvernorat || !specialite || !experience) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
      }
  
      // Vérifiez que les mots de passe correspondent
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
      }
  
      // Vérifiez si l'email existe déjà
      const emailExist = await Condidat.findOne({ email });
      if (emailExist) {
        return res.status(400).json({ message: 'Email existe déjà' });
      }
  
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Créer un nouveau candidat
      const newCondidat = new Condidat({
        firstName,
        lastName,
        email,
        civilite,
        password: hashedPassword,
        dateNaissance,
        gouvernorat,
        specialite,
        experience
      });
  
      // Sauvegarder le candidat dans la base de données
      await newCondidat.save();
  
      // Réponse de succès
      res.status(201).json({ message: 'Candidat enregistré avec succès' });
    } catch (error) {
      console.error('Erreur lors de la création du candidat:', error);
      res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
    }
  };

// Connexion
const loginCondidat = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const condidat = await Condidat.findOne({ email });
  
      if (!condidat) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
      }
  
      const validPassword = await bcrypt.compare(password, condidat.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }
  
      // Créer un token JWT
      const token = jwt.sign(
        { id: condidat._id, role: 'condidat' }, // Payload
        process.env.JWT_SECRET, // Clé secrète
        { expiresIn: '1h' } // Durée de validité
      );
  
      console.log('Token généré :', token); // Ajoutez ce log pour déboguer
  
      // Renvoyer le token dans la réponse
      res.status(200).json({
        success: true,
        token, // Assurez-vous que le token est inclus ici
        role: 'condidat',
        redirect: '/dashboard',
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

// Récupérer le profil
const getCondidatProfile = async (req, res) => {
  try {
    // Vérifier que req.user.id existe
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    // Récupérer le profil du candidat sans utiliser populate
    const condidat = await Condidat.findById(req.user.id).select('-password').exec();

    if (!condidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }

    // Générer l'URL pour l'image de profil et le CV
    const profileImageUrl = condidat.profileImage
      ? `${process.env.BASE_URL}/uploads/${condidat.profileImage}`
      : null;

    const cvUrl = condidat.cv
      ? `${process.env.BASE_URL}/uploads/${condidat.cv}`
      : null;

    // Pour chaque candidature, chercher l'offre correspondante
    const applicationsWithJobTitles = await Promise.all(
      condidat.applications.map(async (application) => {
        // Chercher l'offre associée dans la collection "Recruteur"
        const recruiter = await Recruteur.findOne({ "postedOffers._id": application.jobId }).exec();

        // Si un recruteur est trouvé et qu'il a des offres
        if (recruiter && recruiter.postedOffers) {
          // Chercher l'offre correspondant à jobId dans postedOffers
          const jobOffer = recruiter.postedOffers.find(offer => offer._id.toString() === application.jobId.toString());

          // Si l'offre est trouvée, récupérer son titre
          const jobTitle = jobOffer ? jobOffer.title : 'Offre non trouvée';

          return {
            ...application.toObject(),
            jobTitle,
          };
        } else {
          return {
            ...application.toObject(),
            jobTitle: 'Offre non trouvée',
          };
        }
      })
    );

    // Répondre avec les informations du candidat
    res.status(200).json({
      success: true,
      profileImage: profileImageUrl,
      cv: cvUrl,
      name: condidat.firstName + ' ' + condidat.lastName,
      firstName: condidat.firstName,
      lastName: condidat.lastName,
      email: condidat.email,
      civilite: condidat.civilite || 'Non spécifié',
      dateNaissance: condidat.dateNaissance || 'Non spécifié',
      gouvernorat: condidat.gouvernorat || 'Non spécifié',
      specialite: condidat.specialite || 'Non spécifié',
      experience: condidat.experience || 'Non spécifié',
      profileImage: condidat.profileImage || null,
      applications: applicationsWithJobTitles,  // Retourner les candidatures avec les titres et IDs des offres
      cv: condidat.cv || null,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Mettre à jour le profil du candidat
const updateCondidatProfile = async (req, res) => {
  const { firstName, lastName, email, civilite, password, dateNaissance, governorate, specialite, experience } = req.body;

  try {
    const condidat = await Condidat.findById(req.user.id);
    if (!condidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }

    // Upload de la nouvelle image de profil vers Cloudinary
    if (req.file) {
      console.log('Image reçue:', req.file); // Debug : afficher l'image reçue

      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'condidats/profiles'
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const uploadResult = await uploadFromBuffer();
      console.log('Upload Cloudinary réussi:', uploadResult); // Debug : afficher le résultat de l'upload

      // Vérification du lien Cloudinary retourné
      if (uploadResult && uploadResult.secure_url) {
        condidat.profileImage = uploadResult.secure_url;
      } else {
        console.error('Erreur Cloudinary: URL manquante');
        return res.status(500).json({ message: 'Erreur lors du téléchargement de l\'image sur Cloudinary' });
      }
    }

    // Mise à jour des autres champs
    condidat.firstName = firstName || condidat.firstName;
    condidat.lastName = lastName || condidat.lastName;
    condidat.email = email || condidat.email;
    condidat.civilite = civilite || condidat.civilite;
    condidat.dateNaissance = dateNaissance || condidat.dateNaissance;
    condidat.governorate = governorate || condidat.governorate;
    condidat.specialite = specialite || condidat.specialite;
    condidat.experience = experience || condidat.experience;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      condidat.password = await bcrypt.hash(password, salt);
    }

    await condidat.save();

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: condidat
    });

  } catch (err) {
    console.error('Erreur mise à jour profil:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


// Télécharger et enregistrer le CV
const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier CV téléchargé' });
    }

    // Générer l'URL du fichier téléchargé
    const cvUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

    // Mettre à jour le profil du candidat avec le lien du CV
    const condidat = await Condidat.findByIdAndUpdate(
      req.user.id,
      { cv: cvUrl },  // Enregistrer le chemin du CV
      { new: true }
    );

    if (!condidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: 'CV téléchargé avec succès',
      cv: cvUrl,  // Retourner le lien du CV
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du CV:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const postuler = async (req, res) => {
  try {
    console.log("Données reçues pour la candidature : ", req.body);
    console.log("Fichier reçu : ", req.file);

    const { offerId } = req.body;
    const cvUploaded = req.file;
    const condidatId = req.user.id;

    if (!cvUploaded) {
      return res.status(400).json({ message: 'Veuillez télécharger votre CV avant de postuler.' });
    }

    // Vérification de l'existence du candidat
    const condidat = await Condidat.findById(condidatId);
    if (!condidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }

    console.log("Candidat trouvé : ", condidat);

    // Vérifier si le candidat a déjà postulé à cette offre
    const alreadyApplied = condidat.applications.some(application => 
      application.jobId && application.jobId.toString() === offerId
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Vous avez déjà postulé à cette offre.' });
    }

    // Vérification de la validité de l'offerId
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({ message: 'ID d\'offre invalide' });
    }

    const offerObjectId = mongoose.Types.ObjectId(offerId);

    // Recherche de l'offre par l'ID de l'offre
    const recruteur = await Recruteur.findOne({ 'postedOffers._id': offerObjectId });
    if (!recruteur) {
      return res.status(404).json({ message: 'Recruteur ou offre non trouvée' });
    }

    // Trouver l'offre spécifique parmi les offres du recruteur
    const offer = recruteur.postedOffers.find(offer => offer._id.toString() === offerObjectId.toString());
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée dans les offres du recruteur' });
    }

    console.log("Offre trouvée : ", offer);

    // Vérification de l'ID de l'offre avant d'ajouter la candidature
    if (!offer._id || !mongoose.Types.ObjectId.isValid(offer._id)) {
      return res.status(400).json({ message: 'L\'ID de l\'offre est invalide' });
    }

    // Ajouter la candidature à la liste des candidatures du candidat
    const candidature = {
      jobId: offer._id,  // Utiliser directement l'ID de l'offre
      status: 'En attente',
      date: new Date(),
      cvUploaded: cvUploaded.path // Chemin du fichier téléchargé
    };

    console.log("Candidature à enregistrer : ", candidature);

    // Ajouter la candidature à la liste des candidatures du candidat
    condidat.applications.push(candidature);

    // Sauvegarder les modifications du candidat
    await condidat.save();

    // Incrémenter le nombre de CV reçus pour cette offre
    offer.cvReceived += 1;

    // Sauvegarder les modifications dans le recruteur
    await recruteur.save();

    console.log("Candidature enregistrée pour le candidat : ", condidat);
    console.log("Offre mise à jour : ", offer);

    res.status(200).json({ success: true, message: 'Candidature envoyée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la candidature:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


const getCandidatures = async (req, res) => {
  try {
    console.log('🔍 ID utilisateur:', req.user?.id);

    const condidat = await Condidat.findById(req.user.id)
      .populate({
        path: 'applications.jobId',
        select: 'title _id',
      });

    console.log('✅ Candidat trouvé :', condidat);

    if (!condidat) {
      console.log('❌ Candidat non trouvé');
      return res.status(404).json({ message: 'Condidat non trouvé' });
    }

    console.log('📦 Applications:', condidat.applications);

    res.json({ applications: condidat.applications });

  } catch (error) {
    console.error('🔥 Erreur attrapée dans catch:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des candidatures' });
  }
};



// Fonction pour récupérer tous les candidats
const getAllCondidats = async (req, res) => {
  try {
    // Récupérer tous les candidats sans leurs mots de passe
    const condidats = await Condidat.find().select('-password'); // Ne pas inclure le mot de passe dans la réponse

    if (!condidats || condidats.length === 0) {
      return res.status(404).json({ message: 'Aucun candidat trouvé' });
    }

    res.status(200).json({ condidats });
  } catch (error) {
    console.error('Erreur lors de la récupération des candidats:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getCondidatById = async (req, res) => {
  try {
    const condidat = await Condidat.findById(req.params.id)
      .select('-password'); // Ne pas inclure le mot de passe

    if (!condidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }

    res.status(200).json(condidat);
  } catch (error) {
    console.error('Erreur lors de la récupération du candidat:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const updateCandidatStatus = async (req, res) => {
  const { candidatId } = req.params;  // ID du candidat
  const { jobId, status } = req.body; // ID de l'offre et statut du candidat

  // Vérification du statut
  if (!['En attente', 'Accepté', 'Refusé'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  try {
    // Vérifier que le candidat existe
    const candidat = await Condidat.findById(candidatId);
    if (!candidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }

    // Trouver l'application correspondante pour l'offre donnée
    const applicationIndex = candidat.applications.findIndex(app => app.jobId.toString() === jobId.toString());

    if (applicationIndex === -1) {
      return res.status(404).json({ message: 'Application pour cette offre non trouvée' });
    }

    // Mettre à jour le statut de l'application
    candidat.applications[applicationIndex].status = status;

    // Sauvegarder les changements
    await candidat.save();
    res.status(200).json({ success: true, message: 'Statut du candidat mis à jour' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { registerCondidat, loginCondidat, getCondidatProfile, updateCondidatProfile, uploadCV, postuler, getCandidatures, getAllCondidats, getCondidatById, updateCandidatStatus };