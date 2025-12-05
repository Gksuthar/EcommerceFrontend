import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import './utils/axiosConfig'; // Import axios configuration for JWT handling

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
)
