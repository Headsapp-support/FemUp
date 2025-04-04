import React from 'react';
import '../styles/JoinNetwork.css'; // Fichier CSS pour le style du composant
import { Link } from 'react-router-dom';

const JoinNetwork = () => {
  return (
    <div className="join-network">
      <div className="text-content">
        <p>Rejoignez notre réseau croissant de freelances qualifiés à Tunis Contactez des entreprises à la recherche de votre expertise. Faites évoluer votre carrière et élargissez vos opportunités dès aujourd'hui.</p>
        <button className="connect-button"><Link to="/inscription">Je veux rejoindre</Link></button>
      </div>
      <div className="image-content">
        <img src="/images/bureau.png" alt="Rejoindre le réseau" />
      </div>
    </div>
  );
};

export default JoinNetwork;
