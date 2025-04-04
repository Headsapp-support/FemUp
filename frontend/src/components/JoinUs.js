import React from 'react';
import '../styles/JoinUs.css'; // Fichier CSS pour le style du composant
import { Link } from 'react-router-dom';


// Composant JoinUs
const JoinUs = () => {
    return (
      <div className="join-us">
        <div className="Free-contenth1"> {/* Conteneur interne pour centrer à gauche */}
          <h1>Rejoignez-nous</h1>
          <div className="buttons">
            <button className="connect-button"><Link to="/inscription-condidat"> Je suis un Candidat</Link>
             
            </button>
            <button className="connect-button"> <Link to="/inscription-emploiyeur">Je suis un Employeur</Link>
            </button>
          </div>
          <p>Vous avez déjà un compte ? <Link to="/contact">Se connecter</Link></p>
        </div>
      </div>
    );
  };
  
  export default JoinUs;