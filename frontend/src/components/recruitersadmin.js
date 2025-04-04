import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase, faChartBar, faPlus, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminDashboard.css';

const RecruteursAdmin = () => {
  // Déclaration des états
  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalRecruiter, setModalRecruiter] = useState(null);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recruitersPerPage] = useState(6);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await axios.get('https://femup-1.onrender.com/api/recruteur/recruiters');
        console.log('Recruteurs récupérés:', response.data); // Ajout du log pour vérifier les données
        setRecruiters(response.data);
        setFilteredRecruiters(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des recruteurs');
        console.error(error);
      }
    };
    fetchRecruiters();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredRecruiters(recruiters);
    } else {
      setFilteredRecruiters(
        recruiters.filter(recruiter =>
          recruiter.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recruiter.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, recruiters]);

  const indexOfLastRecruiter = currentPage * recruitersPerPage;
  const indexOfFirstRecruiter = indexOfLastRecruiter - recruitersPerPage;
  const currentRecruiters = filteredRecruiters.slice(indexOfFirstRecruiter, indexOfLastRecruiter);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = async (recruteur) => {
    console.log("Recruteur passé à openModal :", recruteur); // Log l'objet recruteur
    if (!recruteur._id) {
      console.error("L'ID du recruteur est manquant dans l'objet recruteur");
      setError("L'ID du recruteur est manquant.");
      return;
    }
    
    try {
        const response = await axios.get(`https://femup-1.onrender.com/api/recruteur/recruteurs/${recruteur._id}`);
      console.log("Réponse du backend avec les détails du recruteur :", response.data); // Log la réponse
      setModalRecruiter(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des détails du recruteur');
      console.error(error);
    }
  };    

  const closeModal = () => {
    setModalRecruiter(null);
  };

  const totalPages = Math.ceil(filteredRecruiters.length / recruitersPerPage);

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
          <h2>Liste des Recruteurs</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un recruteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Affichage des recruteurs ou erreur */}
          {error ? (
            <div>{error}</div>
          ) : (
            <>
              <table className="recruiter-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecruiters.length > 0 ? (
                    currentRecruiters.map((recruiter) => (
                      <tr key={recruiter._id}>
                        <td>{recruiter.fullName}</td>
                        <td>{recruiter.email}</td>
                        <td>{recruiter.companyName}</td>
                        <td>
                          <button onClick={() => openModal(recruiter)}>Voir détails</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Aucun recruteur trouvé</td>
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
            </>
          )}
        </section>

        {/* Modal pour afficher les détails du recruteur */}
        {modalRecruiter && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>×</span>
              <h2>Détails du recruteur</h2>
              <p><strong>Nom:</strong> {modalRecruiter.fullName}</p>
              <p><strong>Email:</strong> {modalRecruiter.email}</p>
              <p><strong>Entreprise:</strong> {modalRecruiter.companyName}</p>
              <p><strong>Téléphone:</strong> {modalRecruiter.phone}</p>
              <p><strong>Adresse:</strong> {modalRecruiter.address}</p>
              <p><strong>Description:</strong> {modalRecruiter.description}</p>
              <p><strong>Secteur:</strong> {modalRecruiter.sector}</p>
              {modalRecruiter.logo && (
                <p><strong>Logo:</strong> <img src={`https://femup-1.onrender.com/uploads/${modalRecruiter.logo}`} alt="Logo" width="100" /></p>
              )}
              <div className="modal-footer">
                <button onClick={closeModal}>Fermer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruteursAdmin;
