import React from 'react';
import '../styles/Header.css';  // Assurez-vous que ce fichier existe
import Navbar from './Navbar';  // Assurez-vous que Navbar.js existe dans le bon répertoire
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="Header-section">
      <Navbar />  {/* Importation du composant Navbar */}
      <section className="Free">
        <div className="Free-content">
          <h1>Le portail de Freelancer en Tunisie</h1>
          <p>Connectez-vous avec des freelances talentueux à Tunis, développez votre réseau et découvrez des opportunités pour développer votre activité basée sur des concerts dès aujourd'hui.</p>
          <button className="connect-button"><Link to="/contact">Connectez-vous</Link></button>
        </div>
      </section>
    </div>
  );
};

export default Header; 