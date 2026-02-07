import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from '../components/Layout'
import Privacy from '../pages/Privacy'
import '../index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Layout currentPage="privacidade">
      <Privacy />
    </Layout>
  </React.StrictMode>,
)
