import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faFileAlt, faCalendar, faImage } from '@fortawesome/free-solid-svg-icons';
import { faUsers, faBriefcase, faChartBar, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminDashboard.css';
import axios from 'axios';

const ArticleAdmin = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    name: '', // pour les événements
    description: '', // pour les images
    image: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState(""); // Formulaire actuel (article, événement, image)
  const [isFeatured, setIsFeatured] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Variable pour les erreurs
  const [showConfirmation, setShowConfirmation] = useState(false); // Nouveau state pour afficher le popup de confirmation

  const openModal = (type) => {
    setFormType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: '',
      content: '',
      date: '',
      name: '',
      description: '',
      image: null,
    });
    setIsFeatured(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Veuillez sélectionner une image valide (JPEG, PNG, JPG).');
        return;
      }
      setFormData({
        ...formData,
        image: file,
      });
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token manquant, veuillez vous reconnecter.');
      return;
    }

    const data = new FormData();
    let apiUrl = '';

    if (formType === 'article') {
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('date', formData.date);

      if (formData.image) {
        data.append('image', formData.image);
      } else {
        setErrorMessage('Veuillez télécharger une image pour l\'article.');
        return;
      }
    } else if (formType === 'event') {
      data.append('name', formData.name);
      data.append('date', formData.date);

      if (formData.image) {
        data.append('image', formData.image);
      } else {
        setErrorMessage('Veuillez télécharger une image pour l\'événement.');
        return;
      }
    } else if (formType === 'image') {
      data.append('title', formData.title);
      data.append('description', formData.description);

      if (formData.image) {
        data.append('image', formData.image);
      } else {
        setErrorMessage('Veuillez télécharger une image.');
        return;
      }
    }

    if (formType === 'article') {
      apiUrl = 'https://femup-1.onrender.com/api/articles/createArticle';
    } else if (formType === 'event') {
      apiUrl = 'https://femup-1.onrender.com/api/events/createEvent';
    } else if (formType === 'image') {
      apiUrl = 'https://femup-1.onrender.com/api/images/createImage';
    }

    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Afficher le message de confirmation
        setSuccessMessage(`${formType === 'article' ? 'Article' : formType === 'event' ? 'Événement' : 'Image'} ajouté avec succès!`);
        setShowConfirmation(true); // Afficher le popup de confirmation
        closeModal(); // Fermer le modal
      } else {
        throw new Error('Erreur lors de l\'ajout');
      }
    } catch (error) {
      setErrorMessage(`Erreur lors de l'ajout du ${formType === 'article' ? 'article' : formType === 'event' ? 'événement' : 'image'}: ${error.response ? error.response.data.message : error.message}`);
      console.error("Erreur dans la requête :", error);
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
            <li><Link to="/admin/Contact">Formulaire de Contact</Link></li>
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
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
              {/* Formulaire pour les articles */}
              {formType === "article" && (
                <>
                  <div className="form-group">
                    <label>Titre de l'article</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Titre de l'article"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contenu de l'article</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Contenu de l'article"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de publication</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ajouter une image</label>
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nom de l'événement"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de l'événement</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Affiche de l'événement</label>
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
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
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Titre de l'image"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description de l'image"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ajouter une image</label>
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
                  </div>
                </>
              )}

              <button type="submit">Soumettre</button>
            </form>
          </div>
        </div>
      )}

      {/* Popup de confirmation */}
      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="popup-content">
            <p>Votre {formType === 'article' ? 'article' : formType === 'event' ? 'événement' : 'publication de retour en image'} a bien été partagé !</p>
            <button onClick={() => setShowConfirmation(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleAdmin;
