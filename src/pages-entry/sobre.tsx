import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from '../components/Layout'
import About from '../pages/About'
import '../index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Layout currentPage="sobre">
      <About />
    </Layout>
  </React.StrictMode>,
)
