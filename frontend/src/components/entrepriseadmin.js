import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Modal,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  faUsers,
  faBriefcase,
  faChartBar,
  faFileAlt,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/AdminDashboard.css';
import axios from 'axios';

const EntrepriseAdmin = () => {
  const [nom, setNom] = useState('');
  const [secteur, setSecteur] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);

  const handleOpenModal = (entreprise = null) => {
    if (entreprise) {
      setNom(entreprise.nom);
      setSecteur(entreprise.secteur);
      setLocalisation(entreprise.localisation);
      setDescription(entreprise.description);
      setImage(null); // On ne modifie pas l'image directement ici
      setSelectedEntreprise(entreprise);
    } else {
      setNom('');
      setSecteur('');
      setLocalisation('');
      setDescription('');
      setImage(null);
      setSelectedEntreprise(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('secteur', secteur);
    formData.append('localisation', localisation);
    formData.append('description', description);

    if (image) {
      formData.append('image', image);
    }

    try {
      if (selectedEntreprise) {
        await axios.put(
          `https://femup-1.onrender.com/api/entreprises/${selectedEntreprise._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        alert('Entreprise mise à jour avec succès');
      } else {
        await axios.post(
          'https://femup-1.onrender.com/api/add-entreprise',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        alert('Entreprise ajoutée avec succès');
      }

      fetchEntreprises();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Détail:', error.response?.data || error.message);
      alert(`Erreur: ${error.response?.data || error.message}`);
    }
  };

  const fetchEntreprises = async () => {
    try {
      const response = await axios.get(
        'https://femup-1.onrender.com/api/entreprises'
      );
      setEntreprises(response.data);
    } catch (error) {
      console.error('Erreur de récupération des entreprises:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://femup-1.onrender.com/api/entreprises/${id}`);
      alert('Entreprise supprimée avec succès');
      fetchEntreprises();
    } catch (error) {
      console.error("Erreur de suppression de l'entreprise:", error);
      alert('Une erreur est survenue');
    }
  };

  useEffect(() => {
    fetchEntreprises();
  }, []);

  return (
    <Box>
      <div className="admin-dashboard">
        <div className="sidebar">
          <nav>
            <ul>
              <li>
                <Link to="/Admin_Dashboard">
                  <FontAwesomeIcon icon={faChartBar} /> Tableau de bord
                </Link>
              </li>
              <li>
                <Link to="/admin/candidates">
                  <FontAwesomeIcon icon={faUsers} /> Candidats
                </Link>
              </li>
              <li>
                <Link to="/admin/recruiters">
                  <FontAwesomeIcon icon={faBriefcase} /> Recruteurs
                </Link>
              </li>
              <li>
                <Link to="/admin/offers">
                  <FontAwesomeIcon icon={faBriefcase} /> Offres
                </Link>
              </li>
              <li>
                <Link to="/admin/controle">
                  <FontAwesomeIcon icon={faBriefcase} /> Contrôle d'Offres
                </Link>
              </li>
              <li>
                <Link to="/admin/articles">
                  <FontAwesomeIcon icon={faFileAlt} /> Articles
                </Link>
              </li>
              <li>
                <Link to="/admin/entreprise">
                  <FontAwesomeIcon icon={faPlus} /> Ajouter une entreprise
                </Link>
              </li>
              <li>
                <Link to="/admin/Contact">Formulaire de Contact</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="content">
          <section className="entreprise-section">
            <h2>Liste des Entreprises</h2>

            <Button
              onClick={() => handleOpenModal()}
              variant="contained"
              style={{
                marginBottom: '20px',
                color: '#e4aea8',
                backgroundColor: '#f4f4f4',
              }}
            >
              Ajouter une Entreprise
            </Button>

            <Grid container spacing={3} justifyContent="center">
              {entreprises.map((entreprise) => (
                <Grid item xs={12} sm={6} md={4} key={entreprise._id}>
                  <Box className="entreprise-card">
                    {entreprise.image && (
                      <img
                        src={entreprise.image}
                        alt={entreprise.nom}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          marginBottom: '10px',
                          borderRadius: '5px',
                        }}
                      />
                    )}
                    <Typography variant="h6">{entreprise.nom}</Typography>
                    <Typography variant="body2">
                      Secteur: {entreprise.secteur}
                    </Typography>
                    <Typography variant="body2">
                      Localisation: {entreprise.localisation}
                    </Typography>
                    <Typography variant="body2">
                      {entreprise.description}
                    </Typography>
                    <Button
                      onClick={() => handleOpenModal(entreprise)}
                      variant="outlined"
                    >
                      Modifier
                    </Button>
                    <Button
                      onClick={() => handleDelete(entreprise._id)}
                      variant="outlined"
                      color="secondary"
                    >
                      Supprimer
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </section>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box className="modal-box">
          <Typography variant="h6">
            {selectedEntreprise ? 'Modifier' : 'Ajouter'} une Entreprise
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom de l'entreprise"
                  variant="outlined"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Secteur"
                  variant="outlined"
                  value={secteur}
                  onChange={(e) => setSecteur(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Localisation"
                  variant="outlined"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button type="submit" variant="contained">
                  {selectedEntreprise ? 'Mettre à jour' : 'Ajouter'} l'entreprise
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default EntrepriseAdmin;
