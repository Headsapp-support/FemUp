import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase, faChartBar, faPlus, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';  // Importation du graphique en barres de Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Assurez-vous d'importer les éléments nécessaires de Chart.js
import '../styles/AdminDashboard.css';

// Enregistrer les échelles et éléments nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalRecruiters: 0,
    totalOffers: 0,
    totalCompanies: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    preselectedApplications: 0,
    pendingApplications: 0,
  });

  const [offerStats, setOfferStats] = useState({
    acceptedApplications: 0,
    rejectedApplications: 0,
    preselectedApplications: 0,
    pendingApplications: 0,
  });

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const token = localStorage.getItem('token'); // Adapte selon ton stockage

        const response = await axios.get('https://femup-1.onrender.com/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
          },
        });

        setStats(response.data); // Mise à jour des statistiques globales dans l'état local
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques globales', error);
      }
    };

    fetchGlobalStats(); // Appel initial pour récupérer les statistiques globales
  }, []); // Se déclenche une seule fois lors du montage du composant

  useEffect(() => {
    const fetchOfferStats = async () => {
      try {
        const token = localStorage.getItem('token'); // Adapte selon ton stockage
  
        const response = await axios.get(`https://femup-1.onrender.com/api/admin/statistiques-globales`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
          },
        });
  
        setOfferStats(response.data); // Mise à jour des statistiques des offres dans l'état local
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des offres', error);
      }
    };
  
    fetchOfferStats(); // Appel initial pour récupérer les statistiques des offres
  }, []); // Se déclenche une seule fois lors du montage du composant
  
  // Configuration du graphique à barres pour les statistiques globales
  // Configuration du graphique à barres pour les statistiques globales
  const chartData = {
    labels: ['Candidats', 'Recruteurs', 'Offres', 'Entreprises'],
    datasets: [
      {
        label: 'Statistiques Globales',
        data: [stats.totalCandidates, stats.totalRecruiters, stats.totalOffers, stats.totalCompanies],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'], // Couleurs personnalisées pour chaque barre
        borderColor: ['#388e3c', '#1976d2', '#f57c00', '#7b1fa2'],
        borderWidth: 1,
      },
    ],
  };

  // Configuration du graphique à barres pour les candidatures
  const data = {
    labels: ['Accepté', 'Refusé', 'Préselectionné', 'En attente'],
    datasets: [
      {
        label: 'Statistiques des Candidatures',
        data: [
          offerStats.acceptedApplications,
          offerStats.rejectedApplications,
          offerStats.preselectedApplications,
          offerStats.pendingApplications
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options du graphique avec améliorations sur l'échelle (axes)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,  // Assure que l'échelle commence à zéro
        ticks: {
          stepSize: 500, // Définit un intervalle de graduation pour plus de lisibilité
          callback: function(value) {
            if (value >= 1000) {
              return value / 1000 + 'k'; // Si la valeur est supérieure à 1000, l'afficher en "k"
            }
            return value;
          }
        },
      }
    },
  };

  // Options du graphique des candidatures
  const dataOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,  // Assure que l'échelle commence à zéro
        ticks: {
          stepSize: 500, // Définit un intervalle de graduation pour plus de lisibilité
          callback: function(value) {
            if (value >= 1000) {
              return value / 1000 + 'k'; // Si la valeur est supérieure à 1000, l'afficher en "k"
            }
            return value;
          }
        }
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <nav>
          <ul>
            <li><Link to="/Admin_Dashboard"><FontAwesomeIcon icon={faChartBar} /> Tableau de bord</Link></li>
            <li><Link to="/admin/candidates"><FontAwesomeIcon icon={faUsers} /> Candidats</Link></li>
            <li><Link to="/admin/recruiters"><FontAwesomeIcon icon={faBriefcase} /> Recruteurs</Link></li>
            <li><Link to="/admin/offers"><FontAwesomeIcon icon={faBriefcase} /> Offres</Link></li>
            <li><Link to="/admin/controle"><FontAwesomeIcon icon={faBriefcase} /> Contrôle d'Offres</Link></li>
            <li><Link to="/admin/articles"><FontAwesomeIcon icon={faFileAlt} /> Articles</Link></li>
            <li><Link to="/admin/entreprise"><FontAwesomeIcon icon={faPlus} /> Ajouter une entreprise</Link></li>
            <li><Link to="/admin/Contact">Formulaire de Contact </Link></li>
          </ul>
        </nav>
      </div>

      <div className="content">
        <header className="header">
          <h1>Tableau de bord</h1>
        </header>

        <section className="stats">
          <div className="admin-card">
            <h3>Total Candidats</h3>
            <p>{stats.totalCandidates}</p>
          </div>
          <div className="admin-card">
            <h3>Total Recruteurs</h3>
            <p>{stats.totalRecruiters}</p>
          </div>
          <div className="admin-card">
            <h3>Total Offres</h3>
            <p>{stats.totalOffers}</p>
          </div>
          <div className="admin-card">
            <h3>Total Entreprises</h3>
            <p>{stats.totalCompanies}</p>
          </div>
        </section>

        <section className="chart">
          <h2>Graphiques des Statistiques Globales</h2>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </section>

        <section className="actions">
          <h2>Actions rapides</h2>
          <div className="action-cards">
            <div className="action-card">
              <h3>Créer un article</h3>
              <Link to="/admin/create-article" className="btn-action">
                <FontAwesomeIcon icon={faFileAlt} /> Ajouter un article
              </Link>
            </div>
            <div className="action-card">
              <h3>Ajouter une entreprise</h3>
              <Link to="/admin/entreprise" className="btn-action">
                <FontAwesomeIcon icon={faPlus} /> Ajouter une entreprise
              </Link>
            </div>
          </div>
        </section>

        <section className="tracking">
  <h2>Suivi des actions</h2>
  <div className="tracking-cards">
    <div className="tracking-card">
      <h3>Nombre d'offres Acceptées</h3>
      <p>{stats.totalOffers}</p> {/* Affiche les candidatures approuvées */}
    </div>
    <div className="tracking-card">
      <h3>Nombre d'offres En attente</h3>
      <p>{stats.pendingOffers}</p> {/* Affiche les candidatures en attente */}
    </div>
    <div className="tracking-card">
      <h3>Nombre d'offres Refusées</h3>
      <p>{stats.rejectedOffers}</p> {/* Affiche les candidatures rejetées */}
    </div>
  </div>
</section>
        {/* Ajout du graphique pour les candidatures juste en dessous de "Suivi des Candidatures" */}
        <section className="chart">
          <h2>Graphiques des Candidatures</h2>
          <div className="chart-container">
          <Bar data={data} options={dataOptions} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
