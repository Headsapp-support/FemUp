import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, IconButton, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { Edit, Delete, PushPin } from '@mui/icons-material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous d'importer correctement jwt-decode
import '../styles/ArticleDetailPage.css'; // Assurez-vous d'avoir ce fichier CSS importé

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]); // Assume related articles come from an API or are manually set
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Pour vérifier si l'utilisateur est admin
  const [openDialog, setOpenDialog] = useState(false); // Pour contrôler l'affichage du modal
  const [newContent, setNewContent] = useState(""); // Pour la mise à jour du contenu de l'article
  const [newTitle, setNewTitle] = useState(""); // Pour la mise à jour du titre de l'article
  const [newImage, setNewImage] = useState(null); // Pour la mise à jour de l'image
  const [newDate, setNewDate] = useState(""); // Pour la mise à jour de la date

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setIsAdmin(decoded.role === 'admin');
        }

        const response = await axios.get(`https://femup-1.onrender.com/api/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticle(response.data);

        // Fetch related articles (assuming this feature exists)
        setRelatedArticles([
          {
            _id: "1",
            title: "Article 1",
            image: "https://via.placeholder.com/200",
          },
          {
            _id: "2",
            title: "Article 2",
            image: "https://via.placeholder.com/200",
          }
        ]);
      } catch (error) {
        setError('Erreur lors de la récupération des données de l\'article');
        console.error('Erreur lors de la récupération de l\'article', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://femup-1.onrender.com/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Article supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article', error);
    }
  };

  const handleEdit = () => {
    setNewContent(article.content); // Initialiser avec l'ancien contenu
    setNewTitle(article.title); // Initialiser avec l'ancien titre
    setNewImage(null); // Réinitialiser le champ d'image
    setNewDate(article.date); // Initialiser avec l'ancienne date
    setOpenDialog(true); // Ouvrir le modal
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');

      // Préparer les données pour l'upload
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('content', newContent);
      formData.append('date', newDate);

      // Si une nouvelle image est choisie, ajouter l'image à la requête
      if (newImage) {
        formData.append('image', newImage);
      }

      await axios.put(`https://femup-1.onrender.com/api/articles/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Spécifie qu'on envoie des fichiers
        },
      });

      setOpenDialog(false); // Fermer le modal après la mise à jour
      alert('Article modifié');
      setArticle({ ...article, title: newTitle, content: newContent, image: newImage ? URL.createObjectURL(newImage) : article.image, date: newDate }); // Mettre à jour l'article localement
    } catch (error) {
      console.error('Erreur lors de la modification de l\'article', error);
    }
  };

  const handlePin = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://femup-1.onrender.com/api/articles/pin/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Article épinglé');
    } catch (error) {
      console.error('Erreur lors de l\'épinglage de l\'article', error);
    }
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnInstagram = () => {
    const url = `https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return <Typography variant="h6">Chargement en cours...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!article) {
    return <Typography variant="h6" color="error">Aucun article trouvé.</Typography>;
  }

  return (
    <Box className="article-detail-container">

      {/* Section Titre et Date */}
      <Box className="article-header">
        <Typography variant="h3" className="article-title">{article.title}</Typography>
        <Typography variant="body1" className="article-date">{new Date(article.date).toLocaleDateString()}</Typography>
      </Box>

      {/* Section Gestion de l'Article (si Admin) */}
      {isAdmin && (
        <Box className="admin-actions" sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <IconButton onClick={handleEdit} color="primary" sx={{ marginLeft: '10px' }}>
            <Edit fontSize="large" />
          </IconButton>
          <IconButton onClick={handleDelete} color="secondary" sx={{ marginLeft: '10px' }}>
            <Delete fontSize="large" />
          </IconButton>
          <IconButton onClick={handlePin} color="default" sx={{ marginLeft: '10px' }}>
            <PushPin fontSize="large" />
          </IconButton>
        </Box>
      )}

      {/* Section Image */}
      <Box className="image-section">
        <img src={article.image} alt={article.title} className="article-image" />
      </Box>

      {/* Article Content */}
      <Box className="article-content">
        <Typography variant="body1" className="article-text">
          {article.content}
        </Typography>
      </Box>

      {/* Section Partage de l'article */}
      <Box className="share-section">
        <Typography variant="h6">Partager cet article :</Typography>
        <Button 
          onClick={shareOnFacebook} 
          variant="contained" 
          color="primary" 
          className="share-button"
        >
          Partager sur Facebook
        </Button>
        <Button 
          onClick={shareOnInstagram} 
          variant="contained" 
          color="secondary" 
          className="share-button"
        >
          Partager sur Instagram
        </Button>
      </Box>

      {/* Articles Similaires */}
      <Box className="related-articles">
        <Typography variant="h4" className="section-title">Articles Similaires</Typography>
        <Grid container spacing={3}>
          {relatedArticles.length > 0 ? (
            relatedArticles.map((related) => (
              <Grid item xs={12} sm={6} md={4} key={related._id}>
                <Card className="related-card">
                  <CardMedia
                    component="img"
                    height="200"
                    image={related.image}
                    alt={related.title}
                    className="related-image"
                  />
                  <CardContent>
                    <Typography variant="h6" className="related-title">{related.title}</Typography>
                    <Button component={Link} to={`/${related._id}`} className="read-more-button">Lire l'article</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="textSecondary">Aucun article similaire trouvé.</Typography>
          )}
        </Grid>
      </Box>

      {/* Modal pour modifier l'article */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <TextField
            label="Titre"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <TextField
            label="Contenu"
            multiline
            rows={4}
            fullWidth
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
          />
          <TextField
            label="Date"
            fullWidth
            type="date"
            value={newDate ? new Date(newDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setNewDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleDetailPage;
