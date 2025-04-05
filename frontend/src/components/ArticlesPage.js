import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Importation du CSS mis à jour
import '../styles/ArticlesPage.css'; // Importation du CSS spécifique

const articles = [
  {
    id: 1,
    title: 'Le Futur de la Technologie : Quoi de Neuf ?',
    date: '2025-04-04',
    image: 'https://via.placeholder.com/600x400',
    excerpt: 'Découvrez les tendances qui façonnent le monde de demain...',
    link: '/article/1',
  },
  {
    id: 2,
    title: 'Les Secrets de l’Environnement et des Énergies Renouvelables',
    date: '2025-04-03',
    image: 'https://via.placeholder.com/600x400',
    excerpt: 'L’énergie verte : Une révolution durable qui change tout...',
    link: '/article/2',
  },
  {
    id: 3,
    title: 'Santé de Demain : Innovations et Tendances',
    date: '2025-04-02',
    image: 'https://via.placeholder.com/600x400',
    excerpt: 'Comment la technologie transforme le secteur de la santé...',
    link: '/article/3',
  },
  {
    id: 4,
    title: 'La Révolution de l’Énergie Solaire',
    date: '2025-04-01',
    image: 'https://via.placeholder.com/600x400',
    excerpt: 'L’énergie solaire : Un changement dans notre manière de vivre...',
    link: '/article/4',
  },
  {
    id: 5,
    title: 'Les Nouveaux Horizons de l’Intelligence Artificielle',
    date: '2025-03-31',
    image: 'https://via.placeholder.com/600x400',
    excerpt: 'Comment l’intelligence artificielle redéfinit notre quotidien...',
    link: '/article/5',
  },
];

const pastEvents = [
  {
    id: 1,
    title: 'Expo Innovation 2024',
    image: 'https://via.placeholder.com/600x400',
  },
  {
    id: 2,
    title: 'Forum Santé 2024',
    image: 'https://via.placeholder.com/600x400',
  },
  {
    id: 3,
    title: 'Forum Tech 2024',
    image: 'https://via.placeholder.com/600x400',
  },
  {
    id: 4,
    title: 'Événement International 2024',
    image: 'https://via.placeholder.com/600x400',
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Conférence Sur l’IA 2025',
    image: 'https://via.placeholder.com/600x400',
  },
  {
    id: 2,
    title: 'Webinaire Énergie Durable',
    image: 'https://via.placeholder.com/600x400',
  },
  {
    id: 3,
    title: 'Hackathon Développeurs 2025',
    image: 'https://via.placeholder.com/600x400',
  },
];

const ArticlesPage = () => {
  const [showAllArticles, setShowAllArticles] = useState(false);

  const toggleArticles = () => {
    setShowAllArticles(!showAllArticles);
  };

  return (
    <Box className="articles-page-container">
      {/* Hero Section */}
      <Box className="hero-section">
        <div className="hero-content">
          <Typography variant="h2" className="hero-title">Explorez l'Avenir de la Technologie</Typography>
          <Typography variant="body1" className="hero-subtitle">Découvrez les dernières tendances en technologie, santé et innovation, qui façonnent notre futur.</Typography>
          <Button className="hero-button" component={Link} to="/Articles">Voir Tous les Articles</Button>
        </div>
      </Box>

      {/* Actualités */}
      <Box className="news-section">
        <Typography variant="h4" className="section-title">Actualités</Typography>
        <Grid container spacing={4} justifyContent="center" className="articles-grid">
          {(showAllArticles ? articles : articles.slice(0, 3)).map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card className="article-card">
                <CardMedia
                  component="img"
                  height="250"
                  image={article.image}
                  alt={article.title}
                />
                <CardContent>
                  <Typography variant="h6" className="article-title">{article.title}</Typography>
                  <Typography variant="body2" className="article-excerpt">{article.excerpt}</Typography>
                  <Typography variant="body2" className="article-date">{article.date}</Typography>
                  <Button component={Link} to={`/article/${article.id}`} className="article-button">Lire l'article</Button>
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
            <SwiperSlide key={article.id}>
              <Card className="article-card">
                <CardMedia
                  component="img"
                  height="250"
                  image={article.image}
                  alt={article.title}
                />
                <CardContent>
                  <Typography variant="h6" className="article-title">{article.title}</Typography>
                  <Typography variant="body2" className="article-excerpt">{article.excerpt}</Typography>
                  <Button component={Link} to={`/article/${article.id}`} className="article-button">Lire l'article</Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Retour en Image */}
      <Box className="events-section">
        <Typography variant="h4" className="section-title">Retour en Image</Typography>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          effect="fade"
          className="events-carousel"
        >
          {pastEvents.map((event) => (
            <SwiperSlide key={event.id}>
              <Card className="event-card">
                <CardMedia
                  component="img"
                  height="300"
                  image={event.image}
                  alt={event.title}
                />
                <CardContent>
                  <Typography variant="h6" className="event-title">{event.title}</Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Événements à Venir */}
      <Box className="upcoming-events-section">
        <Typography variant="h4" className="section-title">Événements à Venir</Typography>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          className="upcoming-events-carousel"
        >
          {upcomingEvents.map((event) => (
            <SwiperSlide key={event.id}>
              <Card className="upcoming-event-card">
                <CardMedia
                  component="img"
                  height="300"
                  image={event.image}
                  alt={event.title}
                />
                <CardContent>
                  <Typography variant="h6" className="upcoming-event-title">{event.title}</Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default ArticlesPage;
