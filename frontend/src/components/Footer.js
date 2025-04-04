import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/Footer.css'; // Fichier CSS pour le style du composant

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3><Link to="/">Accueil</Link></h3>
          <h3><Link to="/Offres-d'emploi">Offres d'Emploi</Link></h3>
          <h3><Link to="/Entreprise-List">Entreprises</Link></h3>

        </div>
        <div className="footer-section">
          <h3>Employeur</h3>
          <ul>
            <li><Link to="/Offres-d'emploi">dépose un offre</Link></li>
            <li><Link to="/connexion">Connecter vous</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Chercheur d'emploi</h3>
          <ul>
          <li><Link to="/Offres-d'emploi">Trouver un emploi</Link></li>
          <li><Link to="/connexion">Connecter vous</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Vous avez une question?</h3>
            <button className="join-button1"><Link to="/contact">Contactez-nous</Link></button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Fem'up. Tous droits réservés</p>
      </div>
    </footer>
  );
};

export default Footer;