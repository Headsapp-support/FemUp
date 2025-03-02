import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase, faChartBar, faPlus, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const ControleAcces = () => {
  const [pendingOffers, setPendingOffers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer les offres en attente
  const fetchPendingOffers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Vous devez être connecté pour accéder à cette page.');
        navigate('/login'); // Rediriger vers la page de login si pas de token
        return;
      }
  
      const response = await axios.get('https://femup-1.onrender.com/api/admin/en-attente', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Réponse de l\'API:', response);  // Vérifie ce qui est renvoyé
      setPendingOffers(response.data || []); // Assurez-vous que response.data.offers existe
    } catch (error) {
      console.error('Erreur lors de la récupération des offres en attente:', error);
      if (error.response) {
        if (error.response.status === 401) {
          alert('Session expirée ou non autorisée. Veuillez vous reconnecter.');
          navigate('/login');
        } else {
          alert('Erreur inconnue lors de la récupération des offres.');
        }
      } else {
        alert('Problème de connexion au serveur.');
      }
    }
  }, [navigate]);

  // Utilisation de useEffect pour charger les offres au démarrage
  useEffect(() => {
    fetchPendingOffers();
  }, [fetchPendingOffers]);

  // Fonction pour accepter une offre
  const acceptOffer = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour accepter une offre.');
        navigate('/login');
        return;
      }

      await axios.put(`https://femup-1.onrender.com/api/admin/${offerId}/accepter`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Rafraîchir les offres après acceptation
      fetchPendingOffers();
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de l\'offre:', error);
      alert('Une erreur est survenue');
    }
  };

  // Fonction pour rejeter une offre
  const rejectOffer = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour rejeter une offre.');
        navigate('/login');
        return;
      }

      await axios.put(`https://femup-1.onrender.com/api/admin/${offerId}/rejeter`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('L\'offre a été rejetée');
    
      // Mise à jour de l'état des offres en attente dans le composant Admin
      setPendingOffers(prevOffers => prevOffers.map(offer => 
        offer._id === offerId ? { ...offer, status: 'Éjecté' } : offer
      ));

      // Rafraîchir les offres en attente pour refléter la mise à jour
      fetchPendingOffers(); // Appel pour actualiser la liste des offres
    } catch (error) {
      console.error('Erreur lors du rejet de l\'offre:', error);
      alert('Une erreur est survenue');
    }
  };

  return (
    <div className="admin-dashboard">
    <div className="sidebar">
      <nav>
        <ul>
          <li><Link to="/Admin_Dashboard"><FontAwesomeIcon icon={faChartBar} /> Tableau de bord</Link></li>
          <li><Link to="/admin/candidates"><FontAwesomeIcon icon={faUsers} /> Candidats</Link></li>
          <li><Link to="/admin/recruiters"><FontAwesomeIcon icon={faBriefcase} /> Recruteurs</Link></li>
          <li><Link to="/admin/offers"><FontAwesomeIcon icon={faBriefcase} /> Offres</Link></li>
          <li><Link to="/admin/controle"><FontAwesomeIcon icon={faBriefcase} /> Contrôle d'Offres</Link></li>
          <li><Link to="/admin/articles"><FontAwesomeIcon icon={faFileAlt} /> Articles</Link></li>
          <li><Link to="/admin/entreprise"><FontAwesomeIcon icon={faPlus} /> Ajouter une entreprise</Link></li>
          <li><Link to="/admin/Contact">Formulaire de Contact </Link></li>
        </ul>
      </nav>
    </div>
    
    <div className="content">
    <section className="recruiter-section">
      <h2>Offres en attente d'approbation</h2>
      <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un offre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
      {pendingOffers.length === 0 ? (
        <p>Aucune offre en attente.</p>
      ) : (
        <table className="candidate-table" >
          <thead>
            <tr>
              <th>Titre de l'offre </th>
              <th>Recruteur</th>
              <th>Date de publication</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingOffers.map((offer) => {
              const offerDate = offer.date ? new Date(offer.date).toLocaleDateString() : 'Date invalide';
              const offerStatut = offer.status || 'pending';

              return (
                <tr key={offer._id}>
                  <td>{offer.title}</td>
                  <td>{offer.recruiter?.fullName || 'Recruteur inconnu'}</td>
                  <td>{offerDate}</td>
                  <td>
                    {offerStatut === 'pending' ? (
                      <>
                        <button onClick={() => acceptOffer(offer._id)} className="button-spacing" >Accepter</button>
                        <button onClick={() => rejectOffer(offer._id)}>Rejeter</button>
                      </>
                    ) : (
                      <span>{offerStatut === 'approved' ? 'Approuvée' : 'Refusée'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
                
    </section>
    </div>
    </div>
  );
};

export default ControleAcces;
