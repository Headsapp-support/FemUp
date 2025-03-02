import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/experiences.css';

const Experiences = () => {
  const [experiencesData, setExperiencesData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null); // Etat pour gérer l'expansion des avis longs

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % experiencesData.length);
  }, [experiencesData.length]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? experiencesData.length - 1 : prevIndex - 1
    );
  };

  const toggleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Permet d'afficher/masquer l'avis complet
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get('https://femup-1.onrender.com/api/condidat/experiences');
        setExperiencesData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
        alert('Erreur lors de la récupération des avis. Veuillez réessayer.');
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div className="experiences">
      <div className="experiences-content">
        <h2>Expériences authentiques</h2>
        <div className="carousel">
          <button className="nav-button left" onClick={goToPrev}>
            <span className="arrow left">←</span>
          </button>

          <div className="experience-card">
            <p
              style={{
                maxHeight: expandedIndex === currentIndex ? 'none' : '200px',
                overflow: expandedIndex === currentIndex ? 'visible' : 'hidden',
              }}
            >
              {experiencesData[currentIndex]?.text}
            </p>
            {experiencesData[currentIndex]?.text.length > 200 && (
              <span
                className="read-more-button"
                onClick={() => toggleReadMore(currentIndex)}
              >
                {expandedIndex === currentIndex ? 'Lire moins' : 'Lire plus'}
              </span>
            )}
            <div className="author">{experiencesData[currentIndex]?.author}</div>
          </div>

          <button className="nav-button right" onClick={goToNext}>
            <span className="arrow right">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Experiences;
