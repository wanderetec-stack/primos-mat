import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CriptografiaArticle from './pages/CriptografiaArticle';
import TeoriaNumerosArticle from './pages/TeoriaNumerosArticle';
import PerformanceArticle from './pages/PerformanceArticle';
import TelemetriaArticle from './pages/TelemetriaArticle';

// Wrapper component to access useLocation hook
const AppContent: React.FC = () => {
  const location = useLocation();
  
  return (
    <Layout currentPage={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/criptografia-rsa-seguranca" element={<CriptografiaArticle />} />
        <Route path="/teoria-dos-numeros-primos" element={<TeoriaNumerosArticle />} />
        <Route path="/engenharia-performance-web" element={<PerformanceArticle />} />
        <Route path="/telemetria-sistema" element={<TelemetriaArticle />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
