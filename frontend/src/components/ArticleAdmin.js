import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faFileAlt, faCalendar, faImage } from '@fortawesome/free-solid-svg-icons';
import { faUsers, faBriefcase, faChartBar, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminDashboard.css';

const ArticleAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState(""); // Formulaire actuel (article, événement, image)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null); // Pour stocker le fichier téléchargé
  const [isFeatured, setIsFeatured] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Variable pour les erreurs

  // Ouvrir la modale avec le formulaire spécifique
  const openModal = (type) => {
    setFormType(type);
    setIsModalOpen(true);
  };

  // Fermer la modale et réinitialiser les champs
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setDate('');
    setImage('');
    setFile(null); // Réinitialiser le fichier
    setIsFeatured(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Fonction pour capturer les fichiers téléchargés
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capture le fichier téléchargé
  };

  // Fonction pour envoyer les données au backend
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
    if (!token) {
      setErrorMessage('Veuillez vous connecter pour ajouter un article.');
      return; // Si le token n'est pas présent, arrêter l'exécution
    }

    const formData = new FormData();

    // Préparer les données à envoyer en fonction du formulaire
    if (formType === 'article') {
      formData.append('title', title);
      formData.append('content', content);
      formData.append('date', date);
      formData.append('image', image);
      formData.append('isFeatured', isFeatured);

      fetch('https://femup-1.onrender.com/api/articles/createArticle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            return response.text(); // Récupère la réponse en texte brut pour le débogage
          }
          return response.json();
        })
        .then(data => {
          if (typeof data === 'string') {
            setErrorMessage(data); // Si la réponse est en texte brut, afficher comme erreur
          } else {
            setSuccessMessage('Article ajouté avec succès!');
            closeModal();
          }
        })
        .catch(error => {
          console.error('Error:', error);
          setErrorMessage('Erreur lors de l\'ajout de l\'article');
        });
    } else if (formType === 'event') {
      formData.append('name', title);
      formData.append('date', date);
      formData.append('file', file);

      fetch('https://femup-1.onrender.com/api/events/createEvent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            return response.text(); // Récupère la réponse en texte brut pour le débogage
          }
          return response.json();
        })
        .then(data => {
          if (typeof data === 'string') {
            setErrorMessage(data);
          } else {
            setSuccessMessage('Événement ajouté avec succès!');
            closeModal();
          }
        })
        .catch(error => {
          console.error('Error:', error);
          setErrorMessage('Erreur lors de l\'ajout de l\'événement');
        });
    } else if (formType === 'image') {
      const images = file ? [file] : [];
      formData.append('title', title);
      formData.append('description', content);
      images.forEach((img) => {
        formData.append('images', img);
      });

      fetch('https://femup-1.onrender.com/api/images/createImage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            return response.text(); // Récupère la réponse en texte brut pour le débogage
          }
          return response.json();
        })
        .then(data => {
          if (typeof data === 'string') {
            setErrorMessage(data);
          } else {
            setSuccessMessage('Images ajoutées avec succès!');
            closeModal();
          }
        })
        .catch(error => {
          console.error('Error:', error);
          setErrorMessage('Erreur lors de l\'ajout des images');
        });
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
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

      {/* Section des icônes centrées */}
      <div className="icon-section">
        <div className="icon-container" onClick={() => openModal("article")}>
          <FontAwesomeIcon icon={faFileAlt} size="3x" />
          <p>Ajouter un article</p>
        </div>
        <div className="icon-container" onClick={() => openModal("event")}>
          <FontAwesomeIcon icon={faCalendar} size="3x" />
          <p>Ajouter un événement</p>
        </div>
        <div className="icon-container" onClick={() => openModal("image")}>
          <FontAwesomeIcon icon={faImage} size="3x" />
          <p>Retour en image</p>
        </div>
      </div>

      {/* Modal pour afficher les formulaires */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{formType === "article" ? "Ajouter un article" : formType === "event" ? "Ajouter un événement" : "Retour en image"}</h2>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Affichage des erreurs */}

            <form onSubmit={handleSubmit}>
              {/* Formulaire pour les articles */}
              {formType === "article" && (
                <>
                  <div className="form-group">
                    <label>Titre de l'article</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Titre de l'article"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contenu de l'article</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Contenu de l'article"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de publication</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image de l'article</label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="URL de l'image"
                      required
                    />
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={() => setIsFeatured(!isFeatured)}
                    />
                    <span>Mettre cet article à la une</span>
                  </div>
                </>
              )}

              {/* Formulaire pour les événements */}
              {formType === "event" && (
                <>
                  <div className="form-group">
                    <label>Nom de l'événement</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nom de l'événement"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de l'événement</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Fichier de l'événement</label>
                    <input type="file" onChange={handleFileChange} required />
                  </div>
                </>
              )}

              {/* Formulaire pour les images */}
              {formType === "image" && (
                <>
                  <div className="form-group">
                    <label>Titre de l'image</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Titre de l'image"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Description de l'image"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ajouter une image</label>
                    <input type="file" onChange={handleFileChange} required />
                  </div>
                </>
              )}

              <button type="submit">Soumettre</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleAdmin;
