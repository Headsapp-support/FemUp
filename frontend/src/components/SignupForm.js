import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../styles/SignupForm.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); // Pour gérer les erreurs
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://femup-1.onrender.com/api/auth/login', formData);
  
      if (response.data.success) {
        const token = response.data.token; // Récupérer le token depuis la réponse
  
        if (!token) {
          setError('Erreur lors de la connexion. Veuillez réessayer.');
          return;
        }
  
        // Stocker le token et le rôle dans le localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', response.data.role); // Enregistrer le rôle
  
        // Si l'email et le mot de passe sont ceux de l'administrateur
        if (formData.email === 'admin@gmail.com' && formData.password === 'admin') {
          navigate('/Admin_Dashboard'); // Redirection vers le tableau de bord de l'admin
        } else {
          // Rediriger en fonction du rôle
          const role = response.data.role;
          if (role === 'condidat') {
            navigate('/dashboard');
          } else if (role === 'recruteur') {
            navigate('/Dashboard_Emploiyeur');
          }
        }
      } else {
        setError('Adresse email ou mot de passe incorrect');
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
  };  

  return (
    <div className="signup-container">
      <h2 className="signup-title">Se connecter</h2>
      <p className="signup-description">Entrez vos informations pour vous connecter.</p>
      {error && <p className="error-message">{error}</p>} {/* Afficher l'erreur s'il y en a */}

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Adresse Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Entrez votre email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Mot de Passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Entrez votre mot de passe"
          />
        </div>
        <button type="submit" className="submit-btn">Se connecter</button>
      </form>

      <p className="forgot-password">
        Mot de passe oublié ? <a href="/ResetPassword">Récupérer mon mot de passe</a>
      </p>
      <p className="signup-link">
        Pas encore de compte ? <a href="/inscription">S'inscrire ici</a>
      </p>
    </div>
  );
};

export default SignupForm;
