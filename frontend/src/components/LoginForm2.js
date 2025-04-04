import '../styles/LoginForm2.css'; // Fichier CSS pour le style du composant
import React, { useState } from 'react';
import axios from 'axios'; // Pour envoyer les données au backend
import { useNavigate } from 'react-router-dom'; // Pour la redirection après enregistrement

const LoginForm2 = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    address: '',
    logo: null, // Stocker le fichier image
    description: '',
    uniqueId: '',
    sector: ''
  });

  const [errorMessage, setErrorMessage] = useState(''); // Pour afficher les messages d'erreur

  const navigate = useNavigate(); // Pour rediriger après l'enregistrement

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'logo') {
      const file = files[0];
      if (file) {
        // Vérifier que le fichier est une image
        if (!file.type.startsWith('image/')) {
          setErrorMessage('Veuillez sélectionner une image valide (JPEG, PNG, JPG).');
          return;
        }

        setFormData({
          ...formData,
          [name]: file // Stocker le fichier image
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Vérifier que tous les champs obligatoires sont remplis
    if (!formData.password) {
      alert('Le mot de passe est requis.');
      return;
    }
  
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
  
      // Afficher les données envoyées pour déboguer
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }
  
      // Envoi des données au backend
    await axios.post('https://femup-1.onrender.com/api/recruteur/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      alert('Recruteur enregistré avec succès!');
      navigate('/connexion');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert('Erreur lors de l\'enregistrement: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="employer-signup">
      <div className="form-container">
        <h2>Créer votre espace employeur</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Afficher le message d'erreur */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nom & Prénom*</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de Passe*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe*</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nom de l'entreprise*</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Téléphone*</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Emplacement (Adresse)*</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Logo*</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              accept="image/jpeg, image/png, image/jpg" // Accepter uniquement les images
              required
            />
          </div>
          <div className="form-group">
            <label>Description de l'entreprise*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Identifiant Unique (RC/RNE/MF)*</label>
            <input
              type="text"
              name="uniqueId"
              value={formData.uniqueId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Secteur d'activité*</label>
            <input
              type="text"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Enregistrer</button>
        </form>
      </div>

      <div className="side-image">
        <img src={process.env.PUBLIC_URL + '/images/emploiyeur.png'} alt="Side" />
      </div>
    </div>
  );
};

export default LoginForm2;