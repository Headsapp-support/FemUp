import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountSettings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    civilite: 'F',
    password: '',
    confirmPassword: '',
    dateNaissance: '',
    governorate: '',
    specialite: '',
    experience: '',
    profileImage: null,
    profileImageFile: null, // Pour stocker le fichier image
  });

  // Récupérer les données du profil au chargement de la page
  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://femup-1.onrender.com/api/condidat/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const profileData = response.data;
            const dateNaissanceFormatted = new Date(profileData.dateNaissance).toISOString().split('T')[0]; // Format "yyyy-MM-dd"
            
            setFormData({
                firstName: profileData.firstName || '',
                lastName: profileData.lastName || '',
                email: profileData.email || '',
                civilite: profileData.civilite || 'F',
                password: '',
                confirmPassword: '',
                dateNaissance: dateNaissanceFormatted, // Appliquez le format ici
                governorate: profileData.governorate || '',
                specialite: profileData.specialite || '',
                experience: profileData.experience || '',
                profileImage: profileData.profileImage || null, 
                profileImageFile: null,
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
        profileImage: imageURL, // Affiche l'image immédiatement
        profileImageFile: file, // Sauvegarde le fichier pour l'envoi au backend
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
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('civilite', formData.civilite);
      formDataToSend.append('dateNaissance', formData.dateNaissance);
      formDataToSend.append('governorate', formData.governorate);
      formDataToSend.append('specialite', formData.specialite);
      formDataToSend.append('experience', formData.experience);
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }

      // Ajoutez l'image si elle existe
      if (formData.profileImageFile) {
        formDataToSend.append('profileImage', formData.profileImageFile);
      }

      console.log('Données envoyées au backend :', formDataToSend);

      const response = await axios.put(
        'https://femup-1.onrender.com/api/condidat/profile',
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
        navigate('/dashboard');
      } else {
        alert('Erreur lors de la mise à jour du profil.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      if (error.response) {
        console.error('Réponse d\'erreur du backend :', error.response.data);
      }
      alert('Erreur lors de la mise à jour du profil. Veuillez réessayer.');
    }
  };

  return (
    <div className="candidate-dashboard-container">
      <div className="candidate-profile-section">
        <div className="candidate-profile-image-container">
          {formData.profileImage ? (
            <img src={formData.profileImage} alt="Profile" className="profile-image" />
          ) : (
            <div className="candidate-profile-placeholder">
              <span>Image de profil</span>
            </div>
          )}
          <input
            type="file"
            id="profileImage"
            onChange={handleImageChange}
            accept="image/*"
            className="candidate-file-input"
            aria-label="Télécharger une image de profil"
          />
        </div>
        <h2>Modifier Profil</h2>
      </div>

      <form className="candidate-profile-form">
        <div className="candidate-input-group">
          <label htmlFor="firstName">Prénom:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Entrez votre prénom"
            aria-label="Prénom"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="lastName">Nom:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Entrez votre nom"
            aria-label="Nom"
          />
        </div>

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
          <label htmlFor="civilite">Civilité:</label>
          <select
            id="civilite"
            name="civilite"
            value={formData.civilite}
            onChange={handleChange}
            aria-label="Civilité"
          >
            <option value="M">Monsieur</option>
            <option value="F">Madame</option>
          </select>
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

        <div className="candidate-input-group">
          <label htmlFor="dateNaissance">Date de naissance:</label>
          <input
            type="date"
            id="dateNaissance"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleChange}
            aria-label="Date de naissance"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="governorate">Gouvernorat:</label>
          <input
            id="governorate"
            name="governorate"
            value={formData.governorate}
            onChange={handleChange}
            aria-label="Gouvernorat"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="specialite">Spécialité:</label>
          <input
            type="text"
            id="specialite"
            name="specialite"
            value={formData.specialite}
            onChange={handleChange}
            placeholder="Entrez votre spécialité"
            aria-label="Spécialité"
          />
        </div>

        <div className="candidate-input-group">
          <label htmlFor="experience">Expérience:</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Décrivez votre expérience professionnelle"
            aria-label="Expérience"
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