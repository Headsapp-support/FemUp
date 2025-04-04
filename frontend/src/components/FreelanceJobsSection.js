import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/FreelanceJobsSection.css';

const FreelanceJobsSection = () => {
  const [latestOffers, setLatestOffers] = useState([]); // Stocker les 3 dernières offres
  const [loading, setLoading] = useState(true); // Pour gérer le chargement des données
  const [error, setError] = useState(null); // Pour gérer les erreurs

  // Fonction pour récupérer toutes les offres triées
  const fetchLatestOffers = async () => {
    try {
      const response = await axios.get('https://femup-1.onrender.com/api/recruteur/all-offers');
      console.log(response.data.offers); // Vérifie la réponse de l'API

      // Trier les offres par date, du plus récent au plus ancien
      const sortedOffers = response.data.offers.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Garder les 3 dernières offres triées
      setLatestOffers(sortedOffers.slice(0, 3)); // Met à jour l'état avec les 3 premières offres
    } catch (err) {
      console.error('Erreur lors de la récupération des offres:', err);
      setError('Erreur lors de la récupération des offres');
    } finally {
      setLoading(false); // Une fois que l'appel API est terminé, on désactive le chargement
    }
  };

  useEffect(() => {
    // Initialisation de la récupération des offres au premier chargement
    fetchLatestOffers();

    // Mise à jour des offres toutes les 30 secondes
    const interval = setInterval(() => {
      fetchLatestOffers();
    }, 30000); // 30 000 ms = 30 secondes

    // Nettoyage de l'intervalle quand le composant est démonté
    return () => clearInterval(interval);
  }, []);

  // Si les données sont en cours de chargement
  if (loading) {
    return <p>Chargement des offres...</p>;
  }

  // Si une erreur est survenue lors de la récupération des données
  if (error) {
    return <p>{error}</p>;
  }

  // Fonction pour formater la date
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('fr-FR', {
      weekday: 'long', // Jour de la semaine (ex : lundi)
      year: 'numeric', // Année (ex : 2025)
      month: 'long', // Mois (ex : janvier)
      day: 'numeric', // Jour (ex : 8)
    });
  };

  return (
    <div className="freelance-jobs-section">
      <div className="freelance-jobs-content">
        {latestOffers.length === 0 ? (
          <p>Aucune offre disponible pour le moment.</p>
        ) : (
          latestOffers.map((offer) => (
            <div key={offer._id} className="job-card">
              <h2>{offer.title}</h2>
              <p>{offer.description}</p>
              <div className="job-footer">
                {/* Affichage de la date de publication */}
                <span className="date">
                  {offer.date ? `Publié le : ${formatDate(offer.date)}` : "Date inconnue"}
                </span>
                <Link to={`/offre/${offer._id}`} className="see-more">Postuler</Link>
              </div>
            </div>
          ))
        )}

        {/* Lien vers la page des offres complètes */}
        <button className="explore-more">
          <Link to="/Offres-d'emploi">Voir toutes les offres</Link>
        </button>
      </div>
    </div>
  );
};

export default FreelanceJobsSection;
