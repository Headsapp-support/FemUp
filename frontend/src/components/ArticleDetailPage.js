import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Edit, Delete, PushPin } from '@mui/icons-material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReactQuill from 'react-quill'; // Import de react-quill
import 'react-quill/dist/quill.snow.css'; // Import de la feuille de style de l'éditeur
import '../styles/ArticleDetailPage.css';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newDate, setNewDate] = useState("");

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

      } catch (error) {
        setError("Erreur lors de la récupération des données de l'article");
        console.error("Erreur fetch article:", error);
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
    setNewContent(article.content);
    setNewTitle(article.title);
    setNewImage(null);
    setNewDate(article.date);
    setOpenDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('content', newContent);
      formData.append('date', newDate);
      if (newImage) {
        formData.append('image', newImage);
      }

      await axios.put(`https://femup-1.onrender.com/api/articles/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setOpenDialog(false);
      alert('Article modifié');
      setArticle({
        ...article,
        title: newTitle,
        content: newContent,
        image: newImage ? URL.createObjectURL(newImage) : article.image,
        date: newDate
      });
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
    const shareUrl = `https://fem-up.vercel.app/articles/${article._id}`;  // Utilise l'URL correcte de l'article
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const shareOnInstagram = () => {
    const shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
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
      <Box className="article-header">
        <Typography variant="h3" className="article-title">{article.title}</Typography>
        <Typography variant="body1" className="article-date">{new Date(article.date).toLocaleDateString()}</Typography>
      </Box>

      <Box className="image-section">
        <img src={article.image} alt={article.title} className="article-image" />
      </Box>

      {isAdmin && (
        <Box className="admin-actions" sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <IconButton onClick={handleEdit} color="primary">
            <Edit fontSize="large" />
          </IconButton>
          <IconButton onClick={handleDelete} color="secondary">
            <Delete fontSize="large" />
          </IconButton>
          <IconButton onClick={handlePin} color="default">
            <PushPin fontSize="large" />
          </IconButton>
        </Box>
      )}

      <Box className="article-content">
        <Typography variant="body1" className="article-text">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </Typography>
      </Box>

      <Box className="share-section">
        <Typography variant="h6">Partager cet article :</Typography>
        <Button onClick={shareOnFacebook} variant="contained" color="primary">Facebook</Button>
        <Button onClick={shareOnInstagram} variant="contained" color="secondary">Instagram</Button>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <TextField label="Titre" fullWidth value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          
          {/* Utilisation de react-quill pour l'édition enrichie du contenu */}
          <ReactQuill
            value={newContent}
            onChange={setNewContent}
            theme="snow"
            modules={{
              toolbar: [
                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                [{ 'align': [] }],
                ['link'],
                ['blockquote', 'code-block'],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']  // Pour réinitialiser le format
              ],
            }}
          />
          
          <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
          <TextField
            label="Date"
            fullWidth
            type="date"
            value={newDate ? new Date(newDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setNewDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Annuler</Button>
          <Button onClick={handleSaveEdit} color="primary">Sauvegarder</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleDetailPage;
