import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';  // Assurez-vous d'importer le style Swiper
import '../styles/ArticlesPage.css';
import axios from 'axios';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "https://femup-1.onrender.com"; // L'URL de base de votre API

  // Fonction pour récupérer les données et corriger les URLs des images
  const fetchData = async (url, setState, errorMessage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // 🔧 Correction de l'URL des images si nécessaire
      const fixedData = response.data.map(item => ({
        ...item,
        image: item.image && !item.image.startsWith("http") 
          ? `${BASE_URL}/${item.image.replace(/^\/?/, '')}` // Si l'URL ne commence pas par http, la compléter
          : item.image
      }));
  
      console.log("🖼️ Données avec image corrigée :", fixedData);
      setState(fixedData);
    } catch (error) {
      setError(errorMessage);
      console.error(errorMessage, error);
    }
  };

  // Récupérer les articles, événements et images lors du montage du composant
  useEffect(() => {
    const fetchArticlesData = async () => {
      await fetchData('https://femup-1.onrender.com/api/articles/Tous', setArticles, 'Erreur lors de la récupération des articles');
    };
    const fetchEventsData = async () => {
      await fetchData('https://femup-1.onrender.com/api/events/Tous', setEvents, 'Erreur lors de la récupération des événements');
    };
    const fetchImagesData = async () => {
      await fetchData('https://femup-1.onrender.com/api/images/Tous', setImages, 'Erreur lors de la récupération des images');
    };

    fetchArticlesData();
    fetchEventsData();
    fetchImagesData();
    setLoading(false);
  }, []);

  // Fonction pour afficher ou cacher plus d'articles
  const toggleArticles = () => setShowAllArticles(!showAllArticles);
  // Fonction pour afficher ou cacher plus d'événements
  const toggleEvents = () => setShowAllEvents(!showAllEvents);

  // Affichage de chargement ou erreur
  if (loading) {
    return <Typography variant="h6">Chargement en cours...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box className="articles-page-container">
      {/* Hero Section */}
      <Box className="hero-section">
        <div className="hero-content">
          <Typography variant="h2" className="hero-title">Explorez l'Avenir de la Technologie</Typography>
          <Typography variant="body1" className="hero-subtitle">Découvrez les dernières tendances en technologie, santé et innovation, qui façonnent notre futur.</Typography>
        </div>
      </Box>

      {/* Actualités */}
      <Box className="news-section">
        <Typography variant="h4" className="section-title">Actualités</Typography>
        <Grid container spacing={4} justifyContent="center" className="articles-grid">
          {(showAllArticles ? articles : articles.slice(0, 3)).map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article._id}>
              <Card className="article-card">
                <CardMedia
                  component="img"
                  height="250"
                  image={article.image}
                  alt={article.title}
                />
                <CardContent>
                  <Typography variant="h6" className="article-title">{article.title}</Typography>
                  <Typography variant="body2" className="article-excerpt">{article.content.substring(0, 100)}...</Typography>
                  <Typography variant="body2" className="article-date">{new Date(article.date).toLocaleDateString()}</Typography>
                  <Button component={Link} to={`/article/${article._id}`} className="article-button">Lire l'article</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button onClick={toggleArticles} className="see-more-button">
          {showAllArticles ? 'Voir Moins' : 'Voir Plus'}
        </Button>
      </Box>

      {/* Articles à la Une */}
      <Box className="articles-section">
        <Typography variant="h4" className="section-title">Articles à la Une</Typography>
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          loop={true}
          autoplay={{ delay: 3000 }}
          className="articles-carousel"
        >
          {articles.map((article) => (
            <SwiperSlide key={article._id}>
              <Card className="article-card">
                <CardMedia
                  component="img"
                  height="250"
                  image={article.image}
                  alt={article.title}
                />
                <CardContent>
                  <Typography variant="h6" className="article-title">{article.title}</Typography>
                  <Typography variant="body2" className="article-excerpt">{article.content.substring(0, 100)}...</Typography>
                  <Button component={Link} to={`/article/${article._id}`} className="article-button">Lire l'article</Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Retour en Image */}
      <Box className="images-section">
        <Typography variant="h4" className="section-title">Retour en Image</Typography>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={images.length > 1} // Si plus d'une image, activez la boucle
          autoplay={{ delay: 3000 }}
          effect="fade"
          loopAdditionalSlides={2}
          className="images-carousel"
        >
          {images.length > 0 ? (
            images.map((image) => (
              <SwiperSlide key={image._id}>
                <Card className="image-card">
                  <CardMedia
                    component="img"
                    height="300"
                    image={image.image}
                    alt={image.title}
                  />
                  <CardContent>
                    <Typography variant="h6" className="image-title">{image.title}</Typography>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <Typography variant="h6" color="error">Aucune image disponible.</Typography>
          )}
        </Swiper>
      </Box>

      {/* Tous les événements */}
      <Box className="events-section">
        <Typography variant="h4" className="section-title">Tous les Événements</Typography>
        <Grid container spacing={4} justifyContent="center" className="events-grid">
          {(showAllEvents ? events : events.slice(0, 3)).map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card className="event-card">
                <CardMedia
                  component="img"
                  height="250"
                  image={event.image}
                  alt={event.name}
                />
                <CardContent>
                  <Typography variant="h6" className="event-title">{event.name}</Typography>
                  <Typography variant="body2" className="event-date">{new Date(event.date).toLocaleDateString()}</Typography>
                  <Button component={Link} to={`/event/${event._id}`} className="event-button">Voir l'événement</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button onClick={toggleEvents} className="see-more-button">
          {showAllEvents ? 'Voir Moins' : 'Voir Plus'}
        </Button>
      </Box>
    </Box>
  );
};

export default ArticlesPage;
