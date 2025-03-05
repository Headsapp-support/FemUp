import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faCheck, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import '../styles/CandidatsList.css';  // Importation du fichier CSS global

const CandidatsList = () => {
  const { offerId } = useParams();
  const [candidats, setCandidats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidats = async () => {
      if (!offerId) return;
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour voir les candidats.');
        return;
      }

      try {
        const response = await axios.get(`https://femup-1.onrender.com/api/recruteur/offres/${offerId}/candidats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.candidats) {
          setCandidats(response.data.candidats);
        } else {
          setError('Aucun candidat trouvé pour cette offre.');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('L\'offre ou les candidats ne sont pas trouvés.');
        } else {
          setError('Erreur lors de la récupération des candidats.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidats();
  }, [offerId]);

  const handleViewProfile = (candidat) => {
    setSelectedCandidat(candidat);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCandidat(null);
  };

  const handleDownloadCV = (cvLink) => {
    if (!cvLink) {
      alert('CV non disponible');
      return;
    }
  
    // Si le lien est relatif, on le transforme en lien absolu
    const baseUrl = "https://femup-1.onrender.com"; // Remplace par l'URL de ton backend
    const fullUrl = cvLink.startsWith('http') ? cvLink : `${baseUrl}${cvLink}`;
  
    if (fullUrl.includes('undefined')) {
      alert('Erreur: L\'URL du CV est invalide.');
      return;
    }
  
    // Ouvre le CV dans un nouvel onglet
    window.open(fullUrl, '_blank');
  };
  

  const handleStatusChange = async (candidatId, status) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté pour changer le statut.');
            return;
        }

        if (!offerId) {
            alert('Aucune offre associée.');
            return;
        }

        const response = await axios.patch(
            `https://femup-1.onrender.com/api/recruteur/offres/${offerId}/candidats/status`,
            { candidatId, status },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Vérifier si la réponse est un succès
        if (response.data.success) {
            setCandidats((prevCandidats) =>
                prevCandidats.map((candidat) =>
                    candidat._id === candidatId ? { ...candidat, status } : candidat
                )
            );
            alert(`Candidat ${status} avec succès`);
        } else {
            alert('Erreur lors de la mise à jour du statut.');
        }
    } catch (error) {
        // Vérification si l'erreur est dans la réponse du serveur
        if (error.response) {
            console.error('Erreur lors de la mise à jour du statut:', error.response.data);
            alert(error.response.data.message || 'Erreur lors de la mise à jour du statut.');
        } else {
            console.error('Erreur lors de la mise à jour du statut:', error.message);
            alert('Erreur lors de la mise à jour du statut.');
        }
    }
};

if (isLoading) {
    return (
        <div className="loadingSpinner">
            <Spinner animation="border" variant="primary" />
        </div>
    );
}

  return (
    <div key={offerId} className="containerCandidatsList">
      <h2 className="titrePage">Tous les Candidats pour cette Offre</h2>
      <div className="containerCandidatsCards">
        {error ? (
          <div className="errorMessage">{error}</div>
        ) : candidats.length > 0 ? (
          candidats.map((candidat) => (
            <Card key={candidat._id} className="candidatCard">
              <Card.Img
                variant="top"
                src={candidat.profileImage || '/default-profile.png'}
                alt="Candidat Profile"
                className="candidatCardImg"
              />
              <Card.Body className="candidatCardBody">
                <h5>{candidat.firstName} {candidat.lastName}</h5>
                <p><strong>Email:</strong> {candidat.email}</p>
                <p><strong>Spécialité:</strong> {candidat.specialite}</p>
                <p><strong>Expérience:</strong> {candidat.experience || 'Non précisé'}</p>
                <div className="candidatCardActions">
                  <Button className="btnView" onClick={() => handleViewProfile(candidat)}>
                    <FontAwesomeIcon icon={faEye} /> Voir Profil
                  </Button>
                  <Button 
                    className="btnDownload" 
                    onClick={() => handleDownloadCV(candidat.cvUploaded)}
                    disabled={!candidat.cvUploaded} // Désactive le bouton si aucun CV n'est disponible
                  >
                    <FontAwesomeIcon icon={faDownload} /> {candidat.cvUploaded ? "Télécharger CV" : "CV non disponible"}
                  </Button>
                </div>

                <div className="candidatCardMiniActions">
                  <Button variant="success" size="sm" onClick={() => handleStatusChange(candidat._id, 'Accepté')}>
                    <FontAwesomeIcon icon={faCheck} /> Accepter
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleStatusChange(candidat._id, 'Refusé')}>
                    <FontAwesomeIcon icon={faTimes} /> Refuser
                  </Button>
                  <Button variant="warning" size="sm" onClick={() => handleStatusChange(candidat._id, 'Préselectionné')}>
                    <FontAwesomeIcon icon={faEdit} /> Pré-sélectionner
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div>Aucun candidat trouvé.</div>
        )}
      </div>

      {selectedCandidat && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Profil de {selectedCandidat.firstName} {selectedCandidat.lastName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="profileDetails">
              <img src={selectedCandidat.profileImage || '/default-profile.png'} alt="Profile" className="profileImg" />
              <div className="profileInfo">
                <p><strong>Email:</strong> {selectedCandidat.email}</p>
                <p><strong>Civilité:</strong> {selectedCandidat.civilite}</p>
                <p><strong>Date de Naissance:</strong> {new Date(selectedCandidat.dateNaissance).toLocaleDateString()}</p>
                <p><strong>Spécialité:</strong> {selectedCandidat.specialite}</p>
                <p><strong>Expérience:</strong> {selectedCandidat.experience || 'Non spécifiée'}</p>
                <p><strong>Gouvernorat:</strong> {selectedCandidat.gouvernorat}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CandidatsList;
