const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Récupérer le token d'autorisation dans l'en-tête
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Ajouter les informations du token à la requête
    req.recruteurId = decoded.id;

    console.log('Utilisateur décodé :', decoded);  // Log pour déboguer
    next();  // Passer à la prochaine étape (route ou autre middleware)
  } catch (error) {
    console.error('Erreur de vérification du token:', error);

    // Si le token est expiré, envoyer un message spécifique
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré. Veuillez vous reconnecter.' });
    }

    // Si le token est invalide, envoyer un message générique
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Token invalide.' });
    }

    // Dans tous les autres cas, envoyer un message générique
    return res.status(400).json({ message: 'Erreur inconnue avec le token.' });
  }
};

module.exports = auth;
