import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'

// Heartbeat & Security Monitor
const monitor = () => {
  if (process.env.NODE_ENV === 'development') return;

  // Heartbeat (every 5 min)
  setInterval(() => {
    fetch('/api/v1/monitor?type=heartbeat');
  }, 5 * 60 * 1000);

  // Initial Visit
  fetch('/api/v1/monitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'visit',
      path: window.location.pathname,
      userAgent: navigator.userAgent
    })
  });
};

// Start monitoring
monitor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout currentPage="/">
      <Home />
    </Layout>
  </StrictMode>,
)
