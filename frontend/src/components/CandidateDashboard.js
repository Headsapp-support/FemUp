import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/CandidateDashboard.css';
import { FaArrowLeft } from 'react-icons/fa'; // Icône flèche

const CandidateDashboard = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    applications: [],
    cv: null,  // Le CV sera maintenant un lien URL
  });

  const [isFormVisible, setIsFormVisible] = useState(false); // Ajouter un état pour afficher ou masquer le formulaire d'avis
  const [feedback, setFeedback] = useState(""); // Etat pour gérer le contenu de l'avis
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Message de confirmation de l'avis
  const navigate = useNavigate();
  const tokenRef = useRef(localStorage.getItem('token'));

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé');
          navigate('/connexion');
          return;
        }
  
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          alert('Votre session a expiré. Veuillez vous reconnecter.');
          navigate('/connexion');
          return;
        }
  
        const response = await axios.get('https://femup-1.onrender.com/api/condidat/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setProfileData({
          ...response.data,
          applications: response.data.applications.map(application => ({
            ...application,
            jobTitle: application.jobTitle || 'Offre non trouvée', // Utilisation de 'jobTitle' ici
          })),
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        alert('Erreur lors du téléchargement des données du profil. Veuillez réessayer.');
      }
    };
  
    fetchProfileData();
  }, [navigate]);

  const handleDownloadCV = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('cv', file);

      try {
        const response = await axios.post('https://femup-1.onrender.com/api/condidat/uploads', formData, {
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setProfileData({
          ...profileData,
          cv: response.data.cv,  // Le backend renvoie l'URL du CV
        });
        alert('CV téléchargé avec succès');
      } catch (error) {
        console.error('Erreur lors du téléchargement du CV:', error);
        alert('Erreur lors du téléchargement du CV. Veuillez réessayer.');
      }
    }
  };

  const handleEditProfile = () => {
    navigate('/settings', { state: { profileData } });
  };

  const handleToggleFeedbackForm = () => {
    setIsFormVisible(!isFormVisible); // Toggle form visibility
  };

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
  
    if (!feedback.trim()) {
      setFeedbackMessage("L'avis ne peut pas être vide.");
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://femup-1.onrender.com/api/condidat/submit-feedback', { feedback }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.success) {
        setFeedbackMessage("Votre avis a été partagé avec succès !");
        setFeedback(""); // Réinitialiser le champ après l'envoi
  
        // Ajouter l'avis à la liste des expériences (en l'ayant déjà récupéré dans le backend)
        // Cette logique peut être modifiée si vous avez une gestion des expériences dans le frontend
      } else {
        setFeedbackMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'avis:', error);
      setFeedbackMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };  

  return (
    <div className="dashboard-container">
      <div className="profile-section">
        <h2>Bienvenue, {profileData.name || 'Utilisateur'}!</h2>
        <p>Email : {profileData.email || 'Non disponible'}</p>
        <div className="profile-actions">
          <button className="btn-edit-profile" onClick={handleEditProfile}>
            Modifier mon profil
          </button>
          
          <input
            type="file"
            id="cv-upload"
            className="hidden-input"
            accept=".pdf,.doc,.docx"
            onChange={handleDownloadCV}
          />
        </div>

        {profileData.cv && (
          <div className="cv-preview">
            <p>CV téléchargé : 
              <a 
                href={`https://femup-1.onrender.com/uploads/${profileData.cv}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                download
              >
                Télécharger votre CV
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="actions-section">
        <button className="btn-Avis" onClick={handleToggleFeedbackForm}>
          {isFormVisible ? 'Annuler' : 'Partager votre avis'}
        </button>
        <button className="btn-discussion">
          <Link to="/discussion">Discussion</Link>
        </button>
        <button className="btn-follow-responses">
          <Link to="">Suivi des réponses</Link>
        </button>
      </div>

      {isFormVisible && (
        <div className="feedback-form">
          <h3>Partagez votre avis</h3>
          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Écrivez votre avis ici..."
              required
            />
            <button type="submit">Envoyer l'avis</button>
          </form>
          {feedbackMessage && <p>{feedbackMessage}</p>}
        </div>
      )}

      <div className="applications-section">
        <h3>Mes candidatures</h3>
        <table className="applications-table">
          <thead>
            <tr>
              <th>Offre</th>
              <th>Date de candidature</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {profileData.applications && profileData.applications.length > 0 ? (
              profileData.applications.map((application, index) => (
                <tr key={index}>
                  <td>
                    {application.jobTitle || 'Offre non disponible'}
                    {application.offerId && (
                      <Link to={`/offre/${application.offerId}`} className="back-to-offer-link">
                        <FaArrowLeft className="back-to-offer-icon" />
                      </Link>
                    )}
                  </td>
                  <td>{new Date(application.date).toLocaleDateString() || 'Date non disponible'}</td>
                  <td className={`status ${application.status?.toLowerCase() || ''}`}>
                    {application.status || 'Statut non disponible'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Aucune candidature trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateDashboard;
