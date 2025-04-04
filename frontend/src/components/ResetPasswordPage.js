import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ResetPasswordPage.css'; // Personnalisez le style selon vos besoins

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { resetToken } = useParams();  // Récupérer le token de l'URL

  useEffect(() => {
    if (!resetToken) {
      setError('Le token de réinitialisation est manquant.');
    }
  }, [resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://femup-1.onrender.com/api/auth/reset-password/${resetToken}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        alert('Votre mot de passe a été réinitialisé avec succès.');
        navigate('/connexion');  // Rediriger vers la page de connexion après le succès
      } else {
        setError(data.message || 'Erreur lors de la réinitialisation du mot de passe.');
      }
    } catch (error) {
      setError('Une erreur est survenue, veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Réinitialiser votre mot de passe</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Votre mot de passe a été réinitialisé avec succès !</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              placeholder="Entrez votre nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={isLoading} href="/connexion">
              {isLoading ? 'Chargement...' : 'Réinitialiser le mot de passe'}
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

export default ResetPasswordPage;
