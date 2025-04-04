import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase, faChartBar, faPlus, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminDashboard.css';

const Condidatadmin = () => {
  // Déclaration des états
  const [Condidats, setCondidats] = useState([]);
  const [filteredCondidats, setFilteredCondidats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalCondidat, setModalCondidat] = useState(null);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [CondidatsPerPage] = useState(6);

  useEffect(() => {
    const fetchCondidats = async () => {
      try {
        const response = await axios.get('https://femup-1.onrender.com/api/condidats');
        console.log('Données des candidats:', response.data);  // Vérifier la structure exacte ici
  
        // Vérifie si la clé 'condidats' existe et si elle est bien un tableau
        if (response.data && Array.isArray(response.data.condidats)) {
          setCondidats(response.data.condidats);  // Utilise response.data.condidats
          setFilteredCondidats(response.data.condidats);
        } else {
          setError("Les données des candidats ne sont pas un tableau.");
        }
      } catch (error) {
        setError('Erreur lors de la récupération des candidats');
        console.error(error);
      }
    };
  
    fetchCondidats();
  }, []);  
   
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCondidats(Condidats); // Reset à la liste complète des candidats
    } else {
      const result = Condidats.filter(Condidat =>
        Condidat.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Condidat.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Condidat.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCondidats(result);
    }
  }, [searchQuery, Condidats]); // La recherche dépend de Condidats et searchQuery
  

  const indexOfLastCondidat = currentPage * CondidatsPerPage;
  const indexOfFirstCondidat = indexOfLastCondidat - CondidatsPerPage;
  const currentCondidats = filteredCondidats.slice(indexOfFirstCondidat, indexOfLastCondidat);  

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = async (Condidat) => {
    console.log("Condidat passé à openModal :", Condidat); // Log l'objet candidat
    if (!Condidat || !Condidat._id) {
      console.error("L'ID du Condidat est manquant dans l'objet Condidat");
      setError("L'ID du Condidat est manquant.");
      return;
    }
    
    try {
      const response = await axios.get(`https://femup-1.onrender.com/api/condidats/${Condidat._id}`);
      console.log("Réponse du backend avec les détails du Condidat :", response.data); // Log la réponse
      setModalCondidat(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des détails du Condidat');
      console.error('Erreur détaillée:', error);
    }
  };      

  const closeModal = () => {
    setModalCondidat(null);
  };

  if (error) {
    return <div>{error}</div>;
  }

  const totalPages = Math.ceil(filteredCondidats.length / CondidatsPerPage);

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
          <h2>Liste des Condidats</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un Condidat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <table className="candidate-table">
          <thead>
  <tr>
    <th>Prénom</th>
    <th>Nom</th>
    <th>Email</th>
    <th>Spécialité</th>
    <th>Action</th>
  </tr>
</thead>
<tbody>
  {currentCondidats.length > 0 ? (
    currentCondidats.map((Condidat) => (
      <tr key={Condidat._id}>
        <td>{Condidat.firstName}</td>
        <td>{Condidat.lastName}</td>
        <td>{Condidat.email}</td>
        <td>{Condidat.specialite}</td>
        <td>
          <button onClick={() => openModal(Condidat)}>Voir détails</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5">Aucun candidat trouvé</td>
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

        {/* Modal pour afficher les détails du recruteur */}
        {modalCondidat ? (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={closeModal}>×</span>
      <h2>Détails du Condidat</h2>
      <p><strong>Nom:</strong> {modalCondidat.firstName}</p>
      <p><strong>Prénom:</strong> {modalCondidat.lastName}</p>
      <p><strong>Email:</strong> {modalCondidat.email}</p>
      <p><strong>Civilité:</strong> {modalCondidat.civilite}</p>
      <p><strong>Date de Naissance:</strong> {new Date(modalCondidat.dateNaissance).toLocaleDateString()}</p>
      <p><strong>Gouvernorat:</strong> {modalCondidat.gouvernorat}</p>
      <p><strong>Spécialité:</strong> {modalCondidat.specialite}</p>
      <p><strong>Expérience:</strong> {modalCondidat.experience || 'Non spécifiée'}</p>
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

export default Condidatadmin;
