import '../styles/EntrepriseList.css';
import '../styles/ListeJobSection.css';
import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Grid, Card, CardContent, Typography, IconButton } from '@mui/material';  
import LocationOnIcon from '@mui/icons-material/LocationOn'; 
import axios from 'axios'; // Import axios pour faire des requêtes HTTP

const EntrepriseList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [localisation, setLocalisation] = useState('');
    const [secteur, setSecteur] = useState('');
    const [entreprises, setEntreprises] = useState([]);
    const [filteredEntreprises, setFilteredEntreprises] = useState([]);
  
    // Utilisation de useEffect pour récupérer les données depuis l'API
    useEffect(() => {
      const fetchEntreprises = async () => {
        try {
          const response = await axios.get('https://femup-1.onrender.com/api/entreprises'); // Remplacez par l'URL de votre API
          setEntreprises(response.data);
          setFilteredEntreprises(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des entreprises:', error);
        }
      };
  
      fetchEntreprises();
    }, []);
  
    const handleSearch = () => {
      const result = entreprises.filter((entreprise) =>
        entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (localisation ? entreprise.localisation.toLowerCase() === localisation.toLowerCase() : true) &&
        (secteur ? entreprise.secteur.toLowerCase() === secteur.toLowerCase() : true)
      );
      setFilteredEntreprises(result);
    };
  
    return (
      <Box className="entreprise-list-container">
        <Typography variant="h4" className="entreprise-search-title" gutterBottom style={{fontSize:'25px',color:"#293a4d", fontWeight:'bold'}}>
          Recherche d'Entreprises
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Nom de l'entreprise"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="entreprise-search-input"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" className="entreprise-select-field">
              <TextField
                variant="outlined"
                value={localisation}
                onChange={(e) => setLocalisation(e.target.value)}
                placeholder="Localisation"
                className="entreprise-search-input-with-icon"
                InputProps={{
                  startAdornment: (
                    <IconButton position="start">
                      <LocationOnIcon />
                    </IconButton>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" className="entreprise-select-field">
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
          <Grid item xs={12} sm={2}>
          <Button
  onClick={handleSearch}
  sx={{
    background: 'linear-gradient(135deg, #dd38d5 0%, #600d7e 100%)', // Utiliser des guillemets autour de la valeur du gradient
    color: 'white',
    fontWeight: 'bold',
    padding: '12px 18px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #c4c4d0',
    textAlign: 'center',
    '&:hover': {
      background: 'linear-gradient(135deg, rgb(119, 26, 218) 0%, rgb(130, 26, 168) 100%)', // Même correction ici
      border: '1px solid #b4b4bd',
      color: 'white',
    },
    '&:focus': {
      outline: 'none',
    },
  }}
>
  Rechercher
</Button>

          </Grid>
        </Grid>
  
        <Box className="entreprise-card-container">
          {filteredEntreprises.length === 0 ? (
            <Typography variant="h6" align="center" className="entreprise-no-results">
              Aucune entreprise trouvée.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredEntreprises.map((entreprise, index) => (
                <Grid item xs={12} sm={6} md={4} key={entreprise.id || index}>
                  <Card className="entreprise-card">
                    <CardContent>
                      <Box className="entreprise-card-header">
                      <img src={`http://femup-1.onrender.com/uploads/${entreprise.image}`} alt={entreprise.nom} className="entreprise-card-logo" />
                        <Typography variant="h5" className="entreprise-card-title">
                          {entreprise.nom}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Secteur:</strong> {entreprise.secteur}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton className="entreprise-location-icon" sx={{ marginRight: 1 }}>
                          <LocationOnIcon />
                        </IconButton>
                        {entreprise.localisation}
                      </Typography>
                      <Typography variant="body1" className="entreprise-card-description">
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
