import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Envoi de la requête de connexion au backend
      const response = await axios.post('https://femup-1.onrender.com/api/condidat/login', { email, password });

      // Si la connexion est réussie, le token est stocké dans localStorage
      localStorage.setItem('token', response.data.token);

      // Redirection vers le tableau de bord
      history.push('/candidate-dashboard');
    } catch (err) {
      // Gestion des erreurs
      setError('Identifiants incorrects ou utilisateur non trouvé');
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
