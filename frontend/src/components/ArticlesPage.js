import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import '../styles/ArticlesPage.css';
import axios from 'axios';
import { Favorite } from '@mui/icons-material';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "https://femup-1.onrender.com";

  const fetchData = async (url, setState, errorMessage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fixedData = response.data.map(item => ({
        ...item,
        image: item.image && !item.image.startsWith("http")
          ? `${BASE_URL}/${item.image.replace(/^\/?/, '')}`
          : item.image
      }));

      setState(fixedData);
    } catch (error) {
      setError(errorMessage);
      console.error(errorMessage, error);
    }
  };

  useEffect(() => {
    fetchData(`${BASE_URL}/api/articles/Tous`, setArticles, 'Erreur lors de la récupération des articles');
    fetchData(`${BASE_URL}/api/events/Tous`, setEvents, 'Erreur lors de la récupération des événements');
    fetchData(`${BASE_URL}/api/images/Tous`, setImages, 'Erreur lors de la récupération des images');
  }, []);

  const toggleArticles = () => setShowAllArticles(!showAllArticles);
  const toggleEvents = () => setShowAllEvents(!showAllEvents);

  const pinnedArticles = articles.filter(article => article.isPinned);

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box className="articles-page-container">
      {/* Hero Section */}
      <Box className="hero-section">
        <div className="hero-content">
          <Typography variant="h2" className="hero-title">Explorez l'Avenir de la Technologie</Typography>
          <Typography variant="body1" className="hero-subtitle">
            Découvrez les dernières tendances en technologie, santé et innovation, qui façonnent notre futur.
          </Typography>
        </div>
      </Box>

      {/* Actualités */}
      <Box className="news-section">
        <Typography variant="h4" className="section-title1">Actualités</Typography>
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
        <Typography variant="h4" className="section-title1">Articles à la Une</Typography>
        {pinnedArticles.length === 0 ? (
          <Typography variant="h6" color="textSecondary">Aucun article épinglé pour le moment.</Typography>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={3}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="articles-carousel"
          >
            {pinnedArticles.map((article) => (
              <SwiperSlide key={article._id}>
                <Card className="article-card">
                  <CardMedia
                    component="img"
                    height="250"
                    image={article.image}
                    alt={article.title}
                    sx={{ position: 'relative' }}
                  />
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      padding: '5px',
                      borderRadius: '50%',
                    }}
                  >
                    <Favorite sx={{ color: '#f44336' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" className="article-title">{article.title}</Typography>
                    <Typography variant="body2" className="article-excerpt">{article.content.substring(0, 100)}...</Typography>
                    <Button component={Link} to={`/article/${article._id}`} className="article-button">Lire l'article</Button>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>

      {/* Retour en Image */}
      <Box className="images-section">
        <Typography variant="h4" className="section-title1">Retour en Image</Typography>
        {images.length > 0 ? (
          <Swiper
            modules={[Autoplay, EffectFade]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            effect="fade"
            className="images-carousel"
          >
            {images.map((image) => (
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
            ))}
          </Swiper>
        ) : (
          <Typography variant="h6" color="error">Aucune image disponible.</Typography>
        )}
      </Box>

      {/* Tous les événements */}
      <Box className="events-section">
        <Typography variant="h4" className="section-title1">Tous les Événements</Typography>
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
