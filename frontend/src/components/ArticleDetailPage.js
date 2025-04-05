import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/ArticleDetailPage.css'; // Assurez-vous d'avoir ce fichier CSS importé

const article = {
  id: 1,
  title: 'Les Secrets de l’Environnement et des Énergies Renouvelables',
  date: '2025-04-03',
  image: 'https://via.placeholder.com/1200x600', // Image de l'article
  content: `
    L’énergie verte : Une révolution durable qui change tout. Dans cet article, nous plongeons dans les enjeux majeurs
    liés à l'énergie renouvelable. Nous explorerons les dernières technologies et les impacts sur notre futur. Que ce soit
    l'énergie solaire, éolienne ou géothermique, nous étudierons comment elles transforment le paysage énergétique mondial.
    Vous découvrirez également comment elles contribuent à un futur plus respectueux de l'environnement. Les entreprises et
    les gouvernements du monde entier investissent dans ces énergies pour préserver notre planète et garantir un avenir 
    énergétique durable.
  `,
  relatedArticles: [
    { id: 2, title: 'Le Futur de la Technologie : Quoi de Neuf ?', image: 'https://via.placeholder.com/600x400' },
    { id: 3, title: 'Santé de Demain : Innovations et Tendances', image: 'https://via.placeholder.com/600x400' },
  ],
};

const ArticleDetailPage = () => {
  return (
    <Box className="article-detail-container">
      {/* Section Titre et Date - Eviter conflit Hero */}
      <Box className="article-header">
        <Typography variant="h3" className="article-title">{article.title}</Typography>
        <Typography variant="body1" className="article-date">{article.date}</Typography>
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
          {article.relatedArticles.map((related) => (
            <Grid item xs={12} sm={6} md={4} key={related.id}>
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
                  <Button component={Link} to={`/article/${related.id}`} className="read-more-button">Lire l'article</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ArticleDetailPage;
