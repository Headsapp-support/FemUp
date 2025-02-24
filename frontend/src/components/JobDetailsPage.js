import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/JobDetails.css';

const JobDetailsPage = () => {
  const { offerId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [userRole, setUserRole] = useState(null);  // Nouvel état pour stocker le rôle de l'utilisateur
  const [cvUploaded, setCvUploaded] = useState(false); // Vérification si le CV est téléchargé
  const navigate = useNavigate();

  // Fonction pour vérifier si l'utilisateur a déjà postulé
  const checkIfAlreadyApplied = useCallback(async (offer) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Récupère le rôle de l'utilisateur
  
    if (!token) {
      navigate('/connexion');
      return;
    }
  
    // Vérifie si l'utilisateur est un candidat avant de faire la requête
    if (role !== 'condidat') {
      console.log("L'utilisateur n'est pas un candidat, donc pas besoin de vérifier les candidatures.");
      return; // Ne fait rien si l'utilisateur est un recruteur
    }
  
    try {
      // Appel à une API qui retourne les candidatures de l'utilisateur
      const response = await axios.get('http://localhost:5000/api/condidat/candidatures', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Réponse de l\'API des candidatures:', response.data);
  
      const applications = response.data.applications;
  
      // Vérifier si applications existe et est un tableau
      if (Array.isArray(applications)) {
        const applied = applications.some(application => application.jobId && application.jobId.toString() === offer.id);
        setHasApplied(applied); // Mise à jour de l'état hasApplied
      } else {
        console.error('Les candidatures sont mal formatées ou absentes');
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
      const response = await axios.get(`http://localhost:5000/api/recruteur/offer/${offerId}`);
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
    // Vérifier le rôle de l'utilisateur depuis le localStorage
    const role = localStorage.getItem('role');  // Par exemple, 'condidat' ou 'recruteur'
    setUserRole(role);
  }, [offerId, fetchJobDetails]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!jobDetails) {
    return <p>Offre introuvable.</p>;
  }

  // Fonction pour vérifier et posteruler à l'offre
  const postuler = async () => {
    if (!cvUploaded) {
      alert('Vous devez télécharger votre CV avant de postuler.');
      return;
    }
  
    const formData = new FormData();
    formData.append('offerId', offerId);
    formData.append('cv', cvUploaded); // Ici, tu ajoutes le fichier au FormData
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/condidat/postuler', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Important pour envoyer le fichier correctement
        }
      });
  
      if (response.data.success) {
        alert('Votre candidature a été envoyée avec succès');
        setHasApplied(true); // Mise à jour de l'état pour refléter que l'utilisateur a postulé
      } else {
        alert('Une erreur s\'est produite lors de l\'envoi de votre candidature');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la candidature:', error);
      alert('Erreur lors de l\'envoi de votre candidature. Veuillez réessayer.');
    }
  };

  // Fonction pour gérer le téléchargement du CV
  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que le fichier est un PDF ou un autre type autorisé
      if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setCvUploaded(file);
      } else {
        alert('Seuls les fichiers PDF, DOC, ou DOCX sont autorisés');
      }
    }
  };  

  return (
    <div className="job-details-container">
      <header className="job-header">
        <h1 className="job-title">{jobDetails.title}</h1>
        <div className="job-meta">
          <span className="company-name">Client : <strong>{jobDetails.client}</strong></span>
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

      {/* Si l'utilisateur est un recruteur, ne montre pas le bouton de postulation */}
      {userRole === 'condidat' && (
        <section className="apply-section">
          {/* Ajout de l'input pour télécharger le CV */}
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleCvUpload} 
            className="cv-upload-input"
          />
          {!hasApplied ? (
            <button className="apply-btn" onClick={postuler}>Postuler maintenant</button>
          ) : (
            <p className="already-applied-message">Vous avez déjà postulé à cette offre.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default JobDetailsPage;
