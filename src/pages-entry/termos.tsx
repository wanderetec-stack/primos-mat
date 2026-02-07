import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from '../components/Layout'
import Terms from '../pages/Terms'
import '../index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Layout currentPage="termos">
      <Terms />
    </Layout>
  </React.StrictMode>,
)
