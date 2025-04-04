import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import '../styles/ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Ajout d'un état pour la gestion du chargement
  const [error, setError] = useState(''); // Pour afficher les erreurs

  // Gérer la modification des champs de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Début du chargement
    setError(''); // Réinitialiser l'erreur

    try {
      // Envoi des données au backend
      const response = await fetch('https://femup-1.onrender.com/api/messages', { // URL du backend à mettre à jour
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de l\'envoi du message.');
      }
    } catch (error) {
      setError('Une erreur est survenue. Vérifiez la connexion au serveur.');
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  return (
    <Box className="contact-form-container" maxWidth="500px" mx="auto" p={3}>
      <Typography variant="h4" gutterBottom>
        Contactez-nous
      </Typography>

      {submitted ? (
        <Typography variant="h6" color="green" align="center">
          Votre message a été envoyé avec succès. Nous reviendrons vers vous rapidement !
        </Typography>
      ) : (
        <>
          {error && (
            <Typography variant="body1" color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nom complet"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Adresse e-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Sujet"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              required
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading} // Désactiver le bouton pendant le chargement
            >
              {loading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </form>
        </>
      )}
    </Box>
  );
};

export default ContactForm;
