import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Pour décoder le token
import '../styles/Navbar.css';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Vérifier l'état d'authentification et mettre à jour l'état chaque fois que la page change
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Décodage du token pour obtenir le rôle
        setUserRole(decodedToken.role); // Sauvegarder le rôle dans l'état
        setIsAuthenticated(true); // Utilisateur authentifié
      } catch (error) {
        console.error("Erreur lors du décodage du token", error);
        setIsAuthenticated(false); // Si le token est invalide
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  // Vérification de l'authentification à chaque changement de page
  useEffect(() => {
    checkAuthentication();
  }, [navigate]); // Le useEffect se déclenche chaque fois que la navigation change

  // Fonction de déconnexion avec un rafraîchissement forcé de l'état
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token du localStorage
    localStorage.removeItem('role'); // Supprimer le rôle du localStorage
    setIsAuthenticated(false); // Réinitialiser l'état d'authentification
    setUserRole(null); // Réinitialiser le rôle
    navigate('/'); // Rediriger vers la page d'accueil après la déconnexion
  };

  // Toggle du menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="Header-section2">
      <nav className="navbar">
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li style={{ color: '#911092' }}><Link to="/">Accueil</Link></li>
          <li><Link to="/Offres-d'emploi">Offres d'emploi</Link></li>
          <li><Link to="/Entreprise-List">Entreprises</Link></li>
          <li><Link to="/Contact">Contact</Link></li>
        </ul>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              {userRole === 'admin' ? (
                <button onClick={() => navigate('/Admin_Dashboard')}>Mon Profil</button>
              ) : userRole === 'condidat' ? (
                <button onClick={() => navigate('/dashboard')}>Mon Profil</button>
              ) : (
                <button onClick={() => navigate('/Dashboard_Emploiyeur')}>Mon Profil</button>
              )}
              <button onClick={handleLogout}>Déconnexion</button>
            </>
          ) : (
            <>
              <button style={{ color: 'white',backgroundColor: '#911092' }}><Link to="/connexion">Se connecter</Link></button>
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
