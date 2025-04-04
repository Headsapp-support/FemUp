import React, { useState, useEffect, useCallback } from 'react';
import '../styles/RecruiterDashboard.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';

const RecruiterDashboard = () => {
  const [recruiterData, setRecruiterData] = useState({
    name: '',
    email: '',
    postedOffers: [],
    discussions: [],
  });
  const [offerCandidatureCounts, setOfferCandidatureCounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [offerToModify, setOfferToModify] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    title: '',
    location: '',
    category: '',
    description: '',
    client: '',
    requirements: '',
    budget: '',
    contact: '',
  });

  const navigate = useNavigate();

  const fetchProfileData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/connexion');
        return;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        localStorage.removeItem('token');
        navigate('/connexion');
        return;
      }

      const response = await axios.get('https://femup-1.onrender.com/api/recruteur/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const offerCounts = {};
      for (const offer of response.data.postedOffers) {
        const countResponse = await axios.get(`https://femup-1.onrender.com/api/recruteur/offres/${offer._id}/candidatures/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        offerCounts[offer._id] = countResponse.data.candidatureCount;
      }

      setRecruiterData({
        name: response.data.name || '',
        email: response.data.email || '',
        postedOffers: Array.isArray(response.data.postedOffers) ? response.data.postedOffers : [],
        discussions: Array.isArray(response.data.discussions) ? response.data.discussions : [],
      });

      setOfferCandidatureCounts(offerCounts);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil :', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        alert('Session expirée ou token invalide. Veuillez vous reconnecter.');
        navigate('/connexion');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const openModal = (type, offer = null) => {
    setModalType(type);
    setOfferToModify(offer);
    setFormValues({
      title: offer?.title || '',
      location: offer?.location || '',
      category: offer?.category || '',
      description: offer?.description || '',
      client: offer?.client || '',
      requirements: offer?.requirements || '',
      budget: offer?.budget || '',
      contact: offer?.contact || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setOfferToModify(null);
    setFormValues({
      title: '',
      location: '',
      category: '',
      description: '',
      client: '',
      requirements: '',
      budget: '',
      contact: '',
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmitNewOffer = async () => {
    if (Object.values(formValues).includes('')) {
      alert('Veuillez remplir tous les champs avant de soumettre.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://femup-1.onrender.com/api/recruteur/offres', formValues, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProfileData();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'offre:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleModifyOffer = async () => {
    if (Object.values(formValues).includes('')) {
      alert('Veuillez remplir tous les champs avant de soumettre.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const offerId = offerToModify?._id;
      if (!offerId) {
        alert('Offre invalide');
        return;
      }

      const response = await axios.put(`https://femup-1.onrender.com/api/recruteur/offres/${offerId}`, formValues, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecruiterData((prevData) => ({
        ...prevData,
        postedOffers: prevData.postedOffers.map((offer) =>
          offer._id === offerId ? { ...offer, ...response.data } : offer
        ),
      }));

      fetchProfileData(); // Refresh the data to reflect changes
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'offre:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://femup-1.onrender.com/api/recruteur/offres/${offerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecruiterData((prevData) => ({
          ...prevData,
          postedOffers: prevData.postedOffers.filter((offer) => offer._id !== offerId),
        }));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'offre:', error);
        alert(`Erreur: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const navigateToCandidats = (offerId) => {
    navigate(`/candidats/${offerId}`);
  };

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  return (
    <div className="recruiter-dashboard-container">
      <div className="profile-section">
        <h2>Bienvenue, {recruiterData.name}!</h2>
        <p>Email : {recruiterData.email}</p>
        <div className="profile-actions">
          <button className="btn-edit-profile" onClick={() => navigate('/Update', { state: { recruiterData } })}>
            Modifier mon profil
          </button>
        </div>
      </div>

      <div className="offer-section">
        <h3>Déposer une offre</h3>
        <button onClick={() => openModal('deposit')} className="btn-post-offer">
          Déposer une offre
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalType === 'deposit' ? 'Déposer une offre' : 'Modifier une offre'}</h3>
            <form>
              {Object.keys(formValues).map((key) => (
                <div className="form-group" key={key}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    type="text"
                    id={key}
                    placeholder={`Entrez le ${key}`}
                    value={formValues[key]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={modalType === 'deposit' ? handleSubmitNewOffer : handleModifyOffer}
                className="btn-submit"
              >
                {modalType === 'deposit' ? 'Déposer l\'offre' : 'Modifier l\'offre'}
              </button>
            </form>
            <button onClick={closeModal}>Fermer</button>
          </div>
        </div>
      )}

      <div className="posted-offers-section">
        <h3>Offres publiées</h3>
        <table className="posted-offers-table">
          <thead>
            <tr>
              <th>Poste</th>
              <th>Date de publication</th>
              <th>Status</th>
              <th>Candidatures</th>
            </tr>
          </thead>
          <tbody>
            {recruiterData.postedOffers.length > 0 ? (
              recruiterData.postedOffers.map((offer) => (
                <tr key={`offer-${offer._id}`}>
                  <td>{offer.title}</td>
                  <td>{offer.date ? new Date(offer.date).toLocaleDateString() : 'Date non définie'}</td>
                  <td>
                    {offer.status === 'approved' ? 'Postulé' : 
                     offer.status === 'pending' ? 'En attente' : 
                     offer.status === 'rejected' ? 'Rejeté' : 
                     'Statut inconnu'}
                  </td>
                  <td>{offerCandidatureCounts[offer._id] || 0}</td>
                  <td className="offer-actions">
                    <button onClick={() => openModal('modify', offer)} className="action-btn edit-btn">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button onClick={() => handleDeleteOffer(offer._id)} className="action-btn delete-btn">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <button onClick={() => navigateToCandidats(offer._id)} className="action-btn view-btn">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucune offre publiée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
