import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CriptografiaArticle from './pages/CriptografiaArticle';
import TeoriaNumerosArticle from './pages/TeoriaNumerosArticle';
import PerformanceArticle from './pages/PerformanceArticle';
import TelemetriaArticle from './pages/TelemetriaArticle';
import NotFound from './pages/NotFound';
import ReconDashboard from './pages/ReconDashboard';
import DraftViewer from './pages/DraftViewer';
import AcervoIndex from './pages/AcervoIndex';

// Auto-Update Component
const AutoUpdater: React.FC = () => {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Fetch version.json with cache busting
        const response = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' });
        if (!response.ok) return;
        
        const data = await response.json();
        const serverVersion = data.version;
        const localVersion = localStorage.getItem('app_version');

        if (localVersion && localVersion !== serverVersion) {
          console.log(`New version detected: ${serverVersion} (Current: ${localVersion}). Updating...`);
          
          // Clear caches
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
          }
          
          // Clear LocalStorage (except version which we will set after reload)
          localStorage.clear();
          localStorage.setItem('app_version', serverVersion);
          
          // Force Reload from Server
          window.location.reload();
        } else {
          // First run or same version
          localStorage.setItem('app_version', serverVersion);
        }
      } catch (error) {
        console.error('Auto-update check failed:', error);
      }
    };

    // Check immediately and every 5 minutes
    checkVersion();
    const interval = setInterval(checkVersion, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

// Wrapper component to access useLocation hook
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/dashboard-recon-2026-x') || location.pathname.startsWith('/acervo/draft/');
  
  if (isAdminPage) {
    return (
      <>
        <AutoUpdater />
        <Routes>
          <Route path="/dashboard-recon-2026-x" element={<ReconDashboard />} />
          <Route path="/acervo/draft/:id" element={<DraftViewer />} />
        </Routes>
      </>
    );
  }

  return (
    <Layout currentPage={location.pathname}>
      <AutoUpdater />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/acervo" element={<AcervoIndex />} />
        <Route path="/criptografia-rsa-seguranca" element={<CriptografiaArticle />} />
        <Route path="/teoria-dos-numeros-primos" element={<TeoriaNumerosArticle />} />
        <Route path="/engenharia-performance-web" element={<PerformanceArticle />} />
        <Route path="/telemetria-sistema" element={<TelemetriaArticle />} />
        <Route path="*" element={<NotFound />} />
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
