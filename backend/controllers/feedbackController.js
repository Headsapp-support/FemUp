const Feedback = require('../models/Feedback');
const Condidat = require('../models/Condidat'); // Référence au modèle Condidat

// Soumettre un avis
const submitFeedback = async (req, res) => {
  const { feedback } = req.body;  // Récupérer l'avis envoyé par le candidat

  if (!feedback || feedback.trim().length === 0) {
    return res.status(400).json({ message: "L'avis ne peut pas être vide." });
  }

  try {
    // Vérifier que le candidat existe
    const condidat = await Condidat.findById(req.user.id);
    if (!condidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }

    // Créer un nouvel avis
    const newFeedback = new Feedback({
      condidat: condidat._id,  // Lier l'avis au candidat
      text: feedback
    });

    await newFeedback.save();  // Sauvegarder l'avis dans la base de données

    // Répondre avec succès
    res.status(201).json({
      success: true,
      message: 'Votre avis a été partagé avec succès.',
      feedback: newFeedback
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'avis:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer.' });
  }
};

// Récupérer tous les avis
const getAllfeedbacks = async (req, res) => {
    try {
      // Trouver tous les avis associés aux candidats
      const feedbacks = await Feedback.find().populate('condidat', 'firstName lastName');  // Récupérer les candidats liés aux avis

      // Mapper les avis et créer une liste
      const allFeedbacks = feedbacks.map(feedback => ({
        text: feedback.text,  // L'avis
        author: `${feedback.condidat.firstName} ${feedback.condidat.lastName}`,  // Nom du candidat
      }));

      res.status(200).json(allFeedbacks);  // Retourner les avis
    } catch (error) {
      console.error('Erreur lors de la récupération des expériences:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des expériences' });
    }
};

module.exports = { submitFeedback, getAllfeedbacks };
