
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n' // Import i18n configuration
import App from './App.jsx'
import { registerServiceWorker, handleServiceWorkerMessages } from './utils/serviceWorker.js'

// Register service worker
if (import.meta.env.PROD) {
  registerServiceWorker();
  handleServiceWorkerMessages();
}

createRoot(document.getElementById('root')).render(
  
    <App />
  ,
)
