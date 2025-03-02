import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountSettings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    address: '',
    logo: null, // Pour stocker le fichier image
    description: '',
    uniqueId: '',
    sector: ''
  });

  // Récupérer les données du profil au chargement de la page
  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://femup-1.onrender.com/api/recruteur/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const profileData = response.data;

            setFormData({
                email: profileData.email || '',
                fullName: profileData.fullName || '',
                password: '',
                confirmPassword: '',
                companyName: profileData.companyName || '',
                phone: profileData.phone || '',
                address: profileData.address || '',
                logo: profileData.logo || null,
                description: profileData.description || '',
                uniqueId: profileData.uniqueId || '',
                sector: profileData.sector || ''
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du profil :', error);
        }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file); // Crée une URL pour l'image
      setFormData({
        ...formData,
        logo: imageURL, // Affiche l'image immédiatement
        logoFile: file, // Sauvegarde le fichier pour l'envoi au backend
      });
    }
  };

  const handleSave = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Ajoutez les champs texte
      formDataToSend.append('email', formData.email);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('uniqueId', formData.uniqueId);
      formDataToSend.append('sector', formData.sector);

      // Ajoutez les champs de mot de passe, si nécessaire
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }

      // Ajoutez l'image si elle existe
      if (formData.logoFile) {
        formDataToSend.append('logo', formData.logoFile);
      }

      console.log('Données envoyées au backend :', formDataToSend);

      const response = await axios.put(
        'https://femup-1.onrender.com/api/recruteur/profile',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Réponse du backend :', response.data);

      if (response.data.success) {
        alert('Profil mis à jour avec succès !');
        navigate('/Dashboard_Emploiyeur');
      } else {
        alert('Erreur lors de la mise à jour du profil.');
      }
    }catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        if (error.response) {
            console.error('Réponse d\'erreur du backend :', error.response.data);
            alert(`Erreur du serveur : ${error.response.data.message || 'Veuillez réessayer.'}`);
        } else {
            alert('Erreur réseau ou serveur. Veuillez réessayer.');
        }
    }
  };

  return (
    <div className="candidate-dashboard-container">
      <div className="candidate-profile-section">
        <div className="candidate-profile-image-container">
          {formData.logo ? (
            <img src={formData.logo} alt="Logo" className="profile-image" />
          ) : (
            <div className="candidate-profile-placeholder">
              <span>Logo de l'entreprise</span>
            </div>
          )}
          <input
            type="file"
            id="logo"
            onChange={handleImageChange}
            accept="image/*"
            className="file-input"
            aria-label="Télécharger un logo"
          />
        </div>
        <h2>Modifier le Profil</h2>
      </div>

      <form className="candidate-profile-form">
        <div className="candidate-input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez votre email"
            aria-label="Email"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="fullName">Nom complet:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Entrez votre nom complet"
            aria-label="Nom complet"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="companyName">Nom de l'entreprise:</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Entrez le nom de l'entreprise"
            aria-label="Nom de l'entreprise"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="phone">Numéro de téléphone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Entrez votre numéro de téléphone"
            aria-label="Numéro de téléphone"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="address">Adresse:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Entrez l'adresse de l'entreprise"
            aria-label="Adresse"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Entrez une description de l'entreprise"
            aria-label="Description"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="uniqueId">ID unique:</label>
          <input
            type="text"
            id="uniqueId"
            name="uniqueId"
            value={formData.uniqueId}
            onChange={handleChange}
            placeholder="Entrez un identifiant unique"
            aria-label="ID unique"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="sector">Secteur d'activité:</label>
          <input
            type="text"
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            placeholder="Entrez le secteur d'activité"
            aria-label="Secteur d'activité"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Entrez votre mot de passe"
            aria-label="Mot de passe"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmez votre mot de passe"
            aria-label="Confirmer le mot de passe"
          />
        </div>

        <div className="candidate-buttons-group">
          <button type="button" className="candidate-btn-save" onClick={handleSave}>
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
