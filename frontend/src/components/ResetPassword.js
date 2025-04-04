import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResetPassword.css'; // Vous pouvez personnaliser le CSS

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();  // navigate est maintenant utilisé

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null); // Réinitialiser le message avant de soumettre

    try {
      const response = await fetch('https://femup-1.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Vous enverrez l'email dans la requête
      });

      const data = await response.json();

      if (response.ok) {
        // Affichage du message de confirmation
        setMessage('Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.');
        setError(null); // Réinitialiser l'erreur si l'email est valide

        // Rediriger vers la page de connexion après une réussite
        setTimeout(() => {
          navigate('/connexion');  // Utilisation de navigate pour rediriger
        }, 5000); // Attendre 2 secondes avant la redirection (pour laisser le temps à l'utilisateur de lire le message)
      } else {
        setError(data.message || 'Erreur lors de la récupération du mot de passe.');
        setMessage(null); // Réinitialiser le message de succès
      }
    } catch (error) {
      setError('Une erreur est survenue, veuillez réessayer plus tard.');
      setMessage(null); // Réinitialiser le message de succès
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Récupérer votre mot de passe</h2>
        <p>Entrez votre adresse e-mail pour recevoir un lien de réinitialisation du mot de passe.</p>

        {/* Affichage du message de succès ou d'erreur */}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Chargement...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </div>
        </form>

        <div className="back-to-login">
          <p>Vous vous souvenez de votre mot de passe ? <a href="/connexion">Retour à la connexion</a></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
