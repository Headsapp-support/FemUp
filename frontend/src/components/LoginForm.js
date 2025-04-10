import '../styles/LoginForm.css'; // Fichier CSS pour le style du composant
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate

const LoginForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    civilite: '',
    password: '',
    confirmPassword: '',
    dateNaissance: '',
    gouvernorat: '',
    specialite: '',
    experience: '', // Champ obligatoire
  });

  const navigate = useNavigate(); // Hook pour la redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const Submit = async (e) => {
    e.preventDefault();
  
    // Vérifiez que tous les champs obligatoires sont remplis
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'civilite',
      'password',
      'confirmPassword',
      'dateNaissance',
      'gouvernorat',
      'specialite',
      'experience'
    ];
  
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Le champ ${field} est obligatoire.`);
        return;
      }
    }
  
    // Vérifiez que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
  
    try {
      console.log('Données envoyées au backend :', formData); // Ajoutez ce log
  
      // Envoi des données au backend
      await axios.post('https://femup-1.onrender.com/api/condidats/register', formData, {
        headers: {
          'Content-Type': 'application/json' // Utilisez application/json pour les données JSON
        }
      });
  
      alert('Enregistré avec succès!');
      navigate('/connexion');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement', error);
      alert('Erreur lors de l\'enregistrement: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="employer-signup">
      <div className="form-container">
        <form className="form" onSubmit={Submit}>
        <h2>Créer votre profil candidat</h2>
          <div className="form-group">
            <label>Prénom :</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nom :</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Civilité :</label>
            <select
              name="civilite"
              value={formData.civilite}
              onChange={handleChange}
              required
            >
              <option value="">Choisir</option>
              <option value="M">Monsieur</option>
              <option value="Mme">Madame</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mot de Passe :</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe :</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date de Naissance :</label>
            <input
              type="date"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gouvernorat :</label>
            <input
              type="text"
              name="gouvernorat"
              value={formData.gouvernorat}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Spécialité :</label>
            <input
              type="text"
              name="specialite"
              value={formData.specialite}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Expérience :</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez votre niveau d'expérience</option> {/* Option par défaut vide */}
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <button type="submit" className="submit-button">Enregistrer</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;