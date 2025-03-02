import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase, faChartBar, faPlus, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminDashboard.css';

const ContactAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fonction pour récupérer les messages du backend
  const fetchMessages = async () => {
    try {
      const response = await fetch('https://femup-1.onrender.com/api/messages');
      if (!response.ok) {
        throw new Error('Impossible de récupérer les messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error); // Afficher l'erreur dans la console
    }
  };

  useEffect(() => {
    fetchMessages(); // Récupérer les messages dès le montage du composant
  }, []);

  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(`https://femup-1.onrender.com/api/messages/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessages(messages.filter((message) => message._id !== id)); // Mettre à jour la liste après suppression
      } else {
        alert('Erreur lors de la suppression du message.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      alert('Erreur lors de la suppression du message.');
    }
  };

  const truncateMessage = (message, length = 80) => { // Message plus court
    return message.length > length ? message.substring(0, length) + '...' : message;
  };

  // Fonction de filtrage par recherche
  const filteredMessages = messages.filter((message) => {
    return (
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <nav>
          <ul>
            <li><Link to="/Admin_Dashboard"><FontAwesomeIcon icon={faChartBar} /> Tableau de bord</Link></li>
            <li><Link to="/admin/candidates"><FontAwesomeIcon icon={faUsers} /> Candidats</Link></li>
            <li><Link to="/admin/recruiters"><FontAwesomeIcon icon={faBriefcase} /> Recruteurs</Link></li>
            <li><Link to="/admin/offers"><FontAwesomeIcon icon={faBriefcase} /> Offres</Link></li>
            <li><Link to="/admin/controle"><FontAwesomeIcon icon={faBriefcase} /> Contrôle d'Offres</Link></li>
            <li><Link to="/admin/articles"><FontAwesomeIcon icon={faFileAlt} /> Articles</Link></li>
            <li><Link to="/admin/entreprise"><FontAwesomeIcon icon={faPlus} /> Ajouter une entreprise</Link></li>
            <li><Link to="/admin/Contact">Formulaire de Contact </Link></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="content">
        <section className="recruiter-section">
          <h2>Messages reçus</h2>

          {/* Barre de recherche */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tableau des messages */}
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Sujet</th>
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <tr key={message._id}>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.subject}</td>
                    <td>{truncateMessage(message.message)}</td>
                    <td>
                      <button
                        onClick={() => alert(message.message)}
                        className="button-spacing"
                      >
                        Voir le message complet
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message._id)}
                        className="delete-message-button"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" align="center">
                    Aucun message disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default ContactAdmin;
