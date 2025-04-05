import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; 
import FreelanceSection from './components/FreelanceSection';
import WomenFreelanceSection from './components/WomenFreelanceSection';
import CareerBoostSection from './components/CareerBoostSection';
import FreelanceJobsSection from './components/FreelanceJobsSection';
import Experiences from './components/experiences';
import JoinNetwork from './components/JoinNetwork';
import Footer from './components/Footer';
import Header from './components/Header'; 
import Navbar from './components/Navbar';
import JoinUs from './components/JoinUs';
import LoginForm from './components/LoginForm';
import LoginForm2 from './components/LoginForm2';
import SignupForm from './components/SignupForm';
import CandidateDashboard from './components/CandidateDashboard';
import AccountSettings from './components/AccountSettings';
import EntrepriseList from './components/EntrepriseList';
import ListeJobSection from './components/ListeJobSection';
import ContactForm from './components/ContactForm';
import JobDetailsPage from './components/JobDetailsPage';
import RecruiterDashboard from './components/RecruiterDashboard';
import AccountSettingsRecruteur from './components/AccountSettingsRecruteur';
import CandidatsList from './components/CandidatsList';
import AdminDashboard from './components/AdminDashboard';
import Condidatadmin from './components/condidatadmin';
import Recruitersadmin from './components/recruitersadmin';
import Offreadmin from './components/Offreadmin';
import Entrepriseadmin from './components/entrepriseadmin';
import ControleAcces from './components/ControleAcces';
import ResetPassword from './components/ResetPassword';
import ContactAdmin from './components/ContactAdmin';
import ResetPasswordPage from './components/ResetPasswordPage';
import ArticlesPage from './components/ArticlesPage';
import ArticleDetailPage from './components/ArticleDetailPage';
import ArticleAdmin from './components/ArticleAdmin';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation(); // Récupérer l'URL actuelle

  return (
    <div className="App">
      {/* Afficher la Navbar sauf sur la page d'accueil */}
      {location.pathname !== '/' && <Navbar />}
      
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Ajoutez ici d'autres routes si nécessaire */}
          <Route path="/inscription" element={<JoinUs />} />
          <Route path="/inscription-condidat" element={<LoginForm />} />
          <Route path="/inscription-emploiyeur" element={<LoginForm2 />} />
          <Route path="/connexion" element={<SignupForm />} />
          <Route path="/dashboard" element={<CandidateDashboard />} />
          <Route path="/Settings" element={<AccountSettings />} />
          <Route path="/Update" element={<AccountSettingsRecruteur />} />
          <Route path="/Entreprise-List" element={<EntrepriseList />} />
          <Route path="/Offres-d'emploi" element={<ListeJobSection />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/offre/:offerId" element={<JobDetailsPage />} />
          <Route path="/Dashboard_Emploiyeur" element={<RecruiterDashboard />} />
          <Route path="/candidats/:offerId" element={<CandidatsList />} />
          <Route path="/Admin_Dashboard" element={<AdminDashboard />} />
          <Route path="/admin/candidates" element={<Condidatadmin />} />
          <Route path="/admin/recruiters" element={<Recruitersadmin />} />
          <Route path="/admin/offers" element={<Offreadmin />} />
          <Route path="/admin/entreprise" element={<Entrepriseadmin />} />
          <Route path="/admin/controle" element={<ControleAcces />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/admin/Contact" element={<ContactAdmin />} />
          <Route path="/changer-mot-de-passe/:resetToken" element={<ResetPasswordPage />} />
          <Route path="/Article" element={<ArticlesPage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />
          <Route path="/admin/articles" element={<ArticleAdmin />} />
          
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
};

// Composant pour la page d'accueil
const Home = () => {
  return (
    <div>
      <Header />
      <FreelanceSection />
      <WomenFreelanceSection />
      <CareerBoostSection />
      <FreelanceJobsSection />
      <Experiences />
      <JoinNetwork />
    </div>
  );
};

export default App;
