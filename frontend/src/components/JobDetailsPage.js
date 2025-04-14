import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/JobDetails.css';

// Spinner de chargement
const Loader = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

const JobDetailsPage = () => {
  const { offerId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [cvUploaded, setCvUploaded] = useState(null); // Vérification si le CV est téléchargé
  const [applying, setApplying] = useState(false); // Indicateur pour savoir si la postulation est en cours
  const navigate = useNavigate();

  // Fonction pour vérifier si l'utilisateur a déjà postulé
  const checkIfAlreadyApplied = useCallback(async (offer) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      navigate('/connexion');
      return;
    }
    
    if (role !== 'condidat') {
      console.log("L'utilisateur n'est pas un candidat.");
      return;
    }
    
    try {
      const response = await axios.get('https://femup-1.onrender.com/api/condidat/candidatures', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const applications = response.data.applications;
  
      if (Array.isArray(applications)) {
        const applied = applications.some(application => {
          if (application && application.jobId && application.jobId._id) {
            return application.jobId._id.toString() === offer.id;
          } else {
            return false;
          }
        });
  
        setHasApplied(applied); // Mise à jour de l'état hasApplied
      } else {
        setError('Erreur de données : Les candidatures sont mal formatées ou absentes');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des candidatures :', error);
      setError('Erreur de vérification des candidatures');
    }
  }, [navigate]);  

  // Fonction pour récupérer les détails de l'offre
  const fetchJobDetails = useCallback(async () => {
    try {
      const response = await axios.get(`https://femup-1.onrender.com/api/recruteur/offer/${offerId}`);
      setJobDetails(response.data.offer);
      checkIfAlreadyApplied(response.data.offer); // Vérification après récupération des détails
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de l\'offre:', err);
      setError('Erreur de chargement des détails de l\'offre');
    } finally {
      setLoading(false);
    }
  }, [offerId, checkIfAlreadyApplied]);

  // Chargement des détails de l'offre dès que l'ID de l'offre est disponible
  useEffect(() => {
    if (offerId) {
      fetchJobDetails();
    }
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, [offerId, fetchJobDetails]);

  useEffect(() => {
    // Re-vérifier si l'utilisateur a postulé chaque fois que l'on charge l'offre
    if (jobDetails) {
      checkIfAlreadyApplied(jobDetails);  // Vérifier si l'utilisateur a déjà postulé
    }
  }, [jobDetails, checkIfAlreadyApplied]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!jobDetails) {
    return <p>Offre introuvable.</p>;
  }
  

  // Fonction pour gérer le téléchargement du CV
  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 5 * 1024 * 1024; // Limite de 5 Mo

    if (!validTypes.includes(file.type)) {
      alert('Formats acceptés : PDF, DOC, DOCX');
      return;
    }

    if (file.size > maxSize) {
      alert('Fichier trop lourd. Max 5MB.');
      return;
    }

    setCvUploaded(file);
  };

  const postuler = async () => {
    if (!cvUploaded) {
      alert('Veuillez choisir un CV avant de postuler.');
      return;
    }

    const formData = new FormData();
    formData.append('offerId', offerId);
    formData.append('cv', cvUploaded); // 👈 'cv' doit correspondre à la clé backend

    const token = localStorage.getItem('token');

    // 🧪 DEBUG — voir ce qui est envoyé
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      setApplying(true);
      const response = await axios.post(
        'https://femup-1.onrender.com/api/condidat/postuler',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // PAS besoin de content-type ici, axios le gère pour multipart/form-data
          }
        }
      );

      console.log("Réponse du backend:", response.data); // Débogage
      if (response.data.success) {
        alert('✅ Candidature envoyée');
        console.log("✅ Lien du CV Cloudinary :", response.data.cvUrl); // Débogage
        setHasApplied(true);
      } else {
        alert('Une erreur est survenue.');
      }
    } catch (error) {
      console.error('❌ Erreur de postulation:', error);
      alert(error.response?.data?.message || 'Erreur serveur.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="job-details-container">
      <header className="job-header">
        <h1 className="job-title">{jobDetails.title}</h1>
        <div className="job-meta">
          <span className="company-name">Secteur : <strong>{jobDetails.client}</strong></span>
          <span className="job-location">Lieu : <strong>{jobDetails.location}</strong></span>
        </div>
      </header>

      <section className="job-description">
        <h2 className="section-title">Description du travail</h2>
        <p>{jobDetails.description}</p>
      </section>

      <section className="job-requirements">
        <h2 className="section-title">Exigences</h2>
        {Array.isArray(jobDetails.requirements) && jobDetails.requirements.length > 0 ? (
          <ul>
            {jobDetails.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        ) : (
          <p>Aucune exigence spécifiée pour ce poste.</p>
        )}
      </section>

      <section className="job-budget">
        <h2 className="section-title">Budget</h2>
        <p className="budget-value">{jobDetails.budget}</p>
      </section>

      <section className="contact-details">
        <h2 className="section-title">Contact</h2>
        <p>Veuillez envoyer votre CV à : <strong>{jobDetails.contact}</strong></p>
      </section>

      {/* Si l'utilisateur est un candidat */}
      {userRole === 'condidat' && (
        <section className="apply-section">
          {/* Si l'utilisateur n'a pas postulé */}
          {!hasApplied && (
            <>
              {/* Ajout de l'input pour télécharger le CV */}
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleCvUpload} 
                name="cv"
                className="cv-upload-input"
              />
              <button 
                className="apply-btn" 
                onClick={postuler} 
                disabled={applying} // Désactive le bouton pendant la postulation
              >
                {applying ? 'Postulation en cours...' : 'Postuler maintenant'}
              </button>
            </>
          )}

          {/* Si l'utilisateur a déjà postulé */}
          {hasApplied && (
            <p className="already-applied-message">Vous avez déjà postulé à cette offre.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default JobDetailsPage;
