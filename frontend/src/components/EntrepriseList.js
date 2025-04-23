import '../styles/EntrepriseList.css';
import '../styles/ListeJobSection.css';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  InputAdornment
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const EntrepriseList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [secteur, setSecteur] = useState('');
  const [entreprises, setEntreprises] = useState([]);
  const [filteredEntreprises, setFilteredEntreprises] = useState([]);

  // Récupération des données
  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const response = await axios.get('https://femup-1.onrender.com/api/entreprises');
        setEntreprises(response.data);
        setFilteredEntreprises(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des entreprises:', error);
      }
    };
    fetchEntreprises();
  }, []);

  // Fonction de recherche
  const handleSearch = () => {
    const result = entreprises
      .filter((entreprise) => entreprise && entreprise.nom && entreprise.localisation && entreprise.secteur)
      .filter((entreprise) =>
        entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (localisation ? entreprise.localisation.toLowerCase().includes(localisation.toLowerCase()) : true) &&
        (secteur ? entreprise.secteur.toLowerCase().includes(secteur.toLowerCase()) : true)
      );
    setFilteredEntreprises(result);
  };
  

  return (
    <Box className="entreprise-list-container">
      <Typography
        variant="h4"
        className="entreprise-search-title"
        gutterBottom
        style={{ fontSize: '25px', color: "#293a4d", fontWeight: 'bold' }}
      >
        Recherche d'Entreprises
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Nom */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Nom de l'entreprise"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>

        {/* Localisation */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            variant="outlined"
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            placeholder="Localisation"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Secteur */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Secteur</InputLabel>
            <Select
              value={secteur}
              onChange={(e) => setSecteur(e.target.value)}
              label="Secteur"
            >
              <MenuItem value="">Tous les secteurs</MenuItem>
              <MenuItem value="Technologie">Technologie</MenuItem>
              <MenuItem value="Environnement">Environnement</MenuItem>
              <MenuItem value="Santé">Santé</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Bouton de recherche */}
        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            onClick={handleSearch}
            sx={{
              background: 'linear-gradient(135deg, #dd38d5 0%, #600d7e 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 18px',
              fontSize: '14px',
              borderRadius: '8px',
              border: '1px solid #c4c4d0',
              '&:hover': {
                background: 'linear-gradient(135deg, rgb(119, 26, 218) 0%, rgb(130, 26, 168) 100%)',
                border: '1px solid #b4b4bd',
                color: 'white',
              },
            }}
          >
            Rechercher
          </Button>
        </Grid>
      </Grid>

      {/* Affichage des entreprises */}
      <Box className="entreprise-card-container" mt={4}>
        {filteredEntreprises.length === 0 ? (
          <Typography variant="h6" align="center" className="entreprise-no-results">
            Aucune entreprise trouvée.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredEntreprises.map((entreprise, index) => (
              <Grid item xs={12} sm={6} md={4} key={entreprise._id || index}>
                <Card className="entreprise-card">
                  <CardContent>
                    <Box className="entreprise-card-header" display="flex" alignItems="center" mb={2}>
                      {entreprise.image && (
                        <img
                          src={entreprise.image}
                          alt={entreprise.nom}
                          className="entreprise-card-logo"
                        />
                      )}
                      <Typography variant="h5" className="entreprise-card-title" ml={2}>
                        {entreprise.nom}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Secteur:</strong> {entreprise.secteur}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <LocationOnIcon sx={{ mr: 1 }} />
                      {entreprise.localisation}
                    </Typography>
                    <Typography variant="body1" className="entreprise-card-description" mt={2}>
                      {entreprise.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default EntrepriseList;
