import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/FreelanceJobsSection.css';

const FreelanceJobsSection = () => {
  const [latestOffers, setLatestOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestOffers = async () => {
    try {
      const response = await axios.get('https://femup-1.onrender.com/api/recruteur/all-offers');
      console.log(response.data.offers);

      // ✅ Filtrer seulement les offres approuvées
      const approvedOffers = response.data.offers.filter(
        (offer) => offer.status === 'approved'
      );

      // ✅ Trier par date décroissante (plus récentes en premier)
      const sortedOffers = approvedOffers.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // ✅ Garder uniquement les 3 dernières
      setLatestOffers(sortedOffers.slice(0, 3));
    } catch (err) {
      console.error('Erreur lors de la récupération des offres:', err);
      setError('Erreur lors de la récupération des offres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestOffers();
    const interval = setInterval(fetchLatestOffers, 30000); // toutes les 30 sec
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shortenDescription = (description) => {
    if (description.length <= 50) return description;
    const firstPeriod = description.indexOf('.');
    if (firstPeriod !== -1 && firstPeriod < 80) {
      return description.slice(0, firstPeriod + 1) + '...';
    }
    return description.slice(0, 50) + '...';
  };

  if (loading) return <p>Chargement des offres...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="freelance-jobs-section">
      <div className="freelance-jobs-content">
        {latestOffers.length === 0 ? (
          <p>Aucune offre disponible pour le moment.</p>
        ) : (
          latestOffers.map((offer) => (
            <div key={offer._id} className="job-card">
              <h2>{offer.title}</h2>
              <p>{shortenDescription(offer.description)}</p>
              <div className="job-footer">
                <span className="date">
                  {offer.date ? `Publié le : ${formatDate(offer.date)}` : 'Date inconnue'}
                </span>
                <Link to={`/offre/${offer._id}`} className="see-more">
                  Postuler
                </Link>
              </div>
            </div>
          ))
        )}

        <button className="explore-more">
          <Link to="/Offres-d'emploi">Voir toutes les offres</Link>
        </button>
      </div>
    </div>
  );
};

export default FreelanceJobsSection;
