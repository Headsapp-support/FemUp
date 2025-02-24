import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Utiliser le contexte d'authentification
import '../styles/Navbar.css';

const Navbar = () => {
  const { state, logout } = useAuth(); // Accéder à l'état et à la fonction de déconnexion
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle pour le menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    logout(); // Appeler la fonction de déconnexion
    navigate('/'); // Rediriger vers la page d'accueil
  };

  return (
    <div className="Header-section2">
      <nav className="navbar">
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/Offres-d'emploi">Offres d'emploi</Link></li>
          <li><Link to="/Entreprise-List">Entreprises</Link></li>
          <li><Link to="/Article">Article</Link></li>
          <li><Link to="/Contact">Contact</Link></li>
        </ul>

        <div className="auth-buttons">
          {state.isAuthenticated ? (
            <>
              {state.userRole === 'condidat' ? (
                <button onClick={() => navigate('/dashboard')}>Profil Candidat</button>
              ) : (
                <button onClick={() => navigate('/Dashboard_Emploiyeur')}>Profil Employeur</button>
              )}
              <button onClick={handleLogout}>Déconnexion</button>
            </>
          ) : (
            <>
              <button><Link to="/connexion">Se connecter</Link></button>
              <button><Link to="/inscription">S'inscrire</Link></button>
            </>
          )}
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
