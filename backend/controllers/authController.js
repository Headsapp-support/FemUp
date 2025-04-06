const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importez JWT
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Condidat = require('../models/Condidat');
const Recruteur = require('../models/Recruteur');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérification pour l'admin
    if (email === 'admin@gmail.com' && password === 'admin') {
      const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        role: 'admin',
        redirect: '/Admin_Dashboard',
      });
    }
    // Vérifier si l'email appartient à un candidat
    const condidat = await Condidat.findOne({ email });
    if (condidat) {
      console.log('Candidat trouvé:', condidat); // Vérifie que le candidat est trouvé dans la base de données
      const isMatch = await bcrypt.compare(password, condidat.password);  // Comparer le mot de passe
      if (isMatch) {
        console.log('Mot de passe correct pour le candidat');

        // Générer un token JWT
        const token = jwt.sign(
          { id: condidat._id, role: 'condidat' }, // Payload
          process.env.JWT_SECRET, // Clé secrète
          { expiresIn: '24h' } // Durée de validité
        );

        console.log('Token généré pour le candidat :', token);

        // Renvoyer le token dans la réponse
        return res.json({
          success: true,
          token, // Ajoutez le token ici
          role: 'condidat',
          redirect: '/dashboard',
        });
      } else {
        console.log('Mot de passe incorrect pour le candidat');
        return res.status(400).json({ message: 'Mot de passe incorrect pour le candidat' });
      }
    }

    // Vérifier si l'email appartient à un recruteur
    const recruteur = await Recruteur.findOne({ email });
    if (recruteur) {
      console.log('Recruteur trouvé:', recruteur);
      const isMatch = await bcrypt.compare(password, recruteur.password);  // Comparer le mot de passe
      if (isMatch) {
        console.log('Mot de passe correct pour le recruteur');

        // Générer un token JWT
        const token = jwt.sign(
          { id: recruteur._id, role: 'recruteur' }, // Payload
          process.env.JWT_SECRET, // Clé secrète
          { expiresIn: '24h' } // Durée de validité
        );

        console.log('Token généré pour le recruteur :', token);

        // Renvoyer le token dans la réponse
        return res.json({
          success: true,
          token, // Ajoutez le token ici
          role: 'recruteur',
          redirect: '/Dashboard_Emploiyeur',
        });
      } else {
        console.log('Mot de passe incorrect pour le recruteur');
        return res.status(400).json({ message: 'Mot de passe incorrect pour le recruteur' });
      }
    }

    // Si l'email n'existe pas dans les deux collections
    console.log('Utilisateur non trouvé');
    return res.status(404).json({ message: 'Utilisateur non trouvé' });

  } catch (error) {
    console.error('Erreur de connexion:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Créer un transporteur pour l'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Remplacez par votre email
    pass: 'your-email-password',   // Remplacez par votre mot de passe
  }
});

// Fonction pour demander la réinitialisation du mot de passe
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Requête reçue avec email:', email); // Log de la requête

    let user = await Condidat.findOne({ email }) || await Recruteur.findOne({ email });

    if (!user) {
      console.error('Utilisateur non trouvé pour l\'email:', email); // Log si utilisateur non trouvé
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    console.log('Utilisateur trouvé:', user); // Log de l'utilisateur trouvé

    // Génération du token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 heure
    await user.save();

    console.log('Token généré:', resetToken); // Log de génération de token

    // Configuration de l'email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nadaznegui@gmail.com',
        pass: 'abiz bfyf eldv iyye',
      },
    });

    const resetUrl = `https://fem-up-casm.vercel.app/changer-mot-de-passe/${resetToken}`;

    const message = {
      from: 'nadaznegui@gmail.com',
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetUrl}`,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.error('Erreur d\'envoi de l\'email:', err); // Log d'erreur d'email
        return res.status(500).json({ message: 'Erreur d\'envoi de l\'email.' });
      }

      console.log('Email envoyé:', info); // Log du succès d'envoi
      res.status(200).json({ message: 'Email envoyé avec succès.' });
    });
  } catch (error) {
    console.error('Erreur dans le traitement de la demande : ', error);  // Log d'erreur dans le try-catch
    res.status(500).json({ message: 'Une erreur est survenue.' });
  }
};


// Fonction pour réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  let user;

  try {
    user = await Condidat.findOne({ resetPasswordToken: resetToken, resetPasswordExpire: { $gt: Date.now() } }) || await Recruteur.findOne({ resetPasswordToken: resetToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Effacer les informations de réinitialisation
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = { login, forgotPassword, resetPassword };