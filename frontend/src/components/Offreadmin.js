import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase, faChartBar, faPlus, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminDashboard.css';

const OffersAdmin = () => {
  // Déclaration des états
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOffer, setModalOffer] = useState(null);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [offersPerPage] = useState(6);

  // Récupérer les offres publiées
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('https://femup-1.onrender.com/api/recruteur/all-offers');
        setOffers(response.data.offers);
        setFilteredOffers(response.data.offers);
      } catch (error) {
        setError('Erreur lors de la récupération des offres');
      }
    };

    fetchOffers();
  }, []);

  // Filtrage des offres par titre, catégorie ou client
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredOffers(offers); // Reset à la liste complète des offres
    } else {
      const result = offers.filter(offer =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOffers(result);
    }
  }, [searchQuery, offers]);

  // Pagination
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = async (offer) => {
    try {
      const response = await axios.get(`https://femup-1.onrender.com/api/recruteur/offres/${offer._id}`);
      setModalOffer(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des détails de l\'offre');
    }
  };

  const closeModal = () => {
    setModalOffer(null);
  };

  if (error) {
    return <div>{error}</div>;
  }

  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

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
          <h2>Liste des Offres</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une offre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <table className="recruiter-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Client</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOffers.length > 0 ? (
                currentOffers.map((offer) => (
                  <tr key={offer._id}>
                    <td>{offer.title}</td>
                    <td>{offer.category}</td>
                    <td>{offer.client}</td>
                    <td>{new Date(offer.date).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => openModal(offer)}>Voir détails</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Aucune offre trouvée</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </section>

        {/* Modal pour afficher les détails de l'offre */}
        {modalOffer ? (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>×</span>
              <h2>Détails de l'Offre</h2>
              <p><strong>Titre:</strong> {modalOffer.title}</p>
              <p><strong>Catégorie:</strong> {modalOffer.category}</p>
              <p><strong>Client:</strong> {modalOffer.client}</p>
              <p><strong>Description:</strong> {modalOffer.description}</p>
              <p><strong>Exigences:</strong> {modalOffer.requirements}</p>
              <p><strong>Budget:</strong> {modalOffer.budget}</p>
              <p><strong>Contact:</strong> {modalOffer.contact}</p>
              <p><strong>Date de publication:</strong> {new Date(modalOffer.date).toLocaleDateString()}</p>
              <div className="modal-footer">
                <button onClick={closeModal}>Fermer</button>
              </div>
            </div>
          </div>
        ) : (
          <div>...</div>
        )}
      </div>
    </div>
  );
};

export default OffersAdmin;
