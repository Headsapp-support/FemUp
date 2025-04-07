import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ArticleDetailPage.css'; // Assurez-vous d'avoir ce fichier CSS importé

const ArticleDetailPage = () => {
  const { id } = useParams(); // Utiliser useParams pour récupérer l'ID depuis l'URL
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('token'); // Token pour l'authentification (si nécessaire)
        const response = await axios.get(`https://femup-1.onrender.com/api/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticle(response.data);
        // Si tu veux également récupérer des articles similaires, tu peux ajouter cette requête ici
        const relatedResponse = await axios.get('https://femup-1.onrender.com/api/articles/similaires', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRelatedArticles(relatedResponse.data);
      } catch (error) {
        setError('Erreur lors de la récupération des données de l\'article');
        console.error('Erreur lors de la récupération de l\'article', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

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
      {/* Section Titre et Date - Eviter conflit Hero */}
      <Box className="article-header">
        <Typography variant="h3" className="article-title">{article.title}</Typography>
        <Typography variant="body1" className="article-date">{new Date(article.date).toLocaleDateString()}</Typography>
      </Box>

      {/* Section Image - juste après l'en-tête */}
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
        <Button variant="contained" color="primary" className="share-button">
          Facebook
        </Button>
        <Button variant="contained" color="secondary" className="share-button">
          Instagram
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
    </Box>
  );
};

export default ArticleDetailPage;
