import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ListeJobSection.css';

function ListeJobSection() {
  const [offers, setOffers] = useState([]);  // Stocke toutes les offres
  const [filteredJobs, setFilteredJobs] = useState([]);  // Stocke les offres filtrées
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "all",
    location: "all",
  });
  const [visibleCount, setVisibleCount] = useState(6);  // Nombre d'offres visibles au début

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('https://femup-1.onrender.com/api/recruteur/all-offers');
        // Filtrer les offres pour ne garder que celles avec le statut "Postulé"
        const postulatedOffers = response.data.offers.filter(offer => offer.status === 'approved');
        setOffers(postulatedOffers); // Met à jour l'état avec les offres filtrées
        setFilteredJobs(postulatedOffers);  // Mettre à jour filteredJobs avec les offres filtrées
      } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []); 

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const { searchTerm, category, location } = filters;

    const filtered = offers.filter((job) => {
      const matchSearchTerm =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = category === "all" || job.category === category;
      const matchLocation = location === "all" || job.location === location;

      return matchSearchTerm && matchCategory && matchLocation;
    });

    setFilteredJobs(filtered);
  };

  // Fonction pour charger plus d'offres
  const loadMoreOffers = () => {
    setVisibleCount(visibleCount + 6);  // Augmente le nombre d'offres visibles
  };

  return (
    <div className="job-list-section">
      <h1>Toutes les Offres d'Emploi</h1>

      <div className="job-filter-container">
        <input
          type="text"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleFilterChange}
          placeholder="Recherche d'emploi..."
        />
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option placeholder="all">Catégorie</option>
          <option value="Développement Web">Développement Web</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Administration">Administration</option>
        </select>
        <select name="location" value={filters.location} onChange={handleFilterChange}>
          <option value="all">Mode d'emploi</option>
          <option value="distance">À distance</option>
          <option value="Hybride">Hybride</option>
        </select>
        <button onClick={handleSearch}>Rechercher</button>
      </div>

      <div className="job-list-wrapper">
        {loading ? (
          <p>Chargement des offres...</p>
        ) : (
          <div className="job-cards-container">
            {filteredJobs.length === 0 ? (
              <p>Aucune offre trouvée.</p>
            ) : (
              filteredJobs.slice(0, visibleCount).map((offer) => (  // Affiche seulement les offres visibles
                <div key={offer._id} className="job-card-item">
                  <h3>{offer.title}</h3>
                  <p><strong>Catégorie:</strong> {offer.category}</p>
                  <p><strong>Lieu:</strong> {offer.location}</p>
                  <p className="description">{offer.description}</p> {/* Affiche seulement une ligne de description avec des points de suspension */}

                  {/* Lien vers la page des détails de l'offre */}
                  <Link to={`/offre/${offer._id}`} className="apply-button">Postuler</Link>
                </div>
              ))
            )}
          </div>
        )}

        {/* Afficher le bouton "Charger plus" si nécessaire */}
        {filteredJobs.length > visibleCount && (
          <div className="load-more-button">
            <button onClick={loadMoreOffers}>Charger plus</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListeJobSection;
