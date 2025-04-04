import React from 'react';
import '../styles/CareerBoostSection.css';

const CareerBoostSection = () => {
  return (
    <div className="career-boost-section">
      <div className="career-boost-content">
      <p>Développer localement</p>
        <h1>Boostez votre carrière avec des concerts locaux</h1>
        <div className="features">
          <div className="feature">
            <img src="/images/image1.png" alt="Possibilités de travail flexibles" />
            <h3>Possibilités de travail flexibles</h3>
            <p>Connectez-vous à une gamme diversifiée d’emplois indépendants et de concerts adaptés à vos compétences et à votre disponibilité.</p>
          </div>
          <div className="feature">
            <img src="/images/image2.jpg" alt="Système de paiement sécurisé" />
            <h3>Système de paiement sécurisé</h3>
            <p>Assurez des paiements ponctuels et protégés grâce à notre plateforme fiable et sécurisée.</p>
          </div>
          <div className="feature">
            <img src="/images/image3.avif" alt="Ressources de développement des compétences" />
            <h3>Ressources de développement des compétences</h3>
            <p>Accédez à une variété d’outils et de ressources pour améliorer vos compétences et dynamiser votre carrière indépendante.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerBoostSection;
